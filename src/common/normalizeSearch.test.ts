import { describe, expect, it } from 'vitest';
import { matchesAllTerms, normalizeSearch, searchTerms, singleSearchTerm } from './normalizeSearch';

const matches = (text: string, query: string) =>
  matchesAllTerms([normalizeSearch(text)], searchTerms(query));

describe('normalizeSearch', () => {
  it('folds 台 into 臺, lowercases and drops whitespace', () => {
    expect(normalizeSearch('台中市 西屯區 GBS')).toBe('臺中市西屯區gbs');
  });

  it('makes 台中 and 臺中 the same search, whichever side wrote which', () => {
    expect(matches('臺中市西屯區', '台中')).toBe(true);
    expect(matches('台中市西屯區', '臺中')).toBe(true);
  });

  it('finds 「4 個月」 when the parent types 4個月', () => {
    expect(matches('常見於 4 個月前後', '4個月')).toBe(true);
  });

  it('matches the listed spelling variants in both directions', () => {
    expect(matches('需立刻就醫評估子癲前症', '子癇前症')).toBe(true);
    expect(matches('子癇前症風險評估', '子癲前症')).toBe(true);
    expect(matches('合併腹痛、腹脹', '肚子痛')).toBe(true);
    expect(matches('交通部臺灣鐵路管理局桃園站', '桃園火車站')).toBe(true);
    expect(matches('臺灣鐵路管理局臺北車站', '台北站')).toBe(true);
  });

  it('still finds the original spelling, so a variant never narrows a search', () => {
    expect(matches('桃園火車站前廣場', '桃園火車站')).toBe(true);
    expect(matches('肚子痛', '肚子')).toBe(true);
  });

  it('does not invent matches outside the list', () => {
    expect(matches('臺中市西屯區', '台南')).toBe(false);
    expect(matches('交通部臺灣鐵路管理局桃園站', '新竹火車站')).toBe(false);
  });

  it('still splits a query on spaces and needs every term', () => {
    expect(searchTerms('  台中   尿布 ').length).toBe(2);
    expect(matches('臺中市的哺乳室', '台中 哺乳室')).toBe(true);
    expect(matches('臺中市的哺乳室', '台中 尿布')).toBe(false);
    expect(searchTerms('   ')).toEqual([]);
  });

  it('keeps a single-term search whole, spaces and all', () => {
    expect(singleSearchTerm('台北 車站')).toEqual(singleSearchTerm('臺北車站'));
    expect(singleSearchTerm('  ')).toEqual([]);
  });
});
