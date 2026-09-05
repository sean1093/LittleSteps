import type { Locator, Page } from '@playwright/test';
import { ROUTE_PATH, type Page as RoutePage } from '../../src/types/routes';
import { requiresAuth } from '../../src/common/routePolicy';
import { BabyOasisPage } from './babyOasisPage';
import { CareGuidePage } from './careGuidePage';
import { OutingPage } from './outingPage';
import { SleepGuidePage } from './sleepGuidePage';
import { WikiBrowserPage } from './wikiBrowserPage';

/**
 * Every route a signed-out parent can reach, with the locator that says its
 * content is on screen.
 *
 * One index rather than one page object per route (plan §9): the cases that
 * use it — the layout invariants and the console-error sweep — assert the same
 * thing about all nine, and a list is the only shape in which "a route nobody
 * classified" can fail loudly instead of being quietly skipped.
 *
 * The set is **derived** from `requiresAuth`, not typed out, for the reason
 * AUTH-04 gives: a route added without being classified must fail a case
 * rather than slip past one. `routePolicy.ts` imports nothing at runtime, so a
 * spec can read it directly.
 *
 * `ready` is what separates "the shell painted" from "the page rendered", and
 * every measurement waits on it. Three of the nine fetch their data at
 * runtime, so for those it is a locator that exists only after the fetch
 * resolves; for the rest it is the first row of the real content, never the
 * `AppBar`, which renders while the lazy chunk is still loading.
 */
export interface PublicRoute {
  page: RoutePage;
  path: string;
  ready: (page: Page) => Locator;
}

const READY: Partial<Record<RoutePage, (page: Page) => Locator>> = {
  // The hub has no `AppBar`, so its `h1` is the only one on the page.
  home: (page) => page.getByRole('heading', { level: 1 }),
  'littlesteps/baby-wiki': (page) =>
    new WikiBrowserPage(page, 'littlesteps/baby-wiki').articles.first(),
  'littlesteps/care-guide': (page) => new CareGuidePage(page).cardTitles.first(),
  'littlesteps/sleep-training': (page) => new SleepGuidePage(page).ritualSteps.first(),
  'littlebloom/wiki': (page) => new WikiBrowserPage(page, 'littlebloom/wiki').articles.first(),
  'littleexplorer/wiki': (page) =>
    new WikiBrowserPage(page, 'littleexplorer/wiki').articles.first(),
  // Renders on a family-centre card, so it waits for `familyCentres.json`.
  littleouting: (page) => new OutingPage(page).reportButtons.first(),
  // The search input renders once the 1.1 MB nursing-room dataset has arrived.
  babyoasis: (page) => new BabyOasisPage(page).search,
  // The board's own explainer: it renders only with data *and* a county whose
  // cells resolved, which is the state the rest of the page is measured in.
  littleguard: (page) => page.getByRole('heading', { name: '怎麼看這個板' }),
};

export const PUBLIC_ROUTES: PublicRoute[] = (Object.keys(ROUTE_PATH) as RoutePage[])
  .filter((page) => !requiresAuth(page))
  .map((page) => {
    const ready = READY[page];
    if (!ready) {
      throw new Error(
        `${page} is public but has no readiness locator: add one to e2e/pages/publicRoutes.ts`,
      );
    }
    return { page, path: ROUTE_PATH[page], ready };
  });
