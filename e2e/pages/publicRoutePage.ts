import type { Locator, Page as BrowserPage } from '@playwright/test';
import { ROUTE_PATH, type Page } from '../../src/types/routes';

/**
 * The nine routes a visitor reaches without an account.
 *
 * Selectors and navigation only; the assertions live in the specs (plan §9).
 *
 * One locator per route, naming content that belongs to *that* page. The
 * wordmark in the header is deliberately not used: `/littleexplorer/wiki`
 * renders `LittleExplorer` in its `AppBar`, and so does the LittleExplorer
 * intro page a blocked visitor would see instead — a marker that cannot tell
 * the real page from the intro page is not a marker for AUTH-03.
 */
export class PublicRoutePage {
  constructor(private readonly page: BrowserPage) {}

  async goto(route: Page): Promise<void> {
    await this.page.goto(ROUTE_PATH[route]);
  }

  /** Content only the real page at `route` renders. */
  content(route: Page): Locator {
    const marker = CONTENT[route];
    if (!marker) throw new Error(`${route} is not a public route, so it has no content marker`);
    return marker(this.page);
  }
}

/**
 * Traditional Chinese appears here because these strings are the literal UI
 * copy a selector matches — the one thing `e2e/README.md` keeps in Chinese.
 * None has a canonical constant in `src/` to import instead; each is written
 * inline in the page that renders it.
 */
const CONTENT: Partial<Record<Page, (page: BrowserPage) => Locator>> = {
  // The hub's first group heading. It answers the question the page exists to
  // answer — which of the six services is mine — so it is the last thing that
  // would survive the page being replaced by something else.
  home: (page) => page.getByRole('heading', { name: '依孩子的階段' }),

  'littlesteps/care-guide': (page) => page.getByRole('heading', { name: '按月齡照顧重點' }),
  'littlesteps/sleep-training': (page) => page.getByRole('heading', { name: '睡眠時間參考表' }),
  // `WikiBrowser`'s search box carries no `aria-label`, so its placeholder is
  // its accessible name.
  'littlesteps/baby-wiki': (page) => page.getByRole('searchbox', { name: '搜尋症狀、關鍵字...' }),
  // `BloomShell` puts the page's own title in the `AppBar`, not the wordmark.
  'littlebloom/wiki': (page) => page.getByRole('heading', { name: '孕期知識庫' }),
  'littleexplorer/wiki': (page) => page.getByRole('heading', { name: '依年齡看' }),
  littleouting: (page) => page.getByRole('searchbox', { name: '搜尋親子館' }),
  babyoasis: (page) => page.getByRole('searchbox', { name: '搜尋哺乳室' }),
  // The age-band picker, which renders only once the radar's own data file has
  // arrived — so this also says the page reached its content, not just its
  // shell.
  littleguard: (page) => page.getByRole('heading', { name: '孩子的年齡' }),
};
