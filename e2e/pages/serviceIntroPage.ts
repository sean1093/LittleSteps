import type { Locator, Page as BrowserPage } from '@playwright/test';
import { ROUTE_PATH, type Page } from '../../src/types/routes';
import { serviceOf } from '../../src/common/routePolicy';
import { SERVICE_THEME } from '../../src/common/ui/serviceTheme';

/**
 * What a signed-out visitor gets on a route that requires signing in: that
 * service's own intro page, rendered **at the same URL**.
 *
 * `landingKindFor` picks `service-intro` for exactly these
 * routes, so this one page object covers all fifteen of them.
 *
 * Selectors and navigation only; the assertions live in the specs (plan §9).
 */
export class ServiceIntroPage {
  /**
   * The sign-in call to action, and the marker that says a visitor was
   * blocked.
   *
   * All three intro pages share `ServiceIntro` and one label, 使用 Google
   * 登入，開始記錄. The landing page also offers sign-in, and words its button
   * differently on purpose (使用 Google 帳號開始記錄): AUTH-03 asserts this
   * locator matches nothing on a public route, and the landing page is one.
   */
  readonly signIn: Locator;

  /**
   * Content that only exists once a child's record is on screen — the
   * two-sided oracle's negative half for AUTH-02.
   *
   * "No child data" has no locator of its own, so this is a fixed list of the
   * things a leak would put on the page, one per gated feature the catalogue
   * names: the daily log's quick-record buttons, the growth chart panel, a
   * vaccine dose control and a milestone toggle.
   *
   * The growth chart is matched by its own heading rather than by an `svg`
   * element selector: every Lucide icon in the app is an `svg` too, so `svg`
   * would match on any page and assert nothing.
   */
  readonly gatedContent: Locator[];

  constructor(private readonly page: BrowserPage) {
    this.signIn = page.getByRole('button', { name: /^使用 Google 登入/ });
    this.gatedContent = [
      page.getByRole('button', { name: '餵奶' }),
      page.getByRole('heading', { name: /成長曲線圖/ }),
      page.getByRole('button', { name: /記錄接種日期$/ }),
      page.getByRole('button', { name: /^(會了|已經會了，取消)$/ }),
    ];
  }

  async goto(route: Page): Promise<void> {
    await this.page.goto(ROUTE_PATH[route]);
  }

  /**
   * The intro heading for the service that owns this route.
   *
   * Derived through `serviceOf` and `SERVICE_THEME` rather than mapping paths
   * to wordmarks by hand. `serviceOf` returns null for `home` and `about`,
   * which are public and never reach an intro page, and for `join`, the share
   * link's confirm screen: it belongs to no service because one link may be a
   * baby's record or a pregnancy's, so its signed-out page is its own intro
   * (`JoinIntro`), titled by its AppBar.
   */
  heading(route: Page): Locator {
    if (route === 'join') {
      return this.page.getByRole('heading', { name: '加入家人的紀錄', exact: true });
    }
    const service = serviceOf(route);
    if (!service) throw new Error(`no service owns ${route}, so it has no intro page`);
    return this.page.getByRole('heading', { name: SERVICE_THEME[service].role, exact: true });
  }
}
