import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Layout assertions, as measurements rather than golden images (plan §7).
 *
 * `.claude/CLAUDE.md` requires every change to be checked at 390px, and at
 * 320px for anything in a grid; happy-dom has no layout engine, so these four
 * invariants are the only place that requirement can be enforced. They survive
 * a restyle and fail on the things a parent actually hits: a page that scrolls
 * sideways, a control too small to tap, a name behind a tag, a submit button
 * under the keyboard.
 */

/** `min-h-tap` / `w-tap` in `tailwind.config.js`, in pixels. */
const MIN_TAP_PX = 44;

/** Sub-pixel slack, so a 43.99px box measured after a transform is not a bug. */
const EPSILON = 0.5;

/**
 * Controls the design system owns, and therefore guarantees the size of.
 *
 * Inline links inside prose (a source citation, a `tel:` link) are not in the
 * list and Leaflet's own chrome is excluded below: including either yields
 * nothing but false positives, and the plan excludes both explicitly.
 */
const DESIGN_SYSTEM_CONTROLS = [
  'button',
  '[role="button"]',
  'input:not([type="hidden"])',
  'a.btn-primary',
  'a.btn-secondary',
  'a.btn-ghost',
  'a.btn-icon',
  'a.chip',
].join(', ');

/**
 * Everything Leaflet draws: its zoom buttons and attribution, and the markers
 * and cluster icons whose 32px and 40px sizes come from an `L.divIcon` rather
 * than from a design-system class. Leaflet marks its interactive markers
 * `role="button"`, so without this exclusion a map of 3,852 nursing rooms is
 * this assertion's entire output and nothing the design system owns is visible
 * in it.
 */
const THIRD_PARTY_CHROME = '.leaflet-container';

/**
 * The page body does not scroll horizontally.
 *
 * Rows that scroll on purpose are `overflow-x` containers of their own and do
 * not widen the body, which is why this can be a flat assertion; assert the
 * row itself with `expectRowScrollsWithinItself`.
 */
export async function expectNoPageOverflow(page: Page): Promise<void> {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.body.clientWidth,
  }));

  expect(
    scrollWidth,
    `the page body scrolls horizontally: scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`,
  ).toBeLessThanOrEqual(clientWidth + EPSILON);
}

/**
 * A deliberately-scrolling row scrolls inside itself and stays inside the
 * viewport. Select it by the `data-testid` in `./testIds`, never by
 * `.row-bleed` — that is a design-system class and the plan forbids binding a
 * test to one.
 */
export async function expectRowScrollsWithinItself(row: Locator): Promise<void> {
  const size = await row.evaluate((element) => ({
    scrollWidth: element.scrollWidth,
    clientWidth: element.clientWidth,
  }));

  expect(size.scrollWidth, 'the row does not overflow, so nothing scrolls').toBeGreaterThan(
    size.clientWidth,
  );

  const viewport = row.page().viewportSize();
  expect(viewport, 'no viewport size to compare the row against').not.toBeNull();
  expect(size.clientWidth, 'the row itself is wider than the viewport').toBeLessThanOrEqual(
    viewport!.width + EPSILON,
  );
}

/**
 * Every enabled, visible control the design system owns is at least 44px in
 * its smaller dimension.
 */
export async function expectTapTargets(page: Page): Promise<void> {
  const violations = await page.evaluate(
    ({ selector, chrome, minimum, epsilon }) => {
      const describe = (element: Element) => {
        const label = element.getAttribute('aria-label') ?? element.textContent?.trim() ?? '';
        return `${element.tagName.toLowerCase()}${label ? ` "${label.slice(0, 40)}"` : ''}`;
      };

      return Array.from(document.querySelectorAll(selector))
        .filter((element) => !element.closest(chrome))
        .filter((element) => !(element as HTMLButtonElement).disabled)
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => {
          const { width, height } = element.getBoundingClientRect();
          return { control: describe(element), width, height };
        })
        .filter(({ width, height }) => Math.min(width, height) < minimum - epsilon);
    },
    {
      selector: DESIGN_SYSTEM_CONTROLS,
      chrome: THIRD_PARTY_CHROME,
      minimum: MIN_TAP_PX,
      epsilon: EPSILON,
    },
  );

  expect(
    violations,
    `controls smaller than ${MIN_TAP_PX}px: ${violations
      .map(({ control, width, height }) => `${control} ${Math.round(width)}×${Math.round(height)}`)
      .join(', ')}`,
  ).toEqual([]);
}

/**
 * A truncating name and the tag beside it do not overlap: the tag's left edge
 * is at or after the name's right edge.
 */
export async function expectNoOverlap(name: Locator, tag: Locator): Promise<void> {
  const nameBox = await name.boundingBox();
  const tagBox = await tag.boundingBox();

  expect(nameBox, 'the name is not rendered').not.toBeNull();
  expect(tagBox, 'the tag is not rendered').not.toBeNull();

  expect(
    tagBox!.x,
    `the tag starts at ${Math.round(tagBox!.x)}px, over a name that ends at ` +
      `${Math.round(nameBox!.x + nameBox!.width)}px`,
  ).toBeGreaterThanOrEqual(nameBox!.x + nameBox!.width - EPSILON);
}

/**
 * An open modal's submit control is inside the viewport.
 *
 * This is what `max-h-[85vh] overflow-y-auto` exists for: without it the submit
 * button sits under the on-screen keyboard and the form cannot be sent.
 */
export async function expectInViewport(control: Locator): Promise<void> {
  const box = await control.boundingBox();
  expect(box, 'the control is not rendered').not.toBeNull();

  const viewport = control.page().viewportSize();
  expect(viewport, 'no viewport size to compare the control against').not.toBeNull();

  expect(box!.y, 'the control is above the viewport').toBeGreaterThanOrEqual(-EPSILON);
  expect(box!.y + box!.height, 'the control is below the fold').toBeLessThanOrEqual(
    viewport!.height + EPSILON,
  );
  expect(box!.x, 'the control is left of the viewport').toBeGreaterThanOrEqual(-EPSILON);
  expect(box!.x + box!.width, 'the control is right of the viewport').toBeLessThanOrEqual(
    viewport!.width + EPSILON,
  );
}
