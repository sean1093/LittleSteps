import { describe, expect, it } from 'vitest';
import { developmentCheckItems } from '../../littleexplorer/data/developmentChecks';
import { toddlerWikiArticles } from '../../littleexplorer/data/toddlerWiki';
import { prenatalCheckupSchedule } from '../../littlebloom/data/prenatalCheckups';
import { pregnancyWikiArticles } from '../../littlebloom/data/wiki';
import { babyWikiArticles } from './babyWiki';
import { generalSafetyItems, monthlyCareGuides } from './careGuides';
import * as complementaryFood from './complementaryFood';
import { milestones } from './milestones';
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

/**
 * Corrections from checking every baby wiki article against the official page
 * it now cites (HPA 孕產兒關懷網站, Taiwan CDC, AAP). Each case is a sentence
 * the sources contradict, or a red flag they give that the article lacked.
 */
describe('baby wiki, as verified against its sources', () => {
  const byId = (id: string) => babyWikiArticles.find((article) => article.id === id);

  it('does not recommend sponging a feverish baby (HPA 兒童衛教手冊, AAP)', () => {
    const steps = text(byId('fever-assessment')?.solutions);
    expect(steps).not.toMatch(/用溫水擦拭身體散熱/);
    expect(steps).toMatch(/不建議溫水拭浴/);
  });

  it('sends a repeatedly 40°C fever to a doctor, not only 41°C (AAP)', () => {
    const signs = text(byId('fever-assessment')?.warningSignals);
    expect(signs).toMatch(/反覆超過 40°C/);
    expect(signs).not.toMatch(/41°C/);
  });

  it('gives the age limits for fever medicine (AAP)', () => {
    const steps = text(byId('fever-assessment')?.solutions);
    expect(steps).toMatch(/未滿 3 個月發燒不要自行給藥/);
    expect(steps).toMatch(/未滿 6 個月不可使用/);
  });

  it('never tells the parent of a feverish under-two to wait five days for a rash', () => {
    const roseola = text(byId('roseola'));
    expect(roseola).not.toMatch(/持續超過 5 天/);
    expect(roseola).toMatch(/未滿 2 歲發燒超過 24 小時/);
  });

  it('does not blame the iron in formula for constipation (AAP)', () => {
    const constipation = text(byId('constipation'));
    expect(constipation).not.toMatch(/鐵質可能使大便較硬/);
    expect(constipation).toMatch(/不要自行換成低鐵配方/);
  });

  it('lists fever among the signs that crying is not colic', () => {
    expect(text(byId('colic')?.warningSignals)).toMatch(/發燒.*未滿 3 個月.*38°C.*立即就醫/);
  });

  it('gives the under-one choking steps where a crawling baby finds small objects', () => {
    const signs = text(byId('crawling-safety')?.warningSignals);
    expect(signs).toMatch(/119.*5 次拍背、5 次胸部按壓/);
    expect(signs).toMatch(/不要用腹部擠壓法/);
    expect(signs).toMatch(/鈕扣電池.*立即送急診/);
  });

  it('does not treat a baby who never crawls as delayed (AAP)', () => {
    expect(text(byId('crawling-safety'))).not.toMatch(/10 個月以上完全無爬行跡象/);
  });

  it('keeps the baby off the adult bed in the rolling article too', () => {
    const steps = text(byId('rolling-safety')?.solutions);
    expect(steps).not.toMatch(/在床邊加裝安全護欄/);
    expect(steps).toMatch(/不要把寶寶單獨留在大人床或沙發上/);
  });

  it('says what to do when a baby is not breathing', () => {
    expect(text(byId('sids-prevention')?.warningSignals)).toMatch(/沒有呼吸.*119/);
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

/**
 * Corrections from the second review, which read the month table, the care
 * cards and the milestone tips against the principle cards printed beside
 * them, and against AAP / HPA / MOHW pages. The recurring fault was one file
 * giving two answers: a principle saying "do not delay allergens" above a
 * table that delayed them.
 */
describe('solids: the month table agrees with the principle cards', () => {
  const firstRowOffering = (pattern: RegExp) =>
    complementaryFood.monthlyFoodMenus.find((menu) => menu.foods.some((food) => pattern.test(food)));

  it.each([
    ['meat', /雞肉|豬肉|牛肉/],
    ['fish', /魚/],
    ['egg', /蛋/],
    ['tofu', /豆腐/],
    ['shellfish', /蝦/],
    ['tree nuts', /核桃|花生|堅果/],
  ])('offers %s once solids have started, about 6 months (AAP: no benefit in waiting)', (_name, pattern) => {
    // Not later than the 6-month row, and not in the 4-month row either: the
    // principle card says about 6 months, 4 at the earliest.
    const row = firstRowOffering(pattern);
    expect(row?.month).toBe('6個月');
    expect(row?.focus).toMatch(/開始吃副食品後（約 6 個月）/);
  });

  it('never lists a nut without saying it must be ground or pureed', () => {
    const nuts = complementaryFood.monthlyFoodMenus
      .flatMap((menu) => menu.foods)
      .filter((food) => /核桃|花生|堅果/.test(food));
    expect(nuts.length).toBeGreaterThan(0);
    for (const nut of nuts) expect(nut).toMatch(/粉|泥/);
  });

  it('no longer calls seven months the start of meat', () => {
    expect(FOOD).not.toMatch(/開葷/);
    expect(FOOD).not.toMatch(/一歲前肉類仍建議打泥/);
  });

  it('tests one new food over 3 to 5 days, not nine (AAP)', () => {
    const method = complementaryFood.allergyTestingMethod;
    expect(method.name).toBe('每 3–5 天試一種新食材');
    expect(method.observeDays).toEqual({ min: 3, max: 5 });
    expect(text(method.steps)).not.toMatch(/觀察3天|停止新食材/);
    // The emergency branch must survive the rewrite.
    expect(method.principle).toMatch(/呼吸困難.*119/);
  });

  it('keeps cow’s milk as a drink and juice off the menu before one (AAP)', () => {
    const restrictions = complementaryFood.infantFoodRestrictions.flatMap((category) => category.items);
    const milk = restrictions.find((item) => item.food === '鮮奶當飲料');
    const juice = restrictions.find((item) => item.food === '果汁');
    expect(milk?.ageLimit).toBe('1 歲前');
    expect(milk?.reason).toMatch(/不能取代母乳或配方奶/);
    expect(juice?.ageLimit).toBe('1 歲前');
    expect(FOOD).not.toMatch(/一歲前除蜂蜜外都可嘗試/);
  });
});

describe('care guide, by month', () => {
  const month = (n: number) => text(monthlyCareGuides.find((guide) => guide.month === n)?.highlights);

  it.each([1, 2, 3])('month %i carries the under-three-months fever rule (AAP)', (n) => {
    expect(month(n)).toMatch(/未滿 3 個月體溫 38°C 以上.*立刻就醫.*不要先自行退燒/);
  });

  it('does not tell parents to cut milk at ten months', () => {
    expect(CARE).not.toMatch(/應減少奶量/);
  });

  it('caps whole milk at twelve months (AAP)', () => {
    expect(month(12)).toMatch(/滿 1 歲可開始喝全脂鮮奶，一天不超過約 480 ml/);
  });
});

describe('milestones', () => {
  it('keeps "see a doctor" warnings out of the practice tips', () => {
    // A tip is something to do with the baby today; the page prints the
    // when-to-ask line once, so a threshold here is read as a practice step.
    for (const milestone of milestones) {
      for (const tip of milestone.tips) {
        expect(tip, milestone.id).not.toMatch(/諮詢醫師|應注意/);
      }
    }
    expect(text(milestones)).not.toMatch(/6個月不會翻滾/);
  });

  it('does not expect unsupported sitting at five to six months (AAP)', () => {
    const band = text(milestones.filter((milestone) => milestone.monthRange === '5-6'));
    expect(band).not.toMatch(/不需協助能自己坐著|獨立坐/);
    expect(band).toMatch(/滿 9 個月還不能自己坐/);
  });

  it('keeps the ids parents’ progress is stored under', () => {
    const ids = milestones.map((milestone) => milestone.id);
    expect(ids).toEqual(expect.arrayContaining(['m0-1-physical-1', 'm2-physical-1', 'm2-social-1', 'm6-physical-1', 'm6-social-1', 'm10-cognitive-1', 'm11-motor-1']));
  });
});

describe('sleep training', () => {
  it('starts at six months and says when to stop (HPA, AAP)', () => {
    expect(sleep.trainingTips.timing.content).toMatch(/6 個月後再練習自行入睡/);
    expect(SLEEP).not.toMatch(/4-6 個月大後開始進行睡眠訓練/);
    expect(sleep.trainingTips.pause.content).toMatch(/生病、發燒.*先暫停.*哭聲和平常不一樣就進去看/);
  });
});

describe('pregnancy wiki', () => {
  const PREGNANCY = text(pregnancyWikiArticles);

  it('has no one-hour fetal movement threshold left (HPA)', () => {
    expect(PREGNANCY).not.toMatch(/數胎動一小時|胎動[^'"]{0,12}(1|一) ?小時/);
    // Every line that tells a parent to count gives the same threshold.
    expect(PREGNANCY).not.toMatch(/先左側躺數胎動/);
    expect(PREGNANCY.match(/超過 2 小時感覺不到明顯胎動/g)?.length).toBeGreaterThanOrEqual(4);
  });

  it('does not quote a stillbirth multiplier nobody could source', () => {
    expect(PREGNANCY).not.toMatch(/2\.6 倍/);
    expect(PREGNANCY).toMatch(/28 週後建議側睡/);
  });
});

describe('toddler content', () => {
  const TODDLER = text(toddlerWikiArticles);

  it('does not call a two-year-old 「番」', () => {
    expect(TODDLER).not.toContain('番兩歲');
    // The id is a URL; the title changed, the address must not.
    expect(toddlerWikiArticles.some((article) => article.id === 'emotion-terrible-twos')).toBe(true);
  });

  it('uses the checklist’s own age for "says mama or dada with meaning"', () => {
    expect(TODDLER).not.toMatch(/1 歲不會叫/);
    expect(TODDLER).toMatch(/1 歲 3 個月還不會有意義地叫爸爸或媽媽/);
  });

  it('does not reward dry nights, which a child cannot control', () => {
    expect(TODDLER).not.toMatch(/用貼紙記錄乾爽的夜晚/);
  });
});

/**
 * The first-two-weeks articles (#156). Judging intake by a millilitre target
 * is what the panel asked to avoid: wet diapers and weight are what the AAP
 * pages say to watch, and a number per feed invites comparing babies.
 */
describe('first-two-weeks articles', () => {
  const byId = (id: string) => babyWikiArticles.find((article) => article.id === id);

  it('judges "enough" by diapers and weight, never by millilitres', () => {
    const enough = text(byId('feeding-enough'));
    expect(enough).toMatch(/6 片以上的濕尿布/);
    expect(enough).toMatch(/體重/);
    // The article may name millilitres only to say not to go by them.
    expect(enough).not.toMatch(/\d\s*(毫升|ml|c\.c\.|cc)/i);
    expect(enough).toMatch(/不拿毫升數跟別人比/);
  });

  it('sends a pale stool to a doctor before 60 days (HPA)', () => {
    const signs = text(byId('jaundice-stool-card')?.warningSignals);
    expect(signs).toMatch(/1-6 號/);
    expect(signs).toMatch(/60 天內/);
  });

  it('never suggests sunlight for jaundice (AAP)', () => {
    const jaundice = text(byId('jaundice-stool-card'));
    expect(jaundice).toMatch(/不是安全的黃疸治療方式/);
  });
});

