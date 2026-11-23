import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChildProfile } from '../../types';
import { LOG_WINDOW_DAYS, logWindowStart } from '../logWindow';
import DailyLogPage from './DailyLogPage';

/**
 * The day view and the window its listener covers.
 *
 * The listener reads the last `LOG_WINDOW_DAYS` days, not the whole log. The
 * day view is the one screen that can show an older day, and when it does the
 * listener has to reach that day: otherwise the page filters a set that cannot
 * contain it and reports "no records this day" for a day that has some.
 */

const h = vi.hoisted(() => ({ asked: [] as (string | undefined)[] }));

vi.mock('../hooks/useDailyLogs', () => ({
  useDailyLogs: (_childId: string | null, _user: unknown, since?: string) => {
    h.asked.push(since);
    return { logs: [], loading: false, error: false };
  },
}));

vi.mock('../../common/hooks/useFirebaseChildren', () => ({
  useFirebaseChildren: () => ({
    addDailyLog: vi.fn(),
    updateDailyLog: vi.fn(),
    deleteDailyLog: vi.fn(),
  }),
}));

const child: ChildProfile = {
  id: 'c1',
  name: 'Momo',
  birthday: '2025-02-01',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2025-02-01T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
};

const pageBack = (days: number) => {
  for (let i = 0; i < days; i += 1) {
    fireEvent.click(screen.getByRole('button', { name: '前一天' }));
  }
};

const distinct = () => h.asked.filter((since, index) => since !== h.asked[index - 1]);

/** Local midnight `days` before today, as the page computes the shown day. */
const startOfDayAgo = (days: number) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - days).toISOString();
};

beforeEach(() => {
  h.asked.length = 0;
});

describe('DailyLogPage and the log window', () => {
  it('opens on the default window', () => {
    render(<DailyLogPage currentChild={child} user={null} />);

    expect(distinct()).toEqual([logWindowStart()]);
  });

  it('keeps the same listener while paging through days inside the window', () => {
    render(<DailyLogPage currentChild={child} user={null} />);

    pageBack(LOG_WINDOW_DAYS);

    // The first day of the window is still inside it: one query throughout.
    expect(distinct()).toEqual([logWindowStart()]);
  });

  it('reaches further back once the day shown is before the window', () => {
    render(<DailyLogPage currentChild={child} user={null} />);

    pageBack(LOG_WINDOW_DAYS + 1);

    const asked = distinct();
    expect(asked).toHaveLength(2);
    const widened = asked[1] as string;
    // The day on screen is covered by what the listener now asks for.
    expect(startOfDayAgo(LOG_WINDOW_DAYS + 1) >= widened).toBe(true);
  });

  it('does not ask again for every further day, and never narrows on the way forward', () => {
    render(<DailyLogPage currentChild={child} user={null} />);
    pageBack(LOG_WINDOW_DAYS + 1);
    const widened = distinct()[1];

    pageBack(10);
    for (let i = 0; i < 30; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: '後一天' }));
    }

    expect(distinct()).toEqual([logWindowStart(), widened]);
  });
});
