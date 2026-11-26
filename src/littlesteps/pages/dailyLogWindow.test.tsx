import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChildProfile } from '../../types';
import { LOG_WINDOW_DAYS, defaultLogWindowStart } from '../logWindow';
import DailyLogPage from './DailyLogPage';

/**
 * The day view and the window its listener covers.
 *
 * The listener reads the last `LOG_WINDOW_DAYS` days, not the whole log. The
 * day view is the one screen that can show an older day, and when it does the
 * listener has to reach that day: otherwise the page filters a set that cannot
 * contain it and reports "no records this day" for a day that has some.
 */

const h = vi.hoisted(() => ({
  asked: [] as (string | undefined)[],
  /** Starts the fake listener has "answered"; any other start is still loading. */
  answered: null as Set<string | undefined> | null,
  addDailyLog: vi.fn(),
}));

vi.mock('../hooks/useDailyLogs', () => ({
  useDailyLogs: (_childId: string | null, _user: unknown, since?: string) => {
    h.asked.push(since);
    const loading = h.answered !== null && !h.answered.has(since);
    return { logs: [], loading, error: false };
  },
}));

vi.mock('../../common/hooks/useFirebaseChildren', () => ({
  useFirebaseChildren: () => ({
    addDailyLog: h.addDailyLog,
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
  h.answered = null;
  h.addDailyLog.mockReset().mockResolvedValue('log-new');
});

/** A `datetime-local` value for noon, `days` before today. */
const noonDaysAgo = (days: number) => {
  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}T12:00`;
};

describe('DailyLogPage and the log window', () => {
  it('opens on the default window', () => {
    render(<DailyLogPage currentChild={child} user={null} />);

    expect(distinct()).toEqual([defaultLogWindowStart()]);
  });

  it('keeps the same listener while paging through days inside the window', () => {
    render(<DailyLogPage currentChild={child} user={null} />);

    pageBack(LOG_WINDOW_DAYS);

    // The first day of the window is still inside it: one query throughout.
    expect(distinct()).toEqual([defaultLogWindowStart()]);
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

    expect(distinct()).toEqual([defaultLogWindowStart(), widened]);
  });

  it('reaches back when a parent saves an entry dated before the window', async () => {
    // The page jumps to the day the entry falls on. Without widening it would
    // land on a day the listener cannot see, and the entry just saved would
    // not be there.
    const user = userEvent.setup();
    render(<DailyLogPage currentChild={child} user={null} />);

    await user.click(screen.getByRole('button', { name: '餵奶' }));
    fireEvent.change(await screen.findByLabelText('時間 *'), {
      target: { value: noonDaysAgo(LOG_WINDOW_DAYS + 20) },
    });
    await user.type(screen.getByLabelText('奶量（ml）'), '90');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(h.addDailyLog).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(distinct()).toHaveLength(2));
    expect(startOfDayAgo(LOG_WINDOW_DAYS + 20) >= (distinct()[1] as string)).toBe(true);
  });

  it('keeps the day control on screen while the wider window is on its way', () => {
    // Only the default window has answered; anything wider is still loading,
    // which is also what an offline phone looks like indefinitely.
    h.answered = new Set([defaultLogWindowStart()]);
    render(<DailyLogPage currentChild={child} user={null} />);

    pageBack(LOG_WINDOW_DAYS + 1);

    // Still there, so the parent can keep paging or come back...
    expect(screen.getByRole('button', { name: '前一天' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '後一天' })).toBeEnabled();
    // ...told that it is loading...
    expect(screen.getByRole('status')).toBeInTheDocument();
    // ...and not offered a one-tap sleep while the open one cannot be seen.
    expect(screen.queryByRole('button', { name: '餵奶' })).toBeNull();
  });

  it('still replaces the whole page on the very first load', () => {
    h.answered = new Set();
    render(<DailyLogPage currentChild={child} user={null} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '前一天' })).toBeNull();
  });
});
