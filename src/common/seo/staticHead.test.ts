import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN } from './pageMeta';
import {
  articlesToPrerender,
  headForArticle,
  renderArticleHtml,
  renderPageHtml,
  renderSitemap,
} from './staticHead';
import { wikiArticlePages } from './wikiArticlePages';

const TEMPLATE = [
  '<html><head>',
  '<title>home title</title>',
  '<meta name="description" content="home description" />',
  '<meta property="og:title" content="home title" />',
  '</head><body><div id="root"></div></body></html>',
].join('\n');

const fever = () => {
  const entry = wikiArticlePages().find(({ article }) => article.id === 'fever-assessment');
  if (!entry) throw new Error('the baby wiki no longer has a fever-assessment article');
  return entry;
};

const jsonLdOf = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    ([, body]) => JSON.parse(body) as Record<string, unknown>,
  );

describe('the prerendered head of a wiki article', () => {
  it('carries the article title, its summary and its own canonical URL', () => {
    const entry = fever();
    const html = renderArticleHtml(TEMPLATE, entry);

    // The fever article has a search title; the article's own title stays in
    // the structured data, checked below.
    expect(html).toContain('<title>寶寶發燒幾度要看醫生？量法與退燒藥｜寶寶百科｜LittleSteps</title>');
    expect(html).toContain('<meta property="og:type" content="article" />');
    expect(html).toContain(
      `<link rel="canonical" href="${SITE_ORIGIN}/littlesteps/baby-wiki/fever-assessment" />`,
    );
    expect(html).toContain('<meta name="robots" content="index, follow" />');
    // The home page's own tags are gone, not left beside the article's.
    expect(html).not.toContain('home title');
    expect(html).not.toContain('home description');
    expect(html.match(/<title>/g)).toHaveLength(1);
  });

  it('marks the article up with the date its sources were checked', () => {
    const entry = fever();
    const nodes = jsonLdOf(headForArticle(entry));

    const article = nodes.find((node) => node['@type'] === 'Article');
    expect(article?.headline).toBe(entry.article.title);
    expect(article?.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(article?.url).toBe(`${SITE_ORIGIN}/littlesteps/baby-wiki/fever-assessment`);

    const crumbs = nodes.find((node) => node['@type'] === 'BreadcrumbList');
    expect(crumbs).toBeDefined();
  });

  it('writes one file per article, each in its own folder', () => {
    const outDirs = articlesToPrerender().map(({ outDir }) => outDir);

    expect(outDirs).toHaveLength(wikiArticlePages().length);
    expect(new Set(outDirs).size).toBe(outDirs.length);
    expect(outDirs).toContain('littlesteps/baby-wiki/fever-assessment');
    for (const outDir of outDirs) expect(outDir.startsWith('/')).toBe(false);
  });

  it('leaves a knowledge base page with its own head, not an article one', () => {
    const html = renderPageHtml(TEMPLATE, 'littlesteps/baby-wiki');
    expect(html).toContain(`<link rel="canonical" href="${SITE_ORIGIN}/littlesteps/baby-wiki" />`);
  });
});

describe('the sitemap', () => {
  it('lists every article once, dated by when it was verified rather than by the build', () => {
    const sitemap = renderSitemap('2099-01-01');
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);

    for (const { page, article, verifiedOn } of wikiArticlePages()) {
      const url = `${SITE_ORIGIN}/${page}/${article.id}`;
      expect(locs.filter((loc) => loc === url), url).toHaveLength(1);
      const block = sitemap.slice(sitemap.indexOf(`<loc>${url}</loc>`));
      expect(block.slice(0, block.indexOf('</url>'))).toContain(`<lastmod>${verifiedOn}</lastmod>`);
    }
  });
});
