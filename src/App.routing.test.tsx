import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Page } from './types/routes';
import App from './App';

/**
 * 路由的行為特性測試（characterization test）。
 *
 * App.tsx 目前用兩張互為反表的字典接路由，之後會收成一張。這組測試只碰
 * 「網址列的 hash 進來會渲染出哪一頁」這個對外行為，不碰任何內部寫法，
 * 所以重構前後應該一字不改地通過——它存在的意義就是證明重構沒改到行為。
 */

// 未登入時所有需登入的頁面都會落到同一張服務介紹頁，彼此無法區分，
// 就驗不出路由有沒有接對。所以這裡一律以登入狀態跑。
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback({ uid: 'test-uid', displayName: '測試家長', email: 'test@example.com' });
    return vi.fn();
  }),
  getRedirectResult: vi.fn().mockResolvedValue(null),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(() => ({ currentUser: null })),
}));

/**
 * 每條路由「渲染對了」的判準。
 *
 * LittleSteps 的頁面靠頁首標題區分；LittleExplorer 的三頁在沒有寶寶資料時
 * 畫面完全一樣，只有分頁列的 aria-current 不同，就拿它當判準——順帶把
 * 「目前在哪一頁」這個無障礙語意也一起釘住。
 */
type Probe = { hash: string; page: Page; expect: () => Promise<unknown> };

const heading = (text: string) => () =>
  screen.findByRole('heading', { name: new RegExp(text) }, { timeout: 5000 });

const currentTab = (label: string) => async () => {
  const tab = await screen.findByRole('button', { name: label }, { timeout: 5000 });
  expect(tab).toHaveAttribute('aria-current', 'page');
  return tab;
};

const ROUTES: Probe[] = [
  { hash: '#/', page: 'home', expect: heading('用愛陪伴，溫柔守護') },
  { hash: '#/littlesteps', page: 'littlesteps', expect: heading('開始記錄寶寶的成長') },
  { hash: '#/littlesteps/dashboard', page: 'littlesteps/dashboard', expect: heading('成長總覽') },
  { hash: '#/littlesteps/milestones', page: 'littlesteps/milestones', expect: heading('里程碑追蹤') },
  { hash: '#/littlesteps/care-guide', page: 'littlesteps/care-guide', expect: heading('照顧重點') },
  { hash: '#/littlesteps/vaccine-tracking', page: 'littlesteps/vaccine-tracking', expect: heading('疫苗追蹤') },
  { hash: '#/littlesteps/complementary-food', page: 'littlesteps/complementary-food', expect: heading('副食品指南') },
  { hash: '#/littlesteps/daily-log', page: 'littlesteps/daily-log', expect: heading('快速日誌') },
  { hash: '#/littlesteps/growth-charts', page: 'littlesteps/growth-charts', expect: heading('成長曲線圖') },
  { hash: '#/littlesteps/sleep-training', page: 'littlesteps/sleep-training', expect: heading('睡眠訓練') },
  { hash: '#/littlesteps/sleep-analysis', page: 'littlesteps/sleep-analysis', expect: heading('睡眠分析') },
  { hash: '#/littlesteps/baby-wiki', page: 'littlesteps/baby-wiki', expect: heading('寶寶百科') },
  { hash: '#/littlesteps/clinic-summary', page: 'littlesteps/clinic-summary', expect: heading('看診摘要') },
  { hash: '#/littlesteps/report', page: 'littlesteps/report', expect: heading('週報月報') },
  { hash: '#/littlebloom', page: 'littlebloom', expect: heading('還沒有孕期檔案') },
  { hash: '#/littlebloom/prenatal', page: 'littlebloom/prenatal', expect: heading('產檢時程') },
  { hash: '#/littlebloom/wiki', page: 'littlebloom/wiki', expect: heading('孕期知識庫') },
  { hash: '#/littleexplorer', page: 'littleexplorer', expect: currentTab('成長') },
  { hash: '#/littleexplorer/reminders', page: 'littleexplorer/reminders', expect: currentTab('提醒') },
  { hash: '#/littleexplorer/diary', page: 'littleexplorer/diary', expect: currentTab('日記') },
  { hash: '#/littleexplorer/wiki', page: 'littleexplorer/wiki', expect: currentTab('百科') },
  { hash: '#/littleouting', page: 'littleouting', expect: heading('LittleOuting') },
  { hash: '#/babyoasis', page: 'babyoasis', expect: heading('BabyOasis') },
];

