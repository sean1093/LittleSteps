import type { ChildProfile } from '../types';
import { correctedAgeMonths } from '../common/correctedAge';
import { isPregnancyProfile } from '../common/pregnancy';
import { OUTING_STAGES, type OutingStageId } from './data/outingStages';

/**
 * Which outing stage to preselect for a child the parent already keeps
 * records for.
 *
 * The later of two answers is used: the highest stage with a marker ticked,
 * and the stage the child's age falls in. Ticks can only raise the guess. If
 * the parent has recorded that a nine-month-old walks, the page should not
 * contradict them because the child is young for it. But an absent tick is
 * not a "no" — most parents stop ticking milestones long before the child
 * stops reaching them — so a two-year-old whose last tick was "sits alone"
 * is not sent back to the crawling mats.
 *
 * Age here is corrected age: a baby born at 30 weeks is two months behind
 * the calendar in exactly the abilities these stages are about.
 *
 * `basis` is returned so the page can say which of the two it did. A guess
 * from age shown as if it were the parent's own record would be a small lie.
 *
 * A pregnancy profile has no stage: there is nobody to take out yet.
 */
export interface StageGuess {
  stage: OutingStageId;
  basis: 'records' | 'age';
}

export function stageForChild(
  child: ChildProfile | undefined,
  at: Date = new Date(),
): StageGuess | null {
  if (!child || isPregnancyProfile(child)) return null;

  const ticked = (id: string) =>
    child.milestoneProgress?.[id]?.achieved === true ||
    child.developmentProgress?.[id]?.achieved === true;

  let byRecords = -1;
  OUTING_STAGES.forEach((stage, index) => {
    if (stage.reachedBy.some(ticked)) byRecords = index;
  });

  const months = correctedAgeMonths(child, at);
  const byAge = OUTING_STAGES.findIndex(
    (stage) => months >= stage.fromMonth && (stage.toMonth === null || months < stage.toMonth),
  );

  if (byRecords >= byAge && byRecords >= 0) {
    return { stage: OUTING_STAGES[byRecords].id, basis: 'records' };
  }
  return byAge >= 0 ? { stage: OUTING_STAGES[byAge].id, basis: 'age' } : null;
}
