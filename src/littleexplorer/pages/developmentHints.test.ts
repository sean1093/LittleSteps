import { describe, expect, it } from 'vitest';
import type { DevelopmentCheckItem } from '../../types';
import { TODDLER_AGE_BANDS } from '../utils/ageBands';
import { allAchieved, bandEndLabel, pickWeeklyTry } from './developmentHints';

const item = (id: string, tips: string[]): DevelopmentCheckItem => ({
  id,
  ageBand: '12-15',
  domain: 'gross-motor',
  title: `題目 ${id}`,
  detail: '',
  tips,
});

const a = item('a', ['a1', 'a2']);
const b = item('b', ['b1']);
const noTips = item('n', []);

describe('pickWeeklyTry', () => {
  it('第一個還沒勾的項目的第一條點子', () => {
    expect(pickWeeklyTry([a, b], {})).toEqual({ tip: 'a1', title: '題目 a' });
  });

  it('勾過的跳過，輪到下一個', () => {
    expect(pickWeeklyTry([a, b], { a: { achieved: true } })).toEqual({
      tip: 'b1',
      title: '題目 b',
    });
  });

  it('取消勾選（achieved: false）的項目算還沒會', () => {
    expect(pickWeeklyTry([a, b], { a: { achieved: false } })?.title).toBe('題目 a');
  });

  it('沒有點子的項目跳過，不佔位置', () => {
    expect(pickWeeklyTry([noTips, b], {})).toEqual({ tip: 'b1', title: '題目 b' });
  });

  it('全部勾了就沒有東西可給', () => {
    const progress = { a: { achieved: true }, b: { achieved: true } };
    expect(pickWeeklyTry([a, b], progress)).toBeNull();
    expect(allAchieved([a, b], progress)).toBe(true);
  });

  it('剩下的題目沒有點子時不給，但也不算全都會了', () => {
    const progress = { a: { achieved: true } };
    expect(pickWeeklyTry([a, noTips], progress)).toBeNull();
    expect(allAchieved([a, noTips], progress)).toBe(false);
  });

  it('空的年齡段不算全都會了', () => {
    expect(allAchieved([], {})).toBe(false);
  });
});

describe('bandEndLabel', () => {
  it('把每個年齡段的結束月齡寫成家長講的年齡', () => {
    expect(TODDLER_AGE_BANDS.map(bandEndLabel)).toEqual([
      '1 歲 3 個月',
      '1 歲半',
      '2 歲',
      '2 歲半',
      '3 歲',
    ]);
  });
});
