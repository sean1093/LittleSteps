import { useMemo } from 'react';
import type { User } from 'firebase/auth';
import type {
  CareTaskRecord,
  ChildProfile,
  DevelopmentCheckProgress,
  DiaryEntry,
  Gender,
  MilestoneProgress,
  PrenatalCheckupProgress,
  ToothProgress,
  VaccineProgress,
} from '../../types';
import { useUserChildren } from './useUserChildren';
import { useFirebaseChildren } from './useFirebaseChildren';
import {
  logMilestoneToggle,
  logVaccineToggle,
  logChildProfileAction,
} from '../../lib/firebase';

const MAX_FREE_CHILDREN = 2;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export interface ChildStore {
  childProfiles: ChildProfile[];
  currentChildId: string | null;
  currentChild: ChildProfile | undefined;
  currentChildMilestoneProgress: MilestoneProgress;
  currentChildVaccineProgress: VaccineProgress;
  currentChildDevelopmentProgress: DevelopmentCheckProgress;
  currentChildToothProgress: ToothProgress;
  childrenLoading: boolean;
  toggleMilestone: (id: string) => Promise<void>;
  toggleVaccineDose: (vaccineId: string, doseNumber: number, customDate?: string) => Promise<void>;
  addChild: (name: string, birthday: string, gender?: Gender, dueDate?: string) => Promise<void>;
  joinChild: (childUuid: string) => Promise<void>;
  updateChild: (id: string, name: string, birthday: string, gender?: Gender) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  setCurrentChild: (id: string) => Promise<void>;
  toggleDevelopmentCheck: (checkItemId: string) => Promise<void>;
  toggleTooth: (toothId: string) => Promise<void>;
  currentChildPrenatalProgress: PrenatalCheckupProgress;
  upsertPrenatalRecord: (
    templateId: string,
    record: { completedDate: string; clinicName?: string; notes?: string },
  ) => Promise<void>;
  clearPrenatalRecord: (templateId: string) => Promise<void>;
  upsertCareTaskRecord: (record: CareTaskRecord) => Promise<void>;
  addDiaryEntry: (
    entry: Omit<DiaryEntry, 'id' | 'childId' | 'createdAt'>,
  ) => Promise<string | undefined>;
  updateDiaryEntry: (entryId: string, updates: Partial<DiaryEntry>) => Promise<void>;
  deleteDiaryEntry: (entryId: string) => Promise<void>;
}

/**
 * Single source of truth for child-profile state and mutations, backed by
 * Firebase. Login is mandatory, so there is no LocalStorage/guest branch:
 * unauthenticated callers get empty data and no-op mutators.
 */
