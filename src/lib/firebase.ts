import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { serviceOf } from '../common/routePolicy';
import type { Page } from '../types/routes';

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
    /**
     * reCAPTCHA 的腳本掛上來的全域。App Check 的 initializeV3 只看它在不在
     * （見下方那段說明），所以這裡只需要「有沒有」，不需要它的形狀。
     */
    grecaptcha?: unknown;
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
 * 這個檔案在每一條路由（公開頁也包括）都會跑，所以這裡什麼都不准丟出去。
 * initializeAppCheck() 同步做的事包括往 document.body 掛一個 div、打開
 * IndexedDB，而對同一個 app 呼叫第二次會直接丟例外。任何一種失敗都只記一
 * 行，然後當作沒有 App Check 繼續——少一個 token 只是讓請求變成「未驗證」，
 * 讓整個 app 白屏才是真的壞掉。
 *
 * 為什麼 reCAPTCHA 的腳本由我們自己載，而不是交給 SDK：
 *
 * @firebase/app-check 0.11.2 的 loadReCAPTCHAV3Script() 只掛 script.onload，
 * 沒有 onerror、沒有逾時、沒有重試（dist/esm/index.esm.js:1180-1185）。
 * https://www.google.com/recaptcha/api.js 載不進來時，provider 的 initialized
 * promise 永遠不會 settle，getToken() 就一直等下去——而擋廣告的擴充套件、
 * LINE／Facebook／Instagram 的內建瀏覽器（isInAppBrowser() 就是為這群人存在
 * 的）正是載不到它的那一群。token 交換失敗 SDK 有處理（退避、請求照樣以未驗
 * 證送出），腳本載不進來則沒有。
 *
 * 所以順序反過來：先自己載那支腳本，掛上 onerror 與逾時，確定 self.grecaptcha
 * 真的在了才 initializeAppCheck()。initializeV3() 開頭就先看 self.grecaptcha
 * 在不在，在就完全不碰它自己那支載入函式（同檔 :1079-1092），所以我們載成功
 * 之後那條沒有防護的路徑根本走不到；載不成功就這次不啟用 App Check，請求以
 * 未驗證送出——跟現在沒有 key 的行為一樣，而不是卡住。
 *
 * 延後 initializeAppCheck() 是安全的，兩邊的 SDK 都明講：
 * - @firebase/database 1.1.2 的 AppCheckTokenProvider.getToken() 在 App Check
 *   還沒初始化時排一個 setTimeout(0)，屆時仍然沒有就 resolve(null)，連線照樣
 *   開得起來（dist/index.esm.js:732-746，註解寫的就是「Support delayed
 *   initialization of FirebaseAppCheck」）。
 * - 之後才拿到 token 也接得上：addTokenChangeListener 是 appCheckProvider.get()
 *   的 then（同檔 :750-753），Repo 把它接到 refreshAppCheckToken（:10904），
 *   而那會在已經開著的連線上補送 appcheck（:3467-3469）。
 *
 * 代價是第一個請求可能比 token 早出門一步。強制執行打開之後，那條連線會被
 * 後端關掉、SDK 重連時就帶著 token 了；而實務上 RTDB 的第一個 listener 要等
 * 登入狀態回來（未登入的 hook 一律 early-return），通常比腳本慢。
 */
const RECAPTCHA_SCRIPT_URL = 'https://www.google.com/recaptcha/api.js';

/**
 * 等腳本的上限。超過就當它不會來——這個數字只影響「多久之後放棄啟用
 * App Check」，不影響任何畫面：等待期間資料照讀。
 */
const RECAPTCHA_LOAD_TIMEOUT_MS = 8000;

/** self.grecaptcha 在不在。App Check 的 initializeV3 看的就是這個全域。 */
const hasRecaptcha = (): boolean => typeof self !== 'undefined' && self.grecaptcha != null;

