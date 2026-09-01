import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Realtime Database
export const database = getDatabase(app, import.meta.env.VITE_FIREBASE_DATABASE_URL);

/**
 * Analytics 動態載入，而不是靜態 import。
 *
 * firebase/analytics 只為了記事件，對畫面沒有任何貢獻，靜態 import 卻會把它
 * 綁進進入點的 chunk——等於每個家長都得先下載一份追蹤程式碼、等它向 Google
 * 發出第一個請求，才看得到 app。第一次真的要記事件時再載就夠了。
 *
 * isSupported() 是必要的：在無痕模式與部分 in-app 瀏覽器裡 getAnalytics()
 * 會直接丟例外，而記不到事件不該讓呼叫點壞掉。
 */
type SendEvent = (eventName: string, eventParams?: Record<string, unknown>) => void;

let analyticsReady: Promise<SendEvent | null> | null = null;

const loadAnalytics = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  analyticsReady ??= import('firebase/analytics')
    .then(async ({ getAnalytics, isSupported, logEvent: send }) => {
      if (!(await isSupported())) return null;
      const instance = getAnalytics(app);
      return (eventName: string, eventParams?: Record<string, unknown>) =>
        send(instance, eventName, eventParams);
    })
    .catch(() => null);
  return analyticsReady;
};

// 記事件一律是「送出去就算了」：失敗不影響任何畫面，也不該讓呼叫點等它。
export const logEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
  void loadAnalytics().then((send) => send?.(eventName, eventParams));
};

// Pre-defined event helpers
export const logPageView = (pageName: string) => {
  // Determine app category and page details
  const getPageMetadata = (page: string) => {
    // Determine which app
    let app = 'main';
    let section = 'home';
    let feature = page;

    if (page === 'home') {
      app = 'main';
      section = 'landing';
      feature = 'main-entry';
    } else if (page.startsWith('littlebloom')) {
      // startsWith, not ===: an equality check dropped littlebloom/wiki into
      // the generic 'main' bucket, so its page views were never attributed.
      app = 'littlebloom';
      section = 'wip';
      feature = 'pregnancy-companion';
    } else if (page.startsWith('littleexplorer')) {
      app = 'littleexplorer';
      section = 'toddler';
      feature = page.split('/')[1] || 'development';
    } else if (page.startsWith('littlesteps')) {
      app = 'littlesteps';
      const parts = page.split('/');
      feature = parts[1] || 'home';

      // Categorize by section
      if (feature === 'dashboard' || feature === 'daily-log' || feature === 'growth-charts' || feature === 'sleep-analysis') {
        section = 'data-tracking';
      } else if (feature === 'milestones' || feature === 'vaccine-tracking') {
        section = 'development';
      } else if (feature === 'complementary-food' || feature === 'sleep-training') {
        section = 'nutrition-sleep';
      } else if (feature === 'care-guide') {
        section = 'education';
      } else {
        section = 'landing';
      }
    }

    return { app, section, feature };
  };

  const metadata = getPageMetadata(pageName);

  logEvent('page_view', {
    page_name: pageName,
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
    // Custom dimensions for better segmentation
    app_name: metadata.app,           // main | littlesteps | littlebloom | littleexplorer
    app_section: metadata.section,    // landing | data-tracking | development | etc.
    app_feature: metadata.feature,    // specific feature name
  });
};

export const logMilestoneToggle = (milestoneId: string, achieved: boolean) => {
  logEvent('milestone_toggle', {
    milestone_id: milestoneId,
    achieved: achieved
  });
};

export const logVaccineToggle = (vaccineId: string, doseNumber: number, administered: boolean) => {
  logEvent('vaccine_toggle', {
    vaccine_id: vaccineId,
    dose_number: doseNumber,
    administered: administered
  });
};

export const logChildProfileAction = (action: 'create' | 'update' | 'delete' | 'switch') => {
  logEvent('child_profile_action', { action });
};

export const logAuthEvent = (action: 'login' | 'logout' | 'login_failed') => {
  logEvent('auth_action', { action });
};

