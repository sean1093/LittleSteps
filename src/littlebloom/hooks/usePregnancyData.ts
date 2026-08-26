import type { User } from 'firebase/auth';
import { PregnancyData } from '../../types';
import { useDualModeCollection } from '../../common/hooks/useDualModeCollection';

/**
 * Hook for reading pregnancy data (Firebase for authenticated users,
 * LocalStorage for guests). Read-only for now — no write path exists yet.
 */
export function usePregnancyData(childId: string | null, user: User | null) {
  const { data: pregnancyData, loading } = useDualModeCollection<PregnancyData | null>(
    childId,
    user,
    {
      firebasePath: `children/${childId}/pregnancyData`,
      storageKey: `pregnancy-${childId}`,
      empty: null,
      fromFirebase: (data) => (data as PregnancyData) || null,
      errorLabel: 'Error fetching pregnancy data:',
    },
  );

  return { pregnancyData, loading };
}
