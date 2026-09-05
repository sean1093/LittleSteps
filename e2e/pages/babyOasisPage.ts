import type { Locator, Page } from '@playwright/test';
import { ROUTE_PATH } from '../../src/types/routes';
import { MAP_CLUSTER_TESTID, MAP_TESTID, SCROLL_ROW } from '../fixtures/testIds';

/**
 * BabyOasis — the nursing-room map.
 *
 * Selectors and navigation only; the assertions live in the specs, so a reader
 * can see what is being claimed without opening a second file (plan §9).
 */
export class BabyOasisPage {
  readonly search: Locator;
  readonly map: Locator;
  readonly cluster: Locator;
  readonly filterRow: Locator;

  constructor(private readonly page: Page) {
    // `aria-label="搜尋哺乳室"` on an `input type="search"`, so the accessible
    // name carries this on its own — no testid needed or wanted.
    this.search = page.getByRole('searchbox', { name: '搜尋哺乳室' });
    this.map = page.getByTestId(MAP_TESTID);
    this.cluster = page.getByTestId(MAP_CLUSTER_TESTID);
    this.filterRow = page.getByTestId(SCROLL_ROW.oasisFilters);
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTE_PATH.babyoasis);
  }
}
