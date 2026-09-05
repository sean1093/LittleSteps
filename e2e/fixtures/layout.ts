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
 *
 * Every helper here polls. A bounding box read once is read mid-animation:
 * `common/ui/motion`'s `sheet` springs a modal from `y: '100%'` to `0`, so a
 * one-shot measurement taken straight after opening one reports a submit
 * button below the fold and fails a modal that is perfectly correct. Polling
 * is the only escape hatch, because `waitForTimeout` is banned (plan §8).
 */

/** `min-h-tap` / `w-tap` in `tailwind.config.js`, in pixels. */
const MIN_TAP_PX = 44;

/** Sub-pixel slack, so a 43.99px box measured after a transform is not a bug. */
const EPSILON = 0.5;

/**
 * Controls the design system owns, and therefore guarantees the size of.
 *
 * The four `a.btn-*` entries are a deliberate carve-out from the plan's §6 ban
 * on class selectors, and the only one in the suite. A link styled as a button
 * has no attribute that distinguishes it from a link inside a paragraph, and
 * §7 scopes this assertion to controls the design system owns, so the class is
 * the only thing that can express the scope. Know the failure mode before you
 * rename a token: a renamed `.btn-primary` makes this helper quietly stop
 * checking those links rather than fail, so rename the class here in the same
 * commit.
 *
 * Inline links inside prose (a source citation, a `tel:` link) are excluded by
 * not being in the list, and Leaflet's own drawing is excluded below.
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
 *
 * The residual risk is an app-owned control rendered inside a Leaflet popup:
 * it sits under `.leaflet-container` and so escapes the size check silently.
 * Nothing does that today — the room sheet and the report form are siblings of
 * the map, not children of it.
 */
const THIRD_PARTY_CHROME = '.leaflet-container';

/**
 * The page body does not scroll horizontally.
 *
 * Rows that scroll on purpose are `overflow-x` containers of their own and do
 * not widen the body, which is why this can be a flat assertion; assert the
 * row itself with `expectRowContainsItsOverflow`.
 */
export async function expectNoPageOverflow(page: Page): Promise<void> {
  await expect
    .poll(() => page.evaluate(() => document.body.scrollWidth - document.body.clientWidth), {
      message: 'the page body scrolls horizontally: body scrollWidth minus clientWidth, in px',
    })
    .toBeLessThanOrEqual(EPSILON);
}

/**
 * A deliberately-scrolling row keeps its overflow to itself: it is a scroll
 * container, and it is no wider than the viewport.
 *
 * It deliberately does **not** require the row to overflow. Whether three
 * chips fit at 320px is a property of the content on the day, not a
 * correctness property — `scroll-row-guard-age-bands` holds three chips and
 * fits at both widths — and asserting it would fail a row that is behaving.
 * What must hold is that a row which *does* overflow absorbs it instead of
 * pushing the body sideways.
 *
 * Select the row by the `data-testid` in `./testIds`, never by `.row-bleed`:
 * that is a design-system class, and §6 forbids binding a test to one.
 */
export async function expectRowContainsItsOverflow(row: Locator): Promise<void> {
  // Without this the helper is silent if `.row-bleed` ever loses
  // `overflow-x-auto` — the row would then widen the page and only
  // `expectNoPageOverflow` would notice, on a different page and a different
  // case.
  await expect
    .poll(() => row.evaluate((element) => getComputedStyle(element).overflowX), {
      message: 'the row is not a horizontal scroll container',
    })
    .toMatch(/auto|scroll/);

  const viewport = row.page().viewportSize();
  expect(viewport, 'no viewport size to compare the row against').not.toBeNull();

  await expect
    .poll(() => row.evaluate((element) => element.clientWidth), {
      message: 'the row itself is wider than the viewport',
    })
    .toBeLessThanOrEqual(viewport!.width + EPSILON);
}

/**
 * Every enabled, visible control the design system owns is at least 44px in
 * its smaller dimension. The poll's final value lists what failed.
 */
