import { useEffect, useMemo, useState } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { database } from '../../lib/firebase';
import { ChildProfile } from '../../types';
import { User } from 'firebase/auth';

/**
 * 訂閱這個帳號的孩子清單。
 *
 * 兩個 effect 而不是巢狀的 onValue：孩子的 listener 原本開在 users/{uid} 的
 * callback 裡，並在該 callback 內 return 一個清理函式——但 onValue 不看
 * callback 的回傳值，那個清理從來沒被呼叫過。users/{uid} 每變動一次（換孩子、
 * 新增、刪除都會寫它）就再疊一整組孩子 listener，舊的那組還活著，而且各自
 * 握著自己那份過期的名單。
 *
 * 不只是洩漏：舊 closure 被觸發時會拿它的舊名單去 setChildren，於是剛新增的
 * 孩子可能從畫面上消失、剛刪掉的又冒回來，而且發生與否取決於 Firebase 回呼
 * 的順序——正是那種在自己機器上重現不了的 bug。
 *
 * 拆成「聽帳號」與「聽名單裡的每個孩子」兩層之後，第二層的清理交給 React，
 * 名單一變就確實退訂舊的。每個孩子各自更新自己那一格，不再需要 loadedCount
 * 這種計數器。
 */
export function useUserChildren(user: User | null) {
  const [childIds, setChildIds] = useState<string[]>([]);
  const [currentChildId, setCurrentChildId] = useState<string | null>(null);
  const [childrenById, setChildrenById] = useState<Record<string, ChildProfile>>({});
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const [userLoaded, setUserLoaded] = useState(false);

  // 這個帳號有哪些孩子、現在選了誰。
  useEffect(() => {
    if (!user) {
      setChildIds([]);
      setCurrentChildId(null);
      setChildrenById({});
      setReportedIds([]);
      setUserLoaded(true);
      return;
    }

    setUserLoaded(false);
    return onValue(ref(database, `users/${user.uid}`), (snapshot) => {
      const userData = snapshot.val();
      setCurrentChildId(userData?.currentChildId ?? null);
      setChildIds(userData?.childrenIds ? Object.keys(userData.childrenIds) : []);
      setUserLoaded(true);
    });
  }, [user]);

  // 名單裡每個孩子各一個 listener。key 用字串是為了讓 effect 只在名單真的
  // 變了才重跑，而不是每次 render 都因為新陣列而重訂閱。
  const childIdsKey = childIds.join(',');

  useEffect(() => {
    if (!user || childIds.length === 0) {
      setChildrenById({});
      setReportedIds([]);
      return;
    }

    setReportedIds([]);

    const unsubscribes = childIds.map((childId) =>
      onValue(ref(database, `children/${childId}`), (childSnapshot) => {
        if (childSnapshot.exists()) {
          setChildrenById((prev) => ({ ...prev, [childId]: childSnapshot.val() as ChildProfile }));
        } else {
          // 這個孩子不在了（例如建立者刪掉了共享的孩子）。安全規則只允許每個
          // 使用者寫自己的 childrenIds，所以殘留的參照只能由這一端清掉。
          setChildrenById((prev) => {
            if (!(childId in prev)) return prev;
            const next = { ...prev };
            delete next[childId];
            return next;
          });
          remove(ref(database, `users/${user.uid}/childrenIds/${childId}`)).catch(() => {
            /* best-effort cleanup; ignore */
          });
        }

        setReportedIds((prev) => (prev.includes(childId) ? prev : [...prev, childId]));
      }),
    );

    return () => {
      for (const unsubscribe of unsubscribes) unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- childIdsKey 就是 childIds 的值語意
  }, [user, childIdsKey]);

  // 順序跟著 childrenIds，而不是回呼抵達的先後，否則切換器每次刷新都可能重排。
  const children = useMemo(
    () => childIds.map((id) => childrenById[id]).filter((child): child is ChildProfile => !!child),
    [childIds, childrenById],
  );

  // 每個 id 都回報過一次（存在或不存在）才算載入完成。用「回報過」而不是
  // 「拿到資料」，殘留的孤兒 id 才不會讓載入狀態卡住。
  const loading = !userLoaded || childIds.some((id) => !reportedIds.includes(id));

  return {
    children,
    currentChildId,
    loading,
  };
}
