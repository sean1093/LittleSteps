import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Milestone } from '../../../types';
import { X, Check, Share2 } from 'lucide-react';
import { backdrop, sheet } from '../../../common/ui/motion';
import { shareMilestone } from '../../utils/share';
import { formatDate } from '../../../common/utils/dateHelpers';

interface MilestoneModalProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  achievedDate?: string;
  onToggle: () => void;
}

export default function MilestoneModal({
  milestone,
  isOpen,
  onClose,
  isCompleted,
  achievedDate,
  onToggle
}: MilestoneModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!milestone) return null;

  const handleShare = async () => {
    await shareMilestone(milestone.title);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            {...backdrop}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          <motion.div
            {...sheet}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-ink/10 px-4 py-3 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h2>{milestone.title}</h2>
                {isCompleted && achievedDate && (
                  <p className="text-sm text-ink-faint mt-1">
                    完成日期: {formatDate(achievedDate)}
                  </p>
                )}
              </div>
              <button onClick={onClose} className="btn-icon" aria-label="關閉">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-6 space-y-6">
              <p className="leading-relaxed">{milestone.summary}</p>

              <div>
                <h3 className="mb-2">詳細說明</h3>
                <p className="text-ink-muted leading-relaxed">{milestone.details}</p>
              </div>

              {milestone.tips && milestone.tips.length > 0 && (
                <div>
                  <h3 className="mb-3">練習小撇步</h3>
                  <ul className="space-y-2">
                    {milestone.tips.map((tip, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-primary-dark flex-shrink-0">•</span>
                        <span className="text-ink-muted">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-ink/10 px-4 py-4 flex gap-3">
              <button
                onClick={onToggle}
                className={`flex-1 ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
              >
                <Check className="w-5 h-5" />
                {isCompleted ? '已完成' : '標記完成'}
              </button>
              <button onClick={handleShare} className="btn-secondary">
                <Share2 className="w-5 h-5" />
                分享
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
