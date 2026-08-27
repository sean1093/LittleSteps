import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CareTaskRecord, ChildProfile, DiaryEntry } from '../../types';
import { careTaskTemplates } from '../data/careTasks';
import { developmentCheckItems } from '../data/developmentChecks';
import { resolveCareTasks } from '../utils/careSchedule';
import DevelopmentPage from './DevelopmentPage';
import RemindersPage from './RemindersPage';
import DiaryPage from './DiaryPage';
import ToddlerWikiPage from './ToddlerWikiPage';

/**
 * Mount smoke tests for the four LittleExplorer tabs.
 *
 * The repo otherwise has no page-level tests, and these deliberately stay
 * shallow: they exist because a page that throws on mount is invisible to the
 * pure-function suites, and because two behaviours are load-bearing product
 * invariants that a refactor could silently break —
 *   1. vaccine tasks must never offer a "mark complete" button, and
 *   2. the growth tab must open on the child's actual age band.
 */

const NOW = new Date(2026, 7, 27, 12); // 2026-08-27, local noon

/** 生日 2024-08-27 → 恰好 24 個月，落在 24-30 段。 */
const TWO_YEAR_OLD = '2024-08-27';

const child = (overrides: Partial<ChildProfile> = {}): ChildProfile => ({
  id: 'c1',
  name: '小樹',
  birthday: TWO_YEAR_OLD,
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2024-08-27T00:00:00.000Z',
  createdBy: 'u1',
  ...overrides,
});

const noop = async () => {};

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('ExplorerShell 與 tab bar', () => {
  it('每個分頁都渲染四個 tab，並標記自己為作用中', () => {
    render(
      <ToddlerWikiPage currentChild={child()} reminderBadge={0} />,
    );

    const nav = screen.getByRole('navigation');
    for (const label of ['成長', '提醒', '日記', '百科']) {
      expect(within(nav).getByText(label)).toBeInTheDocument();
    }
    expect(within(nav).getByRole('button', { current: 'page' })).toHaveTextContent('百科');
  });

  it('提醒 tab 在有待辦時顯示紅點，數量超過 9 顯示 9+', () => {
    render(<ToddlerWikiPage currentChild={child()} reminderBadge={12} />);
    expect(screen.getByLabelText('12 項待處理')).toHaveTextContent('9+');
  });

  it('沒有待辦時不顯示紅點', () => {
    render(<ToddlerWikiPage currentChild={child()} reminderBadge={0} />);
    expect(screen.queryByLabelText(/項待處理/)).not.toBeInTheDocument();
  });

  // 導覽有兩級：tab bar 通往本服務的首頁（成長分頁即 #/littleexplorer），
  // 頁首的「所有服務」再往上一級回到 app 進入點。兩者不可互相取代。
  it('tab bar 通往本服務首頁', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/littleexplorer/wiki';

    render(<ToddlerWikiPage currentChild={child()} />);
    await user.click(within(screen.getByRole('navigation')).getByText('成長'));

    expect(window.location.hash).toBe('#/littleexplorer');
  });

  it('頁首通往所有服務的進入點', async () => {
    const user = userEvent.setup();
    window.location.hash = '#/littleexplorer/wiki';

    render(<ToddlerWikiPage currentChild={child()} />);
    await user.click(screen.getByRole('button', { name: '所有服務' }));

    expect(window.location.hash).toBe('#/');
  });
});

