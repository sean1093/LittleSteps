import { useMemo } from 'react';
import { ChildProfile, ResolvedCareTask } from '../../types';
import { careTaskTemplates } from '../data/careTasks';
import { resolveCareTasks } from '../utils/careSchedule';

/**
 * Combines the static care schedule with the child's own completion records
 * and LittleSteps' vaccine progress into dated, status-bearing tasks.
 *
 * No listener of its own: both progress maps hang off the children/{childId}
 * node that useUserChildren already subscribes to.
 */
export function useCareTasks(
  child: ChildProfile | undefined | null,
): { tasks: ResolvedCareTask[] } {
  const tasks = useMemo(
    () =>
      child
        ? resolveCareTasks(
            child.birthday,
            careTaskTemplates,
            child.careTaskProgress ?? {},
            child.vaccineProgress ?? {},
          )
        : [],
    [child],
  );

  return { tasks };
}
