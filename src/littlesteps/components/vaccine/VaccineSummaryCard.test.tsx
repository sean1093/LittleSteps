import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { VaccineProgress, VaccineSchedule } from '../../../types';
import { vaccineSchedules } from '../../data/vaccines';
import VaccineSummaryCard from './VaccineSummaryCard';

/**
 * 這張卡片有三種狀態，而且三種都在講同一件事的不同面向：這個孩子還欠什麼。
 *
 * #25 修掉的是「把要自己付錢的劑次寫成下一劑」；#50 修的是剩下那一種狀態
 * 說得太少——公費打完的那一刻正是家長想知道還剩什麼的時候，而隔壁那個狀態
 * 明明說得出數字。所以這裡驗的是「有沒有給出數字」與「有沒有把自費劑次寫
 * 成待辦」，不是文案本身。
 */

/** 公費常規劑次：帶 eligibility 的那種只給名單上的孩子，不是家長欠的。 */
const NATIONAL = vaccineSchedules.filter((v) => v.funding === 'national' && !v.eligibility);

const doseOf = (vaccine: VaccineSchedule): number => vaccine.currentDose ?? 1;

/** 把指定的每一筆記錄標成已接種。同 id 的多劑要合併，不能互相覆蓋。 */
const administered = (vaccines: VaccineSchedule[]): VaccineProgress => {
  const progress: VaccineProgress = {};
  for (const vaccine of vaccines) {
    const doses = progress[vaccine.id]?.doses ?? {};
    doses[doseOf(vaccine)] = { administered: true, administeredDate: '2026-01-01' };
    progress[vaccine.id] = { doses };
  }
  return progress;
};

const renderCard = (progress: VaccineProgress, birthday: string) =>
  render(
    <VaccineSummaryCard vaccineProgress={progress} birthday={birthday} onNavigate={vi.fn()} />,
  );

/** 卡片全文。三種狀態各自一句話，比對整張卡最省事也最不會誤判。 */
const cardText = () => screen.getByRole('button').textContent ?? '';

describe('VaccineSummaryCard', () => {
  it('公費都記完之後，說得出還剩幾劑不在公費常規時程內', () => {
    // 這就是 #50：計數器寫著 21/36，家長看得出差 15 劑，卡片卻只說「其餘
    // 劑次不在公費時程內」——三種狀態裡唯一不給數字的那一種。
    const remaining = vaccineSchedules.length - NATIONAL.length;
    expect(remaining).toBeGreaterThan(0);

    renderCard(administered(NATIONAL), '2020-01-15');

    expect(cardText()).toContain(`另有 ${remaining} 劑`);
  });

  it('那些劑次還可以打這件事也要講出來，不能只說它們不是公費', () => {
    renderCard(administered(NATIONAL), '2020-01-15');

    expect(cardText()).toMatch(/仍可.*接種/);
  });

  it('不推銷、也不把要自己付錢的劑次寫成下一劑', () => {
    // #25 的規矩仍然成立：這個狀態可以說「還有幾劑」，不能說「下一劑是哪一
    // 支」。指名任何一支自費產品就是在替它背書。
    renderCard(administered(NATIONAL), '2020-01-15');
    const text = cardText();

    expect(text).not.toContain('下次接種');
    const paid = vaccineSchedules.filter((v) => v.funding !== 'national');
    expect(paid.length).toBeGreaterThan(0);
    paid.forEach((v) => expect(text, `${v.id} 被指名了`).not.toContain(v.name));
  });

  it('整份時程表都記完時不會說「另有 0 劑」', () => {
    renderCard(administered(vaccineSchedules), '2020-01-15');

    expect(cardText()).not.toContain('另有 0 劑');
  });

  it('公費還沒記完時，講的仍然是還有幾劑沒有記錄', () => {
    // 相反的那一種狀態。兩句話不能混在一起：一種是「你可能漏記了」，另一種
    // 是「沒有免費的可打了」，把它們說成同一句就是 #25 之前的毛病。
    renderCard({}, '2020-01-15');
    const text = cardText();

    expect(text).toContain(`尚有 ${NATIONAL.length} 劑公費疫苗沒有記錄`);
    expect(text).not.toContain('另有');
  });

  it('還有下一劑時，這兩句話都不出現', () => {
    renderCard({}, new Date().toISOString().slice(0, 10));
    const text = cardText();

    expect(text).toContain('下次接種');
    expect(text).not.toContain('沒有記錄');
    expect(text).not.toContain('另有');
  });
});
