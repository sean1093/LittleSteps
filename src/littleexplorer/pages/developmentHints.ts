import type {
  DevelopmentCheckItem,
  DevelopmentCheckProgress,
  ToddlerAgeBand,
} from '../../types';

export interface WeeklyTry {
  tip: string;
  /** 這個點子出自哪一題，讓家長找得到完整的說明。 */
  title: string;
}

/**
 * 「這週可以試試」的那一件事：依傳入順序，第一個還沒勾、而且有練習點子的項目的
 * 第一條 tip。
 *
 * 只給一件。這一頁有十幾題、每題三四條點子，全攤開等於沒有建議；家長每週打開
 * 需要的是一件今天就能做的事。沒有 tips 的項目跳過——拿不出點子的題目不該佔住
 * 這個位置。
 *
 * 回傳 null 有兩種情形：全都勾了，或剩下的題目都沒有 tips。呼叫端用
 * `allAchieved` 分辨，只有前者才說「都會了」。
 */
export function pickWeeklyTry(
  items: DevelopmentCheckItem[],
  progress: DevelopmentCheckProgress,
): WeeklyTry | null {
  for (const item of items) {
    if (progress[item.id]?.achieved) continue;
    const tip = item.tips[0];
    if (tip) return { tip, title: item.title };
  }
  return null;
}

export function allAchieved(
  items: DevelopmentCheckItem[],
  progress: DevelopmentCheckProgress,
): boolean {
  return items.length > 0 && items.every((item) => progress[item.id]?.achieved === true);
}

/**
 * 年齡段結束時的年齡，寫成家長平常講的樣子：「1 歲 3 個月」「1 歲半」「2 歲」。
 *
 * 結束月齡直接取自年齡段的代號（'12-15' → 15），不另外維護一份對照表：代號
 * 本身就是起訖月齡，兩份會在哪一天改了其中一份時對不上。
 */
export function bandEndLabel(band: ToddlerAgeBand): string {
  const endMonths = Number(band.split('-')[1]);
  const years = Math.floor(endMonths / 12);
  const months = endMonths % 12;

  if (months === 0) return `${years} 歲`;
  if (months === 6) return `${years} 歲半`;
  return years > 0 ? `${years} 歲 ${months} 個月` : `${months} 個月`;
}
