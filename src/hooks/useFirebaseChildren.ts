import { ref, set, update, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import { ChildProfile, DailyLog, FoodTrialRecord } from '../types';

// Helper function to remove undefined values from objects
// Firebase does not allow undefined values - they must be null or omitted
function removeUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}

export function useFirebaseChildren(userId: string | null) {
  const addChild = async (name: string, birthday: string, currentChildCount: number) => {
    if (!userId) throw new Error('User not authenticated');

    // 免費版限制：最多 2 個寶寶
    if (currentChildCount >= 2) {
      throw new Error('免費版最多只能新增 2 個寶寶，請升級付費會員');
    }

    const childId = Date.now().toString();
    const newChild: ChildProfile = {
      id: childId,
      name,
      birthday,
      milestoneProgress: {},
      vaccineProgress: {},
      createdAt: new Date().toISOString(),
    };

    const childRef = ref(database, `users/${userId}/children/${childId}`);
    await set(childRef, newChild);

    // 如果是第一個孩子，自動設為 currentChildId
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, {
      currentChildId: childId,
    });

    return childId;
  };

  const updateChild = async (childId: string, name: string, birthday: string) => {
    if (!userId) throw new Error('User not authenticated');

    const childRef = ref(database, `users/${userId}/children/${childId}`);
    await update(childRef, { name, birthday });
  };

  const deleteChild = async (childId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const childRef = ref(database, `users/${userId}/children/${childId}`);
    await remove(childRef);
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

    const progressRef = ref(database, `users/${userId}/children/${childId}/milestoneProgress/${milestoneId}`);
    await set(progressRef, removeUndefined({
      achieved,
      achievedDate: achieved ? new Date().toISOString().split('T')[0] : undefined,
    }));
  };

  const updateVaccineProgress = async (childId: string, vaccineId: string, doseNumber: number, administered: boolean) => {
    if (!userId) throw new Error('User not authenticated');

    const progressRef = ref(database, `users/${userId}/children/${childId}/vaccineProgress/${vaccineId}/doses/${doseNumber}`);
    await set(progressRef, removeUndefined({
      administered,
      administeredDate: administered ? new Date().toISOString().split('T')[0] : undefined,
    }));
  };

  // Daily Log methods
  const addDailyLog = async (childId: string, log: Omit<DailyLog, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');

    const logId = `log_${Date.now()}`;
    const newLog: DailyLog = {
      ...log,
      id: logId,
    };

    const logRef = ref(database, `users/${userId}/children/${childId}/dailyLogs/${logId}`);
    await set(logRef, removeUndefined(newLog));

    return logId;
  };

  const updateDailyLog = async (childId: string, logId: string, updates: Partial<DailyLog>) => {
    if (!userId) throw new Error('User not authenticated');

    const logRef = ref(database, `users/${userId}/children/${childId}/dailyLogs/${logId}`);
    await update(logRef, removeUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteDailyLog = async (childId: string, logId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const logRef = ref(database, `users/${userId}/children/${childId}/dailyLogs/${logId}`);
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

    const foodRef = ref(database, `users/${userId}/children/${childId}/foodTrackingProgress/${foodId}`);
    await set(foodRef, removeUndefined(newFoodTrial));

    return foodId;
  };

  const updateFoodTrial = async (childId: string, foodId: string, updates: Partial<FoodTrialRecord>) => {
    if (!userId) throw new Error('User not authenticated');

    const foodRef = ref(database, `users/${userId}/children/${childId}/foodTrackingProgress/${foodId}`);
    await update(foodRef, removeUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteFoodTrial = async (childId: string, foodId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const foodRef = ref(database, `users/${userId}/children/${childId}/foodTrackingProgress/${foodId}`);
    await remove(foodRef);
  };

  // Note: addTrialDate is handled through updateFoodTrial
  // The calling code should read current data and append the new date to trialDates array

  return {
    addChild,
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
  };
}
