import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
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

declare global {
  interface Window {
    /** App Check SDK 讀的全域旗標；它自己的型別定義沒有宣告，所以在這裡補。 */
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}

/**
 * App Check：讓每個請求都帶著「這是從這個網站、在允許的網域上發出」的證明。
 *
 * bundle 裡的 Firebase 設定本來就是公開的。Auth 加上 database.rules.json 管
 * 的是「誰」能讀寫，卻管不到「從哪裡」——任何人拿著這份設定，都能在自己的
 * 腳本裡直接對資料庫發請求。reCAPTCHA v3 的 App Check token 補上「從哪裡」
 * 這一半；規則仍然是唯一的授權邊界，App Check 只是擋掉不是這個 app 的來源。
 *
 * 用 site key 當開關：沒有 key 就整段跳過，什麼都不印。在擁有者到主控台註冊
 * key 之前，「沒有 key」是預期狀態而不是錯誤；key 一放進環境變數，App Check
 * 就以監控模式上線，不需要再改任何程式碼。
 *
 * 它必須排在 getAuth()/getDatabase() 之前，而且只能靜態 import：token 得在
 * 第一個資料庫請求之前就準備好，所以沒辦法像 analytics 那樣延後載入。
 *
 * 這個檔案在每一條路由（公開頁也包括）都會跑，所以這裡什麼都不准丟出去。
 * initializeAppCheck() 同步做的事包括往 document.body 掛一個 div、打開
 * IndexedDB，而對同一個 app 呼叫第二次會直接丟例外。任何一種失敗都只記一
 * 行，然後當作沒有 App Check 繼續——少一個 token 只是讓請求變成「未驗證」，
 * 讓整個 app 白屏才是真的壞掉。
 */
const appCheckSiteKey: unknown = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;
if (typeof appCheckSiteKey === 'string' && appCheckSiteKey !== '') {
  try {
    // 本機開發拿不到真的 reCAPTCHA token（localhost 不在允許的網域裡），要改用
    // 向主控台註冊過的 debug token：這個旗標讓 SDK 產生一個並印到 console。
    // 只在 DEV 底下：Vite 建置時把 import.meta.env.DEV 換成 false，整個分支
    // 會被當成死碼拿掉，所以它到不了正式的 bundle。
    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG === 'true') {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error('App Check 初始化失敗，這次先不帶 token 繼續：', error);
  }
}

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

