import { ref, set, update, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import { ChildProfile, DailyLog } from '../types';

export function useFirebaseChildren(familyId: string | null) {
  const addChild = async (name: string, birthday: string, userId: string, currentChildCount: number) => {
    if (!familyId) throw new Error('No family selected');

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

    const childRef = ref(database, `families/${familyId}/children/${childId}`);
    await set(childRef, { ...newChild, createdBy: userId });

    // 如果是第一個孩子，自動設為 currentChildId
    const familyRef = ref(database, `families/${familyId}`);
    await update(familyRef, {
      currentChildId: childId,
      updatedAt: new Date().toISOString(),
    });

    return childId;
  };

  const updateChild = async (childId: string, name: string, birthday: string) => {
    if (!familyId) throw new Error('No family selected');

    const childRef = ref(database, `families/${familyId}/children/${childId}`);
    await update(childRef, { name, birthday });

    const familyRef = ref(database, `families/${familyId}`);
    await update(familyRef, { updatedAt: new Date().toISOString() });
  };

  const deleteChild = async (childId: string) => {
    if (!familyId) throw new Error('No family selected');

    const childRef = ref(database, `families/${familyId}/children/${childId}`);
    await remove(childRef);

    const familyRef = ref(database, `families/${familyId}`);
    await update(familyRef, { updatedAt: new Date().toISOString() });
  };

  const setCurrentChild = async (childId: string) => {
    if (!familyId) throw new Error('No family selected');

    const familyRef = ref(database, `families/${familyId}`);
    await update(familyRef, {
      currentChildId: childId,
      updatedAt: new Date().toISOString(),
    });
  };

  const updateMilestoneProgress = async (childId: string, milestoneId: string, achieved: boolean) => {
    if (!familyId) throw new Error('No family selected');

    const progressRef = ref(database, `families/${familyId}/children/${childId}/milestoneProgress/${milestoneId}`);
    await set(progressRef, {
      achieved,
      achievedDate: achieved ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  const updateVaccineProgress = async (childId: string, vaccineId: string, doseNumber: number, administered: boolean) => {
    if (!familyId) throw new Error('No family selected');

    const progressRef = ref(database, `families/${familyId}/children/${childId}/vaccineProgress/${vaccineId}/doses/${doseNumber}`);
    await set(progressRef, {
      administered,
      administeredDate: administered ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  // Daily Log methods
  const addDailyLog = async (childId: string, log: Omit<DailyLog, 'id'>) => {
    if (!familyId) throw new Error('No family selected');

    const logId = `log_${Date.now()}`;
    const newLog: DailyLog = {
      ...log,
      id: logId,
    };

    const logRef = ref(database, `families/${familyId}/children/${childId}/dailyLogs/${logId}`);
    await set(logRef, newLog);

    // Update family updatedAt
    const familyRef = ref(database, `families/${familyId}`);
    await update(familyRef, { updatedAt: new Date().toISOString() });

    return logId;
  };

  const updateDailyLog = async (childId: string, logId: string, updates: Partial<DailyLog>) => {
    if (!familyId) throw new Error('No family selected');

    const logRef = ref(database, `families/${familyId}/children/${childId}/dailyLogs/${logId}`);
    await update(logRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // Update family updatedAt
    const familyRef = ref(database, `families/${familyId}`);
    await update(familyRef, { updatedAt: new Date().toISOString() });
  };

  const deleteDailyLog = async (childId: string, logId: string) => {
    if (!familyId) throw new Error('No family selected');

    const logRef = ref(database, `families/${familyId}/children/${childId}/dailyLogs/${logId}`);
    await remove(logRef);

    // Update family updatedAt
    const familyRef = ref(database, `families/${familyId}`);
    await update(familyRef, { updatedAt: new Date().toISOString() });
  };

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
  };
}
