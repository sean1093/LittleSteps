import type { RadarCell } from '../../types';

/**
 * 疫情雷達的狀態判定。
 *
 * 這個服務的用途是提醒家長多留意，不是製造焦慮，所以這裡有兩條硬規則：
 *
 * 1. 文案用「跟平常比」的日常說法。禁用詞見 FORBIDDEN_WORDS，radar.test.ts
 *    會逐條檢查。
 * 2. 顏色最強只到 butter-dark。不用 primary-dark——那是全 app 最強的文字色，
 *    用在「比平常多一點」上會讀成急診警報。
 *
 * 門檻不是手感，是實測分布的百分位：以「本週 ÷ 前 8 週中位數」為基準，近 3 年
 * 48,725 個樣本的 P25/P75/P90 分別是 0.78 / 1.26 / 1.77（中位數 1.01）。
 * 曾經考慮過的「前 5 年同週中位數」被否決，因為 2020-2022 的防疫措施讓腸病毒
 * 幾乎消失，那個基線下 ratio 的中位數是 1.63，門檻怎麼訂都會全年亮燈。
 */

export type RadarStatus =
  | 'risingStrong'
  | 'rising'
  | 'steady'
  | 'falling'
  | 'none'
  | 'emerged'
  | 'smallSample'
  | 'insufficient';

export type RadarFreshness = 'fresh' | 'stale' | 'expired';

export const RADAR_THRESHOLDS = { p25: 0.78, p75: 1.26, p90: 1.77 } as const;

/** 資料超過兩個更新週期沒進來就標註，超過五週就收起狀態。 */
export const FRESHNESS_DAYS = { stale: 14, expired: 35 } as const;

export const FORBIDDEN_WORDS = [
  '警戒',
  '升溫',
  '爆發',
  '危險',
  '疫情嚴峻',
  '拉警報',
  '慎防',
] as const;

export const STATUS_COPY: Record<RadarStatus, { label: string; tone: string }> = {
  risingStrong: { label: '最近變多，多留意', tone: 'text-butter-dark' },
  rising: { label: '稍微變多', tone: 'text-ink' },
  steady: { label: '跟平常差不多', tone: 'text-ink-muted' },
  falling: { label: '比平常少', tone: 'text-mint-dark' },
  none: { label: '最近沒有個案', tone: 'text-ink-faint' },
  emerged: { label: '這週開始出現', tone: 'text-ink' },
  smallSample: { label: '樣本偏小，僅供參考', tone: 'text-ink-faint' },
  insufficient: { label: '資料不足', tone: 'text-ink-faint' },
};

/**
 * 樣本品質先於比值：分母不到 1,000 時，ratio 的離散度（P90−P10）從 1.20 跳到
 * 2.75 以上，而分母低於 1,000 有超過十分之一的週是零例，比值沒有意義。
 */
export function statusOf(cell: RadarCell): RadarStatus {
  if (cell.reliability === 'insufficient') return 'insufficient';
  if (cell.reliability === 'small') return 'smallSample';
  if (cell.trendBase === null || cell.trendBase === 0) {
    return (cell.rate ?? 0) > 0 ? 'emerged' : 'none';
  }
  const ratio = cell.ratio;
  if (ratio === null) return 'steady';
  if (ratio >= RADAR_THRESHOLDS.p90) return 'risingStrong';
  if (ratio >= RADAR_THRESHOLDS.p75) return 'rising';
  if (ratio >= RADAR_THRESHOLDS.p25) return 'steady';
  return 'falling';
}

export function freshnessOf(weekEnd: string, today: Date = new Date()): RadarFreshness {
  const end = new Date(`${weekEnd}T00:00:00Z`);
  const days = Math.floor(
    (Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) - end.getTime()) /
      86400000,
  );
  if (days > FRESHNESS_DAYS.expired) return 'expired';
  if (days > FRESHNESS_DAYS.stale) return 'stale';
  return 'fresh';
}

export function formatRate(rate: number | null): string {
  return rate === null ? '—' : `${rate.toFixed(1)}/萬`;
}

/** 「8/23–8/29」：家長看得懂日期，看不懂「第 34 週」。 */
export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const [, startMonth, startDay] = weekStart.split('-');
  const [, endMonth, endDay] = weekEnd.split('-');
  return `${Number(startMonth)}/${Number(startDay)}–${Number(endMonth)}/${Number(endDay)}`;
}
