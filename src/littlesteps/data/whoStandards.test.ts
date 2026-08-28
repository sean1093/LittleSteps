import { describe, it, expect } from 'vitest';
import type { Gender, MeasurementType } from '../../types';
import { calculatePercentile, calculateZScore } from '../utils/growthCalculator';
import { STANDING_HEIGHT_FROM_MONTHS, getWHOStandard } from './growthChartData';

/**
 * 把 WHO 公布的 z-score 表當成外部真相，反算回來對帳。
 *
 * 這一整條鏈——抄下來的 L/M/S、LMS 公式、常態分布近似——最後變成家長拿去給
 * 醫師看的百分位。原本的測試只斷言「有定義」、「男生比女生重」、範圍寬鬆，
 * 沒有任何一個數字對過 WHO；任何一格抄錯都照樣全綠。
 *
 * 下面的參考值不是手打的，是從 WHO 檔案用程式抽出來再貼進來的（查證日期
 * 2026-08-29）：
 *   體重  wfa-boys-0-5-zscores.pdf / wfa-girls-0-5-zscores.pdf
 *   身長/身高  lhfa-{boys,girls}-zscore-expanded-tables.xlsx
 *   頭圍  hcfa-{boys,girls}-0-5-zscores.xlsx
 * 手打過一次，當場打錯一個數（33 個月的身高），所以改成生成。
 */

/** 每個月齡對應 -3 到 +3 SD 的實測值 */
type Reference = Record<Gender, Record<number, number[]>>;

const Z_SCORES = [-3, -2, -1, 0, 1, 2, 3];

/** WHO 體重 z-score 表（wfa-boys/girls-0-5-zscores.pdf），單位公斤 */
const WEIGHT_KG_AT_SD: Reference = {
  male: {
    0: [2.1, 2.5, 2.9, 3.3, 3.9, 4.4, 5.0],
    6: [5.7, 6.4, 7.1, 7.9, 8.8, 9.8, 10.9],
    12: [6.9, 7.7, 8.6, 9.6, 10.8, 12.0, 13.3],
    24: [8.6, 9.7, 10.8, 12.2, 13.6, 15.3, 17.1],
    36: [10.0, 11.3, 12.7, 14.3, 16.2, 18.3, 20.7],
  },
  female: {
    0: [2.0, 2.4, 2.8, 3.2, 3.7, 4.2, 4.8],
    6: [5.1, 5.7, 6.5, 7.3, 8.2, 9.3, 10.6],
    12: [6.3, 7.0, 7.9, 8.9, 10.1, 11.5, 13.1],
    24: [8.1, 9.0, 10.2, 11.5, 13.0, 14.8, 17.0],
    36: [9.6, 10.8, 12.2, 13.9, 15.8, 18.1, 20.9],
  },
};

/** WHO 躺姿身長 z-score 展開表，單位公分 */
const LENGTH_CM_AT_SD: Reference = {
  male: {
    0: [44.205, 46.098, 47.991, 49.884, 51.777, 53.67, 55.564],
    6: [61.221, 63.362, 65.503, 67.644, 69.784, 71.925, 74.066],
    12: [68.611, 70.987, 73.363, 75.739, 78.115, 80.491, 82.867],
    24: [78.638, 81.693, 84.747, 87.802, 90.856, 93.911, 96.966],
  },
  female: {
    0: [43.56, 45.422, 47.285, 49.148, 51.01, 52.873, 54.736],
    6: [58.95, 61.217, 63.484, 65.751, 68.018, 70.285, 72.552],
    12: [66.281, 68.856, 71.43, 74.005, 76.58, 79.154, 81.729],
    24: [76.725, 79.95, 83.175, 86.401, 89.626, 92.851, 96.077],
  },
};

/** WHO 站姿身高 z-score 展開表，單位公分。24 個月起適用 */
const STANDING_HEIGHT_CM_AT_SD: Reference = {
  male: {
    24: [77.961, 81.017, 84.074, 87.13, 90.187, 93.243, 96.3],
    27: [79.918, 83.154, 86.389, 89.625, 92.86, 96.096, 99.331],
    36: [84.968, 88.675, 92.382, 96.089, 99.796, 103.503, 107.21],
  },
  female: {
    24: [76.049, 79.276, 82.503, 85.73, 88.957, 92.184, 95.411],
    27: [78.144, 81.525, 84.907, 88.288, 91.67, 95.051, 98.432],
    36: [83.63, 87.439, 91.248, 95.057, 98.866, 102.675, 106.484],
  },
};

/** WHO 頭圍 z-score 表（hcfa-boys/girls-0-5-zscores.xlsx），單位公分 */
const HEAD_CM_AT_SD: Reference = {
  male: {
    0: [30.7, 31.9, 33.2, 34.5, 35.7, 37.0, 38.3],
    6: [39.7, 40.9, 42.1, 43.3, 44.6, 45.8, 47.0],
    12: [42.2, 43.5, 44.8, 46.1, 47.4, 48.6, 49.9],
    24: [44.2, 45.5, 46.9, 48.3, 49.6, 51.0, 52.3],
    36: [45.2, 46.6, 48.0, 49.5, 50.9, 52.3, 53.7],
  },
  female: {
    0: [30.3, 31.5, 32.7, 33.9, 35.1, 36.2, 37.4],
    6: [38.3, 39.6, 40.9, 42.2, 43.5, 44.8, 46.1],
    12: [40.8, 42.2, 43.5, 44.9, 46.3, 47.6, 49.0],
    24: [43.0, 44.4, 45.8, 47.2, 48.6, 50.0, 51.4],
    36: [44.3, 45.7, 47.1, 48.5, 49.9, 51.3, 52.7],
  },
};
/**
 * 容許誤差要從 WHO 印出來的精度推，不是隨手給一個常數。
 *
 * 體重與頭圍只印到小數一位，身長印到三位。把印出來的值反算回 z，誤差上限就是
 * 「半個最小刻度」乘上該點的 dz/dX。新生兒特別敏感：出生時 M=3.35、S=0.146，
 * dz/dX ≈ 2.05 /公斤，所以 0.05 公斤的進位就是 0.1 個 z——比整個中段的誤差
 * 都大。一開始用固定的 0.06 就是在這裡破的，破得對。
 *
 * LMS 的導數：z = ((X/M)^L − 1)/(L·S) ⇒ dz/dX = (X/M)^(L−1) / (M·S)
 */
