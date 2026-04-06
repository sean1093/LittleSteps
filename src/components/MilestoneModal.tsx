import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Milestone } from '../types';
import { X, Check, Share2, Lightbulb } from 'lucide-react';
import { shareMilestone } from '../utils/share';

interface MilestoneModalProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  achievedDate?: string;
  onToggle: () => void;
  isReadOnly?: boolean;
}

export default function MilestoneModal({
  milestone,
  isOpen,
  onClose,
  isCompleted,
  achievedDate,
  onToggle,
  isReadOnly = false
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {milestone.title}
                </h2>
                {isCompleted && achievedDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    完成日期: {achievedDate}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-6 space-y-6">
              {/* Summary */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {milestone.summary}
                </p>
              </div>

              {/* Details */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">詳細說明</h3>
                <p className="text-gray-600 leading-relaxed">
                  {milestone.details}
                </p>
              </div>

              {/* Tips */}
              {milestone.tips && milestone.tips.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    練習小撇步
                  </h3>
                  <ul className="space-y-2">
                    {milestone.tips.map((tip, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-primary flex-shrink-0">•</span>
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 flex gap-3">
              {/* Toggle button - only show when logged in */}
              {!isReadOnly && (
                <button
                  onClick={onToggle}
                  className={`
                    flex-1 py-3 px-6 rounded-2xl font-medium transition-all flex items-center justify-center gap-2
                    ${isCompleted
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-primary text-white shadow-soft hover:bg-primary-dark'
                    }
                  `}
                >
                  <Check className="w-5 h-5" />
                  {isCompleted ? '已完成' : '標記完成'}
                </button>
              )}
              <button
                onClick={handleShare}
                className={`${!isReadOnly ? '' : 'flex-1'} px-6 py-3 rounded-2xl bg-secondary text-white shadow-soft hover:bg-secondary-dark transition-all flex items-center gap-2`}
              >
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
