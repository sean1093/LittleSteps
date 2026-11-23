import type { Locator, Page as BrowserPage } from '@playwright/test';
import { ROUTE_PATH } from '../../src/types/routes';
import { SERVICE_THEME, type ServiceId } from '../../src/common/ui/serviceTheme';

/**
 * The entry point at `/` — the hub that lists all six services.
 *
 * Selectors and navigation only; the assertions live in the specs (plan §9).
 *
 * The wordmarks come from `SERVICE_THEME` rather than being retyped, per the
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
   * One service's card. The whole row is the tap target (`pressable` gives it
   * `role="button"`), so its accessible name is the role label followed by the
   * wordmark and the description — anchored to the role here because the
   * card leads with it: the suite and the 0-12 month service share the
   * wordmark LittleSteps, and the role is what tells the six apart.
   */
  card(service: ServiceId): Locator {
    return this.page.getByRole('button', {
      name: new RegExp(`^${SERVICE_THEME[service].role}`),
    });
  }
}