describe('DevelopmentPage', () => {
  const renderPage = (overrides: Partial<ChildProfile> = {}) =>
    render(
      <DevelopmentPage
        currentChild={child(overrides)}
        progress={{}}
        toothProgress={{}}
        onToggleTooth={noop}
        onToggleCheck={noop}
        onQuickDiary={noop}
      />,
    );

  it('預設選中孩子目前月齡所屬的年齡段，而非第一段', () => {
    renderPage();
    // 24 個月 → 2 歲-2 歲 6 個月
    expect(screen.getByRole('button', { name: '2 歲-2 歲 6 個月', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 歲-1 歲 3 個月', pressed: false })).toBeInTheDocument();
  });

  it('顯示該年齡段的 6 個項目與已完成計數', () => {
    render(
      <DevelopmentPage
        currentChild={child()}
        toothProgress={{}}
        onToggleTooth={noop}
        progress={{ [developmentCheckItems.find((i) => i.ageBand === '24-30')!.id]: { achieved: true } }}
        onToggleCheck={noop}
        onQuickDiary={noop}
      />,
    );
    expect(screen.getByText('這個階段的 6 件事')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('未滿 1 歲顯示引導卡，不渲染檢核清單', () => {
    renderPage({ birthday: '2026-03-01' }); // 約 5 個月
    expect(screen.getByText('寶寶還不到 1 歲')).toBeInTheDocument();
    expect(screen.queryByText(/這個階段的/)).not.toBeInTheDocument();
  });

  it('沒有寶寶時顯示引導卡', () => {
    render(
      <DevelopmentPage
        currentChild={null}
        progress={{}}
        toothProgress={{}}
        onToggleCheck={noop}
        onToggleTooth={noop}
        onQuickDiary={noop}
      />,
    );
    expect(screen.getByText('還沒有寶寶資料')).toBeInTheDocument();
  });

  it('乳牙記錄收合時仍顯示已長顆數', () => {
    render(
      <DevelopmentPage
        currentChild={child()}
        progress={{}}
        toothProgress={{ 'lower-right-1': { erupted: true }, 'lower-left-1': { erupted: true } }}
        onToggleCheck={noop}
        onToggleTooth={noop}
        onQuickDiary={noop}
      />,
    );
    expect(screen.getByText('已長 2／20 顆')).toBeInTheDocument();
  });

  it('展開乳牙記錄後，點牙位會回報該牙的 id', async () => {
    const user = userEvent.setup();
    const onToggleTooth = vi.fn(async (_id: string) => {});

    render(
      <DevelopmentPage
        currentChild={child()}
        progress={{}}
        toothProgress={{}}
        onToggleCheck={noop}
        onToggleTooth={onToggleTooth}
        onQuickDiary={noop}
      />,
    );

    await user.click(screen.getByRole('button', { name: /乳牙萌發/ }));
    // 牙位的 aria-label 形如「上正中門齒，約 4 至 8 個月」；年齡段 chip 也以
    // 「個月」結尾，故必須比對完整的區間格式才不會誤抓。
    const teeth = screen.getAllByRole('button', { name: /約 \d+ 至 \d+ 個月$/ });
    expect(teeth).toHaveLength(20);

    await user.click(teeth[0]);
    expect(onToggleTooth).toHaveBeenCalledTimes(1);
    expect(onToggleTooth.mock.calls[0][0]).toMatch(/^(upper|lower)-(left|right)-[1-5]$/);
  });

  it('滿 3 歲顯示畢業卡但仍可瀏覽', () => {
    renderPage({ birthday: '2023-01-01' }); // 逾 3 歲
    expect(screen.getByText('已經滿 3 歲了')).toBeInTheDocument();
    expect(screen.getByText('這個階段的 6 件事')).toBeInTheDocument();
  });

  it('紅旗警訊預設收合，展開後才顯示轉介建議', async () => {
    const user = userEvent.setup();
    renderPage();

    expect(screen.queryByText(/早期療育通報轉介中心/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /什麼時候該諮詢醫師/ }));
    expect(screen.getByText(/早期療育通報轉介中心/)).toBeInTheDocument();
  });

  it('勾選項目後就地展開日記輸入框，送出後回呼帶著項目 id', async () => {
    const user = userEvent.setup();
    const onQuickDiary = vi.fn(async () => {});
    const item = developmentCheckItems.find((i) => i.ageBand === '24-30')!;

    render(
      <DevelopmentPage
        currentChild={child()}
        progress={{}}
        toothProgress={{}}
        onToggleTooth={noop}
        onToggleCheck={noop}
        onQuickDiary={onQuickDiary}
      />,
    );

    await user.click(screen.getByRole('button', { name: `標記：${item.title}` }));
    const input = screen.getByPlaceholderText('要記一筆嗎？（選填）');
    await user.type(input, '今天做到了');
    await user.click(screen.getByRole('button', { name: '記下來' }));

    expect(onQuickDiary).toHaveBeenCalledWith('今天做到了', item.id);
  });

  it('取消日記輸入框不會建立日記', async () => {
    const user = userEvent.setup();
    const onQuickDiary = vi.fn(async () => {});
    const item = developmentCheckItems.find((i) => i.ageBand === '24-30')!;

    render(
      <DevelopmentPage
        currentChild={child()}
        progress={{}}
        toothProgress={{}}
        onToggleTooth={noop}
        onToggleCheck={noop}
        onQuickDiary={onQuickDiary}
      />,
    );

    await user.click(screen.getByRole('button', { name: `標記：${item.title}` }));
    await user.click(screen.getByRole('button', { name: '關閉' }));

    expect(screen.queryByPlaceholderText('要記一筆嗎？（選填）')).not.toBeInTheDocument();
    expect(onQuickDiary).not.toHaveBeenCalled();
  });
});

describe('RemindersPage', () => {
  const tasks = () =>
    resolveCareTasks(TWO_YEAR_OLD, careTaskTemplates, {}, {}, NOW);

  it('疫苗任務不提供標記完成，只深連結回疫苗追蹤', () => {
    render(
      <RemindersPage currentChild={child()} tasks={tasks()} onCompleteTask={noop} />,
    );

    const vaccineRows = screen.getAllByText('疫苗接種');
    expect(vaccineRows.length).toBeGreaterThan(0);

    for (const badge of vaccineRows) {
      const row = badge.closest('li')!;
      expect(within(row).queryByRole('button', { name: '標記完成' })).not.toBeInTheDocument();
      expect(within(row).getByRole('button', { name: '到疫苗追蹤勾選' })).toBeInTheDocument();
    }
  });

  it('非疫苗任務提供標記完成，展開後可送出記錄', async () => {
    const user = userEvent.setup();
    const onCompleteTask = vi.fn(async (_record: CareTaskRecord) => {});

    render(
      <RemindersPage currentChild={child()} tasks={tasks()} onCompleteTask={onCompleteTask} />,
    );

    await user.click(screen.getAllByRole('button', { name: '標記完成' })[0]);
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(onCompleteTask).toHaveBeenCalledTimes(1);
    const [record] = onCompleteTask.mock.calls[0];
    expect(record.taskId).toBeTruthy();
    expect(record.completedDate).toBe('2026-08-27');
  });

  it('顯示這個月齡的四類注意事項', () => {
    render(<RemindersPage currentChild={child()} tasks={tasks()} onCompleteTask={noop} />);
    for (const label of ['安全', '飲食', '行為與情緒', '健康照護']) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('注意事項不提供勾選', () => {
    render(<RemindersPage currentChild={child()} tasks={tasks()} onCompleteTask={noop} />);
    const safety = screen.getByText('安全').closest('article')!;
    expect(within(safety).queryByRole('checkbox')).not.toBeInTheDocument();
    expect(within(safety).queryByRole('button')).not.toBeInTheDocument();
  });

  it('未滿 1 歲顯示引導卡', () => {
    render(
      <RemindersPage
        currentChild={child({ birthday: '2026-03-01' })}
        tasks={[]}
        onCompleteTask={noop}
      />,
    );
    expect(screen.getByText('寶寶還不到 1 歲')).toBeInTheDocument();
  });
});

describe('DiaryPage', () => {
  const entry = (overrides: Partial<DiaryEntry> = {}): DiaryEntry => ({
    id: 'd1',
    childId: 'c1',
    date: '2026-08-20',
    content: '第一次自己穿鞋',
    createdAt: '2026-08-20T10:00:00.000Z',
    ...overrides,
  });

  const renderPage = (entries: DiaryEntry[]) =>
    render(
      <DiaryPage
        currentChild={child()}
        entries={entries}
        onAdd={async () => 'd2'}
        onUpdate={noop}
        onDelete={noop}
      />,
    );

  it('無紀錄時顯示引導文案而非空白畫面', () => {
    renderPage([]);
    expect(screen.getByText('還沒有任何紀錄')).toBeInTheDocument();
  });

  it('依月份分組，最新月份在前', () => {
    renderPage([
      entry({ id: 'old', date: '2026-06-10', content: '六月的事' }),
      entry({ id: 'new', date: '2026-08-20', content: '八月的事' }),
    ]);

    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.map((h) => h.textContent)).toEqual(['2026 年 8 月', '2026 年 6 月']);
  });

  it('帶成長連結的條目顯示該項目標題', () => {
    const item = developmentCheckItems[0];
    renderPage([entry({ linkedCheckItemId: item.id })]);
    expect(screen.getByText(item.title)).toBeInTheDocument();
  });

  it('連結到已不存在的項目時不渲染空標籤', () => {
    renderPage([entry({ linkedCheckItemId: 'check-removed-long-ago' })]);
    expect(screen.getByText('第一次自己穿鞋')).toBeInTheDocument();
    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
  });

  it('刪除需二次確認，取消則不呼叫', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn(async () => {});
    // happy-dom 不提供 window.confirm，需自行注入才能觀察二次確認。
    const confirmStub = vi.fn(() => false);
    vi.stubGlobal('confirm', confirmStub);

    render(
      <DiaryPage
        currentChild={child()}
        entries={[entry()]}
        onAdd={async () => 'd2'}
        onUpdate={noop}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole('button', { name: '刪除' }));
    expect(confirmStub).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();

    confirmStub.mockReturnValue(true);
    await user.click(screen.getByRole('button', { name: '刪除' }));
    expect(onDelete).toHaveBeenCalledWith('d1');

    vi.unstubAllGlobals();
  });

  it('沒有寶寶時顯示引導卡', () => {
    render(
      <DiaryPage
        currentChild={null}
        entries={[]}
        onAdd={async () => undefined}
        onUpdate={noop}
        onDelete={noop}
      />,
    );
    expect(screen.getByText('還沒有寶寶資料')).toBeInTheDocument();
  });
});

describe('ToddlerWikiPage', () => {
  it('搜尋與分類為 AND 關係', async () => {
    const user = userEvent.setup();
    render(<ToddlerWikiPage currentChild={child()} />);

    await user.click(screen.getByRole('button', { name: '如廁訓練', pressed: false }));
    const beforeSearch = screen.getAllByRole('heading', { level: 3 }).length;
    expect(beforeSearch).toBeGreaterThan(0);

    await user.type(screen.getByRole('searchbox'), 'zzzz-不可能命中的字串');
    expect(screen.getByText('找不到符合的文章，換個關鍵字試試')).toBeInTheDocument();
  });

  it('不做年齡守門，沒有寶寶也能查', () => {
    render(<ToddlerWikiPage currentChild={null} />);
    expect(screen.queryByText('還沒有寶寶資料')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0);
  });
});
