import type { Locator, Page as BrowserPage } from '@playwright/test';
import { ROUTE_PATH } from '../../src/types/routes';
import { SERVICE_THEME, type ServiceId } from '../../src/common/ui/serviceTheme';

/**
 * The entry point at `/` — the hub that lists all six services.
 *
 * Selectors and navigation only; the assertions live in the specs (plan §9).
 *
 * The role names come from `SERVICE_THEME` rather than being retyped, per the
 * plan's §6 rule against a second vocabulary. Importing it is safe: it is a
 * palette table whose only runtime dependency is `lucide-react`'s icon
 * components, which are never rendered here.
 */
export class HubPage {
  /**
   * The landing page's headline, and the only `h1` on the page: its brand bar
   * shows the wordmark as plain text, not as a heading.
   */
  readonly title: Locator;

  /**
   * The control that returns to the hub, on every service's own chrome.
   *
   * It lives on the six service pages rather than on the hub, but it belongs
   * here: it is the hub's entry point, and putting one copy on the hub's page
   * object keeps the six pages from each needing a page object of their own
   * just to name it.
   */
  readonly returnToHub: Locator;

  constructor(private readonly page: BrowserPage) {
    this.title = page.getByRole('heading', { level: 1 });
    this.returnToHub = page.getByRole('button', { name: '所有服務' });
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTE_PATH.home);
  }

  /**
   * One service's entry. Each is a real link wrapping a heading that names the
   * service by its role, so the link is found through that heading rather than
   * through its accessible name, which for a tool starts with its figure
   * (`3,852 處`) and for a stage with its age range. The role is what tells
   * the six apart; the English code names are not on the page.
   */
  card(service: ServiceId): Locator {
    return this.page.getByRole('link').filter({
      has: this.page.getByRole('heading', {
        level: 3,
        name: SERVICE_THEME[service].role,
        exact: true,
      }),
    });
  }
}
