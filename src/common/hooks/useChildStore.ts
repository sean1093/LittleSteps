import { useEffect, useMemo } from 'react';
import type { User } from 'firebase/auth';
import type { ChildProfile, MilestoneProgress, VaccineProgress, Gender } from '../../types';
import { useLocalStorage } from './useLocalStorage';
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
 * Single source of truth for child-profile state and mutations. Encapsulates
 * the Firebase-vs-LocalStorage dual-mode branching that was previously spread
 * across every handler in App.tsx: authenticated users read/write Firebase via
 * useFirebaseChildren, guests use LocalStorage. Callers get one uniform API and
 * never see which backend is active.
 */
export function useChildStore(user: User | null): ChildStore {
  const {
    children: firebaseChildProfiles,
    currentChildId: firebaseCurrentChildId,
    loading: childrenLoading,
  } = useUserChildren(user);
  const firebaseChildren = useFirebaseChildren(user?.uid || null);

  const [localChildProfiles, setLocalChildProfiles] = useLocalStorage<ChildProfile[]>('child-profiles', []);
  const [localCurrentChildId, setLocalCurrentChildId] = useLocalStorage<string | null>('current-child-id', null);

  const childProfiles = user ? firebaseChildProfiles : localChildProfiles;
  const currentChildId = user ? firebaseCurrentChildId : localCurrentChildId;

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

  // LocalStorage mode: auto-select the first child when none is selected.
  useEffect(() => {
    if (!user) {
      if (localChildProfiles.length > 0 && !currentChild) {
        setLocalCurrentChildId(localChildProfiles[0].id);
      } else if (localChildProfiles.length === 0 && localCurrentChildId !== null) {
        setLocalCurrentChildId(null);
      }
    }
  }, [user, localChildProfiles, currentChild, localCurrentChildId]);

  // LocalStorage mode: backfill vaccineProgress on profiles saved before it existed.
  useEffect(() => {
    if (!user) {
      const needsMigration = localChildProfiles.some((profile) => !profile.vaccineProgress);
      if (needsMigration) {
        setLocalChildProfiles((prevProfiles) =>
          prevProfiles.map((profile) => ({
            ...profile,
            vaccineProgress: profile.vaccineProgress || {},
          })),
        );
      }
    }
  }, [user, localChildProfiles]);

  const toggleMilestone = async (id: string) => {
    if (!currentChild) return;

    if (user) {
      try {
        const isAchieved = !currentChildMilestoneProgress[id]?.achieved;
        await firebaseChildren.updateMilestoneProgress(currentChild.id, id, isAchieved);
        logMilestoneToggle(id, isAchieved);
      } catch (error) {
        console.error('更新里程碑失敗:', error);
      }
    } else {
      setLocalChildProfiles((prevProfiles) =>
        prevProfiles.map((profile) => {
          if (profile.id === currentChild.id) {
            // Compute isAchieved from the latest profile to avoid a race condition.
            const isAchieved = !profile.milestoneProgress?.[id]?.achieved;
            const newProgressEntry = isAchieved
              ? { achieved: true, achievedDate: new Date().toISOString().split('T')[0] }
              : { achieved: false, achievedDate: undefined };

            return {
              ...profile,
              milestoneProgress: {
                ...profile.milestoneProgress,
                [id]: newProgressEntry,
              },
            };
          }
          return profile;
        }),
      );
      const isAchieved = !currentChildMilestoneProgress[id]?.achieved;
      logMilestoneToggle(id, isAchieved);
    }
  };

  const toggleVaccineDose = async (vaccineId: string, doseNumber: number, customDate?: string) => {
    if (!currentChild) return;

    if (user) {
      try {
        const currentVaccine = currentChildVaccineProgress[vaccineId] || { doses: {} };
        const currentDose = currentVaccine.doses[doseNumber];
        const isAdministered = !currentDose?.administered;
        await firebaseChildren.updateVaccineProgress(currentChild.id, vaccineId, doseNumber, isAdministered, customDate);
        logVaccineToggle(vaccineId, doseNumber, isAdministered);
      } catch (error) {
        console.error('更新疫苗記錄失敗:', error);
      }
    } else {
      setLocalChildProfiles((prevProfiles) =>
        prevProfiles.map((profile) => {
          if (profile.id === currentChild.id) {
            // Compute isAdministered from the latest profile to avoid a race condition.
            const profileVaccine = profile.vaccineProgress?.[vaccineId] || { doses: {} };
            const profileDose = profileVaccine.doses[doseNumber];
            const isAdministered = !profileDose?.administered;

            const newDoseEntry = isAdministered
              ? { administered: true, administeredDate: customDate || new Date().toISOString().split('T')[0] }
              : { administered: false, administeredDate: undefined };

            return {
              ...profile,
              vaccineProgress: {
                ...profile.vaccineProgress,
                [vaccineId]: {
                  doses: {
                    ...profileVaccine.doses,
                    [doseNumber]: newDoseEntry,
                  },
                },
              },
            };
          }
          return profile;
        }),
      );
      const currentVaccine = currentChildVaccineProgress[vaccineId] || { doses: {} };
      const currentDose = currentVaccine.doses[doseNumber];
      const isAdministered = !currentDose?.administered;
      logVaccineToggle(vaccineId, doseNumber, isAdministered);
    }
  };

  const addChild = async (name: string, birthday: string, gender?: Gender) => {
    if (childProfiles.length >= MAX_FREE_CHILDREN) {
      alert('免費版最多只能新增 2 個寶寶，請升級付費會員');
      return;
    }

    if (user) {
      try {
        await firebaseChildren.addChild(name, birthday, childProfiles.length, gender);
        logChildProfileAction('create');
      } catch (error) {
        console.error('新增寶寶失敗:', error);
        alert(errorMessage(error, '新增寶寶失敗，請稍後再試'));
      }
    } else {
      const newChild: ChildProfile = {
        id: Date.now().toString(),
        name,
        birthday,
        gender,
        milestoneProgress: {},
        vaccineProgress: {},
        createdAt: new Date().toISOString(),
        createdBy: 'local',
      };
      setLocalChildProfiles((prev) => [...prev, newChild]);
      setLocalCurrentChildId(newChild.id);
      logChildProfileAction('create');
    }
  };

  const joinChild = async (childUuid: string) => {
    if (childProfiles.length >= MAX_FREE_CHILDREN) {
      alert('免費版最多只能新增 2 個寶寶，請升級付費會員');
      return;
    }

    if (user) {
      try {
        await firebaseChildren.joinChild(childUuid, childProfiles.length);
        logChildProfileAction('create'); // Creating a reference to an existing child.
      } catch (error) {
        console.error('加入寶寶失敗:', error);
        alert(errorMessage(error, '加入寶寶失敗，請確認代碼是否正確'));
      }
    } else {
      alert('請先登入才能加入家人的寶寶資料');
    }
  };

  const updateChild = async (id: string, name: string, birthday: string, gender?: Gender) => {
    if (user) {
      try {
        await firebaseChildren.updateChild(id, name, birthday, gender);
        logChildProfileAction('update');
      } catch (error) {
        console.error('更新寶寶資料失敗:', error);
        alert(errorMessage(error, '更新失敗，請稍後再試'));
      }
    } else {
      setLocalChildProfiles((prev) =>
        prev.map((child) => (child.id === id ? { ...child, name, birthday, gender } : child)),
      );
      logChildProfileAction('update');
    }
  };

  const deleteChild = async (id: string) => {
    if (user) {
      try {
        await firebaseChildren.deleteChild(id);
        logChildProfileAction('delete');
      } catch (error) {
        console.error('刪除寶寶失敗:', error);
        alert(errorMessage(error, '刪除失敗，請稍後再試'));
      }
    } else {
      setLocalChildProfiles((prev) => prev.filter((child) => child.id !== id));
      if (localCurrentChildId === id) {
        setLocalCurrentChildId(localChildProfiles[0]?.id || null);
      }
      logChildProfileAction('delete');
    }
  };

  const setCurrentChild = async (id: string) => {
    if (user) {
      try {
        await firebaseChildren.setCurrentChild(id);
        logChildProfileAction('switch');
      } catch (error) {
        console.error('切換寶寶失敗:', error);
      }
    } else {
      setLocalCurrentChildId(id);
      logChildProfileAction('switch');
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
