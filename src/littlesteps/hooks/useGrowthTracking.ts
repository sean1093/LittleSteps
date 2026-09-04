import { useState, useEffect, useMemo } from 'react';
import { ref, set, onValue, remove } from 'firebase/database';
import { database } from '../../lib/firebase';
import type { ChildProfile, GrowthRecord, Gender } from '../../types';
import { calculateZScore, calculatePercentile } from '../utils/growthCalculator';
import { growthAgeMonths } from '../../common/correctedAge';
import { removeUndefined } from '../../common/utils/firebaseData';

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
  updateRecord: (
    recordId: string,
    updates: Partial<Omit<GrowthRecord, 'id' | 'childId'>>
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
 * 話，那些紀錄會永遠停在偏低的百分位，而它們正是家長最在意的那幾筆。存的那
 * 一份仍然照寫，資料庫形狀與規則都不動。
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
    const recordWithPercentiles = withPercentiles(record, child);
    const newRecord: GrowthRecord = {
      ...recordWithPercentiles,
      id: crypto.randomUUID(),
    };
    const recordRef = ref(database, `childRecords/${childId}/growthRecords/${newRecord.id}`);
    await set(recordRef, removeUndefined(newRecord));
  };

  const updateRecord = async (
    recordId: string,
    updates: Partial<Omit<GrowthRecord, 'id' | 'childId'>>
  ): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }
    const existing = records.find((r) => r.id === recordId);
    if (!existing) {
      throw new Error('Record not found');
    }
    const updated = { ...existing, ...updates };
    validateRecord(updated);
    const updatedWithPercentiles = withPercentiles(updated, child);
    const recordRef = ref(database, `childRecords/${childId}/growthRecords/${recordId}`);
    await set(recordRef, removeUndefined({ ...updatedWithPercentiles, id: recordId }));
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
 *    percentile 覆蓋成 `{}`，畫面會從「第 45 百分位」變成什麼都沒有。
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
