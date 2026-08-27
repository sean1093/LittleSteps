import type { User } from 'firebase/auth';
import { DiaryEntry } from '../../types';
import { useFirebaseCollection } from '../../common/hooks/useFirebaseCollection';

/**
 * Realtime listener for a child's growth-diary entries (Firebase). Writes go
 * through useChildStore.
 *
 * Diary is the one LittleExplorer collection with its own listener: entries
 * accumulate without bound, so folding them into ChildProfile would drag every
 * entry through every child-profile update.
 */
export function useDiary(childId: string | null, user: User | null) {
  const { data: entries, loading } = useFirebaseCollection<DiaryEntry[]>(childId, user, {
    firebasePath: `children/${childId}/diaryEntries`,
    empty: [],
    fromFirebase: (data) => (data ? (Object.values(data) as DiaryEntry[]) : []),
    errorLabel: 'Error fetching diary entries:',
  });

  return { entries, loading };
}
