import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider, logAuthEvent } from '../lib/firebase';
import { migrateLocalStorageToFirebase } from '../utils/migration';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 檢測是否在 WebView 環境中（LINE, Facebook, Instagram 等內建瀏覽器）
 * 這些環境不支援 Google OAuth popup，需要使用 redirect 方式
 */
function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || navigator.vendor;

  // 檢測常見的 WebView User-Agent
  const webViewPatterns = [
    /Line\//i,           // LINE
    /FBAN|FBAV/i,        // Facebook
    /Instagram/i,        // Instagram
    /Twitter/i,          // Twitter
    /Messenger/i,        // Facebook Messenger
    /MicroMessenger/i,   // WeChat
    /WebView/i,          // Generic WebView
    /wv\)/i,             // Android WebView indicator
  ];

  return webViewPatterns.some(pattern => pattern.test(ua));
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 處理 redirect 登入返回的結果
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          logAuthEvent('login');
          // 遷移會在 onAuthStateChanged 中處理
        }
      } catch (error: any) {
        console.error('Redirect 登入失敗:', error);
        if (error?.code !== 'auth/popup-closed-by-user') {
          logAuthEvent('login_failed');
          alert('登入失敗，請稍後再試');
        }
      }
    };

    handleRedirectResult();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // 檢查是否需要遷移
        const migrated = localStorage.getItem('migrated-to-firebase');
        if (!migrated) {
          try {
            await migrateLocalStorageToFirebase(user);
          } catch (error) {
            console.error('資料遷移失敗:', error);
          }
        }
      }

      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      // 檢測是否在 WebView 中
      if (isInAppBrowser()) {
        // 在 WebView 中使用 redirect 方式
        // redirect 的結果會在 getRedirectResult 中處理
        await signInWithRedirect(auth, googleProvider);
      } else {
        // 一般瀏覽器使用 popup 方式（更好的用戶體驗）
        await signInWithPopup(auth, googleProvider);
        logAuthEvent('login');
      }
    } catch (error: any) {
      console.error('登入失敗:', error);
      // 忽略用戶取消登入的錯誤
      if (error?.code !== 'auth/popup-closed-by-user') {
        logAuthEvent('login_failed');
        alert('登入失敗，請稍後再試');
      }
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      logAuthEvent('logout');
    } catch (error) {
      console.error('登出失敗:', error);
      alert('登出失敗，請稍後再試');
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
