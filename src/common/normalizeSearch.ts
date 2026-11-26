/**
 * One way to compare what a parent types with what the data says, shared by the
 * wiki search and the BabyOasis nursing-room search.
 *
 * Both searches used to compare raw substrings, so the spelling a phone keyboard
 * produces decided whether anything came back: 「台中」 found 23 nursing rooms
 * and 「臺中」 found 390, and 「4個月」 found nothing because the articles write
 * 「4 個月」. The fix is applied to both sides — the query and every searched
 * field — so neither the room data nor the wiki text has to be rewritten to suit
 * the search.
 */

/**
 * Fold one piece of text into the form used for comparison:
 * - 台 → 臺: the government data writes 臺, phone keyboards type 台;
 * - lowercase, for the English and the abbreviations (GBS, Tdap) in the text;
 * - no whitespace at all, so 「4個月」 and 「4 個月」 are the same string.
 *
 * A query is split into terms on whitespace *before* this runs (see
 * `searchTerms`); this only removes the spaces inside a field or a single term.
 */
export function normalizeSearch(text: string): string {
  return text.replace(/台/g, '臺').toLowerCase().replace(/\s+/g, '');
}

/**
 * Spellings that mean the same thing to a parent but share no substring.
 *
 * Kept short and explicit on purpose: each group is here because a real search
 * returned nothing. It is not a thesaurus, and a fuzzy matcher would bring back
 * articles nobody asked for. Members are written already normalized.
 */
const VARIANT_GROUPS: readonly (readonly string[])[] = [
  // The weekly pregnancy guide writes 子癇前症 and the pregnancy wiki 子癲前症:
  // one condition (preeclampsia), two spellings, and a parent who read one
  // searches with it.
  ['子癇', '子癲'],
  // Parents type the everyday word; the articles use the clinical one.
  ['肚子痛', '腹痛'],
  // Parents type 「桃園火車站」; the nursing-room data names the place
  // 「交通部臺灣鐵路管理局桃園站」. Longest first, so 火車站 is tried before 車站.
  ['火車站', '車站', '站'],
];

/**
 * Every spelling a single normalized term should match: the term itself, plus
 * the term with a variant swapped in. Within a group only the longest member
 * found in the term is swapped, so 「火車站」 becomes 「站」 rather than having
 * its 「車站」 rewritten into 「火站」.
 */
function variantsOf(term: string): string[] {
  const variants = [term];
  for (const group of VARIANT_GROUPS) {
    const found = [...group]
      .sort((a, b) => b.length - a.length)
      .find((member) => term.includes(member));
    if (found === undefined) continue;
    for (const other of group) {
      if (other !== found) variants.push(term.split(found).join(other));
    }
  }
  return variants;
}

/**
 * A query as a list of terms, each term a list of acceptable spellings.
 * Whitespace separates terms exactly as before; every term must match
 * (see `matchesAllTerms`).
 */
export function searchTerms(query: string): string[][] {
  return query
    .split(/\s+/)
    .map(normalizeSearch)
    .filter(Boolean)
    .map(variantsOf);
}

/**
 * A query as a single term: for a search box that never split on spaces
 * (BabyOasis), where 「台北 車站」 is still one place name.
 */
export function singleSearchTerm(query: string): string[][] {
  const term = normalizeSearch(query);
  return term === '' ? [] : [variantsOf(term)];
}

/**
 * Whether every term is found in at least one of the already-normalized fields.
 * A term need not share a field with the other terms.
 */
export function matchesAllTerms(fields: readonly string[], terms: readonly string[][]): boolean {
  return terms.every((variants) =>
    variants.some((variant) => fields.some((field) => field.includes(variant))),
  );
}
