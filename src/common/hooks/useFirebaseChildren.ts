import { ref, set, update, remove, get, push, serverTimestamp, type DatabaseReference } from 'firebase/database';
import { database } from '../../lib/firebase';
import { CareTaskRecord, ChildProfile, DailyLog, DailyLogPatch, DiaryEntry, FoodTrialRecord, Gender } from '../../types';
import { removeUndefined, toUpdatePaths } from '../utils/firebaseData';
import type { GestationalAge } from '../correctedAge';
import { lmpFromDueDate, toLocalDateKey } from '../utils/dateHelpers';
import { CHILD_LIMIT_MESSAGE, MAX_CHILDREN } from '../childLimits';

/**
 * 新紀錄的 key 一律交給 push()。
 *
 * 原本是 `${prefix}_${Date.now()}`：共享的孩子有兩個家長（createdBy 就是為此
 * 存在），同一毫秒各寫一筆，後到的那筆會靜靜蓋掉對方的紀錄。push() 的 key 由
 * 客戶端產生且含隨機位元，兩端不會撞。
 *
 * 既有的 Date.now() key 原樣留著——讀取一律 Object.values 後照紀錄自己的時間
 * 排序，沒有任何地方把 key 的順序當成時間順序。
 */
function newRecordRef(path: string): { recordRef: DatabaseReference; id: string } {
  const recordRef = push(ref(database, path));
  if (!recordRef.key) throw new Error('無法產生紀錄編號');
  return { recordRef, id: recordRef.key };
}

/** 規則擋下回饋時給家長看的話：每個帳號一分鐘一則，見 submitFeedback。 */
export const FEEDBACK_THROTTLED_MESSAGE = '剛剛才送出過一次，請稍後再試';
/** 其他失敗（斷線、SDK 例外）的一句；SDK 的原文對家長沒有意義。 */
export const FEEDBACK_FAILED_MESSAGE = '提交失敗，請稍後再試';

/**
 * SDK 把規則的拒絕包成 message 以 PERMISSION_DENIED 開頭、code 也是它的 Error。
 * 兩個都看：測試裡的假 SDK 只給 message。
 */
const isPermissionDenied = (error: unknown): boolean =>
  error instanceof Error &&
  ((error as { code?: unknown }).code === 'PERMISSION_DENIED' ||
    /permission_denied/i.test(error.message));

