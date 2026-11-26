import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ChildProfile, DailyLog } from '../../types';
import DashboardPage from './DashboardPage';

/**
 * The dashboard's alerts are about development, so a preterm baby is judged
 * at the corrected age. The feed-gap alert stops at 3 months; on the
 * chronological age a 32-weeker lost it while still under 2 months corrected.
 */

// The food card's listener reads the database; the alerts do not.
vi.mock('../hooks/useFoodTracking', () => ({
  useFoodTracking: () => ({ stats: null }),
}));
vi.mock('../components/food/FoodTrackingSummaryCard', () => ({ default: () => null }));

const NOW = new Date(2026, 10, 26, 12); // 2026-11-26 12:00

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

const hoursAgo = (hours: number) => new Date(NOW.getTime() - hours * 3_600_000).toISOString();

// Four months old by the calendar.
const baby = (gestationalAgeWeeks?: number): ChildProfile => ({
  id: 'c1',
  name: '小豆',
  birthday: '2026-07-26',
  gestationalAgeWeeks,
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2026-07-26T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
});

// Last feed 7 hours ago, and a diaper since: the parent is still logging.
const logs: DailyLog[] = [
  {
    id: 'f1',
    childId: 'c1',
    type: 'feeding',
    timestamp: hoursAgo(7),
    data: { feedingType: 'formula', amount: 120 },
    createdAt: hoursAgo(7),
  },
  {
    id: 'd1',
    childId: 'c1',
    type: 'diaper',
    timestamp: hoursAgo(1),
    data: { type: 'pee' },
    createdAt: hoursAgo(1),
  },
];

const renderFor = (child: ChildProfile) =>
  render(<DashboardPage currentChild={child} dailyLogs={logs} user={null} onNavigate={vi.fn()} />);

describe('DashboardPage alerts and corrected age', () => {
  it('keeps the 6-hour feed-gap alert for a 32-weeker at 4 actual, 2 corrected months', () => {
    renderFor(baby(32));
    expect(screen.getByText('距離上次餵奶已超過 6 小時')).toBeInTheDocument();
  });

  it('does not raise it for a term baby of the same age', () => {
    renderFor(baby());
    expect(screen.queryByText('距離上次餵奶已超過 6 小時')).not.toBeInTheDocument();
  });
});

/*
  The sleep card's recommended hours come from the same corrected age as the
  alerts and the sleep analysis page, so every screen that says how old the
  baby is says the same number. Four months actual is 2 months corrected for a
  32-weeker: 14-17 hours, not the 3-6-month band's 12-17.
*/
describe('DashboardPage sleep card and corrected age', () => {
  const nap: DailyLog = {
    id: 's1',
    childId: 'c1',
    type: 'sleep',
    timestamp: hoursAgo(3),
    data: { startTime: hoursAgo(3), endTime: hoursAgo(2), duration: 60 },
    createdAt: hoursAgo(3),
  };
  const renderWithSleep = (child: ChildProfile) =>
    render(
      <DashboardPage currentChild={child} dailyLogs={[...logs, nap]} user={null} onNavigate={vi.fn()} />,
    );

  it('recommends the corrected-age band for a 32-weeker', () => {
    renderWithSleep(baby(32));
    expect(screen.getByText('建議睡眠時數：14-17 小時')).toBeInTheDocument();
  });

  it('leaves a term baby of the same age on the actual-age band', () => {
    renderWithSleep(baby());
    expect(screen.getByText('建議睡眠時數：12-17 小時')).toBeInTheDocument();
  });
});
