import { describe, it, expect } from 'vitest';
import type { Page } from '../types/routes';
import { SERVICE_HOME, requiresAuth, serviceOf } from './routePolicy';

/** 與 src/types/routes.ts 的 Page union 同步；漏一個就會被下面的窮舉測試抓到。 */
const ALL_PAGES: Page[] = [
  'home',
  'littlesteps',
  'littlesteps/dashboard',
  'littlesteps/milestones',
  'littlesteps/care-guide',
  'littlesteps/vaccine-tracking',
  'littlesteps/complementary-food',
  'littlesteps/daily-log',
  'littlesteps/growth-charts',
  'littlesteps/sleep-training',
  'littlesteps/sleep-analysis',
  'littlesteps/baby-wiki',
  'littlesteps/clinic-summary',
  'littlesteps/report',
  'littlebloom',
  'littlebloom/prenatal',
  'littlebloom/wiki',
  'littleexplorer',
  'littleexplorer/reminders',
  'littleexplorer/diary',
  'littleexplorer/wiki',
  'babyoasis',
];

/**
 * 公開範圍是產品決定，不是實作細節。判準是「這一頁需不需要某個孩子的資料
 * 才有意義」：純知識內容不需要，一律公開。
 *
 * 用窮舉表比對，而不是各挑幾個路由抽查：新增一條路由卻沒決定它公不公開時，
 * 這裡要失敗，而不是靜靜沿用預設值。
 */
const PUBLIC: Page[] = [
  'home',
  'littlesteps/baby-wiki',
  'littlesteps/care-guide',
  'littlesteps/sleep-training',
  'littlebloom/wiki',
  'littleexplorer/wiki',
  'babyoasis',
];

describe('requiresAuth', () => {
  it('公開的就是宣告的那幾條，一條不多', () => {
    const actual = ALL_PAGES.filter((page) => !requiresAuth(page)).sort();
    expect(actual).toEqual([...PUBLIC].sort());
  });

  it('不需要孩子資料的知識頁都不需登入', () => {
    // 這四頁不收任何 prop，只讀專案內的靜態資料。
    expect(requiresAuth('littlesteps/baby-wiki')).toBe(false);
    expect(requiresAuth('littlesteps/care-guide')).toBe(false);
    expect(requiresAuth('littlesteps/sleep-training')).toBe(false);
    expect(requiresAuth('littlebloom/wiki')).toBe(false);
    expect(requiresAuth('littleexplorer/wiki')).toBe(false);
    expect(requiresAuth('babyoasis')).toBe(false);
  });

  it('會讀或寫孩子資料的頁面都需要登入', () => {
    const gated: Page[] = [
      'littlesteps',
      'littlesteps/dashboard',
      'littlesteps/milestones',
      'littlesteps/vaccine-tracking',
      'littlesteps/complementary-food',
      'littlesteps/daily-log',
      'littlesteps/growth-charts',
      'littlesteps/sleep-analysis',
      'littlesteps/clinic-summary',
      'littlesteps/report',
      'littlebloom',
      'littlebloom/prenatal',
      'littleexplorer',
      'littleexplorer/reminders',
      'littleexplorer/diary',
    ];
    for (const page of gated) {
      expect(requiresAuth(page), page).toBe(true);
    }
  });

  it('未知路由預設需要登入，而不是預設公開', () => {
    expect(requiresAuth('littlesteps/something-new' as Page)).toBe(true);
  });
});

describe('serviceOf', () => {
  it('home 不屬於任何服務', () => {
    expect(serviceOf('home')).toBeNull();
  });

  it('每個非 home 路由都對應到一個服務', () => {
    for (const page of ALL_PAGES) {
      if (page === 'home') continue;
      expect(serviceOf(page), page).not.toBeNull();
    }
  });

  it('以前綴歸屬，子路由跟著自己的服務', () => {
    expect(serviceOf('littlesteps/report')).toBe('littlesteps');
    expect(serviceOf('littlebloom/wiki')).toBe('littlebloom');
    expect(serviceOf('littleexplorer/diary')).toBe('littleexplorer');
    expect(serviceOf('babyoasis')).toBe('babyoasis');
  });

  it('littleexplorer 不會被誤判成 littlesteps', () => {
    // 兩者都以 'little' 開頭，前綴比對順序錯了就會歸錯服務。
    expect(serviceOf('littleexplorer')).toBe('littleexplorer');
    expect(serviceOf('littleexplorer/wiki')).toBe('littleexplorer');
  });

  it('每個服務的首頁都歸屬於自己', () => {
    for (const [service, home] of Object.entries(SERVICE_HOME)) {
      expect(serviceOf(home), home).toBe(service);
    }
  });
});
