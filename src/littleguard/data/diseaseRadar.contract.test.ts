import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

/**
 * public/data/diseaseRadar.json 由 scripts/buildDiseaseRadar.cjs 從疾管署的
 * 六支健保門診就診人次 CSV 聚合而來。這些測試守的是「重跑管線後資料仍然可用」
 * ——上游改欄位、改端點或回傳殘缺資料時要在這裡爆掉，而不是等家長打開板才
 * 看到一片空白或一個算錯的狀態。
 */
const HERE = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  readFileSync(join(HERE, '../../../public/data/diseaseRadar.json'), 'utf8'),
);

const AGE_BANDS = ['0~2', '3~6', '7~12'];
const DISEASES = ['腸病毒', '手足口病', '疱疹性咽峽炎', '類流感', '腹瀉', '水痘'];

describe('diseaseRadar.json 檔頭', () => {
  it('週次格式與疫情週日期區間對得上', () => {
    expect(data.week).toMatch(/^\d{4}-W\d{2}$/);
    const start = new Date(`${data.weekStart}T00:00:00Z`);
    const end = new Date(`${data.weekEnd}T00:00:00Z`);
    // 疫情週週日起算，不是 ISO 週的週一。
    expect(start.getUTCDay()).toBe(0);
    expect((end.getTime() - start.getTime()) / 86400000).toBe(6);
  });

  it('查證日期存在且不是未來', () => {
    expect(data.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(data.verifiedOn <= new Date().toISOString().slice(0, 10)).toBe(true);
  });

  it('六支來源網址與授權都留著', () => {
    expect(data.sourceUrls).toHaveLength(6);
    data.sourceUrls.forEach((url: string) =>
      expect(url).toMatch(/^https:\/\/od\.cdc\.gov\.tw\/eic\/NHI_.+\.csv$/),
    );
    expect(data.license).toBe('政府資料開放授權條款-第1版');
  });

  it('門檻校準有樣本，且百分位單調遞增', () => {
    expect(data.calibration.sampleSize).toBeGreaterThan(10000);
    expect(data.calibration.trendP25).toBeLessThan(data.calibration.trendP75);
    expect(data.calibration.trendP75).toBeLessThan(data.calibration.trendP90);
  });
});

describe('diseaseRadar.json 格子', () => {
  const counties = Object.keys(data.counties);

  it('22 縣市 × 3 年齡層 × 6 病種齊全', () => {
    expect(counties).toHaveLength(22);
    for (const county of counties) {
      expect(Object.keys(data.counties[county]).sort()).toEqual([...AGE_BANDS].sort());
      for (const age of AGE_BANDS) {
        expect(Object.keys(data.counties[county][age]).sort()).toEqual([...DISEASES].sort());
      }
    }
  });

  it('reliability 與分母門檻一致', () => {
    for (const county of counties) {
      for (const age of AGE_BANDS) {
        for (const disease of DISEASES) {
          const cell = data.counties[county][age][disease];
          const expected =
            cell.denom >= 1000 ? 'ok' : cell.denom >= 300 ? 'small' : 'insufficient';
          expect(cell.reliability).toBe(expected);
        }
      }
    }
  });

  it('ratio 就是 rate ÷ trendBase；基線為零或資料不足時是 null', () => {
    for (const county of counties) {
      for (const age of AGE_BANDS) {
        for (const disease of DISEASES) {
          const { rate, trendBase, ratio, reliability } = data.counties[county][age][disease];
          if (reliability === 'insufficient') {
            expect(rate).toBeNull();
            expect(ratio).toBeNull();
          } else if (trendBase === null || trendBase === 0) {
            expect(ratio).toBeNull();
          } else {
            expect(ratio).toBeCloseTo(rate / trendBase, 1);
          }
        }
      }
    }
  });

  it('spark 固定 8 格，且最後一格是本週的率', () => {
    for (const county of counties) {
      for (const age of AGE_BANDS) {
        for (const disease of DISEASES) {
          const cell = data.counties[county][age][disease];
          expect(cell.spark).toHaveLength(8);
          expect(cell.spark[7]).toBe(cell.rate);
        }
      }
    }
  });
});
