import { babyWikiArticles, babyWikiVerifiedOn } from '../../littlesteps/data/babyWiki';
import { pregnancyWikiArticles, pregnancyWikiVerifiedOn } from '../../littlebloom/data/wiki';
import { toddlerWikiArticles, toddlerWikiVerifiedOn } from '../../littleexplorer/data/toddlerWiki';
import { ROUTE_PATH, type WikiPage } from '../../types/routes';

/**
 * 三個知識庫的每一篇文章，給建置期的 <head> 產生器與 sitemap 用。
 *
 * 這個檔案只能被建置期的程式與測試 import。它把三份文章資料全部靜態拉進來，
 * 一旦出現在瀏覽器進入點的 import 路徑上，92 篇文章就會跟著每一頁下載——
 * 知識庫頁面自己是 lazy 的，各拿各的資料。
 */
export interface WikiArticlePage {
  page: WikiPage;
  /** 知識庫的名字，麵包屑用。 */
  wikiName: string;
  /** 這一篇最後一次對過來源的日期，YYYY-MM-DD：文章自己有就用它，否則用資料檔的。 */
  verifiedOn: string;
  article: {
    id: string;
    title: string;
    summary: string;
  };
}

const WIKIS: {
  page: WikiPage;
  wikiName: string;
  verifiedOn: string;
  articles: readonly { id: string; title: string; summary: string; verifiedOn?: string }[];
}[] = [
  {
    page: 'littlesteps/baby-wiki',
    wikiName: '寶寶百科',
    verifiedOn: babyWikiVerifiedOn,
    articles: babyWikiArticles,
  },
  {
    page: 'littlebloom/wiki',
    wikiName: '孕期知識庫',
    verifiedOn: pregnancyWikiVerifiedOn,
    articles: pregnancyWikiArticles,
  },
  {
    page: 'littleexplorer/wiki',
    wikiName: '幼兒百科',
    verifiedOn: toddlerWikiVerifiedOn,
    articles: toddlerWikiArticles,
  },
];

export function wikiArticlePages(): WikiArticlePage[] {
  return WIKIS.flatMap(({ page, wikiName, verifiedOn, articles }) =>
    articles.map(({ id, title, summary, verifiedOn: articleVerifiedOn }) => ({
      page,
      wikiName,
      verifiedOn: articleVerifiedOn ?? verifiedOn,
      article: { id, title, summary },
    })),
  );
}

/** 文章頁在 dist 底下的資料夾，例如 `littlesteps/baby-wiki/fever-assessment`。 */
export function articleOutDir(entry: WikiArticlePage): string {
  return `${ROUTE_PATH[entry.page].replace(/^\//, '')}/${entry.article.id}`;
}
