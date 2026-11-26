import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { getLucideIcon } from '../../lucideIcons';
import EmptyState from '../../ui/EmptyState';
import { listItem, stagger } from '../../ui/motion';
import type { ServiceTheme } from '../../ui/serviceTheme';
import type { WikiArticle, WikiCategoryColors } from '../../../types';
import WikiArticleCard from './WikiArticleCard';
import CrossWikiResults from './CrossWikiResults';
import { matchesKeyword } from '../../wiki/matchesKeyword';
import { queryFromLocation } from '../../wiki/crossWikiSearch';
import type { ServiceId } from '../../ui/serviceTheme';
import SuiteNote, { type SuiteNoteContent } from '../../landing/SuiteNote';
import { ROUTE_PATH, articleFromPath, articlePath, type WikiPage } from '../../../types/routes';
import { metaForArticle } from '../../seo/pageMeta';
import { setDocumentMetaOverride } from '../../seo/useDocumentMeta';
import { shareText } from '../../share';
import { useToast } from '../../ui/toast';

/**
 * 三個知識庫的瀏覽介面：搜尋、分類篩選、篇數、空狀態、展開卡片。
 *
 * 原本 BabyWikiPage、ToddlerWikiPage、LittleBloomWikiPage 各自實作過一次，
 * 而且完成度不同——孕期知識庫累積到 24 篇時仍然只有搜尋框，沒有分類 chip
 * 也沒有空狀態，搜尋不到東西時畫面直接空白。三份分歧的複本就是這樣長出
 * 缺陷的，所以行為集中在這裡，各服務只帶入自己的資料與配色。
 *
 * 配色以 ServiceTheme 帶入。這裡原本另有一份 WikiTheme（focusRing、
 * chipActive、chipInactive、mutedText），但 focus ring 現在是全域的、chip 有
 * 共用的 .chip/.chip-on，於是那份等於是第二套並行的配色詞彙。
 *
 * 搜尋涵蓋成因、處理步驟與警訊，不只標題與摘要：使用者記得的往往是症狀
 * 描述而不是文章標題。
 */

/**
 * `Article` 也是型別參數，不只 `Category`：幼兒百科的文章多帶一個 `ageRange`，
 * 而 `articleTag` 需要看得到那個欄位。預設值讓另外兩個知識庫的呼叫端不受影響。
 */
interface WikiBrowserProps<
  Category extends string,
  Article extends WikiArticle<Category> = WikiArticle<Category>,
> {
  articles: readonly Article[];
  categoryLabels: Record<Category, string>;
  categoryColors: Record<Category, WikiCategoryColors>;
  /** chip 的顯示順序；省略時採用 categoryLabels 的鍵序 */
  categoryOrder?: readonly Category[];
  /** 各分類的 lucide 圖示名稱；省略時 chip 只顯示文字 */
  categoryIcons?: Record<Category, string>;
  searchPlaceholder: string;
  /**
   * 依情境為每篇加一個小標籤，回傳 undefined 就不顯示。
   *
   * 幼兒百科用它標出哪些文章符合孩子現在的月齡；另外兩個知識庫不傳，
   * 卡片就和以前一樣。排序由呼叫端決定——這裡照傳入順序渲染。
   */
  articleTag?: (article: Article) => string | undefined;
  theme: ServiceTheme;
  /**
   * 有給就一併搜其他兩個知識庫，並把結果列在自己的結果下面。
   *
   * 家長的問題不管服務邊界——在幼兒百科搜「發燒」卻看不到寶寶百科那幾篇，
   * 是把 92 篇查證過的文章切成三份互不相通的直接後果。
   */
  crossSearchService?: ServiceId;
  /**
   * 這個知識庫是哪一頁。有給，打開的那一篇就有自己的網址。
   *
   * 文章原本只是頁面裡的一個展開狀態：想把「發燒什麼時候要就醫」傳給另一半，
   * 只能傳整個百科再請對方自己找；搜尋引擎也只看得到一個網址，92 篇文章共用
   * 一個標題。現在展開哪一篇，網址列就是那一篇，重新整理或從連結進來都會
   * 落在那一篇上。
   */
  wikiPage?: WikiPage;
  /**
   * 文末那一行「內容查證於…」。各知識庫自己知道日期與對照了哪些機關。
   * 給函式時逐篇產生，讓後來加入、各自查證的文章寫出自己的日期。
   */
  verifiedNote?: string | ((article: Article) => string);
  /** 頁尾那張卡片要帶家長去哪；省略就是通用的那一句。 */
  suiteNote?: SuiteNoteContent;
}

/** 網址指的那一篇；不是這個知識庫的文章、或那一篇不在清單裡，就當作沒有。 */
function articleIdInUrl(wikiPage: WikiPage | undefined, articles: readonly { id: string }[]) {
  if (!wikiPage) return null;
  const target = articleFromPath(window.location.pathname);
  if (!target || target.page !== wikiPage) return null;
  return articles.some((article) => article.id === target.articleId) ? target.articleId : null;
}

export default function WikiBrowser<
  Category extends string,
  Article extends WikiArticle<Category> = WikiArticle<Category>,
