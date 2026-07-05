import { useState, useMemo } from 'react';
import { pregnancyWikiArticles } from '../data/wiki';
import WikiArticleCard from '../../littlesteps/components/wiki/WikiArticleCard';

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
        <h2 className="text-xl font-bold">孕期知識庫</h2>
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
          />
        ))}
      </div>
    </div>
  );
}
