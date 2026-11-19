import {
  Suspense,
  createContext,
  lazy,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../../contexts/AuthContext';
// 只 import 型別：值的 import 會把 hook 連同資料庫 SDK 一起拉進進入點。
import type { ChildStore } from '../hooks/useChildStore';
import QuietBoundary from '../components/QuietBoundary';
import { LOADING_CHILD_STORE, SIGNED_OUT_CHILD_STORE } from './signedOutChildStore';

const ChildStoreBridge = lazy(() => import('./ChildStoreBridge'));

/**
 * 孩子資料與帳號一樣是「全站脈絡」，不是某一個服務的內部狀態。
 *
 * 原本只有 App.tsx 呼叫 useChildStore，再把十來個成員逐一往下傳。結果是
 * 只有拿得到那些 prop 的畫面（LittleSteps 的側邊欄）才能切換孩子或登出，
 * 其餘四個服務完全碰不到——不是刻意的設計，是 prop 傳不到那麼遠。
 *
 * 改成 context 之後，帳號與孩子的 UI 可以放進任何一個 shell 的 AppBar，
 * 不必為此在五個 shell 上各開十個 prop。
 */
const ChildStoreContext = createContext<ChildStore | null>(null);

/**
 * 真正的 store 在 ChildStoreBridge 裡，登入之後才 lazy 載入：useChildStore 會
 * import 資料層的 hook，而那些 hook 會 import 資料庫 SDK。直接在這裡呼叫它，
 * 等於每一個沒登入、只是來查百科的人都要先把資料庫 SDK 載下來。
 *
 * 所以這裡只決定「現在該給哪一份」：
 * - 沒登入：一份寫死的空 store，不需要任何資料層的程式碼。
 * - 登入了、bridge 還沒回報：同一份空 store，但 childrenLoading 是 true，
 *   App 會停在載入條，而不是對一位有兩個孩子的家長說「還沒有寶寶」。
 * - bridge 回報了：它給的那一份。
 *
 * bridge 是 children 的兄弟而不是外層：包在外面的話，store 到的那一刻整棵
 * app 會被重新掛載一次——每一頁的 effect 重跑、page_view 多送一筆。
 */
export function ChildStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [reported, setReported] = useState<{ uid: string; store: ChildStore } | null>(null);

  const onStore = useCallback((uid: string, store: ChildStore | null) => {
    setReported((current) => {
      if (store !== null) return { uid, store };
      // 離開的 bridge 只收回自己那一份；換帳號時新的 bridge 可能已經先回報了。
      return current?.uid === uid ? null : current;
    });
  }, []);

  // 比對 uid：登出再登入另一個帳號時，上一個帳號的 store 一個 render 都不能給。
  const store = !user
    ? SIGNED_OUT_CHILD_STORE
    : reported?.uid === user.uid
      ? reported.store
      : LOADING_CHILD_STORE;

  return (
    <>
      <ChildStoreContext.Provider value={store}>{children}</ChildStoreContext.Provider>
      {user && (
        // bridge 的 chunk 載不進來時不能讓整個 app 換成錯誤畫面：這一層在每一頁
        // 的外面，公開頁也算。接住之後 store 就停在「載入中」，App 既有的
        // 「連不上伺服器／重新載入」會在它平常的等待之後接手。
        <QuietBoundary key={user.uid} scope="child store">
          <Suspense fallback={null}>
            <ChildStoreBridge user={user} onStore={onStore} />
          </Suspense>
        </QuietBoundary>
      )}
    </>
  );
}

/**
 * 直接給一份 store，不經過登入狀態與 lazy 的 bridge。
 *
 * 給測試用：頁面與元件的測試要的是「這棵樹底下有一份 store」，不是上面那套
 * 載入機制，而它們多半拿一個每次 render 都回傳新物件的假 hook 來提供——
 * bridge 以物件識別判斷「資料有沒有變」，餵那種假 hook 只會無限重畫。載入
 * 機制自己的行為由 ChildStoreContext.test.tsx 驗。
 */
export function ChildStoreValueProvider({
  store,
  children,
}: {
  store: ChildStore;
  children: ReactNode;
}) {
  return <ChildStoreContext.Provider value={store}>{children}</ChildStoreContext.Provider>;
}

/**
 * App 內部用這個：拿不到 provider 就是接線錯了，應該大聲壞掉。
 */
export function useChildStoreContext(): ChildStore {
  const store = useContext(ChildStoreContext);
  if (!store) {
    throw new Error('useChildStoreContext 必須在 ChildStoreProvider 之內使用');
  }
  return store;
}

/**
 * 帳號視窗用這個。
 *
 * AccountButton 掛在每個服務的 AppBar 上，而那些 shell 會被單元測試單獨
 * 掛載——那時沒有 provider，也不需要有：那些測試驗的是頁面內容，不是切換
 * 寶寶。拿不到 store 就只顯示帳號區塊，而不是讓整個 shell 炸掉。
 *
 * 真正接線錯誤仍然會被上面那個嚴格版本在 App 啟動時抓到。
 */
export function useOptionalChildStore(): ChildStore | null {
  return useContext(ChildStoreContext);
}
