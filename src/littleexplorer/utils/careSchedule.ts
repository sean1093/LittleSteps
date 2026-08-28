import type {
  CareTaskProgress,
  CareTaskStatus,
  CareTaskTemplate,
  ResolvedCareTask,
  VaccineProgress,
} from '../../types';
import { parseLocalDate, toLocalDateKey } from '../../common/utils/dateHelpers';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * 在 YYYY-MM-DD 上加指定月數。
 * 目標月份沒有該日時（例：1/31 + 1 個月、2/29 + 12 個月）退回當月最後一日，
 * 而非 JS Date 預設的溢位到下個月。
 */
export function addMonths(isoDate: string, months: number): string {
  const source = parseLocalDate(isoDate);
  const targetDay = source.getDate();
  const result = new Date(source);
  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const daysInTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(targetDay, daysInTargetMonth));

  return toLocalDateKey(result);
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

/** 查該 template 綁定的疫苗劑次是否已接種，回傳接種日期或 undefined。 */
function vaccineCompletionDate(
  template: CareTaskTemplate,
  vaccineProgress: VaccineProgress,
): string | undefined {
  if (!template.vaccineId || template.vaccineDose === undefined) return undefined;
  const dose = vaccineProgress[template.vaccineId]?.doses?.[template.vaccineDose];
  if (!dose?.administered) return undefined;
  // 已接種但未記日期時回空字串，讓呼叫端仍能判定為 done。
  return dose.administeredDate ?? '';
}

function resolveStatus(
  completedDate: string | undefined,
  today: Date,
  dueDate: Date,
  windowEnd: Date,
): CareTaskStatus {
  if (completedDate !== undefined) return 'done';
  if (today.getTime() > windowEnd.getTime()) return 'overdue';
  if (today.getTime() >= dueDate.getTime()) return 'due';
  return 'upcoming';
}

/**
 * 依出生日將靜態時程展開為帶狀態的任務清單，依到期日遞增排序。
 * 完全無 I/O；today 可注入以利測試。
 */
export function resolveCareTasks(
  birthday: string,
  templates: CareTaskTemplate[],
  careProgress: CareTaskProgress,
  vaccineProgress: VaccineProgress,
  today: Date = new Date(),
): ResolvedCareTask[] {
  if (!birthday) return [];

  const todayLocal = parseLocalDate(toLocalDateKey(today));

  return templates
    .map((template) => {
      const dueDate = addMonths(birthday, template.dueMonth);
      const windowEnd = addMonths(birthday, template.toMonth);
      const completedDate =
        careProgress[template.id]?.completedDate ??
        vaccineCompletionDate(template, vaccineProgress);

      return {
        template,
        dueDate,
        windowEnd,
        status: resolveStatus(
          completedDate,
          todayLocal,
          parseLocalDate(dueDate),
          parseLocalDate(windowEnd),
        ),
        daysUntilDue: daysBetween(todayLocal, parseLocalDate(dueDate)),
        completedDate,
      };
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
