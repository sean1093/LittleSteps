import { useState, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { pregnancyWikiArticles, pregnancyWikiCategoryLabels, pregnancyWikiCategoryColors } from '../data/wiki';
import WikiArticleCard from '../../common/components/wiki/WikiArticleCard';

export default function LittleBloomWikiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return pregnancyWikiArticles.filter(a =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-bloom-cream pb-6">
      <header className="bg-bloom-dusty-rose px-4 py-6 text-white mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { window.location.hash = '#/littlebloom'; }}
            aria-label="返回"
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">孕期知識庫</h2>
        </div>
      </header>

      <div className="px-4 mb-4">
        <input
          type="text"
          placeholder="搜尋孕期關鍵字..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-bloom-dusty-rose"
        />
      </div>

      <div className="px-4">
        {filteredArticles.map(article => (
          <WikiArticleCard
            key={article.id}
            article={article}
            isExpanded={expandedId === article.id}
            onToggle={() => setExpandedId(expandedId === article.id ? null : article.id)}
            categoryLabel={pregnancyWikiCategoryLabels[article.category]}
            categoryColors={pregnancyWikiCategoryColors[article.category]}
          />
        ))}
      </div>
    </div>
  );
}
