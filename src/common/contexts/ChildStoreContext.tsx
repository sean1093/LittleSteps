import { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useChildStore, type ChildStore } from '../hooks/useChildStore';

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

export function ChildStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const store = useChildStore(user);

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
