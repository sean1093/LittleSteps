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
import { isPregnancyProfile, resolvePregnancyChild } from '../pregnancy';
import { CHILD_LIMIT_MESSAGE, MAX_CHILDREN } from '../childLimits';
import { useToast } from '../ui/toast';
import { useUserChildren } from './useUserChildren';
import { useFirebaseChildren } from './useFirebaseChildren';
import {
  logMilestoneToggle,
  logVaccineToggle,
  logChildProfileAction,
} from '../../lib/firebase';


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
  setVaccineDose: (
    vaccineId: string,
    doseNumber: number,
    administered: boolean,
    date?: string,
  ) => Promise<void>;
  addChild: (name: string, birthday: string, gender?: Gender, dueDate?: string) => Promise<void>;
  joinChild: (childUuid: string) => Promise<void>;
  updateChild: (id: string, name: string, birthday: string, gender?: Gender) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  setCurrentChild: (id: string) => Promise<void>;
  toggleDevelopmentCheck: (checkItemId: string) => Promise<void>;
  toggleTooth: (toothId: string) => Promise<void>;
  /**
   * LittleBloom 這一頁是關於哪一份檔案。與「現在選了誰」無關——見
   * resolvePregnancyChild。
   */
  pregnancyChild: ChildProfile | undefined;
  pregnancyPrenatalProgress: PrenatalCheckupProgress;
  upsertPrenatalRecord: (
    templateId: string,
    record: { completedDate: string; clinicName?: string; notes?: string },
  ) => Promise<void>;
  clearPrenatalRecord: (templateId: string) => Promise<void>;
  recordBirth: (birthday: string, gender?: Gender) => Promise<void>;
  upsertCareTaskRecord: (record: CareTaskRecord) => Promise<void>;
  clearCareTaskRecord: (taskId: string) => Promise<void>;
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
  const toast = useToast();
  const {
    children: childProfiles,
    currentChildId,
    loading: childrenLoading,
    childCount,
  } = useUserChildren(user);
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  /**
   * currentChildId 可能指著一個已經不存在的孩子：共享的孩子被建立者刪掉之後，
   * 這一端的 childrenIds 會自癒，但 currentChildId 不會——安全規則只允許
   * 每個使用者寫自己那份，執行刪除的人碰不到別人的 currentChildId。
   *
   * 少了這個 fallback，畫面會說「還沒有選擇寶寶」，即使家長明明還有另一個孩子。
   * 名單真的空的時候維持 undefined：那時候「沒有孩子」是事實。
   */
  const currentChild = useMemo(
    () => childProfiles.find((child) => child.id === currentChildId) ?? childProfiles[0],
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

  const pregnancyChild = useMemo(
    () => resolvePregnancyChild(childProfiles, currentChild),
    [childProfiles, currentChild],
  );

  const pregnancyPrenatalProgress: PrenatalCheckupProgress = useMemo(
    () => pregnancyChild?.prenatalProgress || {},
    [pregnancyChild],
  );

  const toggleMilestone = async (id: string) => {
    if (!user || !currentChild) return;
    try {
      const isAchieved = !currentChildMilestoneProgress[id]?.achieved;
      await firebaseChildren.updateMilestoneProgress(currentChild.id, id, isAchieved);
      logMilestoneToggle(id, isAchieved);
    } catch (error) {
      console.error('更新里程碑失敗:', error);
      toast.show(errorMessage(error, '里程碑更新失敗，請稍後再試'));
    }
  };

  /**
   * administered 由呼叫端明講，不從現況推。原本這裡算的是「反過來」，於是家長在
   * 已接種的那一劑上確認「修改接種日期」時，反而把 administered 翻成 false，
   * 資料層接著把 administeredDate 一併刪掉——想改日期，紀錄卻整筆消失。
   */
  const setVaccineDose = async (
    vaccineId: string,
    doseNumber: number,
    administered: boolean,
    date?: string,
  ) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.updateVaccineProgress(
        currentChild.id,
        vaccineId,
        doseNumber,
        administered,
        date,
      );
      logVaccineToggle(vaccineId, doseNumber, administered);
    } catch (error) {
      console.error('更新疫苗記錄失敗:', error);
      toast.show(errorMessage(error, '疫苗記錄更新失敗，請稍後再試'));
    }
  };

  const addChild = async (
    name: string,
    birthday: string,
    gender?: Gender,
    dueDate?: string,
  ) => {
    if (!user) return;
    // 上限比的是 childCount（帳號名下所有 id），不是 childProfiles.length。
    // 後者濾掉了 listener 還沒回報的孩子，第三個檔案就是這樣溜進來的。
    if (childCount >= MAX_CHILDREN) {
      toast.show(CHILD_LIMIT_MESSAGE);
      return;
    }
    try {
      await firebaseChildren.addChild(name, birthday, childCount, gender, dueDate);
      logChildProfileAction('create');
    } catch (error) {
      console.error('新增寶寶失敗:', error);
      throw error;
    }
  };

  const joinChild = async (childUuid: string) => {
    if (!user) return;
    if (childCount >= MAX_CHILDREN) {
      toast.show(CHILD_LIMIT_MESSAGE);
      return;
    }
    try {
      await firebaseChildren.joinChild(childUuid, childCount);
      logChildProfileAction('create'); // Creating a reference to an existing child.
    } catch (error) {
      console.error('加入寶寶失敗:', error);
      throw error;
    }
  };

  const updateChild = async (id: string, name: string, birthday: string, gender?: Gender) => {
    if (!user) return;
    try {
      await firebaseChildren.updateChild(
        id,
        name,
        birthday,
        gender,
        isPregnancyProfile(childProfiles.find((child) => child.id === id)),
      );
      logChildProfileAction('update');
    } catch (error) {
      console.error('更新寶寶資料失敗:', error);
      toast.show(errorMessage(error, '寶寶資料更新失敗，請稍後再試'));
    }
  };

  const deleteChild = async (id: string) => {
    if (!user) return;
    try {
      await firebaseChildren.deleteChild(
        id,
        childProfiles.map((child) => child.id),
      );
      logChildProfileAction('delete');
    } catch (error) {
      console.error('刪除寶寶失敗:', error);
      toast.show(errorMessage(error, '刪除寶寶失敗，請稍後再試'));
    }
  };

  const setCurrentChild = async (id: string) => {
    if (!user) return;
    try {
      await firebaseChildren.setCurrentChild(id);
      logChildProfileAction('switch');
    } catch (error) {
      console.error('切換寶寶失敗:', error);
      toast.show(errorMessage(error, '切換寶寶失敗，請稍後再試'));
    }
  };

  const toggleDevelopmentCheck = async (checkItemId: string) => {
    if (!user || !currentChild) return;
    try {
      const achieved = !currentChildDevelopmentProgress[checkItemId]?.achieved;
      await firebaseChildren.updateDevelopmentProgress(currentChild.id, checkItemId, achieved);
    } catch (error) {
      console.error('更新發展檢核失敗:', error);
      toast.show(errorMessage(error, '發展檢核更新失敗，請稍後再試'));
    }
  };

  const toggleTooth = async (toothId: string) => {
    if (!user || !currentChild) return;
    try {
      const erupted = !currentChildToothProgress[toothId]?.erupted;
      await firebaseChildren.updateToothProgress(currentChild.id, toothId, erupted);
    } catch (error) {
      console.error('更新乳牙記錄失敗:', error);
      toast.show(errorMessage(error, '乳牙記錄更新失敗，請稍後再試'));
    }
  };

  const upsertPrenatalRecord = async (
    templateId: string,
    record: { completedDate: string; clinicName?: string; notes?: string },
  ) => {
    if (!user || !pregnancyChild) return;
    try {
      await firebaseChildren.upsertPrenatalRecord(pregnancyChild.id, templateId, record);
    } catch (error) {
      console.error('更新產檢記錄失敗:', error);
      throw error;
    }
  };

  const clearPrenatalRecord = async (templateId: string) => {
    if (!user || !pregnancyChild) return;
    try {
      await firebaseChildren.clearPrenatalRecord(pregnancyChild.id, templateId);
    } catch (error) {
      console.error('取消產檢記錄失敗:', error);
      throw error;
    }
  };

  const recordBirth = async (birthday: string, gender?: Gender) => {
    if (!user || !pregnancyChild) return;
    try {
      await firebaseChildren.recordBirth(pregnancyChild.id, birthday, gender);
      logChildProfileAction('update');
    } catch (error) {
      console.error('登記出生失敗:', error);
      throw error;
    }
  };

  const upsertCareTaskRecord = async (record: CareTaskRecord) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.upsertCareTaskRecord(currentChild.id, record);
    } catch (error) {
      console.error('更新照護記錄失敗:', error);
      throw error;
    }
  };

  const clearCareTaskRecord = async (taskId: string) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.clearCareTaskRecord(currentChild.id, taskId);
    } catch (error) {
      console.error('取消照護記錄失敗:', error);
      throw error;
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
      throw error;
    }
  };

  const updateDiaryEntry = async (entryId: string, updates: Partial<DiaryEntry>) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.updateDiaryEntry(currentChild.id, entryId, updates);
    } catch (error) {
      console.error('更新日記失敗:', error);
      throw error;
    }
  };

  const deleteDiaryEntry = async (entryId: string) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.deleteDiaryEntry(currentChild.id, entryId);
    } catch (error) {
      console.error('刪除日記失敗:', error);
      throw error;
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
    setVaccineDose,
    addChild,
    joinChild,
    updateChild,
    deleteChild,
    setCurrentChild,
    toggleDevelopmentCheck,
    toggleTooth,
    pregnancyChild,
    pregnancyPrenatalProgress,
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
