import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import type { Page } from '../types/routes';
import type { ServiceId } from './routePolicy';
import { SERVICE_HOME, requiresAuth, serviceOf } from './routePolicy';

/**
 * 執行期的 Page 清單。TS 的 union 不可窮舉，所以只能手寫。
 *
 * 加一條新路由時要一起改三個地方：src/types/routes.ts 的 Page union、
 * 這張表，以及下面 PUBLIC 或 GATED 其中一邊。三者對不上時，
 * 「路由表同步」那組測試會直接指出漏了哪一步。
 */
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
  'littleouting',
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
  'littleouting',
  'babyoasis',
];

/**
 * 需要某個孩子的資料才有意義的頁面。
 *
 * 和 PUBLIC 合起來必須恰好等於 ALL_PAGES：新增一條路由卻沒決定它屬於哪一邊時，
 * 下面的分割測試會失敗。這條測試存在的理由很具體——白名單的預設值是「擋下來」，
 * 所以漏分類不會外洩，但也不會有人發現那一頁其實該公開。兩種漏都要抓。
 */
const GATED: Page[] = [
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

/** 與 routePolicy.ts 的 ServiceId union 同步；少一個，SERVICE_HOME 的窮舉就會鬆掉。 */
const ALL_SERVICES = Object.keys({
  littlesteps: true,
  littlebloom: true,
  littleexplorer: true,
  babyoasis: true,
  littleouting: true,
} satisfies Record<ServiceId, true>) as ServiceId[];

/**
 * 從 App.tsx 讀出真正被接上的路由。
 *
 * TypeScript 的 union 在執行期不可窮舉，所以 ALL_PAGES 只能手寫；手寫的表會過期。
 * 拿 App.tsx 的兩張路由表當事實來源，就讓「加了一條路由但沒有決定它公不公開、
 * 屬於哪個服務」變成一個會紅的測試，而不是一次靜悄悄的預設值。
 */
function parseRouteTable(declaration: string, entry: RegExp): string[] {
  // happy-dom 覆寫了全域 URL，Node 的 fs 不吃它，所以先轉成字串路徑再讀。
  const appSource = join(dirname(fileURLToPath(import.meta.url)), '..', 'App.tsx');
  const source = readFileSync(appSource, 'utf8');
  const table = source.match(
    new RegExp(`${declaration} = \\{([\\s\\S]*?)\\n {4}\\};`),
  );
  if (!table) {
    throw new Error(`在 App.tsx 找不到 ${declaration}；改了寫法請一併更新這個測試`);
  }
  return [...table[1].matchAll(entry)].map((match) => match[1]);
}

describe('路由表同步', () => {
  it('ALL_PAGES 就是 App.tsx 真正接上的那幾條', () => {
    // 這張表是下面每一條窮舉測試的基礎，過期了整組測試就一起失去意義。
    const wired = parseRouteTable('hashMap: Record<Page, string>', /'([^']+)':\s*'#/g);
    expect([...ALL_PAGES].sort()).toEqual(wired.sort());
  });

  it('每條路由都能從網址列直接進來', () => {
    // 只加 hashMap 沒加 pageMap，深連結會靜靜掉回首頁——分享出去的連結全失效。
    const reachable = parseRouteTable('pageMap: Record<string, Page>', /'#[^']*':\s*'([^']+)'/g);
    expect(reachable.sort()).toEqual([...ALL_PAGES].sort());
  });

  it('每條路由不是公開就是需登入，沒有第三種狀態', () => {
    expect([...PUBLIC, ...GATED].sort()).toEqual([...ALL_PAGES].sort());
  });
});

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
    for (const page of GATED) {
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

  it('littleouting 歸自己，不會掉進最後那行 fallthrough', () => {
    // serviceOf 的最後一行是 `return 'babyoasis'`：任何前面沒被認領的路由都會
    // 落到那裡。新增服務時漏掉判斷，頁面不會壞，只會歸錯服務——所以要有測試。
    expect(serviceOf('littleouting')).toBe('littleouting');
  });

  it('只有 babyoasis 自己會被歸到 babyoasis', () => {
    expect(ALL_PAGES.filter((page) => serviceOf(page) === 'babyoasis')).toEqual(['babyoasis']);
  });

  it('每條路由都歸到自己前綴的服務', () => {
    for (const page of ALL_PAGES) {
      if (page === 'home') continue;
      const service = serviceOf(page);
      expect(page === service || page.startsWith(`${service}/`), page).toBe(true);
    }
  });

  it('每個服務的首頁都歸屬於自己', () => {
    for (const [service, home] of Object.entries(SERVICE_HOME)) {
      expect(serviceOf(home), home).toBe(service);
    }
  });
});

describe('SERVICE_HOME', () => {
  it('每個服務都有首頁，一個都不缺', () => {
    // 缺一個，被擋下的頁面就退無可退（SERVICE_HOME[id] 是 undefined）。
    expect(Object.keys(SERVICE_HOME).sort()).toEqual([...ALL_SERVICES].sort());
  });

  it('首頁都是真的存在的路由', () => {
    for (const id of ALL_SERVICES) {
      expect(ALL_PAGES, id).toContain(SERVICE_HOME[id]);
    }
  });
});
