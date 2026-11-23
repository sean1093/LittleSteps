import { useState } from 'react';
import type { User } from 'firebase/auth';
import { DailyLog } from '../../types';
import { useFirebaseCollection } from '../../common/hooks/useFirebaseCollection';
import { logWindowStart } from '../logWindow';

/**
 * Realtime listener for a child's daily logs (Firebase). Writes go through
 * useFirebaseChildren in the calling component.
 *
 * It covers a window, not the whole log: rows from `since` onward, which
 * defaults to the last `LOG_WINDOW_DAYS` days. `logWindow.ts` has the
 * reasoning. A caller that shows an older day passes an earlier `since`.
 */
export function useDailyLogs(childId: string | null, user: User | null, since?: string) {
  // Fixed for the life of the hook: recomputing it on every render would
  // re-subscribe at midnight for no reason anyone could see.
  const [defaultSince] = useState(() => logWindowStart());

  const { data: logs, loading, error } = useFirebaseCollection<DailyLog[]>(childId, user, {
    firebasePath: `childRecords/${childId}/dailyLogs`,
    empty: [],
    fromFirebase: (data) => (data ? (Object.values(data) as DailyLog[]) : []),
    errorLabel: 'Error fetching daily logs:',
    window: { orderBy: 'timestamp', startAt: since ?? defaultSince },
  });

  return { logs, loading, error };
}
