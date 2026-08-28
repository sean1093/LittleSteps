import { useEffect, useRef } from 'react';
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  /*
    The default band is the child's own age, so from 18 months on the selected
    chip starts outside a 390px viewport: the parent saw the first two chips and
    nothing looking selected. Centre the selected chip instead.

    Deliberately not `scrollIntoView({ inline: 'center' })`. It walks every
    scrollable ancestor, and measured at 390px it also dragged the document down
    124px, because 提醒 renders this picker below the fold. Writing `scrollLeft`
    moves this row and nothing else.

    Rect deltas rather than `offsetLeft`: the scroller is unpositioned, so
    `offsetParent` is <body> and `offsetLeft` would also carry the centred
    column's auto margin.
  */
  useEffect(() => {
    const scroller = scrollerRef.current;
    const chip = selectedRef.current;
    if (!scroller || !chip) return;

    const row = scroller.getBoundingClientRect();
    const box = chip.getBoundingClientRect();
    const centred = scroller.scrollLeft + (box.left - row.left) - (row.width - box.width) / 2;
    const left = Math.max(0, Math.min(centred, scroller.scrollWidth - scroller.clientWidth));
    if (Math.abs(left - scroller.scrollLeft) < 1) return;

    // An explicit `behavior: 'smooth'` outranks the global reduced-motion rule
    // in index.css, so this one has to ask for the preference itself.
    scroller.scrollTo({
      left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [selected]);

  return (
    <div ref={scrollerRef} className="row-bleed flex gap-2 py-1">
      {TODDLER_AGE_BANDS.map((band) => {
        const isSelected = band === selected;
        return (
          <motion.button
            key={band}
            ref={isSelected ? selectedRef : undefined}
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
