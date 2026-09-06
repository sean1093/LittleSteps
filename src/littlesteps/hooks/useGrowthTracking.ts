import { useState, useEffect, useMemo } from 'react';
import { ref, set, update, onValue, remove } from 'firebase/database';
import { database } from '../../lib/firebase';
import type { ChildProfile, GrowthRecord, Gender } from '../../types';
import { calculateZScore, calculatePercentile } from '../utils/growthCalculator';
import { growthAgeMonths } from '../../common/correctedAge';
import { changedFields, removeUndefined, toUpdatePaths } from '../../common/utils/firebaseData';

/**
 * 算百分位需要孩子的哪些欄位。整份 ChildProfile 傳進來也可以，型別相容。
 *
 * 早產週數在這裡不是選配：拿實際月齡去查 WHO 標準，一個 32 週出生、體重完全
 * 正常的寶寶會落到第 3 百分位附近，而這張圖正是家長要拿去給醫師看的那一頁。
 */
export type GrowthChild = Partial<
  Pick<ChildProfile, 'gender' | 'birthday' | 'gestationalAgeWeeks' | 'gestationalAgeDays'>
>;

interface UseGrowthTrackingResult {
  records: GrowthRecord[];
  loading: boolean;
  /** 讀取被拒或斷線；沒有測量紀錄與讀不到紀錄不是同一件事。 */
  error: boolean;
  addRecord: (record: Omit<GrowthRecord, 'id'>) => Promise<void>;
  /** opened：表單打開時帶入的那一版（GrowthChartsPage 的 editingRecord），比對的基準。 */
  updateRecord: (
    recordId: string,
    updates: Partial<Omit<GrowthRecord, 'id' | 'childId'>>,
    opened: GrowthRecord,
  ) => Promise<void>;
  deleteRecord: (recordId: string) => Promise<void>;
}

/**
 * Hook for managing growth records (weight, height, head circumference)
 * backed by Firebase. Login is mandatory; without a user it yields no records.
 *
 * 紀錄住在 childRecords/{childId}/growthRecords，不在孩子本體裡：測量筆數沒有
 * 上限，跟著檔案走的話，每一次勾里程碑都會把整份成長史再推送一次給每位家長。
 *
 * 百分位在讀取時重算，而不是只信資料庫裡那一份。百分位本來是寫入當下算好存
 * 進去的，所以早產矯正上線之前寫下的每一筆都是用實際月齡算的——只改寫入端的
 * 話，那些紀錄會永遠停在偏低的百分位，而它們正是家長最在意的那幾筆。
 *
 * 寫入端不再存百分位。讀取端一律重算之後，存的那一份沒有任何地方在讀；而它
 * 對得上的只是寫入者手上那一版——共享的孩子有兩位照顧者，媽媽補身高、爸爸補
 * 頭圍，各自從自己的舊版算出來的百分位都對不上資料庫裡真的那一筆。舊紀錄裡
 * 存著的百分位留著不動，規則也照樣收（見 withPercentiles 的第 2 點）。
 */
