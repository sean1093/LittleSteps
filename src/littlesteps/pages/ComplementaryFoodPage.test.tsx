import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChildProfile } from '../../types';
import type * as FoodTracking from '../hooks/useFoodTracking';
import ComplementaryFoodPage from './ComplementaryFoodPage';

/**
 * 副食品頁的行為特性測試（characterization test）。
 *
 * 這一頁把六個檢視全部內嵌在同一個檔案裡，之後會拆成各自的元件。這組測試
 * 只驗「使用者看得到什麼、點了會去哪裡」，不碰內部怎麼組裝，所以拆檔前後
 * 應該一字不改地通過——它存在的意義就是證明拆檔沒改到行為。
 *
 * 檢視之間用 AnimatePresence mode="wait" 切換：舊的先退場，新的才進場。
 * 所以每次互動之後都得用 findBy* 等，不能用 getBy* 直接抓。
 */

const { addFoodTrial, readState } = vi.hoisted(() => ({
  addFoodTrial: vi.fn(),
  readState: { error: false },
}));

// 只覆蓋讀取失敗這個旗標，其餘照真的 hook 走。
vi.mock('../hooks/useFoodTracking', async (importOriginal) => {
  const actual = await importOriginal<typeof FoodTracking>();
  return {
    ...actual,
    useFoodTracking: (...args: Parameters<typeof actual.useFoodTracking>) => ({
      ...actual.useFoodTracking(...args),
      error: readState.error,
    }),
  };
});

vi.mock('../../common/hooks/useFirebaseChildren', () => ({
  useFirebaseChildren: () => ({
    addFoodTrial,
    updateFoodTrial: vi.fn(),
    deleteFoodTrial: vi.fn(),
  }),
}));

const child: ChildProfile = {
  id: 'c1',
  name: '小豆',
  birthday: '2025-02-27',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2025-02-27T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
};

/** 五個檢視各自的招牌標題；換檢視就是換掉這些字。 */
const VIEWS = {
  home: '我的副食品追蹤',
  'guide-overview': '副食品添加三大原則',
  'guide-stages': '副食品與奶量轉換三階段',
  'guide-menu': '試敏菜單與月份推薦',
  'guide-safety': '專業提醒與禁忌',
} as const;

const renderPage = () => {
  const user = userEvent.setup();
  render(<ComplementaryFoodPage currentChild={child} user={null} />);
  return user;
};

const goneEventually = (name: string) =>
  waitFor(() => expect(screen.queryByRole('heading', { name })).toBeNull());

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  readState.error = false;
});

describe('進到這一頁的第一眼', () => {
  it('停在主頁，看得到追蹤區與四張知識庫卡片', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: VIEWS.home })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '副食品知識庫' })).toBeInTheDocument();
    for (const title of ['開始使用指南', '發展階段', '菜單建議', '安全須知']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
  });

  it('主頁不顯示返回鍵——沒有上一層可回', () => {
    renderPage();
    expect(screen.queryByRole('button', { name: /返回主頁/ })).toBeNull();
  });
});

describe('知識庫四張卡片各自通到一個檢視', () => {
  it.each([
    ['開始使用指南', VIEWS['guide-overview']],
    ['發展階段', VIEWS['guide-stages']],
    ['菜單建議', VIEWS['guide-menu']],
    ['安全須知', VIEWS['guide-safety']],
  ])('點「%s」會看到「%s」', async (card, expected) => {
    const user = renderPage();
    await user.click(screen.getByRole('heading', { name: card }));

    expect(await screen.findByRole('heading', { name: expected })).toBeInTheDocument();
    // 換了檢視就不該還留著主頁的內容，否則就是疊加而不是切換。
    await goneEventually(VIEWS.home);
  });

  it('返回主頁會回到主頁，而且返回鍵跟著消失', async () => {
    const user = renderPage();
    await user.click(screen.getByRole('heading', { name: '安全須知' }));
    await screen.findByRole('heading', { name: VIEWS['guide-safety'] });

    await user.click(screen.getByRole('button', { name: /返回主頁/ }));
    expect(await screen.findByRole('heading', { name: VIEWS.home })).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /返回主頁/ })).toBeNull(),
    );
  });

  it('可以從一個檢視換到另一個，內容不會疊加', async () => {
    const user = renderPage();
    await user.click(screen.getByRole('heading', { name: '菜單建議' }));
    await screen.findByRole('heading', { name: VIEWS['guide-menu'] });

    await user.click(screen.getByRole('button', { name: /返回主頁/ }));
    await screen.findByRole('heading', { name: '發展階段' });
    await user.click(screen.getByRole('heading', { name: '發展階段' }));

    expect(await screen.findByRole('heading', { name: VIEWS['guide-stages'] })).toBeInTheDocument();
    await goneEventually(VIEWS['guide-menu']);
  });
});

