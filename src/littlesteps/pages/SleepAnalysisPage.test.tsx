import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ChildProfile, DailyLog } from '../../types';
import SleepAnalysisPage from './SleepAnalysisPage';
import { useDailyLogs } from '../hooks/useDailyLogs';

/**
 * 這一頁原本把「視窗長度」當分母：一晚 10 小時除以 7 天，畫面寫每日平均
 * 1.4 小時，旁邊再對照建議的 13 小時，於是每個剛開始記錄的家長都被告知
 * 寶寶嚴重睡眠不足。分母應該是有記錄的天數。
 */

vi.mock('../hooks/useDailyLogs', () => ({
  useDailyLogs: vi.fn(),
}));

const child: ChildProfile = {
  id: 'c1',
  name: '小豆',
  birthday: '2026-02-01',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2026-02-01T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
};

const sleepLog = (daysAgo: number, hours: number): DailyLog => {
  const start = new Date();
  start.setDate(start.getDate() - daysAgo);
  start.setHours(21, 0, 0, 0);
  const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

  return {
    id: `s-${daysAgo}`,
    childId: 'c1',
    type: 'sleep',
    timestamp: start.toISOString(),
    data: {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: hours * 60,
    },
    createdAt: start.toISOString(),
  };
};

const withLogs = (logs: DailyLog[]) =>
  vi.mocked(useDailyLogs).mockReturnValue({ logs, loading: false, error: false });

const renderPage = () => render(<SleepAnalysisPage currentChild={child} user={null} />);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('睡眠分析的分母', () => {
  it('一晚 10 小時的每日平均就是 10 小時，不是除以七天', () => {
    withLogs([sleepLog(1, 10)]);
    renderPage();

    // 除以七天會寫成 1.4h，而那一晚實際睡了 10 小時。
    expect(screen.queryByText('1.4h')).toBeNull();
    expect(screen.getAllByText('10.0h').length).toBeGreaterThan(0);
    expect(screen.getByText('1 天有記錄')).toBeInTheDocument();
  });

  it('選到的期間沒有記錄時不畫長條圖，也不寫 0 小時', () => {
    // 兩個月前記過，所以整頁不是空的；但「本週」這個視窗裡什麼都沒有。
    withLogs([sleepLog(60, 10)]);
    renderPage();

    expect(screen.getByText('這段時間還沒有睡眠記錄')).toBeInTheDocument();
    expect(screen.queryByText('睡眠時長對比')).toBeNull();
    expect(screen.queryByText('0.0h')).toBeNull();
  });
});

/*
  睡眠建議看的是發展，早產兒要用矯正年齡。32 週出生、實際 7 個月的寶寶矯正後
  才 5 個月：用實際月齡的話，這一頁會拿 6-12 個月的範圍去對照，「6 個月以上一天
  睡 3-4 次」的建議也會對一個矯正 5 個月的孩子說話。
*/
describe('早產兒的睡眠建議用矯正年齡', () => {
  const NOW = new Date(2026, 10, 26, 12); // 2026-11-26 12:00

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // 實際 7 個月又 10 天。
  const sevenMonthOld = (gestationalAgeWeeks?: number): ChildProfile => ({
    ...child,
    birthday: '2026-04-16',
    gestationalAgeWeeks,
  });

  // 今天上午的六次小睡：每日睡眠次數 6，超過「6 個月以上」那條建議的門檻 5。
  const sixNaps = (): DailyLog[] =>
    Array.from({ length: 6 }, (_, i) => {
      const start = new Date(2026, 10, 26, 4 + i);
      const end = new Date(start.getTime() + 40 * 60_000);
      return {
        id: `nap-${i}`,
        childId: 'c1',
        type: 'sleep',
        timestamp: start.toISOString(),
        data: { startTime: start.toISOString(), endTime: end.toISOString(), duration: 40 },
        createdAt: start.toISOString(),
      };
    });

  it('32 週出生、實際 7 個月：對照矯正 5 個月的範圍並說明是矯正年齡', () => {
    withLogs(sixNaps());
    render(<SleepAnalysisPage currentChild={sevenMonthOld(32)} user={null} />);

    expect(screen.getByText('依矯正年齡 5 個月建議：12-17 小時')).toBeInTheDocument();
    expect(screen.queryByText(/12-16 小時/)).toBeNull();
    expect(screen.queryByText('睡眠次數較多')).toBeNull();
  });

  it('足月的同齡寶寶照實際月齡，不標矯正', () => {
    withLogs(sixNaps());
    render(<SleepAnalysisPage currentChild={sevenMonthOld()} user={null} />);

    expect(screen.getByText('7 個月大寶寶建議：12-16 小時')).toBeInTheDocument();
    expect(screen.queryByText(/依矯正年齡/)).toBeNull();
    expect(screen.getByText('睡眠次數較多')).toBeInTheDocument();
  });
});
