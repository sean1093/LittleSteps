import { describe, expect, it } from 'vitest';
import { LOG_WINDOW_DAYS, logWindowStart, widenLogWindow } from './logWindow';

const DAY = 24 * 60 * 60 * 1000;

describe('logWindowStart', () => {
  it('is the same for every listener opened on the same day', () => {
    // The shell and the day view each hold a listener, and Realtime Database
    // only shares one between identical queries.
    const morning = logWindowStart(new Date(2026, 10, 23, 7, 5));
    const night = logWindowStart(new Date(2026, 10, 23, 23, 59));

    expect(night).toBe(morning);
  });

  it('starts at local midnight, LOG_WINDOW_DAYS before today', () => {
    const start = new Date(logWindowStart(new Date(2026, 10, 23, 15, 30)));

    expect([start.getHours(), start.getMinutes(), start.getSeconds()]).toEqual([0, 0, 0]);
    const today = new Date(2026, 10, 23);
    expect(Math.round((today.getTime() - start.getTime()) / DAY)).toBe(LOG_WINDOW_DAYS);
  });

  it('is the fixed-width UTC form the query sorts as text', () => {
    // The whole design rests on this string comparing in time order.
    expect(logWindowStart()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('covers the longest lookback any screen uses, with room to spare', () => {
    // The monthly report reads 30 days. A window that only just covered it
    // would put the edge inside the thing being computed.
    expect(LOG_WINDOW_DAYS).toBeGreaterThanOrEqual(60);
  });
});

describe('widenLogWindow', () => {
  const since = logWindowStart(new Date(2026, 10, 23));

  it('leaves the window alone for a day inside it', () => {
    expect(widenLogWindow(since, new Date(2026, 10, 1))).toBe(since);
    expect(widenLogWindow(since, new Date(2026, 10, 23, 18, 0))).toBe(since);
  });

  it('keeps the first day of the window inside it', () => {
    const firstDay = new Date(since);

    expect(widenLogWindow(since, firstDay)).toBe(since);
  });

  it('moves the start early enough to show a day before the window', () => {
    const day = new Date(2026, 3, 2, 14, 0);
    const widened = widenLogWindow(since, day);

    expect(widened < since).toBe(true);
    // A log from any moment of that day is inside the new window.
    expect(new Date(2026, 3, 2, 0, 0, 1).toISOString() >= widened).toBe(true);
  });

  it('leaves room to keep paging back without asking again each day', () => {
    const day = new Date(2026, 3, 2);
    const widened = widenLogWindow(since, day);

    const previousDay = new Date(2026, 3, 1);
    expect(widenLogWindow(widened, previousDay)).toBe(widened);
  });

  it('never moves the start later', () => {
    const early = widenLogWindow(since, new Date(2026, 0, 5));

    expect(widenLogWindow(early, new Date(2026, 10, 20))).toBe(early);
  });
});
