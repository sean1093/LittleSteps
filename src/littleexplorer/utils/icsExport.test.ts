import { describe, it, expect } from 'vitest';
import type { ResolvedCareTask } from '../../types';
import { buildGoogleCalendarUrl, buildIcs } from './icsExport';

const task = (
  overrides: Partial<ResolvedCareTask> = {},
): ResolvedCareTask => ({
  template: {
    id: 'health-check-18m',
    kind: 'health-check',
    title: '兒童預防保健第 5 次',
    description: '1 歲 6 個月至未滿 2 歲，攜帶健保卡與兒童健康手冊',
    dueMonth: 18,
    fromMonth: 18,
    toMonth: 24,
    source: '國民健康署',
  },
  dueDate: '2025-07-15',
  windowEnd: '2026-01-15',
  status: 'upcoming',
  daysUntilDue: 100,
  ...overrides,
});

describe('buildIcs', () => {
  it('產生完整的 VCALENDAR 外框', () => {
    const ics = buildIcs([task()], '小樹');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain('VERSION:2.0');
  });

  it('每個任務產生一個全天 VEVENT', () => {
    const ics = buildIcs([task()], '小樹');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('DTSTART;VALUE=DATE:20250715');
    // 全天事件的 DTEND 為隔日（exclusive）
    expect(ics).toContain('DTEND;VALUE=DATE:20250716');
  });

  it('標題含孩子名字', () => {
    expect(buildIcs([task()], '小樹')).toContain('小樹');
  });

  it('附提前 7 天的 VALARM', () => {
    const ics = buildIcs([task()], '小樹');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:-P7D');
    expect(ics).toContain('END:VALARM');
  });

  it('排除已完成的任務', () => {
    const ics = buildIcs(
      [task({ status: 'done', completedDate: '2025-08-01' })],
      '小樹',
    );
    expect(ics).not.toContain('BEGIN:VEVENT');
  });

  it('依 RFC 5545 跳脫反斜線、分號、逗號與換行', () => {
    const ics = buildIcs(
      [
        task({
          template: {
            ...task().template,
            title: 'a\\b;c,d',
            description: 'line1\nline2',
          },
        }),
      ],
      '小樹',
    );
    expect(ics).toContain('a\\\\b\\;c\\,d');
    expect(ics).toContain('line1\\nline2');
  });

  it('每一列以 CRLF 結尾', () => {
    const ics = buildIcs([task()], '小樹');
    const bareNewlines = ics.split('\n').filter((line) => !line.endsWith('\r'));
    // 只有結尾的空字串不以 \r 收尾
    expect(bareNewlines).toEqual(['']);
  });

  it('UID 具唯一性且穩定', () => {
    const first = buildIcs([task()], '小樹');
    const second = buildIcs([task()], '小樹');
    const uidOf = (ics: string) => ics.match(/UID:(.+)\r\n/)![1];
    expect(uidOf(first)).toBe(uidOf(second));
    expect(uidOf(first)).toContain('health-check-18m');
  });
});

describe('buildGoogleCalendarUrl', () => {
  it('產生帶 TEMPLATE action 與全天日期區間的連結', () => {
    const url = new URL(buildGoogleCalendarUrl(task(), '小樹'));
    expect(url.origin + url.pathname).toBe(
      'https://calendar.google.com/calendar/render',
    );
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('dates')).toBe('20250715/20250716');
  });

  it('標題與說明經過 URL 編碼', () => {
    const url = new URL(buildGoogleCalendarUrl(task(), '小樹'));
    expect(url.searchParams.get('text')).toContain('小樹');
    expect(url.searchParams.get('details')).toContain('國民健康署');
  });
});
