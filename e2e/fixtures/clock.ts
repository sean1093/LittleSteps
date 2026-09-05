import type { Page } from '@playwright/test';

/** Pins the page's wall clock. Supplied to specs as the `pinClock` fixture. */
export type PinClock = (time: Date | string) => Promise<void>;

/**
 * Fix `Date.now()` and `new Date()` without freezing timers.
 *
 * `page.clock.install()` would also fake `setTimeout`, which stalls Framer
 * Motion and anything else waiting on a frame; `setFixedTime` leaves the
 * timers running and only lies about what time it is, which is the whole of
 * what a date-dependent assertion needs.
 *
 * Call it before `goto`: the LittleGuard board reads the clock while it
 * renders, so pinning afterwards changes nothing that is already on screen.
 */
export async function pinClockOn(page: Page, time: Date | string): Promise<void> {
  await page.clock.setFixedTime(new Date(time));
}

/**
 * `days` after `iso`, for pinning relative to a fixture's own `weekEnd` rather
 * than to a calendar date. The disease radar's freshness thresholds are 14 and
 * 35 days past `weekEnd`, and `public/data/diseaseRadar.json` is refreshed by
 * hand — a suite pinned to a literal date goes red roughly five weeks after
 * every refresh, for no product reason.
 */
export function daysAfter(iso: string, days: number): Date {
  const base = new Date(iso);
  if (Number.isNaN(base.getTime())) throw new Error(`daysAfter: not a date: ${iso}`);
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}
