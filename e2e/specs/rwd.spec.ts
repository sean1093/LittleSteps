import { expect, test } from '../fixtures/test';
import {
  expectInViewport,
  expectNoPageOverflow,
  expectRowContainsItsOverflow,
  expectTapTargets,
} from '../fixtures/layout';
import { SCROLL_ROW_SELECTOR } from '../fixtures/testIds';
import { OutingPage } from '../pages/outingPage';
import { PUBLIC_ROUTES } from '../pages/publicRoutes';

/**
 * RWD-01…03 — the layout invariants, at 390px and 320px.
 *
 * Measurements, never golden images (plan §2 and §7). A pixel baseline on a
 * Tailwind app churns on every token change and teaches a reviewer to accept
 * the diff; these three assert what a parent actually hits — a page that
 * scrolls sideways, a control too small to tap, an action under the fold —
 * and they survive a restyle that broke nothing.
 *
 * One test per route rather than one loop over all nine: the route is then in
 * the failure's title, and a broken page fails once instead of hiding the
 * eight behind it.
 */

for (const route of PUBLIC_ROUTES) {
  test(`RWD-01 @p1 ${route.page} keeps its horizontal overflow off the page body`, async ({
    page,
  }) => {
    await page.goto(route.path);
    await expect(route.ready(page)).toBeVisible();

    await expectNoPageOverflow(page);

    // The chip rows that scroll on purpose are the exception, and they are
    // asserted on their own container: that each one absorbs its overflow
    // instead of pushing the body sideways. Deliberately not that it
    // overflows — whether three chips fit at 320px is a property of the
    // content on the day, and the age-band row does fit at both widths.
    for (const row of await page.locator(SCROLL_ROW_SELECTOR).all()) {
      await expectRowContainsItsOverflow(row);
    }
  });
}

for (const route of PUBLIC_ROUTES) {
  test(`RWD-02 @p1 ${route.page} has no control under 44px`, async ({ page }) => {
    await page.goto(route.path);
    await expect(route.ready(page)).toBeVisible();

    // Scoped to the controls the design system owns, and with everything
    // Leaflet draws excluded — see the helper. `.chip` and the `.btn-*` family
    // carry `min-h-tap` by construction, so what this catches is a control
    // that left the system: a bare `<button>`, or a token that lost its size.
    await expectTapTargets(page);
  });
}

test('RWD-03 @p1 the venue report form keeps its action inside the viewport', async ({ page }) => {
  const outing = new OutingPage(page);
  await outing.goto();

  await outing.reportButtons.first().click();

  await expect(outing.reportForm).toBeVisible();
  // `ModalFrame` caps itself at `max-h-[85vh]` and scrolls inside so that the
  // action is never pushed under the on-screen keyboard. Signed out the form
  // offers sign-in rather than submit — writing a report needs an account —
  // and that button is what a parent has to be able to reach here. The
  // submit-button form of this case belongs to Phase 2, which can sign in.
  await expectInViewport(outing.reportSignIn);
});