export function useGrowthTracking(
  childId: string | null,
  user: { uid: string } | null,
  child?: GrowthChild,
): UseGrowthTrackingResult {
  const [storedRecords, setStoredRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { gender: childGender, birthday: childBirthday } = child ?? {};
  const gestationalAgeWeeks = child?.gestationalAgeWeeks;
  const gestationalAgeDays = child?.gestationalAgeDays;

  const records = useMemo(
    () =>
      storedRecords.map((record) =>
        withPercentiles(record, {
          gender: childGender,
          birthday: childBirthday,
          gestationalAgeWeeks,
          gestationalAgeDays,
        }),
      ),
    [storedRecords, childGender, childBirthday, gestationalAgeWeeks, gestationalAgeDays],
  );

  // Real-time listener
  useEffect(() => {
    if (!childId || !user) {
      setStoredRecords([]);
      setError(false);
      setLoading(false);
      return;
    }

    // 換孩子時連 records 一起清掉，否則新快照抵達之前，上一個孩子的身高體重
    // 會掛在新孩子的名字與成長曲線上。
    setStoredRecords([]);
    setError(false);
    setLoading(true);
    const recordsRef = ref(database, `childRecords/${childId}/growthRecords`);
    const unsubscribe = onValue(
      recordsRef,
      (snapshot) => {
        const data = snapshot.val();
        setStoredRecords(data ? sortRecordsByDate(Object.values(data) as GrowthRecord[]) : []);
        setLoading(false);
      },
      (err) => {
        console.error('讀取成長紀錄失敗:', err);
        setError(true);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [childId, user]);

  const addRecord = async (record: Omit<GrowthRecord, 'id'>): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }
    validateRecord(record);
    const newRecord: GrowthRecord = {
      ...record,
      id: crypto.randomUUID(),
      // 表單送的是 {}；不存，讀取時算。
      percentile: undefined,
    };
    const recordRef = ref(database, `childRecords/${childId}/growthRecords/${newRecord.id}`);
    await set(recordRef, removeUndefined(newRecord));
  };

  /**
   * 改一筆測量：只寫真的改到的欄位。
   *
   * 原本是拿手上那一版加上這次的欄位、重算百分位、set 整筆。兩位照顧者各補一
   * 項測量時，後到的那一筆連著他手上沒有另一項的舊版蓋回去，對方剛量的數字就
   * 沒了，而且兩邊都不會看到任何提示。改成攤平成 <欄位> 一條一條 update()，
   * 各改各的欄位就會合併——跟 useFirebaseChildren.updateDailyLog 同一套。
   *
   * 比對的基準是 opened——表單打開時帶入的那一版，不是 listener 最新的那一版。
   * 表單每個欄位都送、沒填的送 undefined，而對方存的合併結果會在表單還開著的
   * 時候抵達畫面：拿最新的那一版當基準，對方剛補的身高在我表單裡是空白，存下
   * 去就變成 height: null，把它清掉。拿打開時那一版當基準，沒動過的空白兩邊都
   * 是 undefined，什麼都不寫——跟 DailyLogPage 拿 editingLog 給 dailyLogChanges
   * 是同一件事。
   *
   * 「這一筆還在不在」則要看 listener 最新的那一版，不是 opened：對方在表單開
   * 著的時候把它刪了，PATCH 打在已經不存在的節點上會被規則收下（合併後有
   * date 就夠，id 與 childId 都不是必填），寫回來的那一筆沒有 id——列表以
   * undefined 當 key，刪除鍵指向 growthRecords/undefined，一筆誰都刪不掉的
   * 健康紀錄。所以存在與否查 store，比對的基準才是 opened。
   *
   * percentile 兩邊都先拿掉再比：寫入端不存它，但舊紀錄存著的那一份也不能因
   * 為表單送了 {} 就被寫成 null。送進來卻是 undefined 的欄位是「清掉」，寫
   * null；沒送的欄位不動。沒有任何欄位改到就不寫。
   */
  const updateRecord = async (
    recordId: string,
    updates: Partial<Omit<GrowthRecord, 'id' | 'childId'>>,
    opened: GrowthRecord,
  ): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }
    if (!storedRecords.some((record) => record.id === recordId)) {
      throw new Error('Record not found');
    }
    validateRecord({ ...opened, ...updates });

    const submitted: Record<string, unknown> = { ...updates };
    delete submitted.percentile;
    const before: Record<string, unknown> = {};
    for (const key of Object.keys(submitted)) {
      before[key] = (opened as unknown as Record<string, unknown>)[key];
    }
    const paths = toUpdatePaths(changedFields(before, submitted));
    if (Object.keys(paths).length === 0) return;

    const recordRef = ref(database, `childRecords/${childId}/growthRecords/${recordId}`);
    await update(recordRef, paths);
  };

  const deleteRecord = async (recordId: string): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }
    const recordRef = ref(database, `childRecords/${childId}/growthRecords/${recordId}`);
    await remove(recordRef);
  };

  return {
    records,
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
  };
}

