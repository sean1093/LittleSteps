import { describe, it, expect } from 'vitest';
import { vaccineSchedules } from '../../littlesteps/data/vaccines';
import { careTaskTemplates } from './careTasks';
import { TODDLER_MAX_MONTHS, TODDLER_MIN_MONTHS } from '../utils/ageBands';

/**
 * 幼兒期該提醒的公費疫苗，有沒有真的都出現在提醒清單裡。
 *
 * 這兩份資料原本只被對帳「已連結的任務月齡要一致」，沒有人檢查「該連結的
 * 有沒有漏」。漏掉一劑公費疫苗不會有任何跡象：疫苗頁照樣列得出來，但幼兒期
 * 的家長只看提醒，於是那一劑就這樣過去了。
 *
 * 例外必須逐筆列名並寫下理由，和設計系統的遮罩白名單同一個作法：例外寫成
 * 一條判斷式，下一筆漏掉的疫苗就會被同一條規則默默吸收。
 */

const isToddlerAge = (months: number) =>
  months >= TODDLER_MIN_MONTHS && months <= TODDLER_MAX_MONTHS;

/**
 * 落在 1-3 歲區間、但刻意不做成幼兒期提醒的公費劑次。
 *
 * 每一筆都要有理由。理由不是「暫時先跳過」，而是「為什麼它不屬於這份清單」。
 */
const DOCUMENTED_EXCLUSIONS: Record<string, string> = {
  // 疾管署的常規公費 PCV13 是 3 劑，時程為出生滿 2 個月、4 個月與 12-15 個月；
  // 出生滿 6 個月那一劑只給高危險群，不是每個孩子都打的常規劑次。
  // careTasks 收的是 pneumococcal-12m，也就是常規時程的最後一劑。
  // vaccines.ts 另有一筆 24 個月的「第 4 劑」且標為 national，但它引用的官方
  // 頁面就寫著常規只有 3 劑、高危險群那一劑在 6 個月——劑次、月齡與適用對象
  // 三個欄位都對不上自己的來源。不在測試裡擅自改動醫療資料，改法見 #23。
  'pneumococcal-2y': '常規公費 PCV13 止於 12-15 個月的第 3 劑；24 個月這一筆與其來源頁不符，待 #23 釐清後才決定是否納入提醒',
};

describe('幼兒期疫苗提醒的涵蓋範圍', () => {
  const linkedVaccineIds = new Set(
    careTaskTemplates.map((template) => template.vaccineId).filter(Boolean),
  );

  const toddlerPublicDoses = vaccineSchedules.filter(
    (vaccine) =>
      vaccine.funding === 'national' && isToddlerAge(vaccine.ageInMonths ?? -1),
  );

  it('掃描範圍不是空的', () => {
    // 解析或篩選壞掉時，下面那條規則會安靜地永遠通過。
    expect(toddlerPublicDoses.length).toBeGreaterThan(3);
  });

  it('1-3 歲的每一劑公費疫苗都有提醒，或有列名的理由', () => {
    const unaccounted = toddlerPublicDoses
      .filter((vaccine) => !linkedVaccineIds.has(vaccine.id))
      .filter((vaccine) => !(vaccine.id in DOCUMENTED_EXCLUSIONS))
      .map((vaccine) => `${vaccine.id}@${vaccine.ageInMonths}m ${vaccine.name}`);

    expect(unaccounted).toEqual([]);
  });

  it('每條例外都寫得出理由', () => {
    for (const [id, reason] of Object.entries(DOCUMENTED_EXCLUSIONS)) {
      expect(reason.length, `${id} 的例外理由不能留空`).toBeGreaterThan(10);
      // 例外只對真的存在的劑次有意義；疫苗被改名或移除時這裡要跟著紅。
      expect(
        vaccineSchedules.some((vaccine) => vaccine.id === id),
        `${id} 已不在疫苗時程裡，這條例外可以刪掉`,
      ).toBe(true);
    }
  });

  it('自費劑次不強制要有提醒——那是選擇，不是時程', () => {
    // 六合一（五合一的自費升級版）與自費水痘第 2 劑刻意不在提醒裡：
    // 把自費選項混進法定時程，會讓家長以為漏打了。
    const privateToddlerDoses = vaccineSchedules.filter(
      (vaccine) =>
        vaccine.funding === 'self-paid' && isToddlerAge(vaccine.ageInMonths ?? -1),
    );
    expect(privateToddlerDoses.length).toBeGreaterThan(0);
  });
});
