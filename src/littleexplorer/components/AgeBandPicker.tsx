import type { ToddlerAgeBand } from '../../types';
import { TODDLER_AGE_BANDS } from '../utils/ageBands';
import { ageBandLabels } from '../data/developmentChecks';

interface AgeBandPickerProps {
  selected: ToddlerAgeBand;
  onSelect: (band: ToddlerAgeBand) => void;
}

/** Horizontally scrollable age-band chips, shared by 成長 and 提醒. */
export default function AgeBandPicker({ selected, onSelect }: AgeBandPickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {TODDLER_AGE_BANDS.map((band) => {
        const isSelected = band === selected;
        return (
          <button
            key={band}
            type="button"
            onClick={() => onSelect(band)}
            aria-pressed={isSelected}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-explorer-sunbeam text-white shadow-soft'
                : 'bg-white text-explorer-bark/70 hover:bg-explorer-sunbeam-light/40'
            }`}
          >
            {ageBandLabels[band]}
          </button>
        );
      })}
    </div>
  );
}
