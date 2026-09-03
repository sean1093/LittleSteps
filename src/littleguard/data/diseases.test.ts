import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { DISEASE_INFO } from './diseases';
import { FORBIDDEN_WORDS } from '../utils/radar';

const HERE = dirname(fileURLToPath(import.meta.url));

const DISEASES = ['腸病毒', '手足口病', '疱疹性咽峽炎', '類流感', '腹瀉', '水痘'];

/** 每一筆說明的所有可見文字，禁用詞與絕對化表述都掃這一串。 */
const allText = (disease: string) => {
  const info = DISEASE_INFO[disease];
  return [info.meaning, info.seeDoctor, ...info.actions].join('');
};

describe('六種病的說明', () => {
  it('板上的六種病都有說明', () => {
    expect(Object.keys(DISEASE_INFO).sort()).toEqual([...DISEASES].sort());
  });

  it('說明覆蓋到實際出貨的資料裡的每一種病', () => {
    // 板上有列、抽屜卻沒有說明的話，家長點開會拿到一片空白。這一條把說明綁在
    // public/data/diseaseRadar.json 上，上游哪天多一種病就在這裡爆掉。
    const data = JSON.parse(
      readFileSync(join(HERE, '../../../public/data/diseaseRadar.json'), 'utf8'),
    ) as { diseases: string[] };
    expect(Object.keys(DISEASE_INFO).sort()).toEqual([...data.diseases].sort());
  });

  it.each(DISEASES)('%s 的六個欄位都不是空的', (disease) => {
    const info = DISEASE_INFO[disease];
    expect(info.meaning.length).toBeGreaterThan(0);
    expect(info.seeDoctor.length).toBeGreaterThan(0);
    expect(info.sourceUrl).toMatch(/^https:\/\/www\.cdc\.gov\.tw\//);
    expect(info.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it.each(DISEASES)('%s 至少給得出兩件可以做的事', (disease) => {
    // 每一個「變多」都必須同時給得出可以做什麼；只講風險不講行動就是製造焦慮。
    expect(DISEASE_INFO[disease].actions.length).toBeGreaterThanOrEqual(2);
    DISEASE_INFO[disease].actions.forEach((action) => expect(action.length).toBeGreaterThan(0));
  });

  it.each(DISEASES)('%s 的 Q&A 連結若存在也是疾管署的', (disease) => {
    const { qaUrl } = DISEASE_INFO[disease];
    if (qaUrl !== undefined) expect(qaUrl).toMatch(/^https:\/\/www\.cdc\.gov\.tw\//);
  });

  it('沒有任何一段文字用到禁用詞', () => {
    for (const info of Object.values(DISEASE_INFO)) {
      const text = [info.meaning, info.seeDoctor, ...info.actions].join('');
      for (const word of FORBIDDEN_WORDS) {
        expect(text).not.toContain(word);
      }
    }
  });

  it.each(DISEASES)('%s 沒有把話說成絕對', (disease) => {
    // 「一定」「絕對」「不會」這種話衛教文字擔不起：它們把機率寫成保證，錯了
    // 就是誤導。「不一定」也含「一定」，所以整串掃過去。
    expect(allText(disease)).not.toContain('一定');
    expect(allText(disease)).not.toContain('絕對');
  });

  it.each(DISEASES)('%s 沒有用箭頭或驚嘆號催人', (disease) => {
    expect(allText(disease)).not.toMatch(/[↑↓→←!！⚠]/);
  });

  it.each(DISEASES)('%s 沒有把家長推去談接種', (disease) => {
    // 疫苗是 LittleSteps 的疫苗追蹤在管的（spec §1.3「疫苗追蹤功能不重做」）。
    // 雷達只回答「外面在流行什麼」；一開始講接種就跨進另一個服務的職責，也踩到
    // spec §10「不做醫療建議」。連「問問醫師接種時程」都算，所以掃整串。
    expect(allText(disease)).not.toContain('疫苗');
    expect(allText(disease)).not.toContain('接種');
  });

  it.each(DISEASES)('%s 的就醫時機只寫看得見的徵象', (disease) => {
    // 這個欄位只能是家長看得到的東西。「該去哪一級醫院」是分流指示，「哪些族群
    // 風險較高」是流行病學陳述——兩者都不是徵象，都不屬於這裡。
    const { seeDoctor } = DISEASE_INFO[disease];
    // 「併發症」是診斷分類，不是家長看得見的東西——看得見的是「水泡周圍紅腫」。
    ['大醫院', '高危險', '風險', '族群', '併發症'].forEach((word) =>
      expect(seeDoctor).not.toContain(word),
    );
  });

  it.each(DISEASES)('%s 說清楚了這一格是門診就診人次而不是確診數', (disease) => {
    // 名稱落差是這個服務最容易誤導人的地方：上游六個 dataset 都是健保門診就診
    // 人次，疾管署同名的疾病介紹卻常常只涵蓋重症或併發症。
    expect(DISEASE_INFO[disease].meaning).toContain('門診就診人次');
  });

  it('腸病毒的三種表現指向同一份疾管署說明', () => {
    // 手足口病與疱疹性咽峽炎在疾管署傳染病介紹索引裡沒有獨立條目，它們是腸病毒
    // 的臨床表現。連到別處等於自己編一個不存在的官方頁。
    const entero = DISEASE_INFO['腸病毒'].sourceUrl;
    expect(DISEASE_INFO['手足口病'].sourceUrl).toBe(entero);
    expect(DISEASE_INFO['疱疹性咽峽炎'].sourceUrl).toBe(entero);
  });

  it('每一筆都指向不同疾病時就指向不同的頁', () => {
    // 反過來守：四組不同的病不該共用同一頁，那是複製貼上沒改到。
    const urls = ['腸病毒', '類流感', '腹瀉', '水痘'].map((d) => DISEASE_INFO[d].sourceUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
