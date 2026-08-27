import { useMemo } from 'react';
import type { User } from 'firebase/auth';
import { FoodTrackingProgress } from '../../types';
import { useFirebaseCollection } from '../../common/hooks/useFirebaseCollection';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

/**
 * Realtime listener + derived views for a child's complementary-food tracking
 * (Firebase). Writes go through useFirebaseChildren in the calling component.
 */
export function useFoodTracking(childId: string | null, user: User | null) {
  const { data: foodProgress, loading } = useFirebaseCollection<FoodTrackingProgress>(childId, user, {
    firebasePath: `children/${childId}/foodTrackingProgress`,
    empty: {},
    fromFirebase: (data) => (data ? (data as FoodTrackingProgress) : {}),
    errorLabel: 'Error fetching food tracking data:',
  });

  // Sort by first-tried date, newest first.
  const foodTrials = useMemo(
    () =>
      Object.values(foodProgress).sort(
        (a, b) => new Date(b.firstTriedDate).getTime() - new Date(a.firstTriedDate).getTime(),
      ),
    [foodProgress],
  );

  const stats = useMemo(() => {
    const total = foodTrials.length;
    const withAllergy = foodTrials.filter((f) => f.hasAllergy).length;
    const loved = foodTrials.filter((f) => f.preference === 'love' || f.preference === 'like').length;
    const disliked = foodTrials.filter((f) => f.preference === 'dislike' || f.preference === 'refuse').length;

    return { total, withAllergy, loved, disliked, noAllergy: total - withAllergy };
  }, [foodTrials]);

  /** Whether a food can be tried again (>= 3 days since its last trial). */
  const canTryNewFood = (foodId: string): boolean => {
    const food = foodProgress[foodId];
    if (!food) return true;
    const trialDates = food.trialDates || [];
    if (trialDates.length === 0) return true;
    const lastTrial = new Date(trialDates[trialDates.length - 1]);
    const daysDiff = Math.floor((Date.now() - lastTrial.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 3;
  };

  /** Next eligible trial date (last trial + 3 days) as YYYY-MM-DD, or null. */
  const getNextTrialDate = (foodId: string): string | null => {
    const food = foodProgress[foodId];
    if (!food) return null;
    const trialDates = food.trialDates || [];
    if (trialDates.length === 0) return null;
    const nextTrial = new Date(trialDates[trialDates.length - 1]);
    nextTrial.setDate(nextTrial.getDate() + 3);
    return toLocalDateKey(nextTrial);
  };

  return { foodProgress, foodTrials, loading, stats, canTryNewFood, getNextTrialDate };
}
