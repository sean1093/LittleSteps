import { useEffect, useRef, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import type { User } from 'firebase/auth';
import { database } from '../../lib/firebase';

export interface FirebaseCollectionOptions<T> {
  /** Realtime Database path, e.g. `childRecords/${childId}/dailyLogs`. */
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
): { data: T; loading: boolean; error: boolean } {
  const [data, setData] = useState<T>(options.empty);
  // 哪一個孩子的第一份回應（快照或錯誤）已經到了。loading 由它推導而不是
  // 另存一個布林：布林要等 effect 才會改，於是 childId 從 null 變成某個孩子
  // 的那一次 render 會同時看到「不在載入」與空的 data——呼叫端分不出那是
  // 「還沒讀到」還是「真的沒有紀錄」。App 只在會讀紀錄的服務裡才傳 childId，
  // 所以這個轉換每次走進服務都會發生。
  const [settledFor, setSettledFor] = useState<string | null>(null);
  const [error, setError] = useState(false);

  // Options are derived from childId each render; read the latest via a ref so
  // the effect only re-subscribes on childId/user changes.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const { firebasePath, empty, fromFirebase, errorLabel } = optionsRef.current;

    if (!childId || !user) {
      setData(empty);
      setError(false);
      setSettledFor(null);
      return;
    }

    // 換孩子時必須連 data 一起清掉。只設 loading 的話，新孩子的快照抵達之前
    // 畫面還掛著上一個孩子的餵奶、尿布與睡眠——標題已經是新孩子的名字了。
    setData(empty);
    setError(false);
    setSettledFor(null);
    const dataRef = ref(database, firebasePath);
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        setData(fromFirebase(snapshot.val()));
        setSettledFor(childId);
      },
      (err) => {
        // 讀取被拒或斷線不是「今天還沒有記錄」。data 維持上一個成功的值，
        // 由 error 讓頁面說得出實話。
        console.error(errorLabel || `Error fetching ${firebasePath}:`, err);
        setError(true);
        setSettledFor(childId);
      },
    );
    return () => unsubscribe();
  }, [childId, user]);

  const loading = childId !== null && user !== null && settledFor !== childId;

  return { data, loading, error };
}
