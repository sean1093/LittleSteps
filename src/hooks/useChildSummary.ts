import { useMemo } from 'react';
import { ChildProfile, DailyLog } from '../types';
import {
  calculateMilestoneSummary,
  calculateVaccineSummary,
  MilestoneSummary,
  VaccineSummary,
} from '../utils/summaryCalculator';
import { calculateDailySummary } from '../utils/logHelpers';

/**
 * 計算寶寶的各項摘要統計
 */
export function useChildSummary(currentChild: ChildProfile | undefined, dailyLogs: DailyLog[]) {
  const milestoneSummary: MilestoneSummary | null = useMemo(() => {
    if (!currentChild) return null;
    return calculateMilestoneSummary(currentChild.milestoneProgress || {});
  }, [currentChild]);

  const vaccineSummary: VaccineSummary | null = useMemo(() => {
    if (!currentChild) return null;
    return calculateVaccineSummary(currentChild.vaccineProgress || {}, currentChild.birthday);
  }, [currentChild]);

  const todaySummary = useMemo(() => {
    return calculateDailySummary(dailyLogs);
  }, [dailyLogs]);

  return {
    milestoneSummary,
    vaccineSummary,
    todaySummary,
  };
}
