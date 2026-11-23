import { describe, expect, it } from 'vitest';
import type { WikiArticle } from '../../types';
import { babyWikiArticles } from '../../littlesteps/data/babyWiki';
import { matchesKeyword } from './matchesKeyword';

const article = (over: Partial<WikiArticle<string>> = {}): WikiArticle<string> => ({
  id: 'a',
  title: '玫瑰疹',
  summary: '高燒三到五天，退燒後出疹。',
  category: 'fever',
  causes: ['人類皰疹病毒感染'],
  solutions: [{ step: '補充水分', detail: '發燒時少量多次餵。' }],
  warningSignals: ['出現抽搐'],
  relatedArticleIds: [],
  icon: 'Thermometer',
  ...over,
});

describe('matchesKeyword', () => {
  it('matches everything on an empty query', () => {
    expect(matchesKeyword(article(), '')).toBe(true);
    expect(matchesKeyword(article(), '   ')).toBe(true);
  });

  it('finds a word wherever it sits: title, summary, cause, step or warning', () => {
    for (const word of ['玫瑰疹', '退燒', '皰疹', '補充水分', '少量多次', '抽搐']) {
      expect(matchesKeyword(article(), word), word).toBe(true);
    }
  });

  it('takes two words typed with a space as two things to find', () => {
    // 「高燒」 is in the summary and 「抽搐」 in a warning: no single field has
    // both, and the whole string 「高燒 抽搐」 appears nowhere. A parent types
    // it exactly like this.
    expect(matchesKeyword(article(), '高燒 抽搐')).toBe(true);
    expect(matchesKeyword(article(), '  高燒   抽搐 ')).toBe(true);
  });

  it('needs every word, so a second word narrows rather than widens', () => {
    expect(matchesKeyword(article(), '高燒 尿布')).toBe(false);
  });

  it('answers a real two-word search against the shipped baby wiki', () => {
    // The case from the panel: a father at 2am with a feverish baby and a rash.
    const hits = babyWikiArticles.filter((entry) => matchesKeyword(entry, '發燒 疹'));
    expect(hits.length).toBeGreaterThan(0);
    // And each hit really does mention both.
    for (const hit of hits) {
      const text = JSON.stringify(hit);
      expect(text).toContain('發燒');
      expect(text).toContain('疹');
    }
  });
});
