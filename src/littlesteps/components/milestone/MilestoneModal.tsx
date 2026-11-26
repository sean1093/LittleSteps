import { useEffect, useState } from 'react';
import { Milestone } from '../../../types';
import { Check, Share2 } from 'lucide-react';
import { shareMilestone } from '../../utils/share';
import { formatDate, toLocalDateKey } from '../../../common/utils/dateHelpers';
import { useToast } from '../../../common/ui/toast';
import ModalFrame from '../../../common/components/ModalFrame';
import MilestonePaceNote from './MilestonePaceNote';

interface MilestoneModalProps {
  milestone: Milestone | null;
  isOpen: boolean;
  onClose: () => void;
  isCompleted: boolean;
  achievedDate?: string;
  /** Flip achieved. Ticking this way stamps today; the caller confirms an untick. */
  onToggle: () => void;
  /**
   * Record the milestone as achieved on a given day (YYYY-MM-DD) — both the
   * first tick and a later correction of the date. Without it the modal has
   * nowhere to send a date, so the date field is not shown at all rather than
   * shown and ignored.
   */
  onSetAchieved?: (achievedDate: string) => void;
}

export default function MilestoneModal({
  milestone,
  isOpen,
  onClose,
  isCompleted,
  achievedDate,
  onToggle,
  onSetAchieved,
}: MilestoneModalProps) {
  const toast = useToast();
  const today = toLocalDateKey();
  const [date, setDate] = useState(achievedDate ?? today);
  const milestoneId = milestone?.id;

  // The modal stays mounted while the parent swaps milestones, so the field has
  // to follow: the saved date for an achieved milestone, today for a new one.
  useEffect(() => {
    if (isOpen) setDate(achievedDate ?? toLocalDateKey());
  }, [isOpen, milestoneId, achievedDate]);

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
    const outcome = await shareMilestone(milestone.title);
    // 系統分享面板自己就是回饋，只有退回複製或失敗時才需要說話。
    if (outcome === 'copied') toast.show('已複製到剪貼簿', 'success');
    if (outcome === 'failed') toast.show('分享失敗，請稍後再試');
  };

  const dateValid = Boolean(date) && date <= today;
  // An achieved milestone whose field no longer matches what is saved: the
  // primary action becomes "save this date" instead of the untick.
  const dateChanged = isCompleted && Boolean(onSetAchieved) && date !== achievedDate;

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title={milestone.title}>
            {isCompleted && achievedDate && (
              <p className="text-sm text-ink-faint mb-4">第一次看到：{formatDate(achievedDate)}</p>
            )}

            {/* Content */}
            <div className="space-y-6">
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

            <MilestonePaceNote className="mt-6" />

            {onSetAchieved && (
              <label className="block mt-6 text-sm text-ink-muted">
                第一次看到的日期
                <input
                  type="date"
                  value={date}
                  max={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full px-3 min-h-tap rounded-xl border border-ink/15 bg-white text-ink"
                />
              </label>
            )}

            {/* Actions */}
            <div className={`${onSetAchieved ? 'mt-3' : 'mt-6'} flex gap-3`}>
              {!isCompleted || dateChanged ? (
                <button
                  onClick={() => (onSetAchieved ? onSetAchieved(date) : onToggle())}
                  disabled={Boolean(onSetAchieved) && !dateValid}
                  className="flex-1 btn-primary disabled:opacity-60"
                >
                  <Check className="w-5 h-5" />
                  {isCompleted ? '儲存日期' : '會了'}
                </button>
              ) : (
                <button onClick={onToggle} aria-pressed className="flex-1 btn-secondary">
                  <Check className="w-5 h-5" />
                  已經會了
                </button>
              )}
              <button onClick={handleShare} className="btn-secondary">
                <Share2 className="w-5 h-5" />
                分享
              </button>
            </div>
    </ModalFrame>
  );
}
