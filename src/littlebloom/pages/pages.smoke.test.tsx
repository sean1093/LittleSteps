import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChildProfile } from '../../types';
import { pregnancyGuides } from '../data/pregnancyGuides';
import LittleBloomPage from './LittleBloomPage';
import PrenatalPage from './PrenatalPage';
import LittleBloomWikiPage from './LittleBloomWikiPage';
import { pregnancyWikiArticles } from '../data/wiki';

/**
 * LittleBloom shipped as a shell: no code path wrote pregnancyData, so every
 * user saw week 1 forever, the weekly guide only had weeks 1-4, and the
 * prenatal card rendered a hardcoded fake appointment.
 *
 * These tests pin the behaviours that were broken, so a regression is loud.
 */

const NOW = new Date(2026, 7, 27, 12); // 2026-08-27

/** 末次月經 2026-04-06 → 2026-08-27 已滿 20 整週，顯示為第 21 週。 */
const LMP = '2026-04-06';
const DUE = '2027-01-11';
const EXPECTED_WEEK = 21;

const pregnant = (overrides: Partial<ChildProfile> = {}): ChildProfile => ({
  id: 'c1',
  name: '小花',
  birthday: DUE,
  milestoneProgress: {},
  vaccineProgress: {},
  isPregnancy: true,
  pregnancyData: { childId: 'c1', dueDate: DUE, lastPeriodDate: LMP, status: 'active' },
  createdAt: '2026-04-06T00:00:00.000Z',
  createdBy: 'u1',
  ...overrides,
});

const noop = async () => {};
const noopAdd = async (_name: string, _dueDate: string) => {};

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('LittleBloomPage', () => {
  it('依末次月經算出真正的週數，而不是永遠停在第 1 週', () => {
    render(<LittleBloomPage currentChild={pregnant()} progress={{}} onRecordBirth={noop} onAddPregnancy={noopAdd} />);
    expect(screen.getByText(`第 ${EXPECTED_WEEK} 週`)).toBeInTheDocument();
  });

  it('顯示該週的指南，而不是退回第 1 週的內容', () => {
    render(<LittleBloomPage currentChild={pregnant()} progress={{}} onRecordBirth={noop} onAddPregnancy={noopAdd} />);

    const guide = pregnancyGuides.find((g) => g.week === EXPECTED_WEEK)!;
    expect(screen.getByRole('heading', { name: guide.title })).toBeInTheDocument();
    expect(screen.queryByText(/懷孕第 1 週/)).not.toBeInTheDocument();
  });

  it('第 20 週以後顯示就醫警訊', () => {
    render(<LittleBloomPage currentChild={pregnant()} progress={{}} onRecordBirth={noop} onAddPregnancy={noopAdd} />);
    expect(screen.getByText('這些情況請盡快就醫')).toBeInTheDocument();
  });

  it('沒有孕期資料時說明原因，不假裝在第 1 週', () => {
    render(
      <LittleBloomPage
        currentChild={{ ...pregnant(), isPregnancy: undefined, pregnancyData: undefined }}
        progress={{}}
        onRecordBirth={noop} onAddPregnancy={noopAdd}
      />,
    );
    expect(screen.getByText('還沒有孕期檔案')).toBeInTheDocument();
    expect(screen.queryByText(/第 \d+ 週$/)).not.toBeInTheDocument();
  });

  it('下一項產檢來自真實時程，不是寫死的假資料', () => {
    render(<LittleBloomPage currentChild={pregnant()} progress={{}} onRecordBirth={noop} onAddPregnancy={noopAdd} />);
    // 舊版寫死「幸福婦產科 2026-04-15」給每一位使用者。
    expect(screen.queryByText('幸福婦產科')).not.toBeInTheDocument();
    expect(screen.getByText('下一項產檢')).toBeInTheDocument();
  });

  it('產檢時程按鈕真的會導航（原本是空的 onClick）', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/littlebloom');
    render(<LittleBloomPage currentChild={pregnant()} progress={{}} onRecordBirth={noop} onAddPregnancy={noopAdd} />);

    await user.click(screen.getByRole('button', { name: /產檢時程/ }));

    expect(window.location.pathname).toBe('/littlebloom/prenatal');
  });

  // PregnancyData.status 從設計出來就存在，卻沒有任何流程會把它改成
  // archived——孕期檔案永遠停在孕期，寶寶出生後無處可去。
  it('可以登記出生，並把實際出生日期交出去', async () => {
    const user = userEvent.setup();
    const onRecordBirth = vi.fn(async (_birthday: string) => {});

    render(
      <LittleBloomPage
        currentChild={pregnant()}
        progress={{}}
        onRecordBirth={onRecordBirth} onAddPregnancy={noopAdd}
      />,
    );

    await user.click(screen.getByRole('button', { name: /登記出生/ }));
    await user.click(screen.getByRole('button', { name: '確認出生' }));

    expect(onRecordBirth).toHaveBeenCalledWith('2026-08-27');
  });

  it('說明出生後孕期紀錄會保留', () => {
    render(
      <LittleBloomPage currentChild={pregnant()} progress={{}} onRecordBirth={noop} onAddPregnancy={noopAdd} />,
    );
    expect(screen.getByText(/孕期與產檢紀錄都會保留/)).toBeInTheDocument();
  });
});