>({
  articles,
  categoryLabels,
  categoryColors,
  categoryOrder,
  categoryIcons,
  searchPlaceholder,
  articleTag,
  theme,
  crossSearchService,
  wikiPage,
  verifiedNote,
  suiteNote,
}: WikiBrowserProps<Category, Article>) {
  const toast = useToast();

  /* 文章現在有自己的網址，但頁面上沒有任何東西把它交到家長手上。LINE 群組轉傳
     是這個站唯一的擴散管道，所以每一篇文末都有一顆分享。 */
  const shareArticle = async (article: Article) => {
    if (!wikiPage) return;
    const meta = metaForArticle(wikiPage, article);
    const outcome = await shareText(article.title, article.summary, meta.canonical);
    if (outcome === 'copied') toast.show('已複製連結', 'success');
    if (outcome === 'failed') toast.show('分享失敗，請稍後再試');
  };

  // 從別的知識庫帶著關鍵字跳過來時，要落在搜尋中間，不是從空白開始。
  const [query, setQuery] = useState(() => queryFromLocation(window.location.search));
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(() =>
    articleIdInUrl(wikiPage, articles),
  );

  // 從文章連結進來：那一篇已經展開，但它可能在清單很下面。只在掛載時捲一次。
  useEffect(() => {
    const id = articleIdInUrl(wikiPage, articles);
    if (!id) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`wiki-article-${id}`)?.scrollIntoView({ block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
    // 只處理進站那一刻的網址，所以不跟著 props 重跑。
  }, []);

  const expandedArticle = useMemo(
    () => articles.find((article) => article.id === expandedId) ?? null,
    [articles, expandedId],
  );

  /*
   * 網址與 <head> 跟著展開的那一篇走。
   *
   * 用 replaceState 而不是 pushState：展開、收合是在同一頁裡翻看，每翻一篇就
   * 多一筆歷史紀錄的話，「上一頁」要按十幾下才離得開百科。收合時保留 query，
   * 搜尋到一半的關鍵字不能因為收起一篇文章就不見。
   */
  useEffect(() => {
    if (!wikiPage) return;
    const target = expandedArticle
      ? articlePath(wikiPage, expandedArticle.id)
      : `${ROUTE_PATH[wikiPage]}${window.location.search}`;
    if (`${window.location.pathname}${window.location.search}` !== target) {
      window.history.replaceState(window.history.state, '', target);
    }
    setDocumentMetaOverride(expandedArticle ? metaForArticle(wikiPage, expandedArticle) : null);
  }, [wikiPage, expandedArticle]);

  // 離開知識庫時把 <head> 還給頁面本身。
  useEffect(() => () => setDocumentMetaOverride(null), []);

  const categories = categoryOrder ?? (Object.keys(categoryLabels) as Category[]);

  const titleById = useMemo(
    () => new Map(articles.map((article) => [article.id, article.title])),
    [articles],
  );

  /* 打開另一篇：先把搜尋與分類清掉——那一篇多半不在目前篩出來的清單裡——再
     展開它並捲到它。捲動要等清單重新排好之後。 */
  const openRelated = (id: string) => {
    setQuery('');
    setCategory('all');
    setExpandedId(id);
    window.requestAnimationFrame(() => {
      document.getElementById(`wiki-article-${id}`)?.scrollIntoView({ block: 'start' });
    });
  };

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return articles.filter(
      (article) =>
        (category === 'all' || article.category === category) && matchesKeyword(article, keyword),
    );
  }, [articles, category, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          // 原生的 search 清除鍵會和右邊那顆 44px 清除鍵並排出現兩個叉。
          className="w-full min-h-tap pl-11 pr-14 py-3 bg-white rounded-2xl shadow-soft text-sm text-ink placeholder-ink-faint [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="清除搜尋"
            className="btn-icon absolute right-1 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* data-testid：下面那一列刻意橫向捲動，E2E 要單獨量它，而不是算成整頁的
          水平溢出；捲動容器沒有角色也沒有可及名稱可選（docs/E2E_TEST_PLAN.md §6）。 */}
      {categories.length > 1 && (
        <div data-testid="scroll-row-wiki-categories" className="row-bleed flex gap-2 pb-1">
          {(['all', ...categories] as const).map((value) => {
            const isActive = category === value;
            const iconName = value === 'all' ? 'LayoutGrid' : categoryIcons?.[value as Category];
            const Icon = iconName ? getLucideIcon(iconName) : undefined;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setCategory(value as Category | 'all');
                  setExpandedId(null);
                }}
                aria-pressed={isActive}
                className={`chip shrink-0 ${isActive ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''}`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{value === 'all' ? '全部' : categoryLabels[value as Category]}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className={`text-xs ${theme.muted}`}>共 {filtered.length} 篇文章</p>

      {filtered.length === 0 ? (
        <EmptyState
          theme={theme}
          title="找不到相關文章"
          description="換個字試試，或按「全部」看所有文章。"
        />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((article) => (
              <motion.div
                key={article.id}
                id={`wiki-article-${article.id}`}
                // 讓捲過來的文章停在黏住的頁首下面，而不是被它蓋住。
                className="scroll-mt-20"
                layout
                variants={listItem}
                exit="hidden"
              >
                <WikiArticleCard
                  article={article}
                  isExpanded={expandedId === article.id}
                  onToggle={() =>
                    setExpandedId(expandedId === article.id ? null : article.id)
                  }
                  categoryLabel={categoryLabels[article.category]}
                  categoryColors={categoryColors[article.category]}
                  tag={articleTag?.(article)}
                  theme={theme}
                  related={article.relatedArticleIds.flatMap((id) => {
                    const title = titleById.get(id);
                    return title ? [{ id, title }] : [];
                  })}
                  onOpenRelated={openRelated}
                  onShare={wikiPage ? () => void shareArticle(article) : undefined}
                  verifiedNote={
                    typeof verifiedNote === 'function' ? verifiedNote(article) : verifiedNote
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {crossSearchService && (
        <CrossWikiResults query={query} service={crossSearchService} theme={theme} />
      )}

      <SuiteNote note={suiteNote} />
    </div>
  );
}
