import type { WikiArticle } from '../../types';
import { matchesAllTerms, normalizeSearch, searchTerms } from '../normalizeSearch';

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
 *
 * 關鍵字與文章兩邊都先經過 normalizeSearch：台／臺、大小寫與詞內空白不再決定
 * 有沒有結果（「4個月」找得到寫成「4 個月」的文章），少數同義寫法（子癇／子癲、
 * 肚子痛／腹痛）也算命中。拆詞的方式不變：空白仍然把關鍵字拆成必須全部命中的詞。
 */
export function matchesKeyword(article: WikiArticle<string>, keyword: string): boolean {
  const terms = searchTerms(keyword);
  if (terms.length === 0) return true;
  return matchesAllTerms(normalizedFields(article), terms);
}

/**
 * 每篇文章正規化後的欄位只算一次：每打一個字就要把三個知識庫全掃一遍。
 * 文章資料是靜態的，用 WeakMap 掛在文章物件上，不必擔心過期。
 */
const fieldCache = new WeakMap<WikiArticle<string>, string[]>();

function normalizedFields(article: WikiArticle<string>): string[] {
  const cached = fieldCache.get(article);
  if (cached) return cached;
  const fields = [
    article.title,
    article.summary,
    ...article.causes,
    ...article.solutions.flatMap((solution) => [solution.step, solution.detail]),
    ...article.warningSignals,
  ].map(normalizeSearch);
  fieldCache.set(article, fields);
  return fields;
}
