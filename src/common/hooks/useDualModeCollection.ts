import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { ref, onValue } from 'firebase/database';
import type { User } from 'firebase/auth';
import { database } from '../../lib/firebase';

export interface DualModeCollectionOptions<T> {
  /** Realtime Database path for the authenticated branch, e.g. `children/${childId}/dailyLogs`. */
  firebasePath: string;
  /** LocalStorage key for the guest branch, e.g. `daily-logs-${childId}`. */
  storageKey: string;
  /** Value used when there is no data (no child, empty node, or parse failure). */
  empty: T;
  /** Transform a raw Realtime Database snapshot value into the collection shape. */
  fromFirebase: (data: unknown) => T;
  /** Label used in console error messages. */
  errorLabel?: string;
}

export interface DualModeCollection<T> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
  loading: boolean;
}

/**
 * Shared read/listen half of the Firebase-vs-LocalStorage dual mode used by the
 * child-scoped data hooks (daily logs, food tracking, pregnancy data). It owns
 * the collection state and keeps it in sync: authenticated users get a realtime
 * Firebase listener, guests read from LocalStorage. Writes stay in each hook,
 * which mutates the backend and then updates state through the returned setter.
 */
export function useDualModeCollection<T>(
  childId: string | null,
  user: User | null,
  options: DualModeCollectionOptions<T>,
): DualModeCollection<T> {
  const [data, setData] = useState<T>(options.empty);
  const [loading, setLoading] = useState(true);

  // Options are derived from `childId` on every render; read the latest via a
  // ref so the effect only re-subscribes on childId/user changes, never on the
  // fresh options object identity.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const { firebasePath, storageKey, empty, fromFirebase, errorLabel } = optionsRef.current;

    if (!childId) {
      setData(empty);
      setLoading(false);
      return;
    }

    if (user) {
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
    }

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setData(JSON.parse(stored) as T);
      } catch (error) {
        console.error(errorLabel || `Error parsing ${storageKey}:`, error);
        setData(empty);
      }
    } else {
      setData(empty);
    }
    setLoading(false);
  }, [childId, user]);

  return { data, setData, loading };
}
