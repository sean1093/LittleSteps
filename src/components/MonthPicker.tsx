import { MonthRange } from '../types';

interface MonthPickerProps {
  ranges: { value: MonthRange; label: string }[];
  selected: MonthRange;
  onChange: (value: MonthRange) => void;
}

export default function MonthPicker({ ranges, selected, onChange }: MonthPickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`
            px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all snap-center
            ${selected === range.value
              ? 'bg-primary text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
