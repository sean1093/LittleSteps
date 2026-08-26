import { useMemo } from 'react';
import type { User } from 'firebase/auth';
import type { ChildProfile, MilestoneProgress, VaccineProgress, Gender } from '../../types';
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
  childrenLoading: boolean;
  toggleMilestone: (id: string) => Promise<void>;
  toggleVaccineDose: (vaccineId: string, doseNumber: number, customDate?: string) => Promise<void>;
  addChild: (name: string, birthday: string, gender?: Gender) => Promise<void>;
  joinChild: (childUuid: string) => Promise<void>;
  updateChild: (id: string, name: string, birthday: string, gender?: Gender) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  setCurrentChild: (id: string) => Promise<void>;
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

  const addChild = async (name: string, birthday: string, gender?: Gender) => {
    if (!user) return;
    if (childProfiles.length >= MAX_FREE_CHILDREN) {
      alert('免費版最多只能新增 2 個寶寶，請升級付費會員');
      return;
    }
    try {
      await firebaseChildren.addChild(name, birthday, childProfiles.length, gender);
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

  return {
    childProfiles,
    currentChildId,
    currentChild,
    currentChildMilestoneProgress,
    currentChildVaccineProgress,
    childrenLoading,
    toggleMilestone,
    toggleVaccineDose,
    addChild,
    joinChild,
    updateChild,
    deleteChild,
    setCurrentChild,
  };
}
