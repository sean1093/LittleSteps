import type { User } from 'firebase/auth';
import { PregnancyData } from '../../types';
import { useFirebaseCollection } from '../../common/hooks/useFirebaseCollection';

/**
 * Realtime listener for a child's pregnancy data (Firebase). Read-only for now.
 */
export function usePregnancyData(childId: string | null, user: User | null) {
  const { data: pregnancyData, loading } = useFirebaseCollection<PregnancyData | null>(childId, user, {
    firebasePath: `children/${childId}/pregnancyData`,
    empty: null,
    fromFirebase: (data) => (data as PregnancyData) || null,
    errorLabel: 'Error fetching pregnancy data:',
  });

  return { pregnancyData, loading };
}
