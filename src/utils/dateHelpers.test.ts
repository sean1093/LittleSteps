import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isSameDay,
  calculateAge,
  calculateDuration,
  formatTime,
  formatDuration,
  getCurrentDateTimeLocal,
  dateTimeLocalToISO,
} from './dateHelpers';

/**
 * Builds an instant from *local* calendar fields (month is 1-based).
 *
 * `getCurrentDateTimeLocal`, `dateTimeLocalToISO` and `formatTime` all operate on
 * the local wall clock, so fixtures are pinned by local fields instead of a UTC
 * literal. That keeps every expectation exact no matter which timezone the test
 * runner sits in.
 */
const localDate = (
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0,
  ms = 0
): Date => new Date(year, month - 1, day, hours, minutes, seconds, ms);

describe('calculateAge', () => {
  const at = (year: number, month: number, day: number) => {
    vi.useFakeTimers();
    vi.setSystemTime(localDate(year, month, day, 12));
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  it('計算整月數', () => {
    at(2026, 8, 27);
    expect(calculateAge('2024-08-27')).toBe(24);
    expect(calculateAge('2025-02-27')).toBe(18);
  });

  it('尚未過當月生日時不計入該月', () => {
    at(2026, 8, 26);
    expect(calculateAge('2024-08-27')).toBe(23);
  });

  it('月底出生的孩子不會在隔月一號就多一個月', () => {
    at(2026, 2, 1);
    expect(calculateAge('2026-01-31')).toBe(0);
  });

  it('尚未出生時回傳 0 而非負數', () => {
    at(2026, 8, 27);
    expect(calculateAge('2027-01-01')).toBe(0);
  });

  it('生日當天即進位', () => {
    at(2026, 8, 27);
    expect(calculateAge('2025-08-27')).toBe(12);
  });
});

// Captured before any test installs fake timers, so these are real Date values.
const JUN_15_0805 = localDate(2026, 6, 15, 8, 5);
const JUN_16_0805 = localDate(2026, 6, 16, 8, 5);

describe('dateHelpers', () => {
  describe('isSameDay', () => {
    it('should return true for two times within the same UTC calendar day', () => {
      expect(isSameDay('2026-06-15T00:00:00.000Z', '2026-06-15T23:59:59.999Z')).toBe(true);
    });

    it('should return false for times on adjacent UTC calendar days', () => {
      expect(isSameDay('2026-06-15T23:59:59.999Z', '2026-06-16T00:00:00.000Z')).toBe(false);
    });

    it('should compare UTC calendar days, so one hour across UTC midnight is a different day', () => {
      const beforeMidnight = new Date(Date.UTC(2026, 5, 15, 23, 30));
      const afterMidnight = new Date(Date.UTC(2026, 5, 16, 0, 30));

      expect(isSameDay(beforeMidnight, afterMidnight)).toBe(false);
    });

    it('should accept Date and string inputs interchangeably', () => {
      const date = new Date('2026-06-15T10:00:00.000Z');

      expect(isSameDay(date, '2026-06-15T20:00:00.000Z')).toBe(true);
      expect(isSameDay('2026-06-15T20:00:00.000Z', date)).toBe(true);
      expect(isSameDay(date, new Date('2026-06-15T02:00:00.000Z'))).toBe(true);
      expect(isSameDay(date, new Date('2026-06-14T10:00:00.000Z'))).toBe(false);
    });

    it('should treat offset notation of the same instant as the same day', () => {
      // 2026-06-15T08:00+08:00 === 2026-06-15T00:00Z
      expect(isSameDay('2026-06-15T08:00:00+08:00', '2026-06-15T00:00:00.000Z')).toBe(true);
    });

    it('should return true for the identical instant and false exactly 24h apart', () => {
      const instant = '2026-06-15T12:00:00.000Z';

      expect(isSameDay(instant, instant)).toBe(true);
      expect(isSameDay(instant, '2026-06-16T12:00:00.000Z')).toBe(false);
    });

    it('should throw for an unparseable date', () => {
      expect(() => isSameDay('not-a-date', '2026-06-15T00:00:00.000Z')).toThrow(RangeError);
    });
  });

  describe('calculateDuration', () => {
    it('should return the number of whole minutes between two instants', () => {
      expect(calculateDuration('2026-06-15T08:00:00.000Z', '2026-06-15T09:30:00.000Z')).toBe(90);
    });

    it('should floor partial minutes', () => {
      // 119 seconds => 1.98 minutes => 1
      expect(calculateDuration('2026-06-15T08:00:00.000Z', '2026-06-15T08:01:59.000Z')).toBe(1);
      // 59 seconds => 0.98 minutes => 0
      expect(calculateDuration('2026-06-15T08:00:00.000Z', '2026-06-15T08:00:59.999Z')).toBe(0);
    });

    it('should return 0 for identical timestamps', () => {
      expect(calculateDuration('2026-06-15T08:00:00.000Z', '2026-06-15T08:00:00.000Z')).toBe(0);
    });

    it('should floor towards negative infinity when end precedes start', () => {
      expect(calculateDuration('2026-06-15T08:30:00.000Z', '2026-06-15T08:00:00.000Z')).toBe(-30);
      // -90 seconds => -1.5 minutes => floored to -2 (not truncated to -1)
      expect(calculateDuration('2026-06-15T08:01:30.000Z', '2026-06-15T08:00:00.000Z')).toBe(-2);
    });

    it('should span day boundaries', () => {
      // 22:00 -> 06:30 next day = 8h30m
      expect(calculateDuration('2026-06-15T22:00:00.000Z', '2026-06-16T06:30:00.000Z')).toBe(510);
    });

    it('should compare instants rather than wall-clock text', () => {
      // 17:00+08:00 === 09:00Z, one hour after 08:00Z
      expect(calculateDuration('2026-06-15T08:00:00.000Z', '2026-06-15T17:00:00+08:00')).toBe(60);
    });

    it('should return NaN when an input is unparseable', () => {
      expect(calculateDuration('not-a-date', '2026-06-15T08:00:00.000Z')).toBeNaN();
      expect(calculateDuration('2026-06-15T08:00:00.000Z', 'not-a-date')).toBeNaN();
    });
  });

  describe('formatTime', () => {
    it('should render a zero-padded 24-hour HH:mm shape', () => {
      // Locale output is environment dependent, so only the shape is asserted.
      expect(formatTime(JUN_15_0805.toISOString())).toMatch(/^\d{2}:\d{2}$/);
      expect(formatTime(localDate(2026, 6, 15, 21, 45).toISOString())).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should render the local wall-clock hour and minute', () => {
      expect(formatTime(JUN_15_0805.toISOString()).match(/\d+/g)).toEqual(['08', '05']);
      expect(
        formatTime(localDate(2026, 6, 15, 21, 45).toISOString()).match(/\d+/g)
      ).toEqual(['21', '45']);
    });

    it('should ignore seconds and milliseconds', () => {
      const onTheMinute = localDate(2026, 6, 15, 8, 5, 0, 0).toISOString();
      const nearlyNextMinute = localDate(2026, 6, 15, 8, 5, 59, 999).toISOString();

      expect(formatTime(nearlyNextMinute)).toBe(formatTime(onTheMinute));
    });

    it('should render the same wall-clock time for instants exactly 24h apart', () => {
      expect(formatTime(JUN_16_0805.toISOString())).toBe(formatTime(JUN_15_0805.toISOString()));
    });

    it('should change when the instant advances by one minute', () => {
      const oneMinuteLater = localDate(2026, 6, 15, 8, 6).toISOString();

      expect(formatTime(oneMinuteLater)).not.toBe(formatTime(JUN_15_0805.toISOString()));
    });
  });

  describe('formatDuration', () => {
    it('should render minutes only when under an hour', () => {
      expect(formatDuration(0)).toBe('0分鐘');
      expect(formatDuration(1)).toBe('1分鐘');
      expect(formatDuration(45)).toBe('45分鐘');
      expect(formatDuration(59)).toBe('59分鐘');
    });

    it('should render hours only when minutes divide evenly', () => {
      expect(formatDuration(60)).toBe('1小時');
      expect(formatDuration(120)).toBe('2小時');
      expect(formatDuration(1440)).toBe('24小時');
    });

    it('should render hours and minutes when both are non-zero', () => {
      expect(formatDuration(61)).toBe('1小時1分鐘');
      expect(formatDuration(90)).toBe('1小時30分鐘');
      expect(formatDuration(185)).toBe('3小時5分鐘');
    });
  });

  describe('getCurrentDateTimeLocal', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should render the mocked local now as YYYY-MM-DDTHH:mm', () => {
      vi.setSystemTime(JUN_15_0805);

      expect(getCurrentDateTimeLocal()).toBe('2026-06-15T08:05');
    });

    it('should zero-pad single-digit month, day, hour and minute', () => {
      vi.setSystemTime(localDate(2026, 1, 3, 7, 9));

      expect(getCurrentDateTimeLocal()).toBe('2026-01-03T07:09');
    });

    it('should render two-digit month, day and 24-hour time without padding artefacts', () => {
      vi.setSystemTime(localDate(2026, 11, 25, 23, 59));

      expect(getCurrentDateTimeLocal()).toBe('2026-11-25T23:59');
    });

    it('should drop seconds and milliseconds from now', () => {
      vi.setSystemTime(localDate(2026, 6, 15, 8, 5, 59, 999));

      expect(getCurrentDateTimeLocal()).toBe('2026-06-15T08:05');
    });

    it('should always match the datetime-local input format', () => {
      vi.setSystemTime(localDate(2026, 12, 31, 0, 0));

      expect(getCurrentDateTimeLocal()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(getCurrentDateTimeLocal()).toBe('2026-12-31T00:00');
    });
  });

  describe('dateTimeLocalToISO', () => {
    it('should interpret the input as local wall time and return the UTC instant', () => {
      expect(dateTimeLocalToISO('2026-06-15T08:05')).toBe(JUN_15_0805.toISOString());
    });

    it('should return a full ISO-8601 UTC string', () => {
      expect(dateTimeLocalToISO('2026-06-15T08:05')).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it('should zero the seconds and milliseconds not present in the input', () => {
      expect(dateTimeLocalToISO('2026-06-15T08:05')).toMatch(/:00\.000Z$/);
      expect(dateTimeLocalToISO('2026-01-03T07:09')).toMatch(/:00\.000Z$/);
    });

    it('should preserve seconds when the input includes them', () => {
      expect(dateTimeLocalToISO('2026-06-15T08:05:30')).toBe(
        localDate(2026, 6, 15, 8, 5, 30).toISOString()
      );
    });

    it('should throw for an unparseable datetime-local value', () => {
      expect(() => dateTimeLocalToISO('not-a-date')).toThrow(RangeError);
      expect(() => dateTimeLocalToISO('')).toThrow(RangeError);
    });

    describe('round trip with getCurrentDateTimeLocal', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should round-trip the current minute back to the same instant', () => {
        vi.setSystemTime(JUN_15_0805);

        const iso = dateTimeLocalToISO(getCurrentDateTimeLocal());

        expect(iso).toBe(JUN_15_0805.toISOString());
        expect(new Date(iso).getTime()).toBe(JUN_15_0805.getTime());
      });

      it('should round-trip back to the same datetime-local string', () => {
        const now = localDate(2026, 11, 25, 23, 59);
        vi.setSystemTime(now);

        const dateTimeLocal = getCurrentDateTimeLocal();
        const iso = dateTimeLocalToISO(dateTimeLocal);

        // ISO -> local fields must reproduce the original input verbatim.
        vi.setSystemTime(new Date(iso));
        expect(getCurrentDateTimeLocal()).toBe(dateTimeLocal);
      });
    });
  });
});
