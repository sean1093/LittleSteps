import { describe, expect, it } from 'vitest';
import type { WikiArticle } from '../../types';
import { babyWikiArticles } from '../../littlesteps/data/babyWiki';
import { pregnancyWikiArticles } from '../../littlebloom/data/wiki';
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

  it('answers the searches that used to return nothing (#156)', () => {
    // From user-test round 1: each of these came back 「共 0 篇文章」. Each now
    // names the article a parent typing it is looking for.
    const cases: [string, string][] = [
      ['吃不夠', 'feeding-enough'],
      ['喝多少', 'feeding-enough'],
      ['睡眠倒退', 'sleep-regression'],
      ['夜醒', 'sleep-regression'],
      ['黃疸', 'jaundice-stool-card'],
      ['大便卡', 'jaundice-stool-card'],
      ['新生兒篩檢', 'newborn-screening'],
    ];
    for (const [query, id] of cases) {
      const ids = babyWikiArticles
        .filter((entry) => matchesKeyword(entry, query))
        .map((entry) => entry.id);
      expect(ids, query).toContain(id);
    }
  });

  it('ignores how the parent spells it: 台/臺, spaces inside a word, listed variants (#164)', () => {
    const ids = (articles: readonly WikiArticle<string>[], query: string) =>
      articles.filter((entry) => matchesKeyword(entry, query)).map((entry) => entry.id);
    const containing = (articles: readonly WikiArticle<string>[], text: string) =>
      articles.filter((entry) => JSON.stringify(entry).includes(text)).map((entry) => entry.id);

    // The baby wiki writes 「4 個月」; a phone keyboard types 4個月.
    const fourMonths = containing(babyWikiArticles, '4 個月');
    expect(fourMonths.length).toBeGreaterThan(0);
    expect(ids(babyWikiArticles, '4個月')).toEqual(expect.arrayContaining(fourMonths));

    // The weekly guide spells it 子癇前症, the pregnancy wiki 子癲前症.
    const preeclampsia = containing(pregnancyWikiArticles, '子癲前症');
    expect(preeclampsia.length).toBeGreaterThan(0);
    expect(ids(pregnancyWikiArticles, '子癇前症')).toEqual(expect.arrayContaining(preeclampsia));

    const abdominal = containing(pregnancyWikiArticles, '腹痛');
    expect(abdominal.length).toBeGreaterThan(0);
    expect(ids(pregnancyWikiArticles, '肚子痛')).toEqual(expect.arrayContaining(abdominal));

    expect(matchesKeyword(article({ summary: '臺灣常見' }), '台灣')).toBe(true);
  });

  it('still needs every term of a multi-term query after normalizing', () => {
    expect(matchesKeyword(article(), '高燒 抽搐')).toBe(true);
    expect(matchesKeyword(article(), '4個月 抽搐')).toBe(false);
    expect(matchesKeyword(article({ summary: '4 個月大時高燒' }), '4個月 抽搐')).toBe(true);
  });
});
