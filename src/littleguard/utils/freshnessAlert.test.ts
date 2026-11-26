import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { FRESHNESS_DAYS, freshnessOf } from './radar';

/**
 * The scheduled workflow that opens the "data is stale" issue lives in a
 * CommonJS script outside src/, with its own copy of the threshold. This pins
 * it to the board's: on any day, the issue exists exactly when the page shows
 * a stale or expired banner.
 */

interface FreshnessScript {
  STALE_DAYS: number;
  isStale: (weekEnd: string, today: Date) => boolean;
}

const script = createRequire(import.meta.url)(
  '../../../scripts/checkDiseaseRadarFreshness.cjs',
) as FreshnessScript;

describe('the stale-data issue and the board agree', () => {
  it('uses the same threshold', () => {
    expect(script.STALE_DAYS).toBe(FRESHNESS_DAYS.stale);
  });

  it('calls a day stale exactly when the board stops calling it fresh', () => {
    const weekEnd = '2026-08-29';
    for (let offset = 0; offset <= 60; offset += 1) {
      const today = new Date(Date.UTC(2026, 7, 29 + offset, 15));
      expect(script.isStale(weekEnd, today)).toBe(freshnessOf(weekEnd, today) !== 'fresh');
    }
  });
});
