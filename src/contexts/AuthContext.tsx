import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  getRedirectResult,
  reauthenticateWithPopup,
  deleteUser,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider, logAuthEvent } from '../lib/firebase';
import { useToast } from '../common/ui/toast';
import { goTo } from '../common/navigate';
import { inAppBrowser, type InAppBrowser } from '../common/inAppBrowser';
import InAppBrowserSheet from '../common/components/InAppBrowserSheet';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /**
   * 刪掉 Firebase Auth 使用者本身，並回報有沒有真的刪掉。資料端要先刪乾淨
   * （見 useChildStore 的 deleteAccountData），這一步一走，這個客戶端就沒有
   * 身分再回頭清資料了。回 false 時帳號還在，呼叫端該把入口留著讓家長再試。
   */
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/** Firebase 的錯誤是 Error 的子類，多帶一個 code 字串。 */
function authErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) return undefined;
  return typeof error.code === 'string' ? error.code : undefined;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // 在內建瀏覽器裡按登入時，改開這張說明而不是去 Google。
  const [blockedBrowser, setBlockedBrowser] = useState<InAppBrowser | null>(null);

  useEffect(() => {
    // 處理 redirect 登入返回的結果
    const handleRedirectResult = async () => {
      try {
        // 登入已經不走 redirect 了，這裡接的是舊版本開始、還沒回來的那一次。
        const result = await getRedirectResult(auth);
        if (result?.user) {
          logAuthEvent('login');
          // 遷移會在 onAuthStateChanged 中處理
        }
      } catch (error: unknown) {
        console.error('Redirect 登入失敗:', error);
        if (authErrorCode(error) !== 'auth/popup-closed-by-user') {
          logAuthEvent('login_failed');
          toast.show('登入失敗，請稍後再試');
        }
      }
    };

    handleRedirectResult();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // 「按下登入」和「登入成功」分開記：入口頁把免登入的工具排到登入按鈕正下方，
    // 這個改動會不會讓人少登入，只看成功數看不出來——少掉的可能是沒按，也可能
    // 是按了卻沒完成。
    logAuthEvent('login_start');

    // LINE、Facebook、Instagram 的內建瀏覽器：Google 在自己的頁面上就拒絕
    // （disallowed_useragent），我們連錯誤都收不到，家長只看到一頁 Google 的
    // 錯誤然後離開。所以根本不開始 OAuth，先請家長換到真的瀏覽器。
    const browser = inAppBrowser();
    if (browser) {
      setBlockedBrowser(browser);
      return;
    }

    try {
      await signInWithPopup(auth, googleProvider);
      logAuthEvent('login');
    } catch (error: unknown) {
      console.error('登入失敗:', error);
      // 忽略用戶取消登入的錯誤
      if (authErrorCode(error) !== 'auth/popup-closed-by-user') {
        logAuthEvent('login_failed');
        toast.show('登入失敗，請稍後再試');
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      logAuthEvent('logout');
    } catch (error) {
      console.error('登出失敗:', error);
      toast.show('登出失敗，請稍後再試');
    }
  };

  /**
   * 帳號刪除的 Auth 那一半。
   *
   * deleteUser 只接受「最近登入過」的使用者，隔一段時間就回
   * auth/requires-recent-login。那不是可以吞掉的錯誤：資料端已經刪完了，靜靜
   * 失敗會留下一個登得進來、卻什麼都沒有的帳號。一般瀏覽器用 popup 重新驗證，
   * 成功後立刻再刪一次。WebView（LINE、FB）沒有 popup 只有 redirect，而
   * redirect 會把整個頁面換掉、回來時這個流程已經不存在——所以那裡改成登出並
   * 請家長重新登入後再按一次，那正是取得「最近登入」的方式。
   */
  const deleteAccount = async (): Promise<boolean> => {
    const current = auth.currentUser;
    if (!current) return false;

    // 刪完、或決定改請家長重新登入，兩條路都要回到未登入的入口頁：留在需要
    // 登入的頁面上，畫面會換成某個服務的介紹頁，看起來像被丟進了那個服務。
    const leave = async () => {
      // 登出失敗不改變結果：使用者已經刪掉的話這只是收尾，走重新登入那條路時
      // 它是第一步。兩種情況都不該擋住換頁，否則家長會留在一個需要登入的頁面上。
      await firebaseSignOut(auth).catch((error) => {
        console.error('刪除帳號後登出失敗:', error);
      });
      goTo('home');
    };

    try {
      await deleteUser(current);
    } catch (error) {
      const needsRecentLogin = authErrorCode(error) === 'auth/requires-recent-login';
      if (!needsRecentLogin) {
        console.error('刪除帳號失敗:', error);
        toast.show('帳號還沒刪掉，請稍後再試');
        return false;
      }

      if (inAppBrowser()) {
        toast.show('為了安全，請重新登入一次，再按一次刪除帳號');
        await leave();
        return false;
      }

      try {
        await reauthenticateWithPopup(current, googleProvider);
        await deleteUser(current);
      } catch (reauthError) {
        console.error('重新驗證後刪除帳號失敗:', reauthError);
        toast.show('帳號還沒刪掉，請重新登入後再試一次');
        return false;
      }
    }

    await leave();
    return true;
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <InAppBrowserSheet browser={blockedBrowser} onClose={() => setBlockedBrowser(null)} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * 只想知道「現在有沒有人登入」的地方用這個。
 *
 * AccountButton 掛在每個服務的 AppBar 上，而那些 shell 會被單元測試單獨
 * 掛載，那時沒有 AuthProvider。頭像只是裝飾，缺了就畫預設圖示，不該讓
 * 整個 shell 掛掉。真正需要登入動作的 AccountSheet 仍然用嚴格版。
 */
export function useOptionalAuth() {
  return useContext(AuthContext);
}
