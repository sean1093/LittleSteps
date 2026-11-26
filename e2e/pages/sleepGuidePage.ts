import type { Locator, Page } from '@playwright/test';
import { ROUTE_PATH } from '../../src/types/routes';

/**
 * The sleep guide. Public, static, and the largest of the two guides: five
 * datasets render into one page.
 *
 * Selectors and navigation only; the assertions live in the specs (plan §9).
 */
export class SleepGuidePage {
  readonly main: Locator;

  /**
   * The bedtime-ritual steps: the items of the page's one ordered list. They
   * used to be checkboxes whose ticks were lost on reload; they are steps to
   * follow now, in order, so the list semantics are what identify them.
   */
  readonly ritualSteps: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.ritualSteps = this.main.locator('ol > li');
  }

  /** A card title — a sleep-stage range, a safety rule, a training method. */
  cardTitle(name: string): Locator {
    return this.main.getByRole('heading', { level: 3, name });
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTE_PATH['littlesteps/sleep-training']);
  }
}
