import { useEffect, useRef, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import type { User } from 'firebase/auth';
import { database } from '../../lib/firebase';

export interface FirebaseCollectionOptions<T> {
  /** Realtime Database path, e.g. `children/${childId}/dailyLogs`. */
  firebasePath: string;
  /** Value used when there is no child, no data, or no authenticated user. */
  empty: T;
  /** Transform a raw Realtime Database snapshot value into the collection shape. */
  fromFirebase: (data: unknown) => T;
  /** Label used in console error messages. */
  errorLabel?: string;
}

/**
 * Read-only realtime listener for a child-scoped Firebase collection. Login is
 * mandatory, so there is no LocalStorage fallback: without a user or childId it
 * yields the empty value. Writes go through useFirebaseChildren directly.
 */
export function useFirebaseCollection<T>(
  childId: string | null,
  user: User | null,
  options: FirebaseCollectionOptions<T>,
): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(options.empty);
  const [loading, setLoading] = useState(true);

  // Options are derived from childId each render; read the latest via a ref so
  // the effect only re-subscribes on childId/user changes.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const { firebasePath, empty, fromFirebase, errorLabel } = optionsRef.current;

    if (!childId || !user) {
      setData(empty);
      setLoading(false);
      return;
    }

    setLoading(true);
    const dataRef = ref(database, firebasePath);
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        setData(fromFirebase(snapshot.val()));
        setLoading(false);
      },
      (error) => {
        console.error(errorLabel || `Error fetching ${firebasePath}:`, error);
        setData(empty);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [childId, user]);

  return { data, loading };
}
