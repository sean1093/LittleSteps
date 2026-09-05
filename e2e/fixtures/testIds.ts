/**
 * Every `data-testid` in `src/`, in one place.
 *
 * The selector policy (plan §6) is role first, text second, `data-testid` only
 * where no accessible name can exist. This file is the whole of that third
 * category: a Leaflet container and a marker cluster are drawn imperatively
 * with nothing to call them by, and a chip row is a `<div>` whose only job is
 * to scroll.
 *
 * The list is fixed by the harness. Adding to it is a change to `src/` and
 * needs a comment in that diff saying why a role selector was not usable.
 */

/** The `<div>` Leaflet draws the map into, on `/babyoasis`. */
export const MAP_TESTID = 'oasis-map';

/** One marker cluster icon, built by `react-leaflet-cluster`. */
export const MAP_CLUSTER_TESTID = 'oasis-map-cluster';

/**
 * The deliberately-scrolling `.row-bleed` chip rows on the nine public routes.
 *
 * They are the exception to "the page body must not scroll horizontally": each
 * one scrolls inside itself on purpose, so RWD-01 asserts on the row rather
 * than counting it as page overflow. Gated routes have rows of their own; they
 * get a testid when Phase 2 first reaches them, not before.
 */
export const SCROLL_ROW = {
  oasisFilters: 'scroll-row-oasis-filters',
  guardCounties: 'scroll-row-guard-counties',
  guardAgeBands: 'scroll-row-guard-age-bands',
  outingCities: 'scroll-row-outing-cities',
  wikiCategories: 'scroll-row-wiki-categories',
  explorerWikiStages: 'scroll-row-explorer-wiki-stages',
  careGuideCategories: 'scroll-row-care-guide-categories',
} as const;

/** Matches every row above, for the page-level layout helpers. */
export const SCROLL_ROW_SELECTOR = '[data-testid^="scroll-row-"]';
