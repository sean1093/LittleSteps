import { MonthRange } from '../types';

interface MonthPickerProps {
  ranges: { value: MonthRange; label: string }[];
  selected: MonthRange;
  onChange: (value: MonthRange) => void;
}

export default function MonthPicker({ ranges, selected, onChange }: MonthPickerProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 pl-4 pr-8">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`
            flex-shrink-0 px-5 py-3 min-h-[48px] rounded-full font-medium whitespace-nowrap transition-all
            ${selected === range.value
              ? 'bg-[#FF9B9B] text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
