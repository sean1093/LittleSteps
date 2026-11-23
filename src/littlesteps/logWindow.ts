/**
 * How much of a child's daily log the live listener covers.
 *
 * The log grows by a row per feed, sleep and nappy, for as long as the family
 * uses the app: about ten a day, 3,650 a year. Reading it whole meant every
 * family member downloaded all of it each time they opened LittleSteps, and
 * re-ran it through `Object.values()` on every write.
 *
 * Nothing on screen needs more than the last 30 days at once (the monthly
 * report is the longest lookback; the clinic summary and the sleep analysis
 * use 7). The window is three times that, so the edge is never near anything
 * that is being computed. The one screen that reaches further back is the day
 * view, when a parent pages to an older date, and it asks for an earlier start
 * (`widenLogWindow`) rather than for everything.
 *
 * The query orders by `timestamp` as a string. Every writer this app has ever
 * had produced it with `Date.prototype.toISOString()` (checked back to the
 * first commit that wrote a log), which is fixed-width UTC and sorts as text
 * in time order, and `database.rules.json` now refuses anything else.
 *
 * Exporting a child's records does not go through this: it reads the whole
 * collection once, on purpose.
 *
 * What the window changes on screen, all at the far edge:
 * - "Latest ever" lookups see the window, not all time: the last feed and
 *   nappy that pre-fill the form and feed "repeat last", the "no poop for N
 *   hours" and "no feed for N hours" alerts, the sleep analysis's "no sleep
 *   recorded yet". A family with no log of that kind in 90 days gets the same
 *   answer as a family that never logged one.
 * - A sleep left open more than 90 days ago is not found, so its card does not
 *   show and it does not block starting a new one. It was already flagged as
 *   stale after 14 hours and excluded from every total.
 */
export const LOG_WINDOW_DAYS = 90;

/**
 * How far before the requested day a widened window starts. Paging back one
 * day at a time would otherwise re-subscribe on every tap; with this it does
 * so once a month of paging.
 */
const WIDEN_MARGIN_DAYS = 30;

const startOfLocalDay = (day: Date): Date =>
  new Date(day.getFullYear(), day.getMonth(), day.getDate());

const daysBefore = (day: Date, days: number): Date => {
  const result = startOfLocalDay(day);
  result.setDate(result.getDate() - days);
  return result;
};

/**
 * The default start of the window: local midnight, `LOG_WINDOW_DAYS` ago.
 *
 * Midnight rather than "now minus 90 days" so that every listener opened on
 * the same day asks for the same thing. The shell and the day view each hold
 * one, and Realtime Database shares a listen only between identical queries.
 */
export function logWindowStart(now: Date = new Date()): string {
  return daysBefore(now, LOG_WINDOW_DAYS).toISOString();
}

let pageLoadStart: string | null = null;

/**
 * The default start, worked out once per page load and then reused.
 *
 * Each listener asking for "90 days before today" on its own would agree only
 * until midnight: a PWA left open overnight would have the shell on
 * yesterday's start and a newly opened day view on today's, two different
 * queries and two downloads of nearly the same rows. A day of extra window
 * costs nothing; a second listen costs the whole window again.
 */
export function defaultLogWindowStart(): string {
  pageLoadStart ??= logWindowStart();
  return pageLoadStart;
}

/**
 * The start to use once a parent is looking at `day`: unchanged while `day` is
 * inside the window, otherwise early enough to cover it with room to keep
 * paging. It only ever moves earlier.
 */
export function widenLogWindow(since: string, day: Date): string {
  if (startOfLocalDay(day).toISOString() >= since) return since;
  return daysBefore(day, WIDEN_MARGIN_DAYS).toISOString();
}
