import { describe, expect, it } from 'vitest';
import { wikiArticlePages } from './wikiArticlePages';
import { babyWikiArticles, babyWikiVerifiedOn } from '../../littlesteps/data/babyWiki';
import { pregnancyWikiArticles, pregnancyWikiVerifiedOn } from '../../littlebloom/data/wiki';

/**
 * An article's verification date is a claim that someone compared that article
 * with its sources on that day. Articles added later were checked one by one;
 * adding them did not re-check the older ones, so the older ones must keep
 * their own date rather than inherit the newest one.
 */
describe('verification date per article', () => {
  const pages = wikiArticlePages();
  const dateOf = (id: string) => pages.find((entry) => entry.article.id === id)?.verifiedOn;

  it('gives an article checked on its own day that day', () => {
    const dated = [...babyWikiArticles, ...pregnancyWikiArticles].filter((a) => a.verifiedOn);
    expect(dated.length).toBeGreaterThan(0);
    for (const article of dated) expect(dateOf(article.id)).toBe(article.verifiedOn);
  });

  it('leaves every other article on its wiki date', () => {
    for (const article of babyWikiArticles.filter((a) => !a.verifiedOn)) {
      expect(dateOf(article.id)).toBe(babyWikiVerifiedOn);
    }
    for (const article of pregnancyWikiArticles.filter((a) => !a.verifiedOn)) {
      expect(dateOf(article.id)).toBe(pregnancyWikiVerifiedOn);
    }
  });

  it('only sets an article date that is later than its wiki date', () => {
    for (const article of babyWikiArticles) {
      if (article.verifiedOn) expect(article.verifiedOn > babyWikiVerifiedOn).toBe(true);
    }
    for (const article of pregnancyWikiArticles) {
      if (article.verifiedOn) expect(article.verifiedOn > pregnancyWikiVerifiedOn).toBe(true);
    }
  });
});