describe('PrenatalPage', () => {
  it('列出依週數推算的產檢項目', () => {
    render(
      <PrenatalPage currentChild={pregnant()} progress={{}} onComplete={noop} onUndo={noop} />,
    );
    // 每一列都以「第 N 次 · 標題」開頭，故用 getAllBy。
    expect(screen.getAllByText(/^第 \d+ 次 · /).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: '標記完成' }).length).toBeGreaterThan(0);
  });

  it('標記完成會帶出項目 id 與日期', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn(async (_id: string, _record: { completedDate: string }) => {});

    render(
      <PrenatalPage
        currentChild={pregnant()}
        progress={{}}
        onComplete={onComplete}
        onUndo={noop}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: '標記完成' })[0]);
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    const [templateId, record] = onComplete.mock.calls[0];
    expect(templateId).toBeTruthy();
    expect(record.completedDate).toBe('2026-08-27');
  });

  it('已完成的項目移到已完成區並可取消', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn(async (_id: string) => {});

    render(
      <PrenatalPage
        currentChild={pregnant()}
        progress={{ 'prenatal-visit-1': { completedDate: '2026-05-25' } }}
        onComplete={noop}
        onUndo={onUndo}
      />,
    );

    const doneHeading = screen.getByRole('heading', { name: /已完成/ });
    const doneSection = doneHeading.closest('section')!;
    expect(within(doneSection).getByText(/已於 2026年5月25日 完成/)).toBeInTheDocument();

    await user.click(within(doneSection).getByRole('button', { name: '取消完成' }));
    expect(onUndo).toHaveBeenCalledWith('prenatal-visit-1');
  });

  it('沒有孕期資料時說明原因', () => {
    render(
      <PrenatalPage
        currentChild={{ ...pregnant(), pregnancyData: undefined }}
        progress={{}}
        onComplete={noop}
        onUndo={noop}
      />,
    );
    expect(screen.getByText('還沒有孕期資料')).toBeInTheDocument();
  });
});

/**
 * 孕期知識庫累積到 24 篇時仍只有一個搜尋框：沒有分類 chip，也沒有空狀態，
 * 搜尋不到東西時整頁空白。改用共用的 WikiBrowser 後補上，這裡釘住。
 */
describe('LittleBloomWikiPage', () => {
  // 斷言可見的篇數文字而非 DOM 標題數：AnimatePresence 的離場動畫在
  // happy-dom 不會結束，被篩掉的卡片會滯留在 DOM 裡。
  const articleCount = () => Number(screen.getByText(/共 \d+ 篇文章/).textContent!.match(/\d+/)![0]);

  it('提供分類篩選，而不是只能搜尋', async () => {
    const user = userEvent.setup();
    render(<LittleBloomWikiPage />);

    const total = articleCount();
    expect(total).toBe(pregnancyWikiArticles.length);

    await user.click(screen.getByRole('button', { name: '產檢須知', pressed: false }));
    const filtered = articleCount();
    expect(filtered).toBe(
      pregnancyWikiArticles.filter((a) => a.category === 'checkup').length,
    );
    expect(filtered).toBeLessThan(total);
  });

  it('搜尋涵蓋內文，不是只比對標題', async () => {
    const user = userEvent.setup();
    render(<LittleBloomWikiPage />);

    // 取一篇文章處理步驟的內文當關鍵字；該字串不出現在任何標題裡。
    const article = pregnancyWikiArticles.find((a) => a.solutions.length > 0)!;
    const keyword = article.solutions[0].step.slice(0, 5);
    const titleMatches = pregnancyWikiArticles.filter((a) =>
      a.title.toLowerCase().includes(keyword.toLowerCase()),
    ).length;

    await user.type(screen.getByRole('searchbox'), keyword);
    expect(articleCount()).toBeGreaterThan(titleMatches);
  });

  it('搜尋無結果時顯示空狀態，而不是一片空白', async () => {
    const user = userEvent.setup();
    render(<LittleBloomWikiPage />);

    await user.type(screen.getByRole('searchbox'), 'zzzz-不可能命中的字串');
    expect(articleCount()).toBe(0);
    expect(screen.getByText('找不到相關文章')).toBeInTheDocument();
  });
});

/**
 * recordBirth 保留 lastPeriodDate 當孕期紀錄，只把 status 改成 archived。
 * 兩個頁面原本只判斷 `!lmp`，那個條件產後永遠不成立，於是生完的媽媽會一直
 * 看到「第 40 週」與還能按的「登記出生」。每位使用者最終都會走到這個狀態。
 */
describe('出生之後', () => {
  const born = (): ChildProfile => ({
    ...pregnant(),
    isPregnancy: false,
    birthday: '2026-08-20',
    pregnancyData: {
      childId: 'c1',
      lastPeriodDate: LMP,
      dueDate: DUE,
      status: 'archived',
    },
  });

  it('LittleBloom 首頁不再顯示週數，改為已出生通知', () => {
    render(<LittleBloomPage currentChild={born()} progress={{}} onRecordBirth={noop} onAddPregnancy={noopAdd} />);

    expect(screen.getByText('寶寶已經出生了')).toBeInTheDocument();
    expect(screen.queryByText(`第 ${EXPECTED_WEEK} 週`)).not.toBeInTheDocument();
    expect(screen.queryByText(/第 \d+ 週/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '登記出生' })).not.toBeInTheDocument();
  });

  it('產檢頁不再列出時程，改為已出生通知', () => {
    render(
      <PrenatalPage currentChild={born()} progress={{}} onComplete={noop} onUndo={noop} />,
    );

    expect(screen.getByText('寶寶已經出生了')).toBeInTheDocument();
    expect(screen.queryAllByRole('button', { name: '標記完成' })).toHaveLength(0);
  });

  it('仍在孕期時不會誤判為已出生', () => {
    render(<LittleBloomPage currentChild={pregnant()} progress={{}} onRecordBirth={noop} onAddPregnancy={noopAdd} />);

    expect(screen.queryByText('寶寶已經出生了')).not.toBeInTheDocument();
    expect(screen.getByText(`第 ${EXPECTED_WEEK} 週`)).toBeInTheDocument();
  });
});
