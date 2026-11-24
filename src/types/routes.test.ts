import { describe, expect, it } from 'vitest';
import { ROUTE_PATH, WIKI_PAGES, articleFromPath, articlePath, pageFromPath } from './routes';
import { wikiArticlePages } from '../common/seo/wikiArticlePages';

/**
 * A wiki article has a URL of its own, under the knowledge base it belongs to.
 * What has to hold is that the URL a parent shares resolves back to the same
 * article, and that nothing else starts resolving by accident.
 */
describe('article URLs', () => {
  it('resolves an article URL to the knowledge base it sits under', () => {
    expect(pageFromPath('/littlesteps/baby-wiki/fever-assessment')).toBe('littlesteps/baby-wiki');
    expect(articleFromPath('/littlesteps/baby-wiki/fever-assessment')).toEqual({
      page: 'littlesteps/baby-wiki',
      articleId: 'fever-assessment',
    });
  });

  it('treats a trailing slash as the same article', () => {
    expect(articleFromPath('/littlebloom/wiki/morning-sickness/')).toEqual({
      page: 'littlebloom/wiki',
      articleId: 'morning-sickness',
    });
  });

  it('round-trips every article in all three knowledge bases', () => {
    const entries = wikiArticlePages();
    expect(entries.length).toBeGreaterThan(0);

    for (const { page, article } of entries) {
      const path = articlePath(page, article.id);
      // An id with a character the URL pattern rejects would get a prerendered
      // page and a sitemap entry that open the list instead of the article.
      expect(articleFromPath(path), path).toEqual({ page, articleId: article.id });
      expect(pageFromPath(path), path).toBe(page);
    }
  });

  it('gives every article a URL no other article has', () => {
    const paths = wikiArticlePages().map(({ page, article }) => articlePath(page, article.id));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('does not read the knowledge base itself as an article', () => {
    for (const page of WIKI_PAGES) {
      expect(articleFromPath(ROUTE_PATH[page])).toBeNull();
      expect(articleFromPath(`${ROUTE_PATH[page]}/`)).toBeNull();
    }
  });

  it('does not invent articles under pages that have none', () => {
    expect(articleFromPath('/littlesteps/daily-log/anything')).toBeNull();
    expect(pageFromPath('/littlesteps/daily-log/anything')).toBe('home');
    expect(pageFromPath('/babyoasis/somewhere')).toBe('home');
  });

  it('rejects anything deeper or stranger than one id segment', () => {
    expect(articleFromPath('/littlesteps/baby-wiki/a/b')).toBeNull();
    expect(pageFromPath('/littlesteps/baby-wiki/a/b')).toBe('home');
    expect(articleFromPath('/littlesteps/baby-wiki/%3Cscript%3E')).toBeNull();
    expect(articleFromPath('/littlesteps/baby-wiki/Fever')).toBeNull();
  });
});