/**
 * 載入 reCAPTCHA v3 的腳本，回報成功或失敗，永遠不會 reject、也不會不 settle。
 *
 * 網址必須與 SDK 的 RECAPTCHA_URL 逐字相同（同檔 :1072），不然瀏覽器會抓兩份，
 * 而 SDK 那一份又是沒有防護的那一支。
 */
function loadRecaptchaScript(): Promise<boolean> {
  if (hasRecaptcha()) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    let settled = false;
    const finish = (loaded: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(loaded);
    };
    // 逾時也算失敗：擋下來的方式不一定會觸發 error，有些擴充套件是讓請求一直懸著。
    const timer = window.setTimeout(() => finish(false), RECAPTCHA_LOAD_TIMEOUT_MS);

    script.src = RECAPTCHA_SCRIPT_URL;
    script.async = true;
    script.onload = () => finish(hasRecaptcha());
    script.onerror = () => finish(false);
    document.head.appendChild(script);
  });
}

const appCheckSiteKey: unknown = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;
if (typeof appCheckSiteKey === 'string' && appCheckSiteKey !== '') {
  const siteKey = appCheckSiteKey;
  // 本機開發拿不到真的 reCAPTCHA token（localhost 不在允許的網域裡），要改用
  // 向主控台註冊過的 debug token：這個旗標讓 SDK 產生一個並印到 console。
  // 只在 DEV 底下：Vite 建置時把 import.meta.env.DEV 換成 false，整個分支
  // 會被當成死碼拿掉，所以它到不了正式的 bundle。
  //
  // 旗標要在 initializeAppCheck() 之前設好，而那現在排在腳本之後，所以這裡
  // 就設——它只是一個全域布林，設了不代表 App Check 會啟用。
  if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG === 'true') {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  void loadRecaptchaScript().then((loaded) => {
    if (!loaded) {
      // 一行就好，而且是 warn 不是 error：這不是壞掉，是這次沒有 App Check。
      console.warn('reCAPTCHA 腳本載不進來，這次不啟用 App Check，請求以未驗證送出');
      return;
    }
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (error) {
      console.error('App Check 初始化失敗，這次先不帶 token 繼續：', error);
    }
  });
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
 * 「第一次記事件」現在就是一進站：每一頁都送 page_view，進站的那一頁也算。
 * 所以載入本身再往後讓一步，等瀏覽器閒下來（whenIdle）才開始——事件的內容
 * 在呼叫當下就組好了，晚一點送不會少任何東西，而登入狀態與孩子的資料不必
 * 跟追蹤程式碼搶同一段啟動時間。
 *
 * isSupported() 是必要的：在無痕模式與部分 in-app 瀏覽器裡初始化 Analytics
 * 會直接丟例外，而記不到事件不該讓呼叫點壞掉。
 *
 * 用 initializeAnalytics() 而不是 getAnalytics()，為的是 send_page_view: false。
 * getAnalytics() 跑 gtag 的 config 時不帶這個選項，gtag 就會自己送一筆
 * page_view——而 App 對每一頁都明確送一筆（logPageView），於是每次造訪的
 * 第一頁被算兩次。關掉自動的那一筆，明確送的就是唯一的一筆。
 *
 * initializeAnalytics() 對同一個 app 呼叫第二次會丟 already-initialized——
 * SDK 會就地改寫第一次傳進去的 config，之後任何「一樣」的字面值都比對不過。
 * 正式環境這個模組只執行一次；開發時 HMR 重新執行它就會踩到，而且錯誤被
 * 下面的 catch 吞掉，Analytics 會安靜地停到整頁重新整理。所以丟了就退回
 * getAnalytics()，拿已經存在的那一個。
 *
 * VITE_FIREBASE_ANALYTICS_DISABLED === 'true' 時整段跳過，連 chunk 都不載。
 * 這個開關是給 E2E 的：每一頁（包含一進站的那一頁）都會送 page_view，所以
 * Analytics 在任何路由的第一次載入就會啟動，而它用假的 API key 去註冊
 * Installations 會拿到 400、在 console 印錯誤——那是測試環境自己造成的，
 * 家長不會遇到，卻會讓 PWA-03（公開頁不得有 console 錯誤）紅掉。沒設就是
 * 啟用，所以正式環境不需要為它做任何設定。
 */
type SendEvent = (eventName: string, eventParams?: Record<string, unknown>) => void;

let analyticsReady: Promise<SendEvent | null> | null = null;

/** 瀏覽器閒下來才 resolve；沒有 requestIdleCallback（Safari）就讓出一個 tick。 */
const whenIdle = () =>
  new Promise<void>((resolve) => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => resolve(), { timeout: 3000 });
    } else {
      window.setTimeout(resolve, 1);
    }
  });

