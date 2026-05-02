import { useMemo, useState } from 'react';
import { DailyLog, ChildProfile } from '../../types';
import {
  generateWeeklyReport,
  generateMonthlyReport,
  WeeklyReport,
} from '../../utils/reportGenerator';
import { useGrowthTracking } from './useGrowthTracking';

export type ReportPeriod = '7days' | '30days';

/**
 * Hook for generating weekly/monthly reports
 * Combines daily logs and growth records to produce a comprehensive report
 */
export function useReport(
  currentChild: ChildProfile | undefined,
  dailyLogs: DailyLog[],
  user: { uid: string } | null
) {
  const [period, setPeriod] = useState<ReportPeriod>('7days');

  const { records: growthRecords, loading: growthLoading } = useGrowthTracking(
    currentChild?.id || null,
    user,
    currentChild?.gender,
    currentChild?.birthday
  );

  const ageMonths = useMemo(() => {
    if (!currentChild?.birthday) return 0;
    const birth = new Date(currentChild.birthday);
    const now = new Date();
    return (
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth()) +
      (now.getDate() - birth.getDate()) / 30
    );
  }, [currentChild?.birthday]);

  const report: WeeklyReport | null = useMemo(() => {
    if (!currentChild) return null;

    if (period === '7days') {
      return generateWeeklyReport(dailyLogs, growthRecords, ageMonths);
    }
    return generateMonthlyReport(dailyLogs, growthRecords, ageMonths);
  }, [dailyLogs, growthRecords, ageMonths, period, currentChild]);

  return {
    report,
    period,
    setPeriod,
    loading: growthLoading,
  };
}
