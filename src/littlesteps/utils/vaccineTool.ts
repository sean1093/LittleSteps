import type { VaccineSchedule } from '../../types';
import { addMonths, toLocalDateKey } from '../../common/utils/dateHelpers';
import {
  collapseAlternatives,
  resolveVaccineDoses,
  type ResolvedVaccineDose,
} from './vaccineSchedule';

/**
 * The public vaccine calculator: a birthday in, every dose's date out.
 *
 * It reuses the tracker's own resolver with an empty progress record, so the
 * two can never disagree about when a dose is due. What it adds is the split a
 * visitor needs and a tracking parent does not: which dates are already behind
 * them. The calculator cannot know whether those doses were given, so it says
 * "the suggested date has passed", never "overdue".
 *
 * It cannot know which of two alternative products a family will choose
 * either, so a visit where both have a dose is one line — "2劑型或3劑型，擇一"
 * — rather than two products listed as due on the same day.
 */
export interface VaccineToolResult {
  /** Suggested date is today or later, soonest first. */
  upcoming: ResolvedVaccineDose[];
  /** Suggested date is before today, oldest first. */
  past: ResolvedVaccineDose[];
}

export function vaccineDatesFor(
  birthday: string,
  schedules: VaccineSchedule[],
  today: Date = new Date(),
): VaccineToolResult {
  const todayKey = toLocalDateKey(today);
  const doses = collapseAlternatives(resolveVaccineDoses(birthday, schedules, {}, today));
  return {
    upcoming: doses.filter((dose) => dose.dueDate >= todayKey),
    past: doses.filter((dose) => dose.dueDate < todayKey),
  };
}

/** The rows whose suggested date has not passed: what a calendar export should carry. */
export function schedulesStillAhead(
  birthday: string,
  schedules: VaccineSchedule[],
  today: Date = new Date(),
): VaccineSchedule[] {
  const todayKey = toLocalDateKey(today);
  return schedules.filter(
    (vaccine) =>
      vaccine.ageInMonths !== undefined && addMonths(birthday, vaccine.ageInMonths) >= todayKey,
  );
}
