import { useState, useEffect, useMemo } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import { FoodTrialRecord, FoodTrackingProgress } from '../types';
import { User } from 'firebase/auth';

/**
 * 管理副食品追蹤資料的 Hook
 * 支援 Firebase (已登入) 和 LocalStorage (未登入) 雙模式
 */
export function useFoodTracking(
  childId: string | null,
  user: User | null
) {
  const [foodProgress, setFoodProgress] = useState<FoodTrackingProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) {
      setFoodProgress({});
      setLoading(false);
      return;
    }

    if (user) {
      // Firebase 模式: 即時監聽
      setLoading(true);

      const foodRef = ref(database, `children/${childId}/foodTrackingProgress`);
      const unsubscribe = onValue(foodRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFoodProgress(data as FoodTrackingProgress);
        } else {
          setFoodProgress({});
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching food tracking data:', error);
        setFoodProgress({});
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // LocalStorage 模式
      const storageKey = `food-tracking-${childId}`;
      const storedProgress = localStorage.getItem(storageKey);

      if (storedProgress) {
        try {
          const parsedProgress = JSON.parse(storedProgress) as FoodTrackingProgress;
          setFoodProgress(parsedProgress);
        } catch (error) {
          console.error('Error parsing stored food tracking data:', error);
          setFoodProgress({});
        }
      } else {
        setFoodProgress({});
      }

      setLoading(false);
    }
  }, [childId, user]);

  /**
   * 將 FoodTrackingProgress 物件轉換為陣列，方便排序和顯示
   */
  const foodTrials = useMemo(() => {
    return Object.values(foodProgress).sort((a, b) => {
      // 按首次嘗試日期倒序排列（最新的在前）
      return new Date(b.firstTriedDate).getTime() - new Date(a.firstTriedDate).getTime();
    });
  }, [foodProgress]);

  /**
   * 新增食物嘗試記錄
   */
  const addFoodTrial = async (foodData: Omit<FoodTrialRecord, 'id' | 'createdAt'>): Promise<string> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    const foodId = `food_${Date.now()}`;
    const newFood: FoodTrialRecord = {
      ...foodData,
      id: foodId,
      createdAt: new Date().toISOString(),
    };

    if (user) {
      // Firebase 模式 - 由 useFirebaseChildren 處理
      throw new Error('Use firebaseChildren.addFoodTrial for Firebase mode');
    } else {
      // LocalStorage 模式
      const storageKey = `food-tracking-${childId}`;
      const updatedProgress = {
        ...foodProgress,
        [foodId]: newFood,
      };
      localStorage.setItem(storageKey, JSON.stringify(updatedProgress));
      setFoodProgress(updatedProgress);
    }

    return foodId;
  };

  /**
   * 更新食物嘗試記錄
   */
  const updateFoodTrial = async (foodId: string, updates: Partial<FoodTrialRecord>): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    if (user) {
      // Firebase 模式
      throw new Error('Use firebaseChildren.updateFoodTrial for Firebase mode');
    } else {
      // LocalStorage 模式
      const storageKey = `food-tracking-${childId}`;
      const existingFood = foodProgress[foodId];
      if (!existingFood) {
        throw new Error('Food trial not found');
      }

      const updatedFood: FoodTrialRecord = {
        ...existingFood,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const updatedProgress = {
        ...foodProgress,
        [foodId]: updatedFood,
      };

      localStorage.setItem(storageKey, JSON.stringify(updatedProgress));
      setFoodProgress(updatedProgress);
    }
  };

  /**
   * 刪除食物嘗試記錄
   */
  const deleteFoodTrial = async (foodId: string): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    if (user) {
      // Firebase 模式
      throw new Error('Use firebaseChildren.deleteFoodTrial for Firebase mode');
    } else {
      // LocalStorage 模式
      const storageKey = `food-tracking-${childId}`;
      const updatedProgress = { ...foodProgress };
      delete updatedProgress[foodId];
      localStorage.setItem(storageKey, JSON.stringify(updatedProgress));
      setFoodProgress(updatedProgress);
    }
  };

  /**
   * 新增嘗試日期（用於 4x3 法則追蹤）
   */
  const addTrialDate = async (foodId: string, date: string): Promise<void> => {
    if (!childId) {
      throw new Error('No child selected');
    }

    const existingFood = foodProgress[foodId];
    if (!existingFood) {
      throw new Error('Food trial not found');
    }

    // 避免重複日期
    const existingDates = existingFood.trialDates || [];
    if (existingDates.includes(date)) {
      return; // 已經記錄過這個日期
    }

    const updatedTrialDates = [...existingDates, date].sort(); // 按日期排序

    await updateFoodTrial(foodId, {
      trialDates: updatedTrialDates,
    });
  };

  /**
   * 檢查是否可以嘗試新食物（距離上次嘗試 >= 3 天）
   */
  const canTryNewFood = (foodId: string): boolean => {
    const food = foodProgress[foodId];
    if (!food) return true; // 食物不存在，可以新增

    const trialDates = food.trialDates || [];
    if (trialDates.length === 0) {
      return true; // 沒有嘗試記錄，可以嘗試
    }

    // 取得最後一次嘗試日期
    const lastTrialDate = trialDates[trialDates.length - 1];
    const lastTrial = new Date(lastTrialDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastTrial.getTime()) / (1000 * 60 * 60 * 24));

    return daysDiff >= 3; // 相隔 3 天以上可以嘗試
  };

  /**
   * 取得下次可嘗試日期
   */
  const getNextTrialDate = (foodId: string): string | null => {
    const food = foodProgress[foodId];
    if (!food) return null;

    const trialDates = food.trialDates || [];
    if (trialDates.length === 0) return null;

    const lastTrialDate = trialDates[trialDates.length - 1];
    const lastTrial = new Date(lastTrialDate);
    const nextTrial = new Date(lastTrial);
    nextTrial.setDate(nextTrial.getDate() + 3);

    return nextTrial.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  /**
   * 統計資料
   */
  const stats = useMemo(() => {
    const total = foodTrials.length;
    const withAllergy = foodTrials.filter(f => f.hasAllergy).length;
    const loved = foodTrials.filter(f => f.preference === 'love' || f.preference === 'like').length;
    const disliked = foodTrials.filter(f => f.preference === 'dislike' || f.preference === 'refuse').length;

    return {
      total,
      withAllergy,
      loved,
      disliked,
      noAllergy: total - withAllergy,
    };
  }, [foodTrials]);

  return {
    foodProgress,
    foodTrials,
    loading,
    stats,
    addFoodTrial,
    updateFoodTrial,
    deleteFoodTrial,
    addTrialDate,
    canTryNewFood,
    getNextTrialDate,
  };
}
