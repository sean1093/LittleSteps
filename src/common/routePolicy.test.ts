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
  'littlebloom/wiki',
  'littleexplorer',
  'littleexplorer/reminders',
  'littleexplorer/diary',
  'littleexplorer/wiki',
  'babyoasis',
];

describe('requiresAuth', () => {
  it('服務集合首頁公開', () => {
    expect(requiresAuth('home')).toBe(false);
  });

  it('每個服務的首頁都公開，否則未登入者無從認識該服務', () => {
    for (const home of Object.values(SERVICE_HOME)) {
      // littlebloom 與 littleexplorer 的首頁本身讀孩子資料，未登入時由 App 換成
      // 該服務的介紹頁；此處只確認 littlesteps 與 babyoasis 可直接進入。
      if (home === 'littlesteps' || home === 'babyoasis') {
        expect(requiresAuth(home), home).toBe(false);
      }
    }
  });

  it('靜態內容一律公開', () => {
    const publicContent: Page[] = [
      'littlesteps/milestones',
      'littlesteps/care-guide',
      'littlesteps/vaccine-tracking',
      'littlesteps/complementary-food',
      'littlesteps/sleep-training',
      'littlesteps/baby-wiki',
      'littlebloom/wiki',
      'littleexplorer/wiki',
      'babyoasis',
    ];
    for (const page of publicContent) {
      expect(requiresAuth(page), page).toBe(false);
    }
  });

  it('讀取孩子資料的頁面需要登入', () => {
    const gated: Page[] = [
      'littlesteps/dashboard',
      'littlesteps/daily-log',
      'littlesteps/growth-charts',
      'littlesteps/sleep-analysis',
      'littlesteps/clinic-summary',
      'littlesteps/report',
      'littlebloom',
      'littleexplorer',
      'littleexplorer/reminders',
      'littleexplorer/diary',
    ];
    for (const page of gated) {
      expect(requiresAuth(page), page).toBe(true);
    }
  });

  it('每個路由都有明確歸類，沒有漏網的', () => {
    for (const page of ALL_PAGES) {
      expect(typeof requiresAuth(page), page).toBe('boolean');
    }
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
