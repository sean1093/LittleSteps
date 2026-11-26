import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { DailyLog, DiaperData, FeedingData, SleepData } from '../../types';
import {
  detectFeedingAlerts,
  detectPoopAlerts,
  detectSleepAlerts,
  getActiveAlerts,
} from './alertEngine';

/**
 * 這個模組用 `new Date()` 決定「今天」「昨天」，並以 `toLocalDateKey()` 轉成
 * 本地日曆日。vitest.config.ts 已把 process.env.TZ 釘在 Asia/Taipei，所以
 * 下面的日期字串就是台灣使用者看到的日曆日，時間戳一律寫 +08:00。
 *
 * FIXED_NOW 是真實瞬間，等於台灣時間 2026-06-15 上午 09:00——刻意選在早上，
 * 因為這一批修正要證明的就是「早上不會因為今天還沒睡滿一天而跳警示」。
 */
const FIXED_NOW = new Date('2026-06-15T01:00:00Z');
const TODAY = '2026-06-15';
const YESTERDAY = '2026-06-14';

const AGE_MONTHS = 4; // 4 個月 -> 建議 12-17 小時，70% 門檻是 8.4 小時

let logSeq = 0;

const makeLog = (
  type: DailyLog['type'],
  timestamp: string,
  data: FeedingData | SleepData | DiaperData
): DailyLog => ({
  id: `log-${logSeq++}`,
  childId: 'child-1',
  type,
  timestamp,
  data,
  createdAt: timestamp,
});

const feeding = (date: string, amount: number, hour = '09'): DailyLog =>
  makeLog('feeding', `${date}T${hour}:00:00+08:00`, { feedingType: 'formula', amount });

/** 已結束的睡眠，帶明確時長（分鐘）。 */
const sleep = (date: string, durationMinutes: number, hour = '20'): DailyLog => {
  const startTime = `${date}T${hour}:00:00+08:00`;
  const endTime = new Date(new Date(startTime).getTime() + durationMinutes * 60_000).toISOString();
  return makeLog('sleep', startTime, { startTime, endTime, duration: durationMinutes });
};

/** 還在睡：沒有 endTime，也沒有 duration。 */
const sleepInProgress = (date: string, hour = '20'): DailyLog => {
  const startTime = `${date}T${hour}:00:00+08:00`;
  return makeLog('sleep', startTime, { startTime });
};

const poop = (date: string, hour = '09'): DailyLog =>
  makeLog('diaper', `${date}T${hour}:00:00+08:00`, { type: 'poop' });

const pee = (date: string, hour = '09'): DailyLog =>
  makeLog('diaper', `${date}T${hour}:00:00+08:00`, { type: 'pee' });

const idsOf = (alerts: { id: string }[]) => alerts.map((alert) => alert.id);

/** 餵奶間隔的提醒只給未滿 3 個月的寶寶。 */
const NEWBORN_MONTHS = 1;

