import { expect, test } from '../fixtures/test';
import { GATED_ROUTES, PUBLIC_ROUTES, pathOf } from '../fixtures/routes';
import { PublicRoutePage } from '../pages/publicRoutePage';

/**
 * BUNDLE-01, BUNDLE-02 — what a signed-out visit downloads.
 *
 * The public pages never read the database, and the database SDK was the
 * largest single thing in their first load. It now lives in a chunk of its
 * own that only signed-in code imports (`src/lib/database.ts` has the
 * reasoning). Nothing else notices if that stops being true: one static import
 * of a data hook anywhere on a public page's path puts the SDK back, the app
 * behaves identically, and every unit test stays green.
 *
 * So this asks the browser what the page fetched. `performance` resource
 * entries belong to the document, which is the point: the service worker
 * precaches every chunk in the background, in its own scope, and those fetches
 * must not count against the page.
 */

/** The chunk name `manualChunks` in `vite.config.ts` gives the database SDK. */
const DATABASE_CHUNK = /\/assets\/firebase-database-[\w-]+\.js$/;

test('BUNDLE-01 @p0 the build still emits the database SDK as a chunk of its own', async ({
  request,
}) => {
  // The non-vacuity half of BUNDLE-02. If the chunk were renamed, or folded
  // back into another one, "no page fetched firebase-database-*" would be true
  // of every page forever and would say nothing.
  const response = await request.get('/sw.js');
  expect(response.status()).toBe(200);

  const precached = (await response.text()).match(/assets\/[\w.-]+\.js/g) ?? [];
  expect(
    precached.filter((url) => DATABASE_CHUNK.test(`/${url}`)),
    'no firebase-database chunk in the precache manifest',
  ).toHaveLength(1);
});

for (const route of PUBLIC_ROUTES) {
  test(`BUNDLE-02 @p0 ${route} does not download the database SDK signed out`, async ({
    page,
  }) => {
    const routes = new PublicRoutePage(page);
    await routes.goto(route);
    await expect(routes.ready(route)).toBeVisible();
    // Past first paint: a chunk requested from an effect or an idle callback
    // is still this page's download.
    await page.waitForLoadState('networkidle');

    const scripts = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .map((entry) => new URL(entry.name).pathname)
        .filter((path) => path.endsWith('.js')),
    );

    // The page did load scripts, so an empty list below is not the answer.
    expect(scripts.length).toBeGreaterThan(0);
    expect(scripts.filter((path) => DATABASE_CHUNK.test(path))).toEqual([]);
  });
}

test('BUNDLE-02 @p0 a gated route shows its intro signed out without the database SDK either', async ({
  page,
}) => {
  // A signed-out visitor on a private URL gets the service's intro page at
  // that URL. It reads nothing, so it should cost nothing: one gated route per
  // service is enough to cover the three intro pages.
  for (const route of ['littlesteps/daily-log', 'littlebloom/prenatal', 'littleexplorer/diary']) {
    expect(GATED_ROUTES, `${route} is no longer a gated route`).toContain(route);
    await page.goto(pathOf(route as (typeof GATED_ROUTES)[number]));
    await page.waitForLoadState('networkidle');

    const scripts = await page.evaluate(() =>
      performance.getEntriesByType('resource').map((entry) => new URL(entry.name).pathname),
    );
    expect(scripts.filter((path) => DATABASE_CHUNK.test(path))).toEqual([]);
  }
});
