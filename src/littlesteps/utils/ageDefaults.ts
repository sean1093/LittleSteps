import type { ChildProfile, MonthRange } from '../../types';
import { calculateAge } from '../../common/utils/dateHelpers';
import { isPregnancyProfile } from '../../common/pregnancy';

/**
 * 篩選器該從哪裡開始。
 *
 * 里程碑與疫苗追蹤原本都從 0 個月起跑，因為這兩頁根本沒拿到孩子的資料。
 * 對一個 8 個月大寶寶的家長來說，每次進來都要先滑過出生 24 小時內的
 * B 型肝炎第 1 劑——每一次都做同一件事，只為了回到「現在」。
 *
 * 孕期檔案沒有月齡可算，一律回最前面：還沒出生，0-2 個月才是下一站。
 */

const RANGE_UPPER_BOUND: { value: MonthRange; upTo: number }[] = [
  { value: '0-2', upTo: 2 },
  { value: '3-4', upTo: 4 },
  { value: '5-6', upTo: 6 },
  { value: '7-9', upTo: 9 },
  { value: '10-12', upTo: 12 },
];

/** 孩子當前月齡落在哪一個里程碑區間；超過 12 個月留在最後一段。 */
export function monthRangeForChild(child?: ChildProfile | null): MonthRange {
  if (!child || isPregnancyProfile(child)) return '0-2';

  const months = calculateAge(child.birthday);
  return RANGE_UPPER_BOUND.find((range) => months <= range.upTo)?.value ?? '10-12';
}

/**
 * 疫苗時程該落在哪一個月齡分組。
 *
 * 挑「不晚於孩子月齡的最後一個分組」而不是最接近的：家長最常做的動作是
 * 補登剛打完的那一劑，而那一劑的分組必然已經到期，不會是未來的。
 */
export function vaccineMonthForChild(
  child: ChildProfile | null | undefined,
  availableMonths: readonly number[],
): number | 'all' {
  if (!child || isPregnancyProfile(child) || availableMonths.length === 0) return 'all';

  const months = calculateAge(child.birthday);
  const reached = availableMonths.filter((month) => month <= months);
  return reached.length > 0 ? reached[reached.length - 1] : 'all';
}
