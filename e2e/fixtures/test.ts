import { expect, test as base } from '@playwright/test';
import { blockThirdPartyHosts } from './blockedHosts';
import { pinClockOn, type PinClock } from './clock';

interface Fixtures {
  /**
   * Pin the wall clock. Must be called before the navigation whose rendering
   * depends on the date — see `./clock`.
   */
  pinClock: PinClock;
}

/**
 * The test object every spec imports instead of `@playwright/test`.
 *
 * It overrides `page` so third-party hosts are blocked before a spec can
 * navigate anywhere; forgetting that is not a class of failure worth having.
 */
export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    await blockThirdPartyHosts(page);
    await use(page);
  },

  pinClock: async ({ page }, use) => {
    await use((time) => pinClockOn(page, time));
  },
});

export { expect };
