import type { WikiArticle } from '../../types';

/**
 * 一篇文章是否命中關鍵字。
 *
 * 涵蓋成因、處理步驟與警訊，不只標題與摘要：家長記得的往往是症狀的樣子
 * （「後腦杓一直流汗」），而不是文章叫什麼名字。
 *
 * 獨立成一個模組是為了讓跨知識庫搜尋用同一套判準——搜尋結果的寬鬆程度
 * 在「這個服務裡」和「其他階段」之間不一致，是最難解釋的那種怪。
 *
 * 關鍵字用空白拆開，每一個詞都要命中，但不必在同一個欄位裡。這裡原本拿整
 * 串字去比對，所以「發燒 疹子」——家長半夜最自然的打法——會因為中間那個空白
 * 而一篇都找不到，即使有文章同時講到這兩件事。
 */
export function matchesKeyword(article: WikiArticle<string>, keyword: string): boolean {
  const terms = keyword.split(/\s+/).filter(Boolean);
  return terms.every((term) => matchesTerm(article, term));
}

function matchesTerm(article: WikiArticle<string>, keyword: string): boolean {
  return (
    article.title.toLowerCase().includes(keyword) ||
    article.summary.toLowerCase().includes(keyword) ||
    article.causes.some((cause) => cause.toLowerCase().includes(keyword)) ||
    article.solutions.some(
      (solution) =>
        solution.step.toLowerCase().includes(keyword) ||
        solution.detail.toLowerCase().includes(keyword),
    ) ||
    article.warningSignals.some((signal) => signal.toLowerCase().includes(keyword))
  );
}