export function useChildStore(user: User | null): ChildStore {
  const {
    children: childProfiles,
    currentChildId,
    loading: childrenLoading,
  } = useUserChildren(user);
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  const currentChild = useMemo(
    () => childProfiles.find((child) => child.id === currentChildId),
    [childProfiles, currentChildId],
  );

  const currentChildMilestoneProgress: MilestoneProgress = useMemo(
    () => (currentChild ? currentChild.milestoneProgress || {} : {}),
    [currentChild],
  );

  const currentChildVaccineProgress: VaccineProgress = useMemo(
    () => (currentChild ? currentChild.vaccineProgress || {} : {}),
    [currentChild],
  );

  const currentChildDevelopmentProgress: DevelopmentCheckProgress = useMemo(
    () => (currentChild ? currentChild.developmentProgress || {} : {}),
    [currentChild],
  );

  const currentChildToothProgress: ToothProgress = useMemo(
    () => (currentChild ? currentChild.toothProgress || {} : {}),
    [currentChild],
  );

  const currentChildPrenatalProgress: PrenatalCheckupProgress = useMemo(
    () => (currentChild ? currentChild.prenatalProgress || {} : {}),
    [currentChild],
  );

  const toggleMilestone = async (id: string) => {
    if (!user || !currentChild) return;
    try {
      const isAchieved = !currentChildMilestoneProgress[id]?.achieved;
      await firebaseChildren.updateMilestoneProgress(currentChild.id, id, isAchieved);
      logMilestoneToggle(id, isAchieved);
    } catch (error) {
      console.error('更新里程碑失敗:', error);
    }
  };

  const toggleVaccineDose = async (vaccineId: string, doseNumber: number, customDate?: string) => {
    if (!user || !currentChild) return;
    try {
      const currentVaccine = currentChildVaccineProgress[vaccineId] || { doses: {} };
      const currentDose = currentVaccine.doses[doseNumber];
      const isAdministered = !currentDose?.administered;
      await firebaseChildren.updateVaccineProgress(currentChild.id, vaccineId, doseNumber, isAdministered, customDate);
      logVaccineToggle(vaccineId, doseNumber, isAdministered);
    } catch (error) {
      console.error('更新疫苗記錄失敗:', error);
    }
  };

  const addChild = async (
    name: string,
    birthday: string,
    gender?: Gender,
    dueDate?: string,
  ) => {
    if (!user) return;
    if (childProfiles.length >= MAX_FREE_CHILDREN) {
      alert('免費版最多只能新增 2 個寶寶，請升級付費會員');
      return;
    }
    try {
      await firebaseChildren.addChild(name, birthday, childProfiles.length, gender, dueDate);
      logChildProfileAction('create');
    } catch (error) {
      console.error('新增寶寶失敗:', error);
      alert(errorMessage(error, '新增寶寶失敗，請稍後再試'));
    }
  };

  const joinChild = async (childUuid: string) => {
    if (!user) return;
    if (childProfiles.length >= MAX_FREE_CHILDREN) {
      alert('免費版最多只能新增 2 個寶寶，請升級付費會員');
      return;
    }
    try {
      await firebaseChildren.joinChild(childUuid, childProfiles.length);
      logChildProfileAction('create'); // Creating a reference to an existing child.
    } catch (error) {
      console.error('加入寶寶失敗:', error);
      alert(errorMessage(error, '加入寶寶失敗，請確認代碼是否正確'));
    }
  };

  const updateChild = async (id: string, name: string, birthday: string, gender?: Gender) => {
    if (!user) return;
    try {
      await firebaseChildren.updateChild(id, name, birthday, gender);
      logChildProfileAction('update');
    } catch (error) {
      console.error('更新寶寶資料失敗:', error);
      alert(errorMessage(error, '更新失敗，請稍後再試'));
    }
  };

  const deleteChild = async (id: string) => {
    if (!user) return;
    try {
      await firebaseChildren.deleteChild(id);
      logChildProfileAction('delete');
    } catch (error) {
      console.error('刪除寶寶失敗:', error);
      alert(errorMessage(error, '刪除失敗，請稍後再試'));
    }
  };

  const setCurrentChild = async (id: string) => {
    if (!user) return;
    try {
      await firebaseChildren.setCurrentChild(id);
      logChildProfileAction('switch');
    } catch (error) {
      console.error('切換寶寶失敗:', error);
    }
  };

  const toggleDevelopmentCheck = async (checkItemId: string) => {
    if (!user || !currentChild) return;
    try {
      const achieved = !currentChildDevelopmentProgress[checkItemId]?.achieved;
      await firebaseChildren.updateDevelopmentProgress(currentChild.id, checkItemId, achieved);
    } catch (error) {
      console.error('更新發展檢核失敗:', error);
    }
  };

  const toggleTooth = async (toothId: string) => {
    if (!user || !currentChild) return;
    try {
      const erupted = !currentChildToothProgress[toothId]?.erupted;
      await firebaseChildren.updateToothProgress(currentChild.id, toothId, erupted);
    } catch (error) {
      console.error('更新乳牙記錄失敗:', error);
    }
  };

  const upsertPrenatalRecord = async (
    templateId: string,
    record: { completedDate: string; clinicName?: string; notes?: string },
  ) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.upsertPrenatalRecord(currentChild.id, templateId, record);
    } catch (error) {
      console.error('更新產檢記錄失敗:', error);
    }
  };

  const clearPrenatalRecord = async (templateId: string) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.clearPrenatalRecord(currentChild.id, templateId);
    } catch (error) {
      console.error('取消產檢記錄失敗:', error);
    }
  };

  const upsertCareTaskRecord = async (record: CareTaskRecord) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.upsertCareTaskRecord(currentChild.id, record);
    } catch (error) {
      console.error('更新照護記錄失敗:', error);
    }
  };

  const addDiaryEntry = async (
    entry: Omit<DiaryEntry, 'id' | 'childId' | 'createdAt'>,
  ) => {
    if (!user || !currentChild) return;
    try {
      return await firebaseChildren.addDiaryEntry(currentChild.id, {
        ...entry,
        childId: currentChild.id,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('新增日記失敗:', error);
    }
  };

  const updateDiaryEntry = async (entryId: string, updates: Partial<DiaryEntry>) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.updateDiaryEntry(currentChild.id, entryId, updates);
    } catch (error) {
      console.error('更新日記失敗:', error);
    }
  };

  const deleteDiaryEntry = async (entryId: string) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.deleteDiaryEntry(currentChild.id, entryId);
    } catch (error) {
      console.error('刪除日記失敗:', error);
    }
  };

  return {
    childProfiles,
    currentChildId,
    currentChild,
    currentChildMilestoneProgress,
    currentChildVaccineProgress,
    currentChildDevelopmentProgress,
    currentChildToothProgress,
    childrenLoading,
    toggleMilestone,
    toggleVaccineDose,
    addChild,
    joinChild,
    updateChild,
    deleteChild,
    setCurrentChild,
    toggleDevelopmentCheck,
    toggleTooth,
    currentChildPrenatalProgress,
    upsertPrenatalRecord,
    clearPrenatalRecord,
    upsertCareTaskRecord,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
  };
}
