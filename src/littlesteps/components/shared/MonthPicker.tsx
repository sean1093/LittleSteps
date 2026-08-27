import { MonthRange } from '../../../types';

interface MonthPickerProps {
  ranges: { value: MonthRange; label: string }[];
  selected: MonthRange;
  onChange: (value: MonthRange) => void;
}

export default function MonthPicker({ ranges, selected, onChange }: MonthPickerProps) {
  return (
    <div className="row-bleed flex gap-2 pb-2">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`chip shrink-0 ${selected === range.value ? 'chip-on' : ''}`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