/**
 * Sort records by date (newest first)
 */
function sortRecordsByDate(records: GrowthRecord[]): GrowthRecord[] {
  return [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Validate a growth record
 */
function validateRecord(record: Omit<GrowthRecord, 'id'>): void {
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(record.date)) {
    throw new Error('Invalid date format: must be YYYY-MM-DD');
  }

  // Validate measurements
  if (record.weight !== undefined) {
    if (record.weight < 0) {
      throw new Error('Invalid measurement: weight cannot be negative');
    }
    if (record.weight > 50) {
      throw new Error('Unrealistic measurement: weight over 50kg for infant');
    }
  }

  if (record.height !== undefined) {
    if (record.height < 0) {
      throw new Error('Invalid measurement: height cannot be negative');
    }
    if (record.height > 150) {
      throw new Error('Unrealistic measurement: height over 150cm for infant');
    }
  }

  if (record.headCircumference !== undefined) {
    if (record.headCircumference < 0) {
      throw new Error(
        'Invalid measurement: head circumference cannot be negative'
      );
    }
    if (record.headCircumference > 70) {
      throw new Error(
        'Unrealistic measurement: head circumference over 70cm'
      );
    }
  }
}

/**
 * 依 WHO 標準算出這一筆測量的百分位，早產兒用矯正年齡。
 *
 * 三件事值得說明：
 *
 * 1. 有存好的百分位也一律重算。這個函式原本會在 `record.percentile` 有值時
 *    直接回傳——寫入時算一次就不再動。矯正機制上線後，那個捷徑等於保證舊的
 *    早產紀錄永遠是錯的。百分位只是快取，不是使用者輸入，重算是安全的。
 * 2. 算不出來時保留原本存著的那一份，不清空。缺性別或生日的情況下把
 *    percentile 覆蓋成 `{}`，畫面會從「第 45 百分位」變成什麼都沒有。存著的
 *    只會是舊紀錄：現在的寫入端不存百分位，而那時算不出來的，寫入當下也
 *    一樣算不出來，所以新紀錄在這裡沒有東西可留。
 * 3. 同步。原本掛著 async 卻沒有任何 await；讀取端每一筆都要算，多包一層
 *    promise 只是讓 useMemo 沒辦法用。
 */
function withPercentiles<T extends Omit<GrowthRecord, 'id'>>(record: T, child?: GrowthChild): T {
  const gender = child?.gender;
  const birthday = child?.birthday;
  if (!gender || !birthday) {
    return record;
  }

  const ageMonths = growthAgeMonths(
    {
      birthday,
      gestationalAgeWeeks: child?.gestationalAgeWeeks,
      gestationalAgeDays: child?.gestationalAgeDays,
    },
    new Date(record.date),
  );

  const percentile: {
    weight?: number;
    height?: number;
    headCircumference?: number;
  } = {};

  try {
    if (record.weight !== undefined) {
      percentile.weight = percentileFor(record.weight, ageMonths, 'weight', gender);
    }
    if (record.height !== undefined) {
      percentile.height = percentileFor(record.height, ageMonths, 'height', gender);
    }
    if (record.headCircumference !== undefined) {
      percentile.headCircumference = percentileFor(
        record.headCircumference,
        ageMonths,
        'headCircumference',
        gender,
      );
    }
  } catch (error) {
    // 超出 WHO 標準的年齡範圍（0-36 個月）會丟錯。既有的百分位留著，好過把
    // 畫面上的數字換成空白。
    console.warn('Failed to calculate percentiles:', error);
    return record;
  }

  return {
    ...record,
    percentile,
  };
}

function percentileFor(
  measurement: number,
  ageMonths: number,
  type: 'weight' | 'height' | 'headCircumference',
  gender: Gender,
): number {
  return calculatePercentile(calculateZScore(measurement, ageMonths, type, gender));
}
