import { Milestone } from '../../../types';
import { Check, ChevronRight } from 'lucide-react';
import { formatDate } from '../../../common/utils/dateHelpers';

interface MilestoneCardProps {
  milestone: Milestone;
  isCompleted: boolean;
  achievedDate?: string;
  onToggle: () => void;
  onClick: () => void;
}

export default function MilestoneCard({
  milestone,
  isCompleted,
  achievedDate,
  onToggle,
  onClick
}: MilestoneCardProps) {
  return (
    <div className="card flex gap-3 items-start">
      {/*
        The visual mark stays 24px; the button around it is a full 44px so it can
        actually be hit. The negative margin keeps the row's rhythm unchanged.
      */}
      <button
        onClick={onToggle}
        aria-label={isCompleted ? '已經會了，取消' : '會了'}
        aria-pressed={isCompleted}
        className="btn-icon -m-2.5 shrink-0"
      >
        <span
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${isCompleted ? 'bg-primary-dark border-primary-dark' : 'border-ink/25'}
          `}
        >
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </span>
      </button>

      <button
        onClick={onClick}
        className="flex-1 min-w-0 flex items-start gap-3 text-left"
      >
        <div className="flex-1 min-w-0">
          {/* No strike-through on an achieved milestone: the check mark already
              says it, and crossing out "會翻身" reads as taking it away. */}
          <h3 className="mb-1">{milestone.title}</h3>
          {isCompleted && achievedDate && (
            <p className="text-xs text-ink-faint mt-0.5">
              第一次看到：{formatDate(achievedDate)}
            </p>
          )}
          <p className="text-sm text-ink-muted line-clamp-2">
            {milestone.summary}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-ink-faint shrink-0 mt-0.5" aria-hidden="true" />
      </button>
    </div>
  );
}
