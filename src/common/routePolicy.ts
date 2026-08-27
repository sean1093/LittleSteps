import type { Page } from '../types/routes';

export type ServiceId = 'littlesteps' | 'littlebloom' | 'littleexplorer' | 'babyoasis';

/**
 * 不需登入就能看的頁面。
 *
 * 用「公開白名單」而不是「需登入黑名單」：這個 app 存的是孩子的健康資料，
 * 新增一個頁面時忘了設定，預設應該是擋下來，而不是預設公開。反過來寫的話，
 * 每加一頁就多一次靜默外洩的機會。
 *
 * 公開的只有四個服務各自的知識內容與哺乳室地圖，加上服務集合首頁。這些是
 * 純靜態內容，擋住只會讓還沒有帳號的家長連認識這些服務的機會都沒有；其餘
 * 功能一律需要登入。
 */
const PUBLIC_PAGES: Record<string, true> = {
  home: true,
  'littlesteps/baby-wiki': true,
  'littlebloom/wiki': true,
  'littleexplorer/wiki': true,
  babyoasis: true,
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
  return 'babyoasis';
}

/** 各服務的首頁路由。未登入時被擋下的頁面會退回自己服務的首頁。 */
export const SERVICE_HOME: Record<ServiceId, Page> = {
  littlesteps: 'littlesteps',
  littlebloom: 'littlebloom',
  littleexplorer: 'littleexplorer',
  babyoasis: 'babyoasis',
};
