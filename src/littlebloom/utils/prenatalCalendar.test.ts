import { describe, expect, it } from 'vitest';
import type { PrenatalCheckupTemplate } from '../data/prenatalCheckups';
import { resolvePrenatalItems } from './prenatalSchedule';
import { buildPrenatalIcs, outstandingPrenatalItems, prenatalEvent } from './prenatalCalendar';

const LMP = '2026-01-01';
/** 2026-05-01：LMP 之後第 17 週。 */
const NOW = new Date(2026, 4, 1, 12);

const template = (
  id: string,
  dueWeek: number,
  toWeek: number,
  extra: Partial<PrenatalCheckupTemplate> = {},
): PrenatalCheckupTemplate => ({
  id,
  kind: 'checkup',
  title: `項目 ${id}`,
  description: `說明 ${id}`,
  dueWeek,
  fromWeek: dueWeek,
  toWeek,
  source: '國民健康署',
  ...extra,
});

const early = template('early', 8, 11); // 2026-02-26，已過
const done = template('done', 12, 15);
const later = template('later', 28, 29); // 2026-07-16，還沒到
const templates = [early, done, later];

const resolve = () =>
  resolvePrenatalItems(LMP, templates, { done: { completedDate: '2026-03-26' } }, NOW);

describe('outstandingPrenatalItems', () => {
  it('做完的不算，其餘依建議日期排', () => {
    expect(outstandingPrenatalItems(resolve()).map((item) => item.template.id)).toEqual([
      'early',
      'later',
    ]);
  });

  it('建檔之前就到期的不算：那是 app 沒有的紀錄，不是待辦', () => {
    // 2026-04-01 建檔，early 的建議日 2026-02-26 在那之前。
    const ids = outstandingPrenatalItems(resolve(), '2026-04-01T04:00:00.000Z').map(
      (item) => item.template.id,
    );
    expect(ids).toEqual(['later']);
  });

  it('建檔之後才到期而沒做的照樣算', () => {
    const ids = outstandingPrenatalItems(resolve(), '2026-01-10T04:00:00.000Z').map(
      (item) => item.template.id,
    );
    expect(ids).toEqual(['early', 'later']);
  });
});

describe('prenatalEvent', () => {
  it('日期是建議週對應的那一天，標題是項目名稱', () => {
    const item = resolve().find((row) => row.template.id === 'later')!;
    const event = prenatalEvent(item, 'c1');

    // 2026-01-01 + 28 週。
    expect(event.date).toBe('2026-07-16');
    expect(event.title).toBe('項目 later');
    expect(event.details).toContain('說明 later');
    expect(event.details).toContain('建議第 28 週');
  });

  it('UID 不含日期，改了預產期重新匯出會蓋掉舊的那一筆', () => {
    const before = resolvePrenatalItems(LMP, [later], {}, NOW)[0];
    const after = resolvePrenatalItems('2026-01-08', [later], {}, NOW)[0];

    expect(after.dueDate).not.toBe(before.dueDate);
    expect(prenatalEvent(after, 'c1').uid).toBe(prenatalEvent(before, 'c1').uid);
    expect(prenatalEvent(before, 'c2').uid).not.toBe(prenatalEvent(before, 'c1').uid);
  });
});

describe('buildPrenatalIcs', () => {
  it('只序列化還沒做的項目，日期為全天事件', () => {
    const ics = buildPrenatalIcs(resolve(), { id: 'c1' }, NOW);

    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain('SUMMARY:項目 early');
    expect(ics).toContain('SUMMARY:項目 later');
    expect(ics).not.toContain('SUMMARY:項目 done');
    expect(ics).toContain('DTSTART;VALUE=DATE:20260716');
    expect(ics).toContain('DTEND;VALUE=DATE:20260717');
  });

  it('全部做完時是一份沒有行程的行事曆', () => {
    const items = resolvePrenatalItems(
      LMP,
      templates,
      Object.fromEntries(templates.map((t) => [t.id, { completedDate: '2026-03-01' }])),
      NOW,
    );
    expect(buildPrenatalIcs(items, { id: 'c1' }, NOW)).not.toContain('BEGIN:VEVENT');
  });
});
