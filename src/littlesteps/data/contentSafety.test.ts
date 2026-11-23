import { describe, expect, it } from 'vitest';
import { developmentCheckItems } from '../../littleexplorer/data/developmentChecks';
import { prenatalCheckupSchedule } from '../../littlebloom/data/prenatalCheckups';
import { pregnancyWikiArticles } from '../../littlebloom/data/wiki';
import { babyWikiArticles } from './babyWiki';
import { generalSafetyItems, monthlyCareGuides } from './careGuides';
import * as complementaryFood from './complementaryFood';
import * as sleep from './sleep';

/**
 * Advice that must not come back.
 *
 * A clinical review of the 0-12 month content found sentences that, followed
 * literally, raise the risk of suffocation or choking, and places where two
 * files told a parent opposite things. They were corrected; these cases keep
 * them corrected. Each names the guidance it rests on.
 *
 * The checks read the shipped data as one text, because the point is what a
 * parent can be shown, wherever in a file it sits.
 */

const text = (value: unknown) => JSON.stringify(value);

const BABY_WIKI = text(babyWikiArticles);
const SLEEP = text(sleep);
const CARE = text([generalSafetyItems, monthlyCareGuides]);
const FOOD = text(complementaryFood);

describe('safe sleep (AAP: flat, firm, nothing soft in the cot)', () => {
  it('never tells a parent to raise the head end of the mattress', () => {
    // It was the advice for a blocked nose, in the same file as the SIDS article.
    expect(BABY_WIKI).not.toMatch(/床墊下方墊高|頭部稍微抬高/);
    expect(BABY_WIKI).toMatch(/不要墊高床墊/);
  });

  it('never suggests a comforter or small blanket for the cot', () => {
    expect(SLEEP).not.toMatch(/準備安撫巾、小被被/);
  });

  it('gives swaddling a stop point', () => {
    expect(SLEEP).toMatch(/包巾只用到寶寶出現想翻身的跡象為止/);
  });

  it('never calls tummy time "prone sleeping"', () => {
    expect(CARE).not.toContain('趴睡抬頭');
    expect(CARE).toMatch(/睡覺一律仰睡/);
  });
});

describe('choking', () => {
  it('never offers raw hard vegetable sticks for teething', () => {
    const teething = babyWikiArticles.find((article) => text(article).includes('固齒器'));
    expect(teething).toBeDefined();
    const steps = text(teething?.solutions);
    // The article may name them only to warn against them.
    expect(steps).not.toMatch(/冰涼的蔬菜棒（如紅蘿蔔條）讓寶寶啃咬/);
    expect(steps).toMatch(/不要給生的硬蔬菜棒/);
  });

  it('never has raw meat finished in hot porridge', () => {
    expect(FOOD).not.toMatch(/悶熟|生肉泥是將生肉/);
    expect(FOOD).toMatch(/煮到全熟/);
  });
});

describe('fever', () => {
  const fever = babyWikiArticles.find((article) => article.id === 'fever-assessment');

  it('tells parents of a baby under three months to go now, first', () => {
    expect(fever?.warningSignals[0]).toMatch(/未滿 3 個月.*38°C.*立即就醫/);
  });

  it('lists breathing difficulty and dehydration among the signs', () => {
    const signs = text(fever?.warningSignals);
    expect(signs).toMatch(/呼吸困難/);
    expect(signs).toMatch(/脫水/);
  });

  it('does not let teething explain a fever', () => {
    expect(BABY_WIKI).toMatch(/長牙不會造成發燒/);
  });
});

describe('solids', () => {
  it('gives one answer to when to start, everywhere', () => {
    // Three files gave three answers: from 4 months, after 6 months, month 4.
    expect(FOOD).not.toMatch(/皆應從4個月大開始|四個月就可以開始吃副食品/);
    expect(FOOD).toMatch(/約 6 個月開始，不早於滿 4 個月/);
    expect(CARE).toMatch(/不早於滿 4 個月/);
  });

  it('does not suggest salt before one, which the same file forbids', () => {
    expect(FOOD).not.toMatch(/可添加少量鹽巴/);
  });

  it('gives an allergic reaction an emergency branch', () => {
    expect(FOOD).toMatch(/呼吸困難.*119/);
  });
});

describe('agreement between files', () => {
  it('says not to use a baby walker, in every file that mentions one', () => {
    const everywhere = text([babyWikiArticles, developmentCheckItems]);
    expect(everywhere).not.toMatch(/減少學步車使用時間/);
  });

  it('lists the public prenatal checkup weeks in the public article, from the schedule', () => {
    const weeks = prenatalCheckupSchedule
      .filter((item) => item.kind === 'checkup')
      .map((item) => item.dueWeek);
    const article = pregnancyWikiArticles.find((entry) => entry.id === 'checkup-schedule');
    expect(text(article?.solutions)).toContain(`第 ${weeks.join('、')} 週`);
    expect(weeks).toHaveLength(14);
  });
});
