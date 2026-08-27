import type { Page } from '../types/routes';

export type ServiceId = 'littlesteps' | 'littlebloom' | 'littleexplorer' | 'babyoasis';

/**
 * 需要登入才能開啟的頁面。
 *
 * 判準是「這一頁會不會讀孩子的資料」，而不是「這一頁屬於哪個服務」。靜態內容
 * ——百科、照顧指南、疫苗時程、哺乳室地圖——沒有登入的理由，擋住只會讓沒帳號
 * 的家長連看都看不到。
 *
 * 里程碑與疫苗追蹤刻意不在此列：那兩頁本來就收 `user` 與 `onSignIn`，會自己在
 * 勾選處提示登入，內容照常可讀。
 */
const AUTH_REQUIRED: Record<string, true> = {
  'littlesteps/dashboard': true,
  'littlesteps/daily-log': true,
  'littlesteps/growth-charts': true,
  'littlesteps/sleep-analysis': true,
  'littlesteps/clinic-summary': true,
  'littlesteps/report': true,
  littlebloom: true,
  littleexplorer: true,
  'littleexplorer/reminders': true,
  'littleexplorer/diary': true,
};

export function requiresAuth(page: Page): boolean {
  return AUTH_REQUIRED[page] === true;
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
