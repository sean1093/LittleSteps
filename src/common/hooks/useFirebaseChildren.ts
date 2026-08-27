import { ref, set, update, remove, get } from 'firebase/database';
import { database } from '../../lib/firebase';
import { CareTaskRecord, ChildProfile, DailyLog, DiaryEntry, FoodTrialRecord, Gender } from '../../types';
import { removeUndefined } from '../../utils/firebaseData';
import { lmpFromDueDate } from '../../utils/dateHelpers';

// Helper function to generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useFirebaseChildren(userId: string | null) {
  /**
   * Add a new child profile
   * - Generates a unique UUID for the child
   * - Stores child data in children/{uuid}
   * - Adds UUID to users/{userId}/childrenIds
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

    // 免費版限制：最多 2 個寶寶
    if (currentChildCount >= 2) {
      throw new Error('免費版最多只能新增 2 個寶寶，請升級付費會員');
    }

    const childId = generateUUID();
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

    // Store child data in shared children/ node
    const childRef = ref(database, `children/${childId}`);
    await set(childRef, removeUndefined(newChild));

    // Add child UUID to user's childrenIds
    const userChildRef = ref(database, `users/${userId}/childrenIds/${childId}`);
    await set(userChildRef, true);

    // 如果是第一個孩子，自動設為 currentChildId
    if (currentChildCount === 0) {
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, {
        currentChildId: childId,
      });
    }

    return childId;
  };

  /**
   * Join an existing child profile using UUID
   * - Verifies the child exists
   * - Adds UUID to users/{userId}/childrenIds
   */
  const joinChild = async (childUuid: string, currentChildCount: number) => {
    if (!userId) throw new Error('User not authenticated');

    // 免費版限制：最多 2 個寶寶
    if (currentChildCount >= 2) {
      throw new Error('免費版最多只能新增 2 個寶寶，請升級付費會員');
    }

    // Verify child exists
    const childRef = ref(database, `children/${childUuid}`);
    const childSnapshot = await get(childRef);

    if (!childSnapshot.exists()) {
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

  const updateChild = async (childId: string, name: string, birthday: string, gender?: Gender) => {
    if (!userId) throw new Error('User not authenticated');

    const childRef = ref(database, `children/${childId}`);
    await update(childRef, removeUndefined({ name, birthday, gender }));
  };

  /**
   * Delete child (only creator can delete)
   * - Removes child data from children/{childId}
   * - Removes from all users' childrenIds (TODO: may need to iterate users)
   * Note: For simplicity, we only remove from current user's childrenIds
   */
  const deleteChild = async (childId: string) => {
    if (!userId) throw new Error('User not authenticated');

    // Remove from user's childrenIds
    const userChildRef = ref(database, `users/${userId}/childrenIds/${childId}`);
    await remove(userChildRef);

    // Check if user is the creator
    const childRef = ref(database, `children/${childId}`);
    const childSnapshot = await get(childRef);

    if (childSnapshot.exists()) {
      const childData = childSnapshot.val() as ChildProfile;

      // Only creator can fully delete the child
      if (childData.createdBy === userId) {
        await remove(childRef);
      }
    }
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
      achievedDate: achieved ? new Date().toISOString().split('T')[0] : undefined,
    }));
  };

  const updateVaccineProgress = async (childId: string, vaccineId: string, doseNumber: number, administered: boolean, customDate?: string) => {
    if (!userId) throw new Error('User not authenticated');

    const progressRef = ref(database, `children/${childId}/vaccineProgress/${vaccineId}/doses/${doseNumber}`);
    await set(progressRef, removeUndefined({
      administered,
      administeredDate: administered ? (customDate || new Date().toISOString().split('T')[0]) : undefined,
    }));
  };

  // LittleExplorer methods
  const updateDevelopmentProgress = async (childId: string, checkItemId: string, achieved: boolean) => {
    if (!userId) throw new Error('User not authenticated');

    const progressRef = ref(database, `children/${childId}/developmentProgress/${checkItemId}`);
    await set(progressRef, removeUndefined({
      achieved,
      achievedDate: achieved ? new Date().toISOString().split('T')[0] : undefined,
    }));
  };

  const updateToothProgress = async (childId: string, toothId: string, erupted: boolean, customDate?: string) => {
    if (!userId) throw new Error('User not authenticated');

    const toothRef = ref(database, `children/${childId}/toothProgress/${toothId}`);
    await set(toothRef, removeUndefined({
      erupted,
      eruptedDate: erupted ? (customDate || new Date().toISOString().split('T')[0]) : undefined,
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

  const upsertCareTaskRecord = async (childId: string, record: CareTaskRecord) => {
    if (!userId) throw new Error('User not authenticated');

    const taskRef = ref(database, `children/${childId}/careTaskProgress/${record.taskId}`);
    await set(taskRef, removeUndefined(record));
  };

  const addDiaryEntry = async (childId: string, entry: Omit<DiaryEntry, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');

    const entryId = `diary_${Date.now()}`;
    const newEntry: DiaryEntry = { ...entry, id: entryId };

    const entryRef = ref(database, `children/${childId}/diaryEntries/${entryId}`);
    await set(entryRef, removeUndefined(newEntry));

    return entryId;
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

    const logId = `log_${Date.now()}`;
    const newLog: DailyLog = {
      ...log,
      id: logId,
    };

    const logRef = ref(database, `children/${childId}/dailyLogs/${logId}`);
    await set(logRef, removeUndefined(newLog));

    return logId;
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

    const foodId = `food_${Date.now()}`;
    const newFoodTrial: FoodTrialRecord = {
      ...foodTrial,
      id: foodId,
      createdAt: new Date().toISOString(),
    };

    const foodRef = ref(database, `children/${childId}/foodTrackingProgress/${foodId}`);
    await set(foodRef, removeUndefined(newFoodTrial));

    return foodId;
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

    const feedbackId = `feedback_${Date.now()}`;
    const feedbackData = {
      id: feedbackId,
      ...feedback,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const feedbackRef = ref(database, `feedbacks/${feedbackId}`);
    await set(feedbackRef, feedbackData);

    return feedbackId;
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
    upsertCareTaskRecord,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
  };
}
