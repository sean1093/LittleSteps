import type { Page } from '../types/routes';
// ServiceId 原本在這裡另寫一份，於是加一個服務要改兩處且必須手動同步。
// 主題那份是真正被 UI 讀的，這裡改成引用它。
export type { ServiceId } from './ui/serviceTheme';
import type { ServiceId } from './ui/serviceTheme';

/**
 * 不需登入就能看的頁面。
 *
 * 用「公開白名單」而不是「需登入黑名單」：這個 app 存的是孩子的健康資料，
 * 新增一個頁面時忘了設定，預設應該是擋下來，而不是預設公開。反過來寫的話，
 * 每加一頁就多一次靜默外洩的機會。
 *
 * 判準是「這一頁需不需要某個孩子的資料才有意義」。純知識內容不需要，擋住
 * 只會讓還沒有帳號的家長連查都查不到；會讀或寫孩子紀錄的一律需要登入。
 *
 * 照這個判準，照顧重點與睡眠指南和三個百科是同一類：它們不收任何 prop，
 * 只讀專案內的靜態資料，沒有 Firebase 也沒有 auth。
 *
 * 里程碑與疫苗追蹤刻意不在此列。它們的清單本身確實是參考資料，但整頁的
 * 主體是逐項勾選的完成紀錄，離開孩子的資料就只剩一份空清單。
 */
// Partial<Record<Page, true>>：key 綁在路由聯集上，改了路由名稱而忘了改這裡
// 會編譯失敗，而不是安靜地把一頁公開頁變成需登入（或反過來）。
// `join` 刻意不在這裡：它會把一個帳號寫進某個孩子的成員名單。
const PUBLIC_PAGES: Partial<Record<Page, true>> = {
  home: true,
  // 這一頁就是寫給還沒決定要不要交出帳號的人看的，擋起來等於自相矛盾。
  about: true,
  'littlesteps/baby-wiki': true,
  'littlesteps/care-guide': true,
  'littlesteps/sleep-training': true,
  'littlebloom/wiki': true,
  // 副食品指南和照顧重點、睡眠指南是同一類：整頁是參考資料。它底下「我的追蹤」
  // 那一塊要讀寫孩子的試吃紀錄，只在登入後才掛載（見 ComplementaryFoodPage）。
  'littlesteps/complementary-food': true,
  // 三個試算工具：輸入一個日期或幾個數字，在瀏覽器裡算完就結束。不讀也不寫
  // 任何孩子的紀錄，輸入的東西不離開這一頁的記憶體。
  'littlesteps/vaccine-schedule': true,
  'littlesteps/growth-percentile': true,
  'littlebloom/checkup-schedule': true,
  // 孕期每週指南：填預產期、翻前後週，和三個試算工具同一類。只讀專案內的
  // pregnancyGuides.ts，不讀也不寫任何孩子的紀錄，預產期不離開這一頁的記憶體。
  'littlebloom/weekly-guide': true,
  'littleexplorer/wiki': true,
  // 場館名冊是政府公開資料與查證過的整理，不讀任何孩子的資料。
  littleouting: true,
  babyoasis: true,
  // 就診統計是政府公開資料的整理，不讀任何孩子的資料。
  littleguard: true,
};

export function requiresAuth(page: Page): boolean {
  return PUBLIC_PAGES[page] !== true;
}

