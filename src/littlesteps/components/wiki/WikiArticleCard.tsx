import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { BabyWikiArticle, WikiCategory } from '../../../types';
import { wikiCategoryLabels } from '../../data/babyWiki';

interface WikiArticleCardProps {
  article: BabyWikiArticle;
  isExpanded: boolean;
  onToggle: () => void;
}

const categoryColors: Record<WikiCategory, { bg: string; text: string; pill: string }> = {
  skin: { bg: 'bg-pink-50', text: 'text-pink-700', pill: 'bg-pink-100 text-pink-700' },
  oral: { bg: 'bg-sky-50', text: 'text-sky-700', pill: 'bg-sky-100 text-sky-700' },
  motor: { bg: 'bg-emerald-50', text: 'text-emerald-700', pill: 'bg-emerald-100 text-emerald-700' },
  digestive: { bg: 'bg-amber-50', text: 'text-amber-700', pill: 'bg-amber-100 text-amber-700' },
  fever: { bg: 'bg-red-50', text: 'text-red-700', pill: 'bg-red-100 text-red-700' },
  sleep: { bg: 'bg-indigo-50', text: 'text-indigo-700', pill: 'bg-indigo-100 text-indigo-700' },
  daily: { bg: 'bg-teal-50', text: 'text-teal-700', pill: 'bg-teal-100 text-teal-700' },
  pregnancy: { bg: 'bg-rose-50', text: 'text-rose-700', pill: 'bg-rose-100 text-rose-700' },
};

export default function WikiArticleCard({ article, isExpanded, onToggle }: WikiArticleCardProps) {
  const IconComponent = Icons[article.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  const colors = categoryColors[article.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-soft overflow-hidden cursor-pointer"
      onClick={onToggle}
    >
      {/* Collapsed Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          {IconComponent && (
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
              <IconComponent className={`w-5 h-5 ${colors.text}`} />
            </div>
          )}

          {/* Title & Summary */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-gray-800">{article.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.pill}`}>
                {wikiCategoryLabels[article.category]}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <Icons.ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
              {/* Causes */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icons.HelpCircle className="w-4 h-4 text-gray-500" />
                  <h4 className="font-semibold text-gray-700 text-sm">可能原因</h4>
                </div>
                <ul className="space-y-1.5">
                  {article.causes.map((cause, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Lightbulb className="w-4 h-4 text-amber-500" />
                  <h4 className="font-semibold text-gray-700 text-sm">處理方式</h4>
                </div>
                <ol className="space-y-3">
                  {article.solutions.map((solution, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 text-sm">{solution.step}</span>
                        <p className="text-sm text-gray-600 leading-relaxed mt-0.5">
                          {solution.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Warning Signals */}
              <div className="bg-red-50/60 rounded-xl p-3 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <Icons.AlertTriangle className="w-4 h-4 text-red-500" />
                  <h4 className="font-semibold text-red-700 text-sm">就醫警訊</h4>
                </div>
                <ul className="space-y-1.5">
                  {article.warningSignals.map((signal, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-red-700">
                      <Icons.AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-400" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Articles hint */}
              {article.relatedArticleIds.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                  <Icons.Link2 className="w-3.5 h-3.5" />
                  <span>有 {article.relatedArticleIds.length} 篇相關文章</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
