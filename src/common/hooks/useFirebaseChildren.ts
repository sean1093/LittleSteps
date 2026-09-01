import { ref, set, update, remove, get, push, type DatabaseReference } from 'firebase/database';
import { database } from '../../lib/firebase';
import { CareTaskRecord, ChildProfile, DailyLog, DiaryEntry, FoodTrialRecord, Gender } from '../../types';
import { removeUndefined } from '../utils/firebaseData';
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

    // 一次寫完，不是三筆循序 set。
    //
    // 原本先寫 children/{id} 再寫 childrenIds：第二筆沒落地就沒有任何人是
    // 成員，database.rules.json 從此拒絕這個 childId 的每一次讀與寫——那份
    // 健康紀錄再也讀不到、也刪不掉，帳號卻已經被它佔掉一個名額。
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
   * Join an existing child profile using UUID
   * - Verifies the child exists
   * - Adds UUID to users/{userId}/childrenIds
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

    // Add child UUID to user's childrenIds
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
   * Leave (unlink) from a child profile
   * - Removes UUID from users/{userId}/childrenIds
   * - Does NOT delete child data (other family members may still have access)
   */
  const leaveChild = async (childId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const userChildRef = ref(database, `users/${userId}/childrenIds/${childId}`);
    await remove(userChildRef);
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
  ) => {
    if (!userId) throw new Error('User not authenticated');

    const childRef = ref(database, `children/${childId}`);
    await update(
      childRef,
      removeUndefined({
        name,
        birthday,
        gender,
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
   * 只移除自己那份 childrenIds，不去動別人的——這不是簡化，是規則決定的。
   * database.rules.json 只允許每個使用者寫 users/$uid，所以「順手清掉共享對象
   * 的名單」在客戶端做不到。共享的孩子被刪掉之後，對方殘留的參照由對方那端的
   * useUserChildren 自癒（連 currentChildId 一起）。
   *
   * 原本這裡寫著 TODO: may need to iterate users。那條路走不通，留著只會讓
   * 下一個人去撞同一道規則。
   */
  /**
   * 刪除檔案。
   *
   * 一併把 currentChildId 移到另一個還在的孩子身上。少了這一步，刪掉當下
   * 選取的檔案之後 currentChildId 仍然指著已經不存在的 id，currentChild
   * 變成 undefined——即使還有另一個孩子，每一頁都會顯示「還沒有寶寶資料，
   * 請新增」，等於叫家長去建一個他明明已經有的檔案。
   */
  const deleteChild = async (childId: string, remainingChildIds: string[] = []) => {
    if (!userId) throw new Error('User not authenticated');

    // 順序不能反：children 的讀寫都要求成員身分，所以先看完、刪完孩子資料，
    // 最後才退掉自己的成員資格。原本是先退再刪，在 .read 收緊之後那會讓
    // 建立者的刪除靜靜失敗，留下一份沒有人能再讀到的健康紀錄。
    const childRef = ref(database, `children/${childId}`);
    const childSnapshot = await get(childRef);

    if (childSnapshot.exists()) {
      const childData = childSnapshot.val() as ChildProfile;

      // Only creator can fully delete the child
      if (childData.createdBy === userId) {
        await remove(childRef);
        // 索引跟著本體走，否則代碼還查得到、加入後卻是一份空資料。
        await remove(ref(database, `childIndex/${childId}`));
      }
    }

    // Remove from user's childrenIds
    const userChildRef = ref(database, `users/${userId}/childrenIds/${childId}`);
    await remove(userChildRef);

    const nextChildId = remainingChildIds.find((id) => id !== childId) ?? null;
    await update(ref(database, `users/${userId}`), { currentChildId: nextChildId });
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

    const { recordRef, id } = newRecordRef(`children/${childId}/diaryEntries`);
    const newEntry: DiaryEntry = { ...entry, id };
    await set(recordRef, removeUndefined(newEntry));

    return id;
  };

  const updateDiaryEntry = async (childId: string, entryId: string, updates: Partial<DiaryEntry>) => {
    if (!userId) throw new Error('User not authenticated');

    const entryRef = ref(database, `children/${childId}/diaryEntries/${entryId}`);
    await update(entryRef, removeUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteDiaryEntry = async (childId: string, entryId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const entryRef = ref(database, `children/${childId}/diaryEntries/${entryId}`);
    await remove(entryRef);
  };

  // Daily Log methods
  const addDailyLog = async (childId: string, log: Omit<DailyLog, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');

    const { recordRef, id } = newRecordRef(`children/${childId}/dailyLogs`);
    const newLog: DailyLog = { ...log, id };
    await set(recordRef, removeUndefined(newLog));

    return id;
  };

  const updateDailyLog = async (childId: string, logId: string, updates: Partial<DailyLog>) => {
    if (!userId) throw new Error('User not authenticated');

    const logRef = ref(database, `children/${childId}/dailyLogs/${logId}`);
    await update(logRef, removeUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteDailyLog = async (childId: string, logId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const logRef = ref(database, `children/${childId}/dailyLogs/${logId}`);
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

  // Feedback submission
  const submitFeedback = async (feedback: {
    title: string;
    content: string;
    userId: string;
    userEmail: string;
    userName: string;
  }) => {
    if (!userId) throw new Error('User not authenticated');

    const { recordRef, id } = newRecordRef('feedbacks');
    const feedbackData = {
      id,
      ...feedback,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await set(recordRef, feedbackData);

    return id;
  };

  return {
    addChild,
    joinChild, // New: join existing child via UUID
    leaveChild, // New: leave/unlink from child
    updateChild,
    deleteChild,
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