beforeEach(() => {
  window.location.hash = '';
});

describe('深連結', () => {
  it.each(ROUTES)('$hash 進來會渲染 $page', async ({ hash, expect: assertRendered }) => {
    window.location.hash = hash;
    render(<App />);
    await assertRendered();
    // 路由不該在渲染後改寫網址，否則使用者分享出去的連結會變成另一頁。
    expect(window.location.hash).toBe(hash);
  }, 20000);

  it('認不得的 hash 落回服務集合首頁，而不是空白畫面', async () => {
    window.location.hash = '#/does-not-exist';
    render(<App />);
    await screen.findByRole('heading', { name: /用愛陪伴，溫柔守護/ });
  });

  it('完全沒有 hash 時也是服務集合首頁', async () => {
    window.location.hash = '';
    render(<App />);
    await screen.findByRole('heading', { name: /用愛陪伴，溫柔守護/ });
  });
});

describe('上一頁／下一頁', () => {
  it('hashchange 會把畫面換成新 hash 對應的頁', async () => {
    window.location.hash = '#/littlesteps/milestones';
    render(<App />);
    await screen.findByRole('heading', { name: /里程碑追蹤/ });

    // 瀏覽器的上一頁只會改 hash 並送出 hashchange，不會重新掛載 App。
    window.location.hash = '#/littlesteps/vaccine-tracking';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await screen.findByRole('heading', { name: /疫苗追蹤/ });
  }, 20000);

  it('認不得的 hash 也會即時落回首頁', async () => {
    window.location.hash = '#/littlesteps/report';
    render(<App />);
    await screen.findByRole('heading', { name: /週報月報/ });

    window.location.hash = '#/garbage';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await screen.findByRole('heading', { name: /用愛陪伴，溫柔守護/ });
  }, 20000);
});

describe('點擊導覽寫回網址', () => {
  it('切到另一個分頁時 hash 跟著變，重新整理會回到同一頁', async () => {
    window.location.hash = '#/littleexplorer';
    render(<App />);
    const diary = await screen.findByRole('button', { name: '日記' });
    diary.click();

    await waitFor(() => expect(window.location.hash).toBe('#/littleexplorer/diary'));

    // 寫回去的 hash 必須是深連結吃得下的那一個，否則重新整理就掉回首頁。
    cleanup();
    render(<App />);
    await currentTab('日記')();
  }, 20000);

  it('側邊選單切頁時 hash 跟著變，重新整理會回到同一頁', async () => {
    // 分頁列自己寫 hash，側邊選單走 App 的 navigateToPage——兩條寫入路徑
    // 都要驗，只驗一條的話另一條寫錯了會靜靜地掉回首頁。
    window.location.hash = '#/littlesteps/dashboard';
    render(<App />);
    await screen.findByRole('heading', { name: /成長總覽/ });

    (await screen.findByRole('button', { name: '開啟選單' })).click();
    const milestones = await screen.findByRole('button', { name: /里程碑追蹤/ });
    milestones.click();

    await waitFor(() => expect(window.location.hash).toBe('#/littlesteps/milestones'));
    await screen.findByRole('heading', { name: /里程碑追蹤/ });

    cleanup();
    render(<App />);
    await screen.findByRole('heading', { name: /里程碑追蹤/ });
  }, 20000);
});
