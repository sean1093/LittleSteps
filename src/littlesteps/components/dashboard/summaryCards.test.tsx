import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DailyLog, DailySummary } from '../../../types';
import DailyLogSummaryCard from '../dailylog/DailyLogSummaryCard';
import MilestoneSummaryCard from '../milestone/MilestoneSummaryCard';

/**
 * 儀表板的摘要卡以前把數字講成判決：新生兒的里程碑是「3 / 33」加一條 9% 的
 * 進度條，而今天還沒記錄的家長只看到一句「今日尚無記錄」，沒有下一步。
 */

const NOW = new Date('2026-06-15T04:00:00.000Z');
const ago = (minutes: number) => new Date(NOW.getTime() - minutes * 60_000).toISOString();

const emptySummary: DailySummary = {
  date: '2026-06-15',
  feedingCount: 0,
  totalFeedingAmount: 0,
  sleepCount: 0,
  totalSleepDuration: 0,
  diaperCount: 0,
  poopCount: 0,
  peeCount: 0,
};

describe('DailyLogSummaryCard', () => {
  afterEach(() => vi.useRealTimers());

  it('今天還沒記錄時說下一步是什麼，而整張卡點下去就是日誌', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<DailyLogSummaryCard summary={emptySummary} dailyLogs={[]} onNavigate={onNavigate} />);

    const hint = screen.getByText('還沒有今天的紀錄。記第一筆：餵奶、睡眠或尿布，點一下就好。');
    await user.click(hint);

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('最上面先回答上次餵奶是多久以前，擠奶不算一餐', () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    const logs: DailyLog[] = [
      {
        id: 'feed',
        childId: 'c1',
        type: 'feeding',
        timestamp: ago(130),
        data: { feedingType: 'breast_left', duration: 15 },
        createdAt: ago(130),
      },
      {
        id: 'pump',
        childId: 'c1',
        type: 'feeding',
        timestamp: ago(20),
        data: { feedingType: 'pumping', amount: 90 },
        createdAt: ago(20),
      },
      {
        id: 'diaper',
        childId: 'c1',
        type: 'diaper',
        timestamp: ago(50),
        data: { type: 'pee' },
        createdAt: ago(50),
      },
    ];
    render(
      <DailyLogSummaryCard
        summary={{ ...emptySummary, feedingCount: 1, diaperCount: 1, peeCount: 1 }}
        dailyLogs={logs}
        onNavigate={() => {}}
      />,
    );

    const feedingLine = screen.getByText(/^上次餵奶/);
    expect(feedingLine).toHaveTextContent('上次餵奶 2 小時 10 分鐘前 · 母乳（左）');
    expect(screen.getByText(/^上次換尿布/)).toHaveTextContent('上次換尿布 50 分鐘前');
    // 在今天的次數之前
    expect(
      feedingLine.compareDocumentPosition(screen.getByText('尿布')) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe('MilestoneSummaryCard', () => {
  it('只說已經會了幾件，不拿整年的清單當分母', () => {
    const { container } = render(
      <MilestoneSummaryCard
        milestoneProgress={{
          m1: { achieved: true, achievedDate: '2026-06-01' },
          m2: { achieved: true, achievedDate: '2026-06-05' },
          m3: { achieved: false },
        }}
        onNavigate={() => {}}
      />,
    );

    expect(screen.getByText(/^已經會了/)).toHaveTextContent('已經會了 2 件');
    expect(container.textContent).not.toMatch(/\d+\s*\/\s*\d+/);
    expect(container.textContent).not.toContain('已達成');
  });
});
