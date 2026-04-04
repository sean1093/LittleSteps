import { MilestoneProgress, VaccineProgress } from '../types';
import { milestones } from '../data/milestones';
import { vaccineSchedules } from '../data/vaccines';

/**
 * 計算里程碑達成率
 */
export interface MilestoneSummary {
  totalMilestones: number;
  achievedCount: number;
  achievementRate: number; // 百分比 (0-100)
  recentAchievements: Array<{
    id: string;
    title: string;
    achievedDate: string;
  }>;
}

export function calculateMilestoneSummary(
  milestoneProgress: MilestoneProgress
): MilestoneSummary {
  const totalMilestones = milestones.length;
  const achieved = Object.entries(milestoneProgress).filter(
    ([_, progress]) => progress.achieved
  );
  const achievedCount = achieved.length;
  const achievementRate = totalMilestones > 0
    ? Math.round((achievedCount / totalMilestones) * 100)
    : 0;

  // 獲取最近達成的里程碑（最多 3 個）
  const recentAchievements = achieved
    .filter(([_, progress]) => progress.achievedDate)
    .sort((a, b) => {
      const dateA = a[1].achievedDate || '';
      const dateB = b[1].achievedDate || '';
      return dateB.localeCompare(dateA); // Descending
    })
    .slice(0, 3)
    .map(([id, progress]) => {
      const milestone = milestones.find(m => m.id === id);
      return {
        id,
        title: milestone?.title || '',
        achievedDate: progress.achievedDate || '',
      };
    });

  return {
    totalMilestones,
    achievedCount,
    achievementRate,
    recentAchievements,
  };
}

/**
 * 計算疫苗接種進度
 */
export interface VaccineSummary {
  totalDoses: number;
  administeredCount: number;
  administrationRate: number; // 百分比 (0-100)
  nextVaccine?: {
    id: string;
    name: string;
    timing: string;
    doseNumber: number;
  };
}

export function calculateVaccineSummary(
  vaccineProgress: VaccineProgress
): VaccineSummary {
  // 計算總劑次和已接種劑次
  let totalDoses = 0;
  let administeredCount = 0;

  vaccineSchedules.forEach(vaccine => {
    totalDoses += vaccine.doses;
    const progress = vaccineProgress[vaccine.id];
    if (progress) {
      Object.values(progress.doses).forEach(dose => {
        if (dose.administered) {
          administeredCount++;
        }
      });
    }
  });

  const administrationRate = totalDoses > 0
    ? Math.round((administeredCount / totalDoses) * 100)
    : 0;

  // Find the next vaccine to be administered
  const nextVaccine = findNextVaccine(vaccineProgress);

  return {
    totalDoses,
    administeredCount,
    administrationRate,
    nextVaccine,
  };
}

/**
 * Find the next vaccine to be administered
 */
function findNextVaccine(
  vaccineProgress: VaccineProgress
): VaccineSummary['nextVaccine'] {
  // Sort vaccines by age for sequential recommendation
  const sortedVaccines = [...vaccineSchedules].sort((a, b) => {
    const ageA = a.ageInMonths ?? 999;
    const ageB = b.ageInMonths ?? 999;
    return ageA - ageB;
  });

  // 找出第一個尚未完全接種的疫苗
  for (const vaccine of sortedVaccines) {
    const progress = vaccineProgress[vaccine.id];

    for (let doseNumber = 1; doseNumber <= vaccine.doses; doseNumber++) {
      const dose = progress?.doses[doseNumber];
      if (!dose || !dose.administered) {
        return {
          id: vaccine.id,
          name: vaccine.name,
          timing: vaccine.timing,
          doseNumber,
        };
      }
    }
  }

  return undefined; // All vaccines have been administered
}

/**
 * Calculate baby's age display text
 */
export function calculateAgeDisplay(birthday: string): string {
  const birthDate = new Date(birthday);
  const today = new Date();

  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  const days = today.getDate() - birthDate.getDate();

  let ageInMonths = years * 12 + months;
  let ageInDays = days;

  if (ageInDays < 0) {
    ageInMonths--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    ageInDays += lastMonth.getDate();
  }

  if (ageInMonths < 0) {
    return '尚未出生';
  }

  if (ageInMonths === 0) {
    return `${ageInDays}天`;
  }

  if (ageInMonths < 12) {
    if (ageInDays === 0) {
      return `${ageInMonths}個月`;
    }
    return `${ageInMonths}個月又${ageInDays}天`;
  }

  const displayYears = Math.floor(ageInMonths / 12);
  const displayMonths = ageInMonths % 12;

  if (displayMonths === 0) {
    return `${displayYears}歲`;
  }

  return `${displayYears}歲${displayMonths}個月`;
}