const loadAnalytics = () => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (import.meta.env.VITE_FIREBASE_ANALYTICS_DISABLED === 'true') return Promise.resolve(null);
  analyticsReady ??= whenIdle()
    .then(() => import('firebase/analytics'))
    .then(async ({ getAnalytics, initializeAnalytics, isSupported, logEvent: send }) => {
      if (!(await isSupported())) return null;
      let instance;
      try {
        instance = initializeAnalytics(app, { config: { send_page_view: false } });
      } catch {
        instance = getAnalytics(app);
      }
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
export const logPageView = (pageName: Page) => {
  // Determine app category and page details
  const getPageMetadata = (page: Page) => {
    // Which app: serviceOf() is the one place that maps a page to its service.
    // This function used to keep its own prefix list, and the list drifted:
    // littleouting, babyoasis, littleguard and about were all reported as
    // 'main' / 'home'.
    const app: string = serviceOf(page) ?? 'main';
    let section = 'home';
    let feature: string = page;

    if (page === 'home') {
      section = 'landing';
      feature = 'main-entry';
    } else if (page === 'about') {
      section = 'about';
    } else if (page.startsWith('littlebloom')) {
      // startsWith, not ===: an equality check dropped littlebloom/wiki into
      // the generic 'main' bucket, so its page views were never attributed.
      section = 'wip';
      feature = 'pregnancy-companion';
    } else if (page.startsWith('littleexplorer')) {
      section = 'toddler';
      feature = page.split('/')[1] || 'development';
    } else if (page.startsWith('littlesteps')) {
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
    } else if (page === 'littleouting' || page === 'babyoasis' || page === 'littleguard') {
      // The three single-page services: public, no child data, one page each.
      section = 'public';
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
    // main | littlesteps | littlebloom | littleexplorer | littleouting | babyoasis | littleguard
    app_name: metadata.app,
    app_section: metadata.section,    // landing | data-tracking | development | public | about | etc.
    app_feature: metadata.feature,    // specific feature name
  });
};

/**
 * 里程碑與疫苗的事件只記「動作」，不記是哪一項。
 *
 * 這兩個事件原本帶著 milestone_id、vaccine_id 與 dose_number。那些是目錄上的
 * 編號，不是孩子的名字或生日，但綁在同一個 Analytics client id 上，就是一台
 * 裝置上「哪些里程碑達到了、哪些疫苗打過了」的逐筆軌跡——離「關於資料」頁
 * 那句「不會出現任何一筆紀錄的內容」太近了。哪一劑被勾得多，看目錄的總量就
 * 答得出來，不需要每台裝置各留一份。
 *
 * 每個事件允許帶哪些欄位，由 src/lib/analytics.test.ts 釘死：多一個欄位就紅，
 * 所以這條界線不靠這段註解。
 */
export const logMilestoneToggle = (achieved: boolean) => {
  logEvent('milestone_toggle', { achieved });
};

export const logVaccineToggle = (administered: boolean) => {
  logEvent('vaccine_toggle', { administered });
};

export const logChildProfileAction = (action: 'create' | 'update' | 'delete' | 'switch') => {
  logEvent('child_profile_action', { action });
};

export const logAuthEvent = (action: 'login' | 'logout' | 'login_failed') => {
  logEvent('auth_action', { action });
};

