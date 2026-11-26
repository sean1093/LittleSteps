/**
 * How much of the country the datasets cover, as the number strip prints it.
 *
 * Typed literals, on purpose: the nursing-room and family-centre files are
 * fetched at runtime and must not be imported into this chunk, and the wiki
 * arrays are large enough that pulling all three in here for a `.length` would
 * more than double the page's weight. Each value is asserted against the real
 * data in `dataSources.test.ts`, so a regenerated dataset turns the test red
 * rather than leaving a stale number on the page.
 */
export const COVERAGE = [
  { value: 3844, unit: '處哺乳室' },
  { value: 234, unit: '間親子館' },
  { value: 36, unit: '劑疫苗' },
  { value: 92, unit: '篇百科文章' },
  { value: 7, unit: '種傳染病' },
] as const;
