import { describe, expect, it } from 'vitest';
import type { ToddlerWikiArticle } from '../../types';
import {
  monthsLabel,
  relevanceFor,
  relevanceTag,
  sortByRelevance,
} from './wikiRelevance';

function article(
  id: string,
  ageRange: [number, number],
  overrides: Partial<ToddlerWikiArticle> = {},
): ToddlerWikiArticle {
  return {
    id,
    title: id,
    summary: '',
    category: 'health',
    ageRange,
    causes: [],
    solutions: [],
    warningSignals: [],
    relatedArticleIds: [],
    icon: 'Heart',
    ...overrides,
  };
}

describe('relevanceFor', () => {
  it('是 now 當月齡落在區間內', () => {
    expect(relevanceFor(article('a', [18, 30]), 24)).toBe('now');
  });

  it('起始月齡當天就算 now', () => {
    expect(relevanceFor(article('a', [18, 30]), 18)).toBe('now');
  });

  it('結束月齡當天就算 past——區間不含尾', () => {
    expect(relevanceFor(article('a', [18, 30]), 30)).toBe('past');
  });

  it('半年內開始的算 soon', () => {
    expect(relevanceFor(article('a', [24, 36]), 18)).toBe('soon');
  });

  it('剛好半年也算 soon', () => {
    expect(relevanceFor(article('a', [24, 36]), 18)).toBe('soon');
  });

  it('超過半年才開始的算 later', () => {
    expect(relevanceFor(article('a', [30, 36]), 14)).toBe('later');
  });
});

describe('sortByRelevance', () => {
  it('now 排在 soon 前面，soon 排在 later 前面，past 最後', () => {
    const articles = [
      article('past', [12, 15]),
      article('later', [30, 36]),
      article('soon', [24, 36]),
      article('now', [18, 24]),
    ];
    expect(sortByRelevance(articles, 20).map((a) => a.id)).toEqual([
      'now',
      'soon',
      'later',
      'past',
    ]);
  });

  it('同層之內，起始月齡較晚的先出現', () => {
    const articles = [
      article('evergreen', [12, 36]),
      article('stage', [24, 30]),
    ];
    expect(sortByRelevance(articles, 26).map((a) => a.id)).toEqual([
      'stage',
      'evergreen',
    ]);
  });

  it('起始相同時，區間較窄的先出現', () => {
    const articles = [
      article('wide', [12, 36]),
      article('narrow', [12, 18]),
    ];
    expect(sortByRelevance(articles, 14).map((a) => a.id)).toEqual([
      'narrow',
      'wide',
    ]);
  });

  it('完全同級時保留原順序，結果才穩定', () => {
    const articles = [
      article('first', [12, 36]),
      article('second', [12, 36]),
      article('third', [12, 36]),
    ];
    expect(sortByRelevance(articles, 14).map((a) => a.id)).toEqual([
      'first',
      'second',
      'third',
    ]);
  });

  it('不篩掉任何一篇——半夜搜發燒的家長必須找得到', () => {
    const articles = [
      article('a', [12, 15]),
      article('b', [30, 36]),
      article('c', [18, 24]),
    ];
    expect(sortByRelevance(articles, 13)).toHaveLength(3);
  });

  it('不改動傳入的陣列', () => {
    const articles = [article('a', [30, 36]), article('b', [12, 18])];
    const ids = articles.map((a) => a.id);
    sortByRelevance(articles, 14);
    expect(articles.map((a) => a.id)).toEqual(ids);
  });
});

describe('monthsLabel', () => {
  it('整歲不加月份', () => {
    expect(monthsLabel(12)).toBe('1 歲');
    expect(monthsLabel(24)).toBe('2 歲');
    expect(monthsLabel(36)).toBe('3 歲');
  });

  it('半歲說「半」，不說 6 個月', () => {
    expect(monthsLabel(18)).toBe('1 歲半');
    expect(monthsLabel(30)).toBe('2 歲半');
  });

  it('其他餘數照實說', () => {
    expect(monthsLabel(15)).toBe('1 歲 3 個月');
  });
});

describe('relevanceTag', () => {
  it('現在適用的直接說', () => {
    expect(relevanceTag(article('a', [12, 36]), 14)).toBe('現在適用');
  });

  it('還沒到的說什麼時候開始', () => {
    expect(relevanceTag(article('a', [18, 30]), 14)).toBe('1 歲半後');
  });

  it('已經過去的不標——那篇仍然讀得到，標「已過」沒有用', () => {
    expect(relevanceTag(article('a', [12, 18]), 24)).toBeUndefined();
  });
});