describe('發展階段的收合', () => {
  it('階段預設收合，點開才展開', async () => {
    const user = renderPage();
    await user.click(screen.getByRole('heading', { name: '發展階段' }));
    await screen.findByRole('heading', { name: VIEWS['guide-stages'] });

    const collapsed = screen.getAllByRole('button', { expanded: false });
    expect(collapsed.length).toBeGreaterThan(0);

    await user.click(collapsed[0]);
    await waitFor(() => expect(collapsed[0]).toHaveAttribute('aria-expanded', 'true'));
  });
});

describe('兩張參考表用 bottom sheet 開', () => {
  it.each(['4x3 試敏法', '手指食物指南'])('「%s」可以開、也可以關', async (label) => {
    const user = renderPage();
    await user.click(screen.getByRole('button', { name: label }));

    expect(await screen.findByRole('button', { name: '關閉' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '關閉' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: '關閉' })).toBeNull());
  });
});

describe('追蹤區的兩個入口', () => {
  it('「我的食物清單」進到追蹤檢視，分頁列兩個選項都在', async () => {
    const user = renderPage();
    await user.click(screen.getByRole('button', { name: /我的食物清單/ }));

    await goneEventually(VIEWS.home);
    expect(screen.getByRole('button', { name: /我的食物清單/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /4×3 追蹤/ })).toBeInTheDocument();
  });

  it('「4×3 追蹤」也進到同一個追蹤檢視', async () => {
    const user = renderPage();
    await user.click(screen.getByRole('button', { name: /4×3 追蹤/ }));

    await goneEventually(VIEWS.home);
    expect(screen.getByRole('button', { name: /4×3 追蹤/ })).toBeInTheDocument();
  });

  it('從追蹤區也能返回主頁', async () => {
    const user = renderPage();
    await user.click(screen.getByRole('button', { name: /我的食物清單/ }));
    await goneEventually(VIEWS.home);

    await user.click(screen.getByRole('button', { name: /返回主頁/ }));
    expect(await screen.findByRole('heading', { name: VIEWS.home })).toBeInTheDocument();
  });
});

describe('新增食物寫入失敗時', () => {
  it('表單不關，錯誤顯示在表單裡，打好的名稱還在', async () => {
    addFoodTrial.mockRejectedValue(new Error('權限不足，無法寫入'));
    const user = renderPage();

    await user.click(screen.getByRole('button', { name: /我的食物清單/ }));
    await user.click(await screen.findByRole('button', { name: /記錄新食物嘗試/ }));

    const name = await screen.findByLabelText(/食物名稱/);
    await user.type(name, '地瓜');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('權限不足，無法寫入');
    expect(screen.getByLabelText(/食物名稱/)).toHaveValue('地瓜');
  });
});

describe('讀不到食物記錄時', () => {
  it('追蹤頁說讀不到，而不是說還沒記過', async () => {
    readState.error = true;
    const user = renderPage();

    await user.click(screen.getByRole('button', { name: /我的食物清單/ }));

    expect(
      await screen.findByText('讀不到食物記錄，請確認網路後重新載入'),
    ).toBeInTheDocument();
  });
});