/**
 * Pages that render their own chrome, so `App.tsx` keeps the LittleSteps
 * header and sidebar hidden for them: the about page and five standalone
 * sub-apps — LittleBloom, LittleExplorer, LittleOuting, BabyOasis and
 * LittleGuard.
 *
 * The comment here used to name three of the five, which is why it is easy to
 * believe the two shell-based services are on the other side of this line;
 * they are not. Issue #65 was filed against that comment rather than the code.
 *
 * The join page (`/join#code`) is on the list for the same reason as the
 * about page: it belongs to no service, so the LittleSteps chrome would claim
 * it for one.
 *
 * The about page is not a LittleSteps page either: it describes all six
 * services and renders its own AppBar. Leaving it out would mount the
 * LittleSteps sidebar on it with a `currentPage` that is not a LittleStepsPage
 * — the cast in `App.tsx` would be a lie.
 *
 * Being on this list is a contract, not just a styling switch: `App.tsx` stops
 * supplying a `<main>`, so every page reachable under these prefixes must
 * render its own `<header>` and its own `<main>`. A11Y-01/02 check that in the
 * browser, but only on the public ones — the E2E suite is signed out, and the
 * five gated routes here early-return an intro page before the contract even
 * applies. `standaloneLandmarks.test.tsx` derives its list from this function
 * to cover the rest, which is why the predicate lives here rather than inside
 * `App.tsx`.
 */
export function isStandaloneSubApp(page: Page): boolean {
  return (
    page === 'about' ||
    page === 'join' ||
    page.startsWith('littlebloom') ||
    page.startsWith('littleexplorer') ||
    page === 'littleouting' ||
    page === 'babyoasis' ||
    page === 'littleguard'
  );
}

/**
 * 頁面所屬的服務；`home`、`about` 與 `join` 不屬於任何服務，回傳 null。
 *
 * 最後一行是 fallthrough 到 babyoasis。一個不屬於任何服務的頁面要是沒有在
 * 這裡明講，不會壞，只會被當成 BabyOasis 的頁面——landingKindFor 與主題查表
 * 都會跟著錯。
 */
export function serviceOf(page: Page): ServiceId | null {
  // join 也不屬於任何服務：同一條連結可能是寶寶的檔案，也可能是孕期檔案，
  // 而加入之前讀不到是哪一種。
  if (page === 'home' || page === 'about' || page === 'join') return null;
  if (page.startsWith('littlesteps')) return 'littlesteps';
  if (page.startsWith('littlebloom')) return 'littlebloom';
  if (page.startsWith('littleexplorer')) return 'littleexplorer';
  if (page === 'littleouting') return 'littleouting';
  if (page === 'littleguard') return 'littleguard';
  return 'babyoasis';
}

/**
 * 這一頁所在的服務會不會讀 App 那份日誌／日記。
 *
 * 外框那兩個 listener（useDailyLogs 與 useDiary，跑在 ChildRecordsBridge 裡，
 * 要聽誰由 App 用這兩個函式決定）讀的量都不小：日記是整個集合，日誌是最近
 * 90 天（見 littlesteps/logWindow.ts）。以前
 * 它們不看頁面，所以登入的家長打開哺乳室地圖、疾病雷達或關於頁，也會把孩子
 * 的整份日誌與日記下載下來並一直聽著——而那些頁面一個字都不讀。
 *
 * 範圍是「服務」而不是「頁面」：RTDB 在一條路徑上最後一個 listener 退訂時就
 * 丟掉記憶體裡的快取。以頁面為界的話，總覽 → 里程碑 → 總覽會把整份日誌重新
 * 下載一次，而總覽 → 快速日誌會在 lazy 頁面掛上自己的 listener 之前先把 App
 * 這一個退掉。以服務為界，家長待在服務裡的期間 listener 一直是熱的。
 */
export function wantsDailyLogs(page: Page): boolean {
  return serviceOf(page) === 'littlesteps';
}

export function wantsDiaryEntries(page: Page): boolean {
  return serviceOf(page) === 'littleexplorer';
}

/** 各服務的首頁路由。未登入時被擋下的頁面會退回自己服務的首頁。 */
export const SERVICE_HOME: Record<ServiceId, Page> = {
  littlesteps: 'littlesteps',
  littlebloom: 'littlebloom',
  littleexplorer: 'littleexplorer',
  littleouting: 'littleouting',
  babyoasis: 'babyoasis',
  littleguard: 'littleguard',
};
