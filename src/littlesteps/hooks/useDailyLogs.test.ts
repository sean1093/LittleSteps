import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from 'firebase/auth';
import { defaultLogWindowStart } from '../logWindow';
import { useDailyLogs } from './useDailyLogs';

/**
 * That the daily-log listener asks the database for a window.
 *
 * Without this, deleting the range from the hook leaves every other test
 * green: the day view's tests replace this hook, and the collection hook's
 * tests pass a range of their own. The app would go back to downloading the
 * whole log, or ignore the start a caller asked for and show "no records" on
 * an old day, with nothing red.
 */

type Asked = { path: string; orderBy?: string; startAt?: string };
const asked: Asked[] = [];

vi.mock('firebase/database', () => ({
  ref: (_db: unknown, path: string) => ({ path }),
  query: (target: { path: string }, order: object, start: object) => ({
    ...target,
    ...order,
    ...start,
  }),
  orderByChild: (child: string) => ({ orderBy: child }),
  startAt: (value: string) => ({ startAt: value }),
  onValue: (target: Asked) => {
    asked.push(target);
    return () => {};
  },
}));

vi.mock('../../lib/database', () => ({ database: {} }));

const user = { uid: 'u1' } as User;

beforeEach(() => {
  asked.length = 0;
});

describe('useDailyLogs', () => {
  it('asks for the default window, ordered by timestamp, not the whole log', () => {
    renderHook(() => useDailyLogs('c1', user));

    expect(asked).toEqual([
      {
        path: 'childRecords/c1/dailyLogs',
        orderBy: 'timestamp',
        startAt: defaultLogWindowStart(),
      },
    ]);
  });

  it('asks from the start a caller gives it', () => {
    renderHook(() => useDailyLogs('c1', user, '2026-01-05T16:00:00.000Z'));

    expect(asked.map((query) => query.startAt)).toEqual(['2026-01-05T16:00:00.000Z']);
  });

  it('gives two listeners opened in one page load the identical question', () => {
    // Realtime Database shares a listen only between identical queries; two
    // different starts would download the window twice.
    renderHook(() => useDailyLogs('c1', user));
    renderHook(() => useDailyLogs('c1', user));

    expect(asked).toHaveLength(2);
    expect(asked[1]).toEqual(asked[0]);
  });
});
