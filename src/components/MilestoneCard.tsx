import { Milestone } from '../types';
import { Check, ChevronRight } from 'lucide-react';

interface MilestoneCardProps {
  milestone: Milestone;
  isCompleted: boolean;
  achievedDate?: string;
  onToggle: () => void;
  onClick: () => void;
  isReadOnly?: boolean;
}

export default function MilestoneCard({
  milestone,
  isCompleted,
  achievedDate,
  onToggle,
  onClick,
  isReadOnly = false
}: MilestoneCardProps) {
  return (
    <div className="card flex gap-3 items-start">
      {/* Checkbox - only show when logged in */}
      {!isReadOnly && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`
            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${isCompleted
              ? 'bg-primary border-primary'
              : 'border-gray-300 hover:border-primary'
            }
          `}
        >
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </button>
      )}

      {/* Content */}
      <div
        onClick={onClick}
        className="flex-1 cursor-pointer"
      >
        <h3 className={`font-semibold text-gray-800 mb-1 ${isCompleted ? 'line-through opacity-60' : ''}`}>
          {milestone.title}
        </h3>
        {isCompleted && achievedDate && ( // Conditionally render achieved date
          <p className="text-xs text-gray-500 mt-0.5">
            完成日期: {achievedDate}
          </p>
        )}
        <p className="text-sm text-gray-600 line-clamp-2">
          {milestone.summary}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        onClick={onClick}
        className="w-5 h-5 text-gray-400 flex-shrink-0 cursor-pointer"
      />
    </div>
  );
}
