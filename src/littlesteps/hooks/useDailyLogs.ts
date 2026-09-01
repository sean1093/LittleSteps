import type { User } from 'firebase/auth';
import { DailyLog } from '../../types';
import { useFirebaseCollection } from '../../common/hooks/useFirebaseCollection';

/**
 * Realtime listener for a child's daily logs (Firebase). Writes go through
 * useFirebaseChildren in the calling component.
 */
export function useDailyLogs(childId: string | null, user: User | null) {
  const { data: logs, loading, error } = useFirebaseCollection<DailyLog[]>(childId, user, {
    firebasePath: `children/${childId}/dailyLogs`,
    empty: [],
    fromFirebase: (data) => (data ? (Object.values(data) as DailyLog[]) : []),
    errorLabel: 'Error fetching daily logs:',
  });

  return { logs, loading, error };
}