describe('alertEngine', () => {
  beforeEach(() => {
    logSeq = 0;
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('detectSleepAlerts', () => {
    it('stays silent in the morning even though today is nowhere near a full day of sleep', () => {
      // 今天到 09:00 只睡了 2 小時，遠低於 12 小時的 70%。原本這裡會亮
      // 「今日睡眠時數偏低」，而且會一路亮到深夜——每天早上都一樣。
      const logs = [sleep(YESTERDAY, 780), sleep(TODAY, 120, '05')];

      expect(detectSleepAlerts(logs, AGE_MONTHS)).toEqual([]);
    });

    it('flags yesterday once the day is over and the total really was short', () => {
      const alerts = detectSleepAlerts([sleep(YESTERDAY, 360)], AGE_MONTHS);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].id).toBe('sleep-below-recommended');
      expect(alerts[0].title).toBe('昨日睡眠時數偏低');
      expect(alerts[0].message).toBe(
        '昨日睡眠 6.0 小時，低於建議最低 12 小時的 70%，請注意寶寶作息。'
      );
    });

    it('says nothing when yesterday met the recommendation', () => {
      expect(detectSleepAlerts([sleep(YESTERDAY, 780)], AGE_MONTHS)).toEqual([]);
    });

    it('says nothing when yesterday has no sleep record at all', () => {
      // 沒記錄不是沒睡。
      expect(detectSleepAlerts([sleep(TODAY, 120, '05')], AGE_MONTHS)).toEqual([]);
    });

    it('says nothing when one of yesterday\u2019s sleeps was never ended', () => {
      // 忘了按結束的那一段沒有時數，昨天的總和就是不完整的。
      const logs = [sleep(YESTERDAY, 240, '13'), sleepInProgress(YESTERDAY)];

      expect(detectSleepAlerts(logs, AGE_MONTHS)).toEqual([]);
    });

    it('adds up every completed sleep of yesterday before judging', () => {
      // 4 + 2 + 2.5 = 8.5 小時，剛好高於 8.4 小時的門檻；少算任何一段都會亮警示。
      const logs = [
        sleep(YESTERDAY, 240, '01'),
        sleep(YESTERDAY, 120, '13'),
        sleep(YESTERDAY, 150, '20'),
      ];

      expect(detectSleepAlerts(logs, AGE_MONTHS)).toEqual([]);
    });
  });

  describe('detectFeedingAlerts', () => {
    /** 06-08 到 06-13：昨天之前那六天，每天固定奶量。 */
    const baselineWeek = (amount: number): DailyLog[] =>
      ['2026-06-08', '2026-06-09', '2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13'].map(
        (date) => feeding(date, amount)
      );

    it('does not judge today halfway through it', () => {
      // 今天早上才喝 100ml，昨天整天 800ml 與前六天持平。
      const logs = [...baselineWeek(800), feeding(YESTERDAY, 800), feeding(TODAY, 100)];

      expect(idsOf(detectFeedingAlerts(logs, AGE_MONTHS))).not.toContain('feeding-low-amount');
    });

    it('flags yesterday when its total fell below 70% of the week', () => {
      const logs = [...baselineWeek(800), feeding(YESTERDAY, 300), feeding(TODAY, 200)];

      const alert = detectFeedingAlerts(logs, AGE_MONTHS).find(
        (a) => a.id === 'feeding-low-amount'
      );

      expect(alert?.title).toBe('昨日餵奶量偏低');
      expect(alert?.message).toBe(
        '昨日餵奶量 300ml，低於近一週平均 800ml 的 70%，請留意寶寶食慾。'
      );
    });

    it('leaves yesterday out of the average it is measured against', () => {
      // 550ml 低於前六天 800ml 的 70%（560ml），所以該說。把昨天自己算進
      // 平均會得到 764ml，門檻降到 535ml，這一天就被自己的低值救了回去。
      const logs = [...baselineWeek(800), feeding(YESTERDAY, 550)];

      const alert = detectFeedingAlerts(logs, AGE_MONTHS).find(
        (a) => a.id === 'feeding-low-amount'
      );

      expect(alert?.message).toBe(
        '昨日餵奶量 550ml，低於近一週平均 800ml 的 70%，請留意寶寶食慾。'
      );
    });

    it('ignores unlogged days instead of averaging them in as zero', () => {
      // 只有三天有記，平均是那三天的 900ml。補 0 會把平均壓到 450ml，
      // 昨天的 500ml 就變成「高於平均」，該說的話反而沒說。
      const logs = [
        feeding('2026-06-11', 900),
        feeding('2026-06-12', 900),
        feeding('2026-06-13', 900),
        feeding(YESTERDAY, 500),
      ];

      const alert = detectFeedingAlerts(logs, AGE_MONTHS).find(
        (a) => a.id === 'feeding-low-amount'
      );

      expect(alert?.message).toContain('平均 900ml');
    });

    it('needs at least three logged days before it calls anything an average', () => {
      const logs = [feeding('2026-06-12', 900), feeding('2026-06-13', 900), feeding(YESTERDAY, 100)];

      expect(idsOf(detectFeedingAlerts(logs, AGE_MONTHS))).not.toContain('feeding-low-amount');
    });

    it('says nothing about yesterday when yesterday was never logged', () => {
      const logs = [...baselineWeek(800), feeding(TODAY, 100)];

      expect(idsOf(detectFeedingAlerts(logs, AGE_MONTHS))).not.toContain('feeding-low-amount');
    });

    it('still reports a gap since the last feed, which is a real-time fact', () => {
      // 01:00 餵奶，08:30 還記了一片尿布：家長在記，只是八小時沒有餵奶紀錄。
      const alerts = detectFeedingAlerts(
        [feeding(TODAY, 120, '01'), pee(TODAY, '08')],
        NEWBORN_MONTHS,
      );

      expect(alerts).toHaveLength(1);
      expect(alerts[0].id).toBe('feeding-long-gap');
      expect(alerts[0].message).toBe('距離上次餵奶已經 8 小時，請確認寶寶是否需要餵食。');
    });

    it('reports no gap when the baby was fed within the last six hours', () => {
      expect(
        detectFeedingAlerts([feeding(TODAY, 120, '08'), pee(TODAY, '08')], NEWBORN_MONTHS),
      ).toEqual([]);
    });

    /*
      The alert measures time since the last LOGGED feed. A parent who simply
      stopped logging was being told, every time they opened the app, that
      their baby had not eaten for days.
    */
    describe('only while the parent is still logging', () => {
      it('stays silent when the last feed is also the last thing ever logged', () => {
        expect(detectFeedingAlerts([feeding(TODAY, 120, '01')], NEWBORN_MONTHS)).toEqual([]);
      });

      it('does not count a log older than the feed as evidence', () => {
        const logs = [pee(TODAY, '00'), feeding(TODAY, 120, '01')];

        expect(detectFeedingAlerts(logs, NEWBORN_MONTHS)).toEqual([]);
      });

      it('stays silent when the newer log is itself more than 24 hours old', () => {
        // 06-13 餵奶，06-14 08:59 記了尿布——距離現在 24 小時又 1 分鐘，之後就沒再記。
        const stale = makeLog('diaper', `${YESTERDAY}T08:59:00+08:00`, { type: 'pee' });
        const logs = [feeding('2026-06-13', 120, '20'), stale];

        expect(detectFeedingAlerts(logs, NEWBORN_MONTHS)).toEqual([]);
      });

      it('speaks when the newer log is exactly 24 hours old', () => {
        const logs = [feeding('2026-06-13', 120, '20'), pee(YESTERDAY, '09')];

        expect(idsOf(detectFeedingAlerts(logs, NEWBORN_MONTHS))).toEqual(['feeding-long-gap']);
      });
    });

    describe('only for a baby under three months', () => {
      const logs = () => [feeding(TODAY, 120, '01'), pee(TODAY, '08')];

      it('fires at two months', () => {
        expect(idsOf(detectFeedingAlerts(logs(), 2))).toEqual(['feeding-long-gap']);
      });

      it('is silent from three months on', () => {
        expect(detectFeedingAlerts(logs(), 3)).toEqual([]);
        expect(detectFeedingAlerts(logs(), AGE_MONTHS)).toEqual([]);
      });
    });

    /*
      A pumping session is the mother's output. Stored as a feeding log it
      silently reset the "six hours since the last feed" warning, so a mother
      who pumps at 02:00 stops being told that her BABY has not been fed.
    */
    it('does not let a pumping session stand in for a feed', () => {
      const pumped = makeLog('feeding', `${TODAY}T08:00:00+08:00`, {
        feedingType: 'pumping',
        amount: 140,
        duration: 20,
      });
      // 擠奶不是一餐，但它證明她還在記——所以提醒照樣要響。
      const alerts = detectFeedingAlerts([feeding(TODAY, 120, '01'), pumped], NEWBORN_MONTHS);

      expect(idsOf(alerts)).toContain('feeding-long-gap');
    });

    it('keeps pumped millilitres out of the daily intake baseline', () => {
      const pumpedYesterday = ['02', '06', '10', '14'].map((hour) =>
        makeLog('feeding', `${YESTERDAY}T${hour}:00:00+08:00`, {
          feedingType: 'pumping' as const,
          amount: 200,
        })
      );
      const logs = [...baselineWeek(800), feeding(YESTERDAY, 300), ...pumpedYesterday];

      // 昨天真正餵進去的是 300ml，只有基準的 37.5%。加上擠出來的 800ml
      // 會變成 1100ml，警示就消失了——而那正是這則警示要說的事。
      expect(idsOf(detectFeedingAlerts(logs, AGE_MONTHS))).toContain('feeding-low-amount');
    });
  });

  describe('detectPoopAlerts', () => {
    it('says nothing at 48 hours: a couple of days between stools is common', () => {
      // 06-13 08:00 之後 49 小時，家長今天還在記。
      expect(detectPoopAlerts([poop('2026-06-13', '08'), pee(TODAY, '08')])).toEqual([]);
    });

    it('says nothing at exactly 72 hours', () => {
      expect(detectPoopAlerts([poop('2026-06-12', '09'), pee(TODAY, '08')])).toEqual([]);
    });

    it('raises one warning past 72 hours, naming the signs that do need a doctor', () => {
      const alerts = detectPoopAlerts([poop('2026-06-12', '08'), pee(TODAY, '08')]);

      expect(alerts).toHaveLength(1);
      expect(alerts[0].id).toBe('poop-no-poop-72h');
      expect(alerts[0].severity).toBe('warning');
      expect(alerts[0].message).toBe(
        '已 73 小時沒有排便紀錄。便便軟、吃得好、精神好，幾天一次也常見；便硬、解便時哭、肚子脹、吐或帶血，請就醫。',
      );
    });

    it('never escalates to danger, however long it has been', () => {
      const alerts = detectPoopAlerts([poop('2026-06-05', '08'), pee(TODAY, '08')]);

      expect(alerts.map((alert) => alert.severity)).toEqual(['warning']);
    });

    it('stays silent when the stool is the last thing the parent logged', () => {
      expect(detectPoopAlerts([poop('2026-06-12', '08')])).toEqual([]);
    });

    it('stays silent when logging stopped more than 24 hours ago', () => {
      const stale = makeLog('diaper', `${YESTERDAY}T08:59:00+08:00`, { type: 'pee' });

      expect(detectPoopAlerts([poop('2026-06-10', '08'), stale])).toEqual([]);
    });

    it('speaks when the newest log is exactly 24 hours old', () => {
      const alerts = detectPoopAlerts([poop('2026-06-10', '08'), pee(YESTERDAY, '09')]);

      expect(idsOf(alerts)).toEqual(['poop-no-poop-72h']);
    });

    it('says nothing when there has never been a poop to measure from', () => {
      expect(detectPoopAlerts([feeding(TODAY, 120)])).toEqual([]);
    });
  });

  describe('getActiveAlerts', () => {
    it('reports the stool and sleep warnings together, neither as danger', () => {
      const logs = [poop('2026-06-12', '08'), sleep(YESTERDAY, 360), feeding(TODAY, 120, '08')];

      const alerts = getActiveAlerts(logs, AGE_MONTHS);
      expect(idsOf(alerts)).toEqual(['poop-no-poop-72h', 'sleep-below-recommended']);
      expect(alerts.every((alert) => alert.severity === 'warning')).toBe(true);
    });

    it('returns nothing on a well-recorded, unremarkable day', () => {
      const logs = [sleep(YESTERDAY, 780), poop(YESTERDAY), poop(TODAY, '07'), feeding(TODAY, 120, '08')];

      expect(getActiveAlerts(logs, AGE_MONTHS)).toEqual([]);
    });
  });
});
