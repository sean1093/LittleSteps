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
const PUBLIC_PAGES: Partial<Record<Page, true>> = {
  home: true,
  'littlesteps/baby-wiki': true,
  'littlesteps/care-guide': true,
  'littlesteps/sleep-training': true,
  'littlebloom/wiki': true,
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

/** 頁面所屬的服務；`home` 不屬於任何服務，回傳 null。 */
export function serviceOf(page: Page): ServiceId | null {
  if (page === 'home') return null;
  if (page.startsWith('littlesteps')) return 'littlesteps';
  if (page.startsWith('littlebloom')) return 'littlebloom';
  if (page.startsWith('littleexplorer')) return 'littleexplorer';
  if (page === 'littleouting') return 'littleouting';
  if (page === 'littleguard') return 'littleguard';
  return 'babyoasis';
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
