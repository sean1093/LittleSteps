import { describe, expect, it } from 'vitest';
import { ARTICLE_SEARCH_TITLE } from './articleSearchTitles';
import { metaForArticle } from './pageMeta';
import { wikiArticlePages } from './wikiArticlePages';

/**
 * A search title replaces the article's own title in `<title>` only. Two ways
 * it can rot: the article it names is renamed or removed, and nothing says so;
 * or it grows past what a results page shows and loses the brand at the end.
 */
describe('search titles for wiki articles', () => {
  const entries = wikiArticlePages();

  it('names only articles that exist', () => {
    const ids = new Set(entries.map(({ article }) => article.id));
    for (const id of Object.keys(ARTICLE_SEARCH_TITLE)) {
      expect(ids.has(id), `${id} is not an article any more`).toBe(true);
    }
  });

  it('reaches the page title, and leaves other articles on their own title', () => {
    for (const { page, article } of entries) {
      const { title } = metaForArticle(page, article);
      const expected = ARTICLE_SEARCH_TITLE[article.id] ?? article.title;
      expect(title.startsWith(`${expected}｜`), article.id).toBe(true);
      expect(title.endsWith('｜LittleSteps'), article.id).toBe(true);
    }
  });

  it('fits in a search result with the knowledge base and brand still showing', () => {
    // A full-width character counts as one; Latin letters and digits as half.
    const width = (text: string) =>
      [...text].reduce((sum, char) => sum + (char.charCodeAt(0) < 0x2e80 ? 0.5 : 1), 0);

    for (const { page, article } of entries) {
      if (!(article.id in ARTICLE_SEARCH_TITLE)) continue;
      const { title } = metaForArticle(page, article);
      expect(width(title), `${article.id}: ${title}`).toBeLessThanOrEqual(31);
    }
  });
});
