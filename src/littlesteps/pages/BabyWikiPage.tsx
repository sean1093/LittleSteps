import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, SearchX, X } from 'lucide-react';
import { getLucideIcon } from '../../common/lucideIcons';
import { WikiCategory } from '../../types';
import { babyWikiArticles, wikiCategoryLabels, babyWikiCategoryColors } from '../data/babyWiki';
import WikiArticleCard from '../../common/components/wiki/WikiArticleCard';

const categoryIcons: Record<WikiCategory, string> = {
  skin: 'Droplets',
  oral: 'Smile',
  motor: 'Footprints',
  digestive: 'Soup',
  fever: 'Thermometer',
  sleep: 'Moon',
  daily: 'Baby',
};

export default function BabyWikiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WikiCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    let articles = babyWikiArticles;

    // Filter by category
    if (selectedCategory !== 'all') {
      articles = articles.filter(a => a.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.causes.some(c => c.toLowerCase().includes(query)) ||
        a.solutions.some(s =>
          s.step.toLowerCase().includes(query) ||
          s.detail.toLowerCase().includes(query)
        ) ||
        a.warningSignals.some(w => w.toLowerCase().includes(query))
      );
    }

    return articles;
  }, [selectedCategory, searchQuery]);

  const handleToggle = (articleId: string) => {
    setExpandedId(prev => (prev === articleId ? null : articleId));
  };

  const categories: { value: WikiCategory | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: '全部', icon: 'LayoutGrid' },
    ...Object.entries(wikiCategoryLabels).map(([key, label]) => ({
      value: key as WikiCategory,
      label,
      icon: categoryIcons[key as WikiCategory],
    })),
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 bg-[#E8F4F8]/30 px-4 py-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#E8F4F8] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#7EC8E3]" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">寶寶百科</h2>
        </div>
        <p className="text-sm text-gray-600">
          常見嬰幼兒照顧問題與處理方式，參考台灣兒科醫學指引
        </p>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜尋症狀、關鍵字..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl shadow-soft text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 pl-4 pr-8">
          {categories.map(cat => {
            const CatIcon = getLucideIcon(cat.icon);
            const isActive = selectedCategory === cat.value;

            return (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setExpandedId(null);
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-2xl font-medium whitespace-nowrap text-sm transition-all
                  ${isActive
                    ? 'bg-secondary text-white shadow-soft'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                {CatIcon && <CatIcon className="w-4 h-4" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Article Count */}
      <div className="px-4 mb-3">
        <span className="text-xs text-gray-500">
          共 {filteredArticles.length} 篇文章
        </span>
      </div>

      {/* Article List */}
      <div className="px-4">
        {filteredArticles.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, index) => (
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
                    onToggle={() => handleToggle(article.id)}
                    categoryLabel={wikiCategoryLabels[article.category]}
                    categoryColors={babyWikiCategoryColors[article.category]}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-1">找不到相關文章</p>
            <p className="text-sm text-gray-400">
              請嘗試其他關鍵字或清除篩選條件
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