function toleranceFor(
  measurement: number,
  ageMonths: number,
  type: MeasurementType,
  gender: Gender,
  printedStep: number,
): number {
  const { L, M, S } = getWHOStandard(ageMonths, type, gender);
  const dzdx = Math.pow(measurement / M, L - 1) / (M * S);

  // 加一點餘裕給 erf 近似（A&S 7.1.26，誤差 ≤1.5e-7）與 L/M/S 本身的位數。
  return (printedStep / 2) * dzdx + 0.01;
}

const CASES: Array<{
  label: string;
  type: MeasurementType;
  reference: Reference;
  /** WHO 表上的最小刻度 */
  printedStep: number;
}> = [
  { label: '體重', type: 'weight', reference: WEIGHT_KG_AT_SD, printedStep: 0.1 },
  { label: '躺姿身長', type: 'height', reference: LENGTH_CM_AT_SD, printedStep: 0.001 },
  { label: '頭圍', type: 'headCircumference', reference: HEAD_CM_AT_SD, printedStep: 0.1 },
];

describe('WHO 標準對帳', () => {
  for (const { label, type, reference, printedStep } of CASES) {
    for (const gender of ['male', 'female'] as Gender[]) {
      it(`${label}（${gender}）反算回 WHO 印出來的 SD`, () => {
        for (const [month, values] of Object.entries(reference[gender])) {
          const ageMonths = Number(month);
          // 身長表只到 24 個月，24 個月起是站姿身高，另一組測試負責。
          if (type === 'height' && ageMonths >= STANDING_HEIGHT_FROM_MONTHS) continue;

          values.forEach((measurement, index) => {
            const expected = Z_SCORES[index];
            const actual = calculateZScore(measurement, ageMonths, type, gender);
            const tolerance = toleranceFor(measurement, ageMonths, type, gender, printedStep);
            expect(
              Math.abs(actual - expected),
              `${label} ${gender} ${ageMonths}m ${measurement} 應該是 ${expected} SD，算出 ${actual.toFixed(3)}（容許 ${tolerance.toFixed(3)}）`,
            ).toBeLessThan(tolerance);
          });
        }
      });
    }
  }

  it('中位數就是第 50 百分位', () => {
    for (const gender of ['male', 'female'] as Gender[]) {
      for (const type of ['weight', 'height', 'headCircumference'] as MeasurementType[]) {
        for (const ageMonths of [0, 6, 12, 24, 36]) {
          const { M } = getWHOStandard(ageMonths, type, gender);
          expect(calculatePercentile(calculateZScore(M, ageMonths, type, gender))).toBeCloseTo(50, 1);
        }
      }
    }
  });
});

describe('身長與身高是兩套標準', () => {
  for (const gender of ['male', 'female'] as Gender[]) {
    it(`${gender}：24 個月起用站姿身高反算回 WHO 的 SD`, () => {
      for (const [month, values] of Object.entries(STANDING_HEIGHT_CM_AT_SD[gender])) {
        const ageMonths = Number(month);
        values.forEach((measurement, index) => {
          const actual = calculateZScore(measurement, ageMonths, 'height', gender);
          const tolerance = toleranceFor(measurement, ageMonths, 'height', gender, 0.001);
          expect(
            Math.abs(actual - Z_SCORES[index]),
            `站姿身高 ${gender} ${ageMonths}m ${measurement} 應該是 ${Z_SCORES[index]} SD，算出 ${actual.toFixed(3)}`,
          ).toBeLessThan(tolerance);
        });
      }
    });
  }

  it('接縫兩側是不同的標準，差距約 0.67 公分', () => {
    // 這不是誤差，是姿勢造成的真實差異。WHO 的合併表就在第 731 天直接跳過去。
    for (const gender of ['male', 'female'] as Gender[]) {
      const recumbent = getWHOStandard(STANDING_HEIGHT_FROM_MONTHS - 0.01, 'height', gender);
      const standing = getWHOStandard(STANDING_HEIGHT_FROM_MONTHS, 'height', gender);
      expect(recumbent.M - standing.M).toBeGreaterThan(0.6);
      expect(recumbent.M - standing.M).toBeLessThan(0.75);
    }
  });

  it('25 個月的身高不是兩套標準的混合值', () => {
    // 修之前 getWHOStandard 會在 24（身長）與 27（身高）之間線性插值，
    // 25 個月、90 公分的男孩因此被算成第 69 百分位。
    const percentile = calculatePercentile(calculateZScore(90, 25, 'height', 'male'));
    expect(percentile).toBeGreaterThan(72);
    expect(percentile).toBeLessThan(77);
  });
});
