import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import type { RadarCell } from '../../types';
import {
  RADAR_THRESHOLDS,
  STATUS_COPY,
  FORBIDDEN_WORDS,
  statusOf,
  freshnessOf,
  formatRate,
  formatWeekRange,
} from './radar';

const HERE = dirname(fileURLToPath(import.meta.url));

/** 只覆寫關心的欄位，其餘給一組「分母夠大、算得出比值」的預設。 */
function cell(overrides: Partial<RadarCell>): RadarCell {
  return {
    rate: 100,
    trendBase: 100,
    ratio: 1,
    geoRatio: 1,
    visits: 20,
    denom: 2000,
    reliability: 'ok',
    spark: [null, null, null, null, null, null, null, 100],
    ...overrides,
  };
}

describe('statusOf 的邊界', () => {
  it('P90 是「最近變多，多留意」的下界，且下界本身算在內', () => {
    expect(statusOf(cell({ ratio: 1.77 }))).toBe('risingStrong');
    expect(statusOf(cell({ ratio: 1.769 }))).toBe('rising');
  });

  it('P75 是「稍微變多」的下界', () => {
    expect(statusOf(cell({ ratio: 1.26 }))).toBe('rising');
    expect(statusOf(cell({ ratio: 1.259 }))).toBe('steady');
  });

  it('P25 是「跟平常差不多」的下界', () => {
    expect(statusOf(cell({ ratio: 0.78 }))).toBe('steady');
    expect(statusOf(cell({ ratio: 0.779 }))).toBe('falling');
  });
});

describe('statusOf 的基線為零', () => {
  it('前 8 週與本週都沒有個案 → 最近沒有個案', () => {
    expect(statusOf(cell({ rate: 0, trendBase: 0, ratio: null, visits: 0 }))).toBe('none');
  });

  it('前 8 週沒有、本週開始有 → 這週開始出現，而不是無限倍', () => {
    expect(statusOf(cell({ rate: 12, trendBase: 0, ratio: null, visits: 3 }))).toBe('emerged');
  });
});

describe('statusOf 的樣本品質優先於比值', () => {
  it('分母 300–999 只標樣本偏小，不給狀態', () => {
    expect(statusOf(cell({ reliability: 'small', ratio: 3 }))).toBe('smallSample');
  });

  it('分母不足 300 是資料不足', () => {
    expect(
      statusOf(cell({ reliability: 'insufficient', rate: null, ratio: null, denom: 29 })),
    ).toBe('insufficient');
  });
});

describe('freshnessOf', () => {
  const weekEnd = '2026-08-29';

  it('14 天內是新的', () => {
    expect(freshnessOf(weekEnd, new Date('2026-09-12T00:00:00Z'))).toBe('fresh');
  });

  it('超過 14 天但不到 35 天是有點舊', () => {
    expect(freshnessOf(weekEnd, new Date('2026-09-13T00:00:00Z'))).toBe('stale');
    expect(freshnessOf(weekEnd, new Date('2026-10-03T00:00:00Z'))).toBe('stale');
  });

  it('超過 35 天要收起狀態', () => {
    expect(freshnessOf(weekEnd, new Date('2026-10-04T00:00:00Z'))).toBe('expired');
  });
});

/**
 * spec §6.1 第 3 條的禁用詞，逐字抄在測試這一側。
 *
 * 刻意不從 radar.ts 取用 FORBIDDEN_WORDS 來檢查文案：那是套套邏輯——實作只要
 * 把某個詞從清單裡刪掉、同時把它寫進 STATUS_COPY，測試照樣綠。真正要守的是
 * spec 的清單，所以由測試自己持有一份。
 */
const BANNED_IN_SPEC = [
  '警戒',
  '升溫',
  '爆發',
  '危險',
  '疫情嚴峻',
  '拉警報',
  '慎防',
] as const;

describe('語氣', () => {
  it('八個狀態的文案都不含 spec 的禁用詞', () => {
    for (const { label } of Object.values(STATUS_COPY)) {
      for (const word of BANNED_IN_SPEC) {
        expect(label).not.toContain(word);
      }
    }
  });

  it('FORBIDDEN_WORDS 這個對外契約涵蓋 spec 的七個詞', () => {
    for (const word of BANNED_IN_SPEC) {
      expect(FORBIDDEN_WORDS).toContain(word);
    }
  });

  it('沒有任何狀態用到 primary-dark——那是全 app 最強的文字色', () => {
    for (const { tone } of Object.values(STATUS_COPY)) {
      expect(tone).not.toContain('primary-dark');
    }
  });

  it('狀態文案不含箭頭與驚嘆號', () => {
    for (const { label } of Object.values(STATUS_COPY)) {
      expect(label).not.toMatch(/[↑↓→!！]/);
    }
  });
});

describe('formatRate', () => {
  it('沒有率的時候給破折號，不給 0', () => {
    expect(formatRate(null)).toBe('—');
  });

  it('保留一位小數並帶單位', () => {
    expect(formatRate(169)).toBe('169.0/萬');
  });
});

describe('formatWeekRange', () => {
  it('同年的疫情週給月/日，不給「第 34 週」', () => {
    expect(formatWeekRange('2026-08-23', '2026-08-29')).toBe('8/23–8/29');
  });

  it('跨年的週照樣只給月/日，不會冒出年份', () => {
    expect(formatWeekRange('2025-12-28', '2026-01-03')).toBe('12/28–1/3');
  });

  it('月與日都去掉補零——家長寫日期不寫 08/09', () => {
    expect(formatWeekRange('2026-01-04', '2026-01-10')).toBe('1/4–1/10');
    expect(formatWeekRange('2026-10-11', '2026-10-17')).toBe('10/11–10/17');
  });

  it('分隔符是 en dash（U+2013），不是 hyphen', () => {
    const range = formatWeekRange('2026-08-23', '2026-08-29');
    expect(range).toContain('\u2013');
    expect(range).not.toContain('-');
  });
});

describe('門檻常數', () => {
  it('與 spec §4.5 的百分位一致', () => {
    expect(RADAR_THRESHOLDS).toEqual({ p25: 0.78, p75: 1.26, p90: 1.77 });
  });
});

describe('門檻與 shipped 資料的校準', () => {
  it('程式碼常數沒有跟資料分布漂開', () => {
    // 動態 import 避開 vitest 的 happy-dom 環境對 node:fs 的限制順序問題。
    const data = JSON.parse(
      readFileSync(join(HERE, '../../../public/data/diseaseRadar.json'), 'utf8'),
    );
    expect(Math.abs(data.calibration.trendP25 - RADAR_THRESHOLDS.p25)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(data.calibration.trendP75 - RADAR_THRESHOLDS.p75)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(data.calibration.trendP90 - RADAR_THRESHOLDS.p90)).toBeLessThanOrEqual(0.05);
  });
});
