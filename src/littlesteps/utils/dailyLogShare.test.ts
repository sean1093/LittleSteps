import { describe, expect, it } from 'vitest';
import type { DailyLog } from '../../types';
import { buildDailyLogShareText } from './dailyLogShare';

/**
 * The text a parent sends to a sitter or a grandparent. It is the only thing
 * that leaves the app, so what it says has to be right on its own.
 */
const NOW = new Date(2026, 10, 26, 15, 0); // 2026-11-26 15:00 local

const at = (day: number, hours: number, minutes = 0) =>
  new Date(2026, 10, day, hours, minutes).toISOString();

const log = (id: string, type: DailyLog['type'], timestamp: string, data: DailyLog['data']): DailyLog => ({
  id,
  childId: 'c1',
  type,
  timestamp,
  data,
  createdAt: timestamp,
});

describe('buildDailyLogShareText', () => {
  it('says plainly that nothing has been logged on an empty day', () => {
    const text = buildDailyLogShareText('小豆', [], NOW);

    expect(text).toBe('【小豆 今天的紀錄】11/26\n今天還沒有紀錄。');
  });

  it('lists feeds with times and amounts in order, and leaves pumping out entirely', () => {
    const text = buildDailyLogShareText(
      '小豆',
      [
        log('f2', 'feeding', at(26, 11, 30), { feedingType: 'formula', amount: 120 }),
        log('p1', 'feeding', at(26, 12, 0), { feedingType: 'pumping', amount: 150 }),
        log('f1', 'feeding', at(26, 8, 5), { feedingType: 'breast_left', duration: 15 }),
      ],
      NOW,
    );

    expect(text).toContain('餵奶（2 次）\n08:05 母乳（左） 15 分鐘\n11:30 配方奶 120 ml');
    expect(text).not.toContain('擠奶');
    expect(text).not.toContain('150');
    // The last feed is the 11:30 bottle, not the 12:00 pumping session.
    expect(text).toContain('上次餵奶：11:30 配方奶');
  });

  it('says a sleep still open is still going, and counts a finished one with its length', () => {
    const text = buildDailyLogShareText(
      '小豆',
      [
        log('s1', 'sleep', at(26, 9, 0), {
          startTime: at(26, 9, 0),
          endTime: at(26, 10, 30),
          duration: 90,
        }),
        log('s2', 'sleep', at(26, 14, 10), { startTime: at(26, 14, 10) }),
      ],
      NOW,
    );

    expect(text).toContain('睡眠（2 次）');
    expect(text).toContain('09:00–10:30（1小時30分鐘）');
    expect(text).toContain('14:10 入睡，還在睡');
    expect(text).toContain('現在在睡：14:10 入睡');
  });

  it('dates the last feed when it was yesterday, so last night is not read as just now', () => {
    const text = buildDailyLogShareText(
      '小豆',
      [
        log('f0', 'feeding', at(25, 23, 40), { feedingType: 'formula', amount: 90 }),
        log('d1', 'diaper', at(26, 7, 0), { type: 'both', consistency: 'soft' }),
      ],
      NOW,
    );

    expect(text).not.toContain('餵奶（');
    expect(text).toContain('尿布（1 次）\n07:00 大小便 稀');
    expect(text).toContain('上次餵奶：11/25 23:40 配方奶');
    expect(text).toContain('上次換尿布：07:00 大小便');
  });

  it('carries no link of any kind', () => {
    const text = buildDailyLogShareText(
      '小豆',
      [log('f1', 'feeding', at(26, 8), { feedingType: 'formula', amount: 120 })],
      NOW,
    );
    expect(text).not.toMatch(/https?:|www\./);
  });
});
