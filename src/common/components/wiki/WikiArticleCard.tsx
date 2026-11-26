import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getLucideIcon } from '../../lucideIcons';
import { collapse } from '../../ui/motion';
import { pressable } from '../../ui/pressable';
import { goTo } from '../../navigate';
import type { WikiArticle, WikiCategoryColors } from '../../../types';
import type { ServiceTheme } from '../../ui/serviceTheme';

interface WikiArticleCardProps {
  article: WikiArticle;
  isExpanded: boolean;
  onToggle: () => void;
  /** Display label for the article's category; resolved by the owning sub-app. */
  categoryLabel: string;
  /** Category color scheme; resolved by the owning sub-app. */
  categoryColors: WikiCategoryColors;
  /** Optional situational label, e.g. whether this applies at the child's age. */
  tag?: string;
  theme: ServiceTheme;
  /**
   * 這一篇指向的其他文章，已經由擁有資料的那一層解析成標題。這裡原本只印
   * 「有 N 篇相關文章」，沒有標題也點不動。
   */
  related?: { id: string; title: string }[];
  onOpenRelated?: (id: string) => void;
  /** 有給就在文末放「分享這篇」。交給上層做，因為網址與 toast 都在那裡。 */
  onShare?: () => void;
  /** 這份知識庫的內容最後一次對過來源的日期與說明，印在文末。 */
  verifiedNote?: string;
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
  tag,
  theme,
  related = [],
  onOpenRelated,
  onShare,
  verifiedNote,
}: WikiArticleCardProps) {
  // 每篇文章的圖示都不一樣，在三十幾篇的長清單裡是用來重新找回某一列的記號，
  // 所以留著；但原本包在外面那層著色圓角方塊只是裝飾，而且分類已經有文字 pill。
  const IconComponent = getLucideIcon(article.icon);

  return (
    // 點擊區只有標題那一列。原本整張卡片都是：展開後是一篇兩千像素的文章，
    // 讀到一半手指碰到任何地方，文章就收起來、頁面跳走。
    <motion.article layout aria-label={article.title} className="card overflow-hidden">
      <div
        className={`flex items-start gap-3 -mx-4 -mt-4 px-4 pt-4 cursor-pointer ${isExpanded ? '' : '-mb-4 pb-4'}`}
        {...pressable(onToggle, isExpanded)}
      >
        <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${categoryColors.text}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-ink">{article.title}</h3>
            <span className={`tag ${categoryColors.pill}`}>{categoryLabel}</span>
            {/* 情境標籤放在分類後面：它回答的是「這篇現在跟我有關嗎」，
                和分類是兩種不同的資訊，所以用服務色而不是分類色。 */}
            {tag && <span className={`tag ${theme.tint} ${theme.ink}`}>{tag}</span>}
          </div>
          <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
            {article.summary}
          </p>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-5 h-5 text-ink-faint" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div {...collapse} className="overflow-hidden">
            <div className="mt-4 pt-4 space-y-4 border-t border-ink/5">
              {/* 就醫警訊放最前面：半夜打開這篇的家長要先知道的是「現在該不該去
                  醫院」，而它原本排在成因與五個處理步驟之後，要滑好幾下才看得到。 */}
              {article.warningSignals.length > 0 && (
                <div className="bg-primary-soft rounded-2xl p-3 border border-primary/30">
                  <h4 className="text-primary-dark mb-2">就醫警訊</h4>
                  <ul className="space-y-1.5">
                    {article.warningSignals.map((signal, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-primary-dark">
                        <span className="flex-shrink-0">•</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {article.causes.length > 0 && (
                <div>
                  <h4 className="text-ink mb-2">可能原因</h4>
                  <ul className="space-y-1.5">
                    {article.causes.map((cause, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-ink-muted">
                        <span className="text-ink-faint flex-shrink-0">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-ink mb-2">處理方式</h4>
                <ol className="space-y-3">
                  {article.solutions.map((solution, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-light text-primary-dark flex items-center justify-center text-xs font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <span className="font-medium text-ink text-sm">{solution.step}</span>
                        <p className="text-sm text-ink-muted leading-relaxed mt-0.5">
                          {solution.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {related.length > 0 && onOpenRelated && (
                <div>
                  <h4 className="text-ink mb-1">相關文章</h4>
                  <ul>
                    {related.map((entry) => (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => onOpenRelated(entry.id)}
                          className={`inline-flex items-center min-h-tap text-sm font-medium underline underline-offset-2 text-left ${theme.ink}`}
                        >
                          {entry.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 查證日期原本只寫在給搜尋引擎看的結構化資料裡；「關於資料」頁
                  說每一篇都標了日期，而頁面上其實看不到。 */}
              {verifiedNote && (
                <p className="text-xs text-ink-muted leading-relaxed">
                  {verifiedNote}{' '}
                  <a
                    href="/about"
                    onClick={(event) => {
                      event.preventDefault();
                      goTo('about');
                    }}
                    className={`font-medium underline underline-offset-2 ${theme.ink}`}
                  >
                    看資料來源
                  </a>
                </p>
              )}

              <div className="flex gap-2">
                {onShare && (
                  <button type="button" onClick={onShare} className="btn-secondary flex-1">
                    分享這篇
                  </button>
                )}
                <button type="button" onClick={onToggle} className="btn-ghost flex-1">
                  收起
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
