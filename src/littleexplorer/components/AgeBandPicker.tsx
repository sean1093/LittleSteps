import { motion } from 'framer-motion';
import type { ToddlerAgeBand } from '../../types';
import { tap } from '../../common/ui/motion';
import { TODDLER_AGE_BANDS } from '../utils/ageBands';
import { ageBandLabels } from '../data/developmentChecks';

interface AgeBandPickerProps {
  selected: ToddlerAgeBand;
  onSelect: (band: ToddlerAgeBand) => void;
}

/** Horizontally scrollable age-band chips, shared by 成長 and 提醒. */
export default function AgeBandPicker({ selected, onSelect }: AgeBandPickerProps) {
  return (
    <div className="row-bleed flex gap-2 py-1">
      {TODDLER_AGE_BANDS.map((band) => {
        const isSelected = band === selected;
        return (
          <motion.button
            key={band}
            type="button"
            whileTap={tap}
            onClick={() => onSelect(band)}
            aria-pressed={isSelected}
            className={`chip shrink-0 ${
              isSelected
                ? 'bg-explorer-sunbeam-ink text-white border-explorer-sunbeam-ink hover:border-explorer-sunbeam-ink'
                : ''
            }`}
          >
            {ageBandLabels[band]}
          </motion.button>
        );
      })}
    </div>
  );
}
