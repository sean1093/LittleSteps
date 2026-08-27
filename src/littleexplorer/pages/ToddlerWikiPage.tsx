import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { ChildProfile, ToddlerWikiCategory } from '../../types';
import { calculateAgeDisplay } from '../../utils/summaryCalculator';
import WikiArticleCard from '../../common/components/wiki/WikiArticleCard';
import {
  toddlerWikiArticles,
  toddlerWikiCategoryColors,
  toddlerWikiCategoryLabels,
} from '../data/toddlerWiki';
import ExplorerShell from '../components/ExplorerShell';

const CATEGORY_ORDER: ToddlerWikiCategory[] = [
  'toilet',
  'language',
  'emotion',
  'eating',
  'sleep',
  'safety',
  'preschool',
];

interface ToddlerWikiPageProps {
  currentChild?: ChildProfile | null;
  reminderBadge?: number;
}

/**
 * 幼兒百科：疑難雜症查詢。
 *
 * 比 LittleBloom 的 wiki 多一排分類 chip——那邊只有 1 篇文章，這裡有 20 篇，
 * 光靠搜尋不足以瀏覽。分類與搜尋為 AND 關係。
 *
 * 不做年齡守門：查資料不需要先有孩子。
 */
export default function ToddlerWikiPage({ currentChild, reminderBadge }: ToddlerWikiPageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ToddlerWikiCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return toddlerWikiArticles.filter((article) => {
      const matchesCategory = category === 'all' || article.category === category;
      const matchesKeyword =
        keyword === '' ||
        article.title.toLowerCase().includes(keyword) ||
        article.summary.toLowerCase().includes(keyword);
      return matchesCategory && matchesKeyword;
    });
  }, [query, category]);

  return (
    <ExplorerShell
      active="wiki"
      childName={currentChild?.name}
      ageLabel={currentChild ? calculateAgeDisplay(currentChild.birthday) : undefined}
      reminderBadge={reminderBadge}
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-explorer-bark/30" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋幼兒照顧問題"
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white shadow-soft text-explorer-bark placeholder:text-explorer-bark/40 focus:outline-none focus:ring-2 focus:ring-explorer-sunbeam"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {(['all', ...CATEGORY_ORDER] as const).map((value) => {
            const isSelected = category === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                aria-pressed={isSelected}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-explorer-sunbeam text-white shadow-soft'
                    : 'bg-white text-explorer-bark/70 hover:bg-explorer-sunbeam-light/40'
                }`}
              >
                {value === 'all' ? '全部' : toddlerWikiCategoryLabels[value]}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-explorer-bark/50">
            找不到符合的文章，換個關鍵字試試
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((article) => (
              <WikiArticleCard
                key={article.id}
                article={article}
                isExpanded={expandedId === article.id}
                onToggle={() => setExpandedId(expandedId === article.id ? null : article.id)}
                categoryLabel={toddlerWikiCategoryLabels[article.category]}
                categoryColors={toddlerWikiCategoryColors[article.category]}
              />
            ))}
          </div>
        )}
      </div>
    </ExplorerShell>
  );
}
