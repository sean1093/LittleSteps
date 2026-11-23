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

/**
 * The start to use once a parent is looking at `day`: unchanged while `day` is
 * inside the window, otherwise early enough to cover it with room to keep
 * paging. It only ever moves earlier.
 */
export function widenLogWindow(since: string, day: Date): string {
  if (startOfLocalDay(day).toISOString() >= since) return since;
  return daysBefore(day, WIDEN_MARGIN_DAYS).toISOString();
}
