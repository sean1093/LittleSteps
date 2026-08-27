import type { ToddlerWikiArticle } from '../../types';

/**
 * 依孩子的月齡決定百科文章的閱讀順序。
 *
 * 44 篇文章依分類排列，對「孩子現在 1 歲 2 個月，我該先看什麼」這個問題毫無
 * 幫助——如廁訓練排在最前面，但那是 18 個月後的事；而這個年紀真正該看的戒
 * 奶瓶、學步期居家安全散在清單中段。
 *
 * 這裡只重排順序，不做篩選。半夜搜「發燒」的家長必須找得到那一篇，跟孩子幾
 * 歲無關，所以任何年齡的文章都留在清單上，搜尋與分類篩選也照舊。
 */

export type WikiRelevance =
  /** 現在正是這篇適用的月齡 */
  | 'now'
  /** 半年內就會用到 */
  | 'soon'
  /** 還很遠 */
  | 'later'
  /** 適用月齡已經過去 */
  | 'past';

/** 「半年內會用到」的界線。抓得比這更遠就變成一整頁的待辦，失去排序的意義。 */
const SOON_MONTHS = 6;

export function relevanceFor(article: ToddlerWikiArticle, ageMonths: number): WikiRelevance {
  const [start, end] = article.ageRange;
  if (ageMonths >= end) return 'past';
  if (ageMonths >= start) return 'now';
  return start - ageMonths <= SOON_MONTHS ? 'soon' : 'later';
}

const TIER_ORDER: Record<WikiRelevance, number> = {
  now: 0,
  soon: 1,
  later: 2,
  // 過去的排最後而不是刪掉：孩子兩歲時仍可能回頭查戒奶嘴。
  past: 3,
};

/**
 * 依相關度重排，不改變內容也不移除任何一篇。
 *
 * 同一層之內先看起始月齡較晚的：階段性的內容（24-30 個月的手足競爭）比橫跨
 * 整個幼兒期的常備知識（12-36 個月的居家安全）更貼近「現在」。起始相同時，
 * 適用區間較窄的先出現，最後才用原本的順序讓結果穩定。
 */
export function sortByRelevance(
  articles: readonly ToddlerWikiArticle[],
  ageMonths: number,
): ToddlerWikiArticle[] {
  return articles
    .map((article, index) => ({ article, index }))
    .sort((a, b) => {
      const tierDiff =
        TIER_ORDER[relevanceFor(a.article, ageMonths)] -
        TIER_ORDER[relevanceFor(b.article, ageMonths)];
      if (tierDiff !== 0) return tierDiff;

      const startDiff = b.article.ageRange[0] - a.article.ageRange[0];
      if (startDiff !== 0) return startDiff;

      const widthDiff =
        a.article.ageRange[1] - a.article.ageRange[0] -
        (b.article.ageRange[1] - b.article.ageRange[0]);
      if (widthDiff !== 0) return widthDiff;

      return a.index - b.index;
    })
    .map((entry) => entry.article);
}

/**
 * 月齡的口語說法。起始月齡都落在既有的年齡段界線上（12/15/18/24/30），
 * 所以「18」要讀成「1 歲半」而不是「18 個月」。
 */
export function monthsLabel(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (rest === 0) return `${years} 歲`;
  if (rest === 6) return `${years} 歲半`;
  return `${years} 歲 ${rest} 個月`;
}

/**
 * 卡片上的小標籤。只在能補充資訊時回傳字串：
 * 現在適用的講「現在適用」，還沒到的講從什麼時候開始，已經過去的不標
 * ——「已過」對家長沒有用，而且那篇仍然可以讀。
 */
export function relevanceTag(
  article: ToddlerWikiArticle,
  ageMonths: number,
): string | undefined {
  const relevance = relevanceFor(article, ageMonths);
  if (relevance === 'now') return '現在適用';
  if (relevance === 'past') return undefined;
  return `${monthsLabel(article.ageRange[0])}後`;
}
