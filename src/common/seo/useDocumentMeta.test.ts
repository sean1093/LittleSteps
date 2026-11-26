import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { ROUTE_PATH, type Page } from '../../types/routes';
import { requiresAuth } from '../routePolicy';
import { metaFor, metaForArticle } from './pageMeta';
import { setDocumentMetaOverride, useDocumentMeta } from './useDocumentMeta';

/**
 * The document title is static per route and never names a child.
 *
 * `logPageView` sends `document.title` with every page view, so the about
 * page's promise that usage statistics carry no child's name rests on this
 * hook reading the title from the static meta table and nothing else. A
 * future 「{child.name} 的成長總覽」 in the tab title would leak the name into
 * analytics without touching lib/firebase.ts; this test is where that turns
 * red.
 */
const pages = Object.keys(ROUTE_PATH) as Page[];

describe('useDocumentMeta', () => {
  it('sets the title and description from the static meta table, for every route', () => {
    for (const page of pages) {
      const { unmount } = renderHook(() => useDocumentMeta(page));
      expect(document.title, page).toBe(metaFor(page).title);
      expect(
        document.head.querySelector('meta[name="description"]')?.getAttribute('content'),
        page,
      ).toBe(metaFor(page).description);
      unmount();
    }
  });

  it('tells crawlers to stay off every route that reads a child, and only those', () => {
    for (const page of pages) {
      const { unmount } = renderHook(() => useDocumentMeta(page));
      const robots = document.head.querySelector('meta[name="robots"]')?.getAttribute('content');
      expect(robots, page).toBe(requiresAuth(page) ? 'noindex, follow' : 'index, follow');
      unmount();
    }
  });

  it('lets an open wiki article take over the head, and gives it back afterwards', () => {
    const article = { id: 'drool-rash', title: '口水疹', summary: '嘴巴周圍的紅疹。' };
    const meta = metaForArticle('littlesteps/baby-wiki', article);
    const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');

    // Set before the page's own hook has run: the order the two effects fire
    // in is not something either side controls.
    setDocumentMetaOverride(meta);
    const { unmount } = renderHook(() => useDocumentMeta('littlesteps/baby-wiki'));

    expect(document.title).toBe('口水疹｜寶寶百科｜LittleSteps');
    expect(canonical()).toBe(meta.canonical);
    expect(canonical()).toContain('/littlesteps/baby-wiki/drool-rash');

    act(() => setDocumentMetaOverride(null));

    expect(document.title).toBe(metaFor('littlesteps/baby-wiki').title);
    expect(canonical()).toBe(metaFor('littlesteps/baby-wiki').canonical);
    unmount();
  });
});
