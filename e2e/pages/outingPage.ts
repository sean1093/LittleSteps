import type { Locator, Page } from '@playwright/test';
import { ROUTE_PATH } from '../../src/types/routes';
import { SCROLL_ROW } from '../fixtures/testIds';

/**
 * LittleOuting — family centres, child-friendly restaurants and the checklist.
 *
 * Selectors and navigation only; the assertions live in the specs (plan §9).
 *
 * Every chip here is matched exactly. Substring matching is the default, and
 * 124 of the 234 family centres carry 親子館 in their own name, so a loose
 * match on the 親子館 tab also matches every report button in the list.
 */
export class OutingPage {
  readonly centreTab: Locator;
  readonly restaurantTab: Locator;
  readonly checklistTab: Locator;
  readonly centreSearch: Locator;
  readonly restaurantSearch: Locator;
  readonly clearSearch: Locator;
  readonly cityRow: Locator;
  readonly allCitiesChip: Locator;
  readonly resultCount: Locator;
  readonly loadFailedTitle: Locator;
  readonly checklistQuestions: Locator;

  constructor(private readonly page: Page) {
    this.centreTab = page.getByRole('button', { name: '親子館', exact: true });
    this.restaurantTab = page.getByRole('button', { name: '親子餐廳', exact: true });
    this.checklistTab = page.getByRole('button', { name: '出發前', exact: true });
    // One search box, renamed with the view it is searching.
    this.centreSearch = page.getByRole('searchbox', { name: '搜尋親子館' });
    this.restaurantSearch = page.getByRole('searchbox', { name: '搜尋親子餐廳' });
    this.clearSearch = page.getByRole('button', { name: '清除搜尋' });
    this.cityRow = page.getByTestId(SCROLL_ROW.outingCities);
    this.allCitiesChip = page.getByRole('button', { name: '全部縣市', exact: true });
    // The header states the total; the list itself renders at most thirty cards.
    this.resultCount = page.getByText(/^共 \d+ 處/);
    this.loadFailedTitle = page.getByRole('heading', { name: '親子館資料載入失敗' });
    // On the 出發前 tab the checklist cards are the only level-3 headings, so
    // this counts the items rendered without binding to `.card`.
    this.checklistQuestions = page.getByRole('heading', { level: 3 });
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTE_PATH.littleouting);
  }

  /** A county chip in the scrolling row above the list. */
  cityChip(city: string): Locator {
    return this.cityRow.getByRole('button', { name: city, exact: true });
  }

  /** The panel of entry rules for the selected county, by its heading. */
  accessHeading(city: string): Locator {
    return this.page.getByRole('heading', { name: `${city}的使用規則` });
  }

  /** A venue card, by the name it is headed with. */
  venueCard(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }
}