export function useFirebaseChildren(userId: string | null) {
  /**
   * 新增一份檔案：孩子本體、自己的成員資格、（第一個孩子的）選取狀態，
   * 一筆原子寫入。
   */
  const addChild = async (
    name: string,
    birthday: string,
    currentChildCount: number,
    gender?: Gender,
    /** 建立孕期檔案時傳入預產期；末次月經由 Naegele 法則回推。 */
    dueDate?: string,
    /** 早產週數，只有家長填了才寫。見 common/correctedAge。 */
    gestationalAge?: GestationalAge,
  ) => {
    if (!userId) throw new Error('User not authenticated');

    // 帳號層級的上限，見 common/childLimits。
    if (currentChildCount >= MAX_CHILDREN) {
      throw new Error(CHILD_LIMIT_MESSAGE);
    }

    const childId = crypto.randomUUID();
    const newChild: ChildProfile = {
      id: childId,
      name,
      birthday,
      gender,
      gestationalAgeWeeks: gestationalAge?.weeks,
      gestationalAgeDays: gestationalAge?.days,
      // 授權名單，不是 users/{uid}/childrenIds。建立者必須在同一筆寫入裡就是
      // 成員，否則規則擋下這筆——連他自己都讀不回這個孩子。
      members: { [userId]: true },
      // 一律寫成布林值，不留空。規則驗的是 isBoolean，欄位缺著的話分享視窗
      // 讀到的是 undefined，切換開關時就會以為自己在改一個本來存在的設定。
      // 預設關：代碼是 UUID，但 UUID 會流過聊天軟體與截圖。
      joinOpen: false,
      milestoneProgress: {},
      vaccineProgress: {},
      // 孕期檔案在這裡就要把 pregnancyData 寫進去。先前這兩個參數在
      // AddChildModal → Sidebar → useChildStore 的傳遞途中被靜默丟棄，
      // 導致 LittleBloom 永遠讀不到資料、每個人都停在第 1 週。
      isPregnancy: dueDate ? true : undefined,
      pregnancyData: dueDate
        ? {
            childId,
            dueDate,
            lastPeriodDate: lmpFromDueDate(dueDate),
            status: 'active',
          }
        : undefined,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };

    // 一次寫完，不是兩筆循序 set。
    //
    // 孩子本體與自己的名單索引要嘛都在、要嘛都不在。只有本體落地的話，那份
    // 檔案讀得到（我還在 members 裡）卻沒有任何入口指得到它——名單上沒有、
    // 切換器裡沒有，只剩當初那個 UUID，而家長從來沒看過它。
    const updates: Record<string, unknown> = {
      [`children/${childId}`]: removeUndefined(newChild),
      [`users/${userId}/childrenIds/${childId}`]: true,
    };
    // 第一個孩子自動設為當前選取，同一筆帶過去。
    if (currentChildCount === 0) {
      updates[`users/${userId}/currentChildId`] = childId;
    }
    await update(ref(database), updates);

    // 加入用的公開索引，見 childIndex 的說明。它進不了上面那一筆：規則檢查的
    // 是寫入前的 root，成員資格在同一筆裡還不算存在，所以只能排在授權之後。
    // 寫失敗不算新增失敗——孩子已經建好了，而 useUserChildren 對每個有權限的
    // 孩子都會補一次索引。
    await set(ref(database, `childIndex/${childId}`), true).catch((error) => {
      console.error('寫入寶寶索引失敗，稍後由名單 listener 補上:', error);
    });

    return childId;
  };

  /**
   * 用代碼加入一份既有的檔案。
   *
   * 兩筆寫入，順序不能反：先寫 children/{id}/members/{我}，才寫自己的
   * childrenIds。成員資格是授權的來源，先落地的話，第二筆掉了也還有一位成員，
   * 那一端的 listener 補得回索引；反過來則是在名單上留一個永遠讀不到的 id。
   */
  const joinChild = async (childUuid: string, currentChildCount: number) => {
    if (!userId) throw new Error('User not authenticated');

    // 帳號層級的上限，見 common/childLimits。
    if (currentChildCount >= MAX_CHILDREN) {
      throw new Error(CHILD_LIMIT_MESSAGE);
    }

    // 只讀 childIndex，不讀 children。
    //
    // 以前這裡讀的是 children/{uuid} 本體，而那需要 children 的 .read 對任何
    // 登入者開放——於是任何人只要有 UUID 就能讀到別人孩子的完整健康紀錄，而
    // 這個 app 的共享機制正是把 UUID 傳給對方。childIndex 只存一個 true，
    // 恰好是加入流程唯一需要知道的事：這個代碼存不存在。
    const indexSnapshot = await get(ref(database, `childIndex/${childUuid}`));

    if (!indexSnapshot.exists()) {
      throw new Error('找不到此寶寶代碼，請確認代碼是否正確');
    }

    // Check if already joined
    const userChildRef = ref(database, `users/${userId}/childrenIds/${childUuid}`);
    const existingSnapshot = await get(userChildRef);

    if (existingSnapshot.exists()) {
      throw new Error('您已經加入此寶寶');
    }

    try {
      await set(ref(database, `children/${childUuid}/members/${userId}`), true);
    } catch (error) {
      // 代碼查得到，成員資格卻寫不進去，就只剩一個原因：對方沒有開放加入。
      // 這跟「代碼打錯」是兩件事；講成同一句話，家長會一直去核對一組沒有錯的
      // 代碼，而真正該做的是請對方把共享打開。
      console.error('加入寶寶失敗（成員資格被拒）:', error);
      throw new Error('這個寶寶目前未開放加入，請對方在分享視窗中開啟共享後再試');
    }

    await set(userChildRef, true);

    // 如果是第一個孩子，自動設為 currentChildId
    if (currentChildCount === 0) {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, {
        currentChildId: childUuid,
      });
    }

    return childUuid;
  };

  /**
   * 編輯既有檔案。
   *
   * 孕期檔案的 birthday 欄位存的是預產期，而 LittleBloom 的週數、孕期指南
   * 與 14 次產檢時程全部是從 pregnancyData.lastPeriodDate 推出來的。只改
   * birthday 的話兩者會永久脫鉤：畫面上的預產期改了，週數與產檢時程卻還用
   * 舊的末次月經——照超音波修正預產期正是最常見的操作。
   */
  const updateChild = async (
    childId: string,
    name: string,
    birthday: string,
    gender?: Gender,
    isPregnancy?: boolean,
    gestationalAge?: GestationalAge,
  ) => {
    if (!userId) throw new Error('User not authenticated');

    const childRef = ref(database, `children/${childId}`);
    await update(
      childRef,
      removeUndefined({
        name,
        birthday,
        gender,
        // 寫 null 而不是留空：呼叫端只有編輯表單，送過來的一定是當下完整的
        // 表單狀態，所以「沒有值」就是「家長把它清掉了」。用 undefined 的話
        // removeUndefined 會整個拔掉這兩個 key，舊的週數就永遠留在資料庫裡，
        // 誤填一次之後再也改不回足月。
        gestationalAgeWeeks: gestationalAge?.weeks ?? null,
        gestationalAgeDays: gestationalAge?.days ?? null,
        ...(isPregnancy
          ? {
              'pregnancyData/dueDate': birthday,
              'pregnancyData/lastPeriodDate': lmpFromDueDate(birthday),
            }
          : {}),
      }),
    );
  };

  /**
   * 刪除檔案。
   *
   * 一筆 root fan-out，不是一連串 remove。規則裡的 root 指的是「寫入前」的
   * 資料庫，而 childRecords/{childId} 與 childIndex/{childId} 的授權都是去
   * children/{childId}/members 查我在不在。所以先刪掉孩子本體，後面兩筆就會
   * 被拒——留下一份沒有任何人是成員、再也讀不到也刪不掉的健康紀錄，以及一個
   * 查得到卻加入不了的殘留代碼。同一筆裡每個路徑都對寫入前的狀態驗證，
   * 順序問題就不存在了。
   *
   * 只有建立者能整份刪除。其他成員刪掉的是自己的成員資格——那才是真的交回
   * 讀寫權限，光清掉自己的 childrenIds 只是從自己的名單上藏起來。建立者的
   * 成員資格規則上刪不掉（否則孩子本體會沒有人碰得到），所以建立者沒有
   * 「離開」這條路，只有刪除。
   *
   * currentChildId 一起帶進同一筆。少了它，刪掉當下選取的檔案之後它仍然指著
   * 已經不存在的 id，currentChild 變成 undefined——即使還有另一個孩子，每一頁
   * 都會顯示「還沒有寶寶資料，請新增」，等於叫家長去建一個他明明已經有的檔案。
   *
   * 別人的 childrenIds 動不了：users/$uid 只有本人寫得動。共享的孩子被刪掉
   * 之後，對方殘留的參照由對方那端的 useUserChildren 自癒。
   */
  const deleteChild = async (childId: string, remainingChildIds: string[] = []) => {
    if (!userId) throw new Error('User not authenticated');

    // 讀不到本體有兩種可能：已經被建立者刪掉，或自己的成員資格被收回了。兩種
    // 都還是要清掉自己這一端的名單，否則被收回的家長會永遠卡著一個讀不到、
    // 又刪不掉的項目。
    const childSnapshot = await get(ref(database, `children/${childId}`)).catch(() => null);
    const childData = childSnapshot?.exists() ? (childSnapshot.val() as ChildProfile) : null;

    const updates: Record<string, unknown> = {
      [`users/${userId}/childrenIds/${childId}`]: null,
      [`users/${userId}/currentChildId`]: remainingChildIds.find((id) => id !== childId) ?? null,
    };

    if (childData?.createdBy === userId) {
      updates[`children/${childId}`] = null;
      // 紀錄搬出孩子本體之後，刪孩子不會再把它們一起帶走。少了這一筆，
      // childRecords/{childId} 會留在資料庫裡，而且沒有人是成員、沒有任何人
      // 讀得到或刪得掉——一份孩子的健康紀錄就這樣漏在那裡。
      updates[`childRecords/${childId}`] = null;
      // 索引跟著本體走，否則代碼還查得到、加入時卻只換到一則講不出原因的錯誤。
      updates[`childIndex/${childId}`] = null;
    } else if (childData) {
      updates[`children/${childId}/members/${userId}`] = null;
    }

    await update(ref(database), updates);
  };

  /**
   * 收回分享：把其他成員移出名單，並關掉加入。
   *
   * 代碼已經在對方手上，所以「收回」不是換一組代碼而是刪成員；joinOpen 要一起
   * 關掉，否則對方下一秒就用手上的同一組代碼加回來。同一筆 update，不會只成功
   * 一半。
   *
   * 建立者留著。規則上他的成員資格刪不掉，混進同一筆會讓整筆被拒——共同照顧者
   * 按下收回時，畫面上什麼都不會發生。
   */
  const revokeOtherMembers = async (childId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const childSnapshot = await get(ref(database, `children/${childId}`));
    const childData = childSnapshot.exists() ? (childSnapshot.val() as ChildProfile) : null;
    if (!childData) throw new Error('找不到這個寶寶的資料，請重新整理後再試');

    const updates: Record<string, unknown> = { joinOpen: false };
    for (const memberUid of Object.keys(childData.members ?? {})) {
      if (memberUid === userId || memberUid === childData.createdBy) continue;
      updates[`members/${memberUid}`] = null;
    }
    await update(ref(database, `children/${childId}`), updates);
  };

  const setJoinOpen = async (childId: string, open: boolean) => {
    if (!userId) throw new Error('User not authenticated');

    await set(ref(database, `children/${childId}/joinOpen`), open);
  };

  const setCurrentChild = async (childId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      currentChildId: childId,
    });
  };

  const updateMilestoneProgress = async (childId: string, milestoneId: string, achieved: boolean) => {
    if (!userId) throw new Error('User not authenticated');

    const progressRef = ref(database, `children/${childId}/milestoneProgress/${milestoneId}`);
    await set(progressRef, removeUndefined({
      achieved,
      achievedDate: achieved ? toLocalDateKey() : undefined,
    }));
  };

  const updateVaccineProgress = async (childId: string, vaccineId: string, doseNumber: number, administered: boolean, customDate?: string) => {
    if (!userId) throw new Error('User not authenticated');

    const progressRef = ref(database, `children/${childId}/vaccineProgress/${vaccineId}/doses/${doseNumber}`);
    await set(progressRef, removeUndefined({
      administered,
      administeredDate: administered ? (customDate || toLocalDateKey()) : undefined,
    }));
  };

  // LittleExplorer methods
  const updateDevelopmentProgress = async (childId: string, checkItemId: string, achieved: boolean) => {
    if (!userId) throw new Error('User not authenticated');

    const progressRef = ref(database, `children/${childId}/developmentProgress/${checkItemId}`);
    await set(progressRef, removeUndefined({
      achieved,
      achievedDate: achieved ? toLocalDateKey() : undefined,
    }));
  };

  const updateToothProgress = async (childId: string, toothId: string, erupted: boolean, customDate?: string) => {
    if (!userId) throw new Error('User not authenticated');

    const toothRef = ref(database, `children/${childId}/toothProgress/${toothId}`);
    await set(toothRef, removeUndefined({
      erupted,
      eruptedDate: erupted ? (customDate || toLocalDateKey()) : undefined,
    }));
  };

  const upsertPrenatalRecord = async (
    childId: string,
    templateId: string,
    record: { completedDate: string; clinicName?: string; notes?: string },
  ) => {
    if (!userId) throw new Error('User not authenticated');

    const recordRef = ref(database, `children/${childId}/prenatalProgress/${templateId}`);
    await set(recordRef, removeUndefined(record));
  };

  const clearPrenatalRecord = async (childId: string, templateId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const recordRef = ref(database, `children/${childId}/prenatalProgress/${templateId}`);
    await remove(recordRef);
  };

  /**
   * 孕期檔案轉成寶寶檔案。
   *
   * 一併收性別：成長曲線的百分位要有性別才算得出來（WHO 標準男女不同表），
   * 沒有的話 calculatePercentiles 直接原樣返回，percentile 是空物件、被
   * Firebase 丟掉，於是從 LittleBloom 出生的每個孩子成長曲線都少一半功能，
   * 而且畫面上完全沒有跡象說明為什麼。出生當下正是知道性別的時刻。
   */
  const recordBirth = async (childId: string, birthday: string, gender?: Gender) => {
    if (!userId) throw new Error('User not authenticated');

    const childRef = ref(database, `children/${childId}`);
    await update(
      childRef,
      removeUndefined({
        birthday,
        gender,
        isPregnancy: false,
        'pregnancyData/status': 'archived',
      }),
    );
  };

  const upsertCareTaskRecord = async (childId: string, record: CareTaskRecord) => {
    if (!userId) throw new Error('User not authenticated');

    const taskRef = ref(database, `children/${childId}/careTaskProgress/${record.taskId}`);
    await set(taskRef, removeUndefined(record));
  };

  const clearCareTaskRecord = async (childId: string, taskId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const taskRef = ref(database, `children/${childId}/careTaskProgress/${taskId}`);
    await remove(taskRef);
  };

  const addDiaryEntry = async (childId: string, entry: Omit<DiaryEntry, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');

    const { recordRef, id } = newRecordRef(`childRecords/${childId}/diaryEntries`);
    const newEntry: DiaryEntry = { ...entry, id };
    await set(recordRef, removeUndefined(newEntry));

    return id;
  };

  const updateDiaryEntry = async (childId: string, entryId: string, updates: Partial<DiaryEntry>) => {
    if (!userId) throw new Error('User not authenticated');

    const entryRef = ref(database, `childRecords/${childId}/diaryEntries/${entryId}`);
    await update(entryRef, removeUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteDiaryEntry = async (childId: string, entryId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const entryRef = ref(database, `childRecords/${childId}/diaryEntries/${entryId}`);
    await remove(entryRef);
  };

  // Daily Log methods
  const addDailyLog = async (childId: string, log: Omit<DailyLog, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');

    const { recordRef, id } = newRecordRef(`childRecords/${childId}/dailyLogs`);
    const newLog: DailyLog = { ...log, id };
    await set(recordRef, removeUndefined(newLog));

    return id;
  };

  /**
   * 改一筆日誌：只寫真的改到的欄位。
   *
   * update() 只在它收到的那一層合併，巢狀的 data 是整個節點換掉。所以
   * `{ data: { nightWakings: 2 } }` 會把 data 裡其他欄位一起洗掉——共享的
   * 孩子有兩位照顧者，一個人按「醒了」寫結束時間、另一個人同時在補備註，
   * 後到的那一筆連著他手上的舊值蓋回去，對方剛記的東西就沒了，而且兩邊都
   * 不會看到任何提示。攤平成 data/<欄位> 之後，各改各的欄位就會合併。
   *
   * 沒有任何欄位改到就不寫：只更新 updatedAt 沒有意義。
   */
  const updateDailyLog = async (childId: string, logId: string, patch: DailyLogPatch) => {
    if (!userId) throw new Error('User not authenticated');

    const paths = toUpdatePaths(patch);
    if (Object.keys(paths).length === 0) return;

    const logRef = ref(database, `childRecords/${childId}/dailyLogs/${logId}`);
    await update(logRef, {
      ...paths,
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteDailyLog = async (childId: string, logId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const logRef = ref(database, `childRecords/${childId}/dailyLogs/${logId}`);
    await remove(logRef);
  };

  // Food Tracking methods
  const addFoodTrial = async (childId: string, foodTrial: Omit<FoodTrialRecord, 'id' | 'createdAt'>) => {
    if (!userId) throw new Error('User not authenticated');

    const { recordRef, id } = newRecordRef(`children/${childId}/foodTrackingProgress`);
    const newFoodTrial: FoodTrialRecord = {
      ...foodTrial,
      id,
      createdAt: new Date().toISOString(),
    };
    await set(recordRef, removeUndefined(newFoodTrial));

    return id;
  };

  const updateFoodTrial = async (childId: string, foodId: string, updates: Partial<FoodTrialRecord>) => {
    if (!userId) throw new Error('User not authenticated');

    const foodRef = ref(database, `children/${childId}/foodTrackingProgress/${foodId}`);
    await update(foodRef, removeUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteFoodTrial = async (childId: string, foodId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const foodRef = ref(database, `children/${childId}/foodTrackingProgress/${foodId}`);
    await remove(foodRef);
  };

  /**
   * 回饋與 users/$uid/lastFeedbackAt 是同一筆 multi-path 更新，不能拆成兩筆。
   *
   * feedbacks 是唯一任何登入者都寫得進去的節點，而登入對每一個 Google 帳號
   * 開放：沒有上限的話，一支迴圈就能把 Spark 方案的儲存額度寫滿，而回饋沒有
   * 人讀得到，所以不會有人發現。規則的解法是每個帳號一分鐘一則：feedbacks 的
   * .write 從同一筆寫入裡讀自己的 lastFeedbackAt（newData.parent()），要求它
   * 等於伺服器的 now，而 lastFeedbackAt 自己的 validate 又要求比上一次晚 60 秒。
   * 戳記交給 serverTimestamp()，客戶端填的數字永遠對不上 now。
   *
   * 分開寫的話，單獨的回饋那一筆讀不到戳記，一定被擋。
   */
  const submitFeedback = async (feedback: {
    title: string;
    content: string;
    userId: string;
    userEmail: string;
    userName: string;
  }) => {
    if (!userId) throw new Error('User not authenticated');

    const { id } = newRecordRef('feedbacks');
    const now = new Date().toISOString();
    const feedbackData = {
      id,
      ...feedback,
      timestamp: now,
      createdAt: now,
    };
    try {
      await update(ref(database), {
        [`feedbacks/${id}`]: feedbackData,
        [`users/${userId}/lastFeedbackAt`]: serverTimestamp(),
      });
    } catch (error) {
      // 表單這一側能造成的拒絕只剩一種：一分鐘內送過。userId 是自己的 uid，
      // 欄位長度在表單就已經封頂。伺服器那一側還有兩個不在表單手上的原因——
      // 帳號在 app 開著的時候被停用（auth 變成 null），或 App Check 開始強制
      // 執行後 reCAPTCHA 載不進來——它們也回 PERMISSION_DENIED，這裡會說錯話。
      throw new Error(isPermissionDenied(error) ? FEEDBACK_THROTTLED_MESSAGE : FEEDBACK_FAILED_MESSAGE);
    }

    return id;
  };

  return {
    addChild,
    joinChild, // New: join existing child via UUID
    updateChild,
    deleteChild,
    revokeOtherMembers,
    setJoinOpen,
    setCurrentChild,
    updateMilestoneProgress,
    updateVaccineProgress,
    addDailyLog,
    updateDailyLog,
    deleteDailyLog,
    addFoodTrial,
    updateFoodTrial,
    deleteFoodTrial,
    submitFeedback,
    updateDevelopmentProgress,
    updateToothProgress,
    upsertPrenatalRecord,
    clearPrenatalRecord,
    recordBirth,
    upsertCareTaskRecord,
    clearCareTaskRecord,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
  };
}
