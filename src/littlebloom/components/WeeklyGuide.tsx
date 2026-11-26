import { PREGNANCY_TOTAL_WEEKS, pregnancyGuides } from '../data/pregnancyGuides';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';

const THEME = SERVICE_THEME.littlebloom;

interface WeeklyGuideProps {
  /** The week on screen, 1 to 40. */
  week: number;
  /** The week the pregnancy is actually in, or null when it is not known. */
  currentWeek: number | null;
  onWeekChange: (week: number) => void;
}

/**
 * One week of the pregnancy guide, with a way to step to the week before or
 * after.
 *
 * Shared by the signed-in LittleBloom hub and the public weekly guide, so both
 * show the same text from `pregnancyGuides.ts` with the same control. It reads
 * nothing but that static file: it is on a public page's import path.
 */
export default function WeeklyGuide({ week, currentWeek, onWeekChange }: WeeklyGuideProps) {
  const guide = pregnancyGuides.find((entry) => entry.week === week) ?? null;
  const isCurrent = currentWeek === week;
  const hasPrevious = week > 1;
  const hasNext = week < PREGNANCY_TOTAL_WEEKS;

  return (
    <section aria-label="每週孕期指南" className="panel">
      <nav aria-label="切換週數" className="flex items-center justify-between gap-2 mb-4">
        <button
          type="button"
          onClick={() => onWeekChange(week - 1)}
          disabled={!hasPrevious}
          className="btn-ghost px-3 whitespace-nowrap disabled:opacity-40"
        >
          上一週
        </button>
        {currentWeek !== null && !isCurrent ? (
          <button
            type="button"
            onClick={() => onWeekChange(currentWeek)}
            className="btn-ghost px-3 whitespace-nowrap"
          >
            回到本週
          </button>
        ) : (
          <span className={`text-sm whitespace-nowrap ${THEME.muted}`}>
            {isCurrent ? '這一週' : `第 ${week} 週`}
          </span>
        )}
        <button
          type="button"
          onClick={() => onWeekChange(week + 1)}
          disabled={!hasNext}
          className="btn-ghost px-3 whitespace-nowrap disabled:opacity-40"
        >
          下一週
        </button>
      </nav>

      {guide && (
        <>
          <h2 className={`mb-2 ${THEME.body}`}>{guide.title}</h2>
          <p className={`text-sm leading-relaxed mb-5 ${THEME.muted}`}>{guide.summary}</p>

          <h3 className={`mb-2 ${THEME.ink}`}>{isCurrent ? '本週提醒' : `第 ${week} 週提醒`}</h3>
          <ul className="space-y-2 mb-5">
            {guide.tips.map((tip) => (
              <li key={tip} className={`text-sm flex gap-2 leading-relaxed ${THEME.body}`}>
                <span className="text-bloom-dusty-rose-ink shrink-0">·</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {guide.warningSignals.length > 0 && (
            <div className="rounded-2xl bg-bloom-terracotta/10 p-4">
              <h3 className="mb-2 text-bloom-terracotta-ink">這些情況請盡快就醫</h3>
              <ul className="space-y-1.5">
                {guide.warningSignals.map((signal) => (
                  <li key={signal} className={`text-sm flex gap-2 leading-relaxed ${THEME.body}`}>
                    <span className="text-bloom-terracotta-ink shrink-0">·</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
