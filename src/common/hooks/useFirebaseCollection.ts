import { useEffect, useRef, useState } from 'react';
import { ref, onValue, orderByChild, query, startAt } from 'firebase/database';
import type { User } from 'firebase/auth';
import { database } from '../../lib/database';

export interface FirebaseCollectionOptions<T> {
  /** Realtime Database path, e.g. `childRecords/${childId}/dailyLogs`. */
  firebasePath: string;
  /** Value used when there is no child, no data, or no authenticated user. */
  empty: T;
  /** Transform a raw Realtime Database snapshot value into the collection shape. */
  fromFirebase: (data: unknown) => T;
  /** Label used in console error messages. */
  errorLabel?: string;
  /**
   * Listen to part of the collection: rows whose `orderBy` child is at or
   * after `startAt`. Left out, the listener covers the whole collection.
   * The path needs an `.indexOn` for `orderBy` in `database.rules.json`;
   * without one the server sends everything and the client filters.
   */
  window?: { orderBy: string; startAt: string };
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
  // error 也是同一個道理：存成布林的話，換孩子的那一次 render 還帶著上一個
  // 孩子的失敗，畫面會替一個還沒開始讀的孩子說「讀不到」。
  const [erroredFor, setErroredFor] = useState<string | null>(null);

  // Options are derived from childId each render; read the latest via a ref so
  // the effect only re-subscribes on childId/user changes.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // 「哪一份」不只是哪個孩子：視窗的起點變了，就是另一個查詢，上一份回應不能
  // 算在它頭上。少了這個，往回翻到視窗之前的那一天時，畫面會先拿較窄的那一份
  // 說「這天沒有記錄」，下一瞬間才換成載入中。
  const windowKey = options.window ? `${options.window.orderBy}>=${options.window.startAt}` : '';
  const listenKey = childId ? `${childId}|${windowKey}` : null;

  useEffect(() => {
    const { firebasePath, empty, fromFirebase, errorLabel, window: range } = optionsRef.current;

    if (!childId || !user) {
      setData(empty);
      setErroredFor(null);
      setSettledFor(null);
      return;
    }

    // 換孩子時必須連 data 一起清掉。只設 loading 的話，新孩子的快照抵達之前
    // 畫面還掛著上一個孩子的餵奶、尿布與睡眠——標題已經是新孩子的名字了。
    setData(empty);
    setErroredFor(null);
    setSettledFor(null);
    const dataRef = ref(database, firebasePath);
    const target = range
      ? query(dataRef, orderByChild(range.orderBy), startAt(range.startAt))
      : dataRef;
    const unsubscribe = onValue(
      target,
      (snapshot) => {
        setData(fromFirebase(snapshot.val()));
        setSettledFor(listenKey);
      },
      (err) => {
        // 讀取被拒不是「今天還沒有記錄」。（斷線不會走到這裡：RTDB 斷線時
        // 兩個 callback 都不呼叫，那是 useStalled 在處理的事。）data 維持上一個成功的值，
        // 由 error 讓頁面說得出實話。
        console.error(errorLabel || `Error fetching ${firebasePath}:`, err);
        setErroredFor(listenKey);
        setSettledFor(listenKey);
      },
    );
    return () => unsubscribe();
    // listenKey 已經包含 childId 與視窗；單獨列 childId 是給讀的人看的。
  }, [childId, user, listenKey]);

  // 與上面 effect 的 `!childId || !user` 同一個判準：不訂閱的時候就不是載入中。
  const active = Boolean(childId && user);
  const loading = active && settledFor !== listenKey;
  const error = active && erroredFor === listenKey;

  return { data, loading, error };
}