export async function expectTapTargets(page: Page): Promise<void> {
  await expect
    .poll(() => measureUndersizedControls(page), {
      message: `controls smaller than ${MIN_TAP_PX}px in their smaller dimension`,
    })
    .toEqual([]);
}

interface UndersizedControl {
  control: string;
  width: number;
  height: number;
}

function measureUndersizedControls(page: Page): Promise<UndersizedControl[]> {
  return page.evaluate(
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
}

/**
 * A truncating name and the tag beside it do not overlap: the tag's left edge
 * is at or after the name's right edge. The polled value is the gap between
 * them in pixels, so a failure says how far the two are into each other.
 */
export async function expectNoOverlap(name: Locator, tag: Locator): Promise<void> {
  await expect(name, 'the name is not rendered').toBeVisible();
  await expect(tag, 'the tag is not rendered').toBeVisible();

  await expect
    .poll(
      async () => {
        const [nameBox, tagBox] = await Promise.all([name.boundingBox(), tag.boundingBox()]);
        // Not rendered any more: report the worst possible gap rather than
        // null, so the poll keeps retrying and the matcher stays numeric.
        if (!nameBox || !tagBox) return Number.NEGATIVE_INFINITY;
        return tagBox.x - (nameBox.x + nameBox.width);
      },
      { message: 'pixels between the end of the name and the start of the tag' },
    )
    .toBeGreaterThanOrEqual(-EPSILON);
}

/**
 * A control is inside the viewport.
 *
 * `toBeInViewport` retries, which matters because a sheet animates in: a
 * one-shot measurement taken straight after opening one reports a control
 * below the fold and fails a modal that is perfectly correct.
 */
export async function expectInViewport(control: Locator): Promise<void> {
  await expect(control, 'the control is not fully inside the viewport').toBeInViewport({
    ratio: 1,
  });
}

/** `max-h-[85vh]` on `ModalFrame`, as a fraction. */
const MODAL_MAX_VIEWPORT_FRACTION = 0.85;

/**
 * An open modal keeps itself inside the viewport and scrolls its own content.
 *
 * This is the whole of what `max-h-[85vh] overflow-y-auto` buys. `ModalFrame`
 * is `fixed inset-x-0 bottom-0`, so without the cap a form taller than the
 * screen grows *upwards* past the top edge: nothing can scroll a fixed element
 * from outside, so its header, its close button and its first fields become
 * unreachable — which is the same defect, in the other direction, as the three
 * centred modals it replaced, where the submit button ended up under the
 * on-screen keyboard.
 *
 * Both halves have to be asserted together. The cap alone clips the overflow
 * away; the scrolling alone never engages.
 *
 * Know the failure mode before changing the token: this reads 85vh from here,
 * not from the class, so a modal re-capped at some other height silently keeps
 * passing until someone updates this constant in the same commit.
 */
export async function expectModalFitsViewport(dialog: Locator): Promise<void> {
  await expect
    .poll(() => dialog.evaluate((element) => getComputedStyle(element).overflowY), {
      message: 'the modal is not a vertical scroll container',
    })
    .toMatch(/auto|scroll/);

  const viewport = dialog.page().viewportSize();
  expect(viewport, 'no viewport size to compare the modal against').not.toBeNull();
  const cap = viewport!.height * MODAL_MAX_VIEWPORT_FRACTION;

  await expect
    .poll(() => dialog.evaluate((element) => element.getBoundingClientRect().height), {
      message: `the modal is taller than ${MODAL_MAX_VIEWPORT_FRACTION} of the viewport, in px`,
    })
    .toBeLessThanOrEqual(cap + EPSILON);
}

/**
 * A control inside a scrolling modal can be brought into view by scrolling the
 * modal itself.
 *
 * `scrollIntoViewIfNeeded` scrolls the nearest scrollable ancestor, which for
 * a capped `ModalFrame` is the dialog. Without the cap the dialog does not
 * scroll and nothing else can move it, so a control that started off-screen
 * stays there.
 */
export async function expectReachableByScrolling(control: Locator): Promise<void> {
  await control.scrollIntoViewIfNeeded();
  await expectInViewport(control);
}
