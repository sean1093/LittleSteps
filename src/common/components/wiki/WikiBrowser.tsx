import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SearchX, X } from 'lucide-react';
import { getLucideIcon } from '../../lucideIcons';
import type { WikiArticle, WikiCategoryColors } from '../../../types';
import WikiArticleCard from './WikiArticleCard';

/**
 * 三個知識庫的瀏覽介面：搜尋、分類篩選、篇數、空狀態、展開卡片。
 *
 * 原本 BabyWikiPage、ToddlerWikiPage、LittleBloomWikiPage 各自實作過一次，
 * 而且完成度不同——孕期知識庫累積到 24 篇時仍然只有搜尋框，沒有分類 chip
 * 也沒有空狀態，搜尋不到東西時畫面直接空白。三份分歧的複本就是這樣長出
 * 缺陷的，所以行為集中在這裡，各服務只帶入自己的資料與配色。
 *
 * 搜尋涵蓋成因、處理步驟與警訊，不只標題與摘要：使用者記得的往往是症狀
 * 描述而不是文章標題。
 */

export interface WikiTheme {
  /** 搜尋框 focus 樣式，例：'focus:ring-primary/30' */
  focusRing: string;
  /** 選中的分類 chip */
  chipActive: string;
  /** 未選中的分類 chip */
  chipInactive: string;
  /** 篇數與空狀態文字 */
  mutedText: string;
}

interface WikiBrowserProps<Category extends string> {
  articles: readonly WikiArticle<Category>[];
  categoryLabels: Record<Category, string>;
  categoryColors: Record<Category, WikiCategoryColors>;
  /** chip 的顯示順序；省略時採用 categoryLabels 的鍵序 */
  categoryOrder?: readonly Category[];
  /** 各分類的 lucide 圖示名稱；省略時 chip 只顯示文字 */
  categoryIcons?: Record<Category, string>;
  searchPlaceholder: string;
  theme: WikiTheme;
}

function matchesKeyword(article: WikiArticle<string>, keyword: string) {
  if (keyword === '') return true;
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

export default function WikiBrowser<Category extends string>({
  articles,
  categoryLabels,
  categoryColors,
  categoryOrder,
  categoryIcons,
  searchPlaceholder,
  theme,
}: WikiBrowserProps<Category>) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = categoryOrder ?? (Object.keys(categoryLabels) as Category[]);

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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className={`w-full pl-11 pr-10 py-3 bg-white rounded-2xl shadow-soft text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${theme.focusRing}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="清除搜尋"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
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
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? theme.chipActive : theme.chipInactive
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{value === 'all' ? '全部' : categoryLabels[value as Category]}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className={`text-xs ${theme.mutedText}`}>共 {filtered.length} 篇文章</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium mb-1">找不到相關文章</p>
          <p className={`text-sm ${theme.mutedText}`}>請嘗試其他關鍵字或清除篩選條件</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((article, index) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
              >
                <WikiArticleCard
                  article={article}
                  isExpanded={expandedId === article.id}
                  onToggle={() =>
                    setExpandedId(expandedId === article.id ? null : article.id)
                  }
                  categoryLabel={categoryLabels[article.category]}
                  categoryColors={categoryColors[article.category]}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
