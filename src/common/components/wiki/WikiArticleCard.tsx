import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, ChevronDown, HelpCircle, Lightbulb, Link2 } from 'lucide-react';
import { getLucideIcon } from '../../lucideIcons';
import type { WikiArticle, WikiCategoryColors } from '../../../types';

interface WikiArticleCardProps {
  article: WikiArticle;
  isExpanded: boolean;
  onToggle: () => void;
  /** Display label for the article's category; resolved by the owning sub-app. */
  categoryLabel: string;
  /** Category color scheme; resolved by the owning sub-app. */
  categoryColors: WikiCategoryColors;
}

/**
 * Presentational wiki card shared by every sub-app. It is deliberately
 * data-agnostic: the category label and colors are passed in, so it knows
 * nothing about baby-vs-pregnancy category sets. Each sub-app owns its own
 * categories, labels, colors and article data.
 */
export default function WikiArticleCard({
  article,
  isExpanded,
  onToggle,
  categoryLabel,
  categoryColors,
}: WikiArticleCardProps) {
  const IconComponent = getLucideIcon(article.icon);

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
            <div className={`w-10 h-10 rounded-xl ${categoryColors.bg} flex items-center justify-center flex-shrink-0`}>
              <IconComponent className={`w-5 h-5 ${categoryColors.text}`} />
            </div>
          )}

          {/* Title & Summary */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-gray-800">{article.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors.pill}`}>
                {categoryLabel}
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
            <ChevronDown className="w-5 h-5 text-gray-400" />
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
              {article.causes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-gray-500" />
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
              )}

              {/* Solutions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
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
              {article.warningSignals.length > 0 && (
                <div className="bg-red-50/60 rounded-xl p-3 border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <h4 className="font-semibold text-red-700 text-sm">就醫警訊</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {article.warningSignals.map((signal, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-red-700">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-400" />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Articles hint */}
              {article.relatedArticleIds.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                  <Link2 className="w-3.5 h-3.5" />
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
