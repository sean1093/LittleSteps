import type { VaccineProgress, VaccineSchedule } from '../../types';
import { addMonths, parseLocalDate, toLocalDateKey } from '../../common/utils/dateHelpers';
import {
  resolveScheduleStatus,
  type ScheduleStatus,
} from '../../common/utils/scheduleStatus';

/**
 * 把疫苗時程依出生日展開成「什麼時候該打」。
 *
 * 修之前 LittleSteps 只把 ageInMonths 拿來篩選和顯示，從來沒有和生日相減過：
 * 疫苗頁是一份可以按月齡瀏覽的清單，家長得自己知道寶寶幾個月大、自己去翻。
 * 而 32 劑裡有 22 劑落在 0-12 個月，也就是這個服務自己的守備範圍——時程最密、
 * 最不能拖的那一年，用的是最被動的介面。
 *
 * 對照組是 LittleExplorer：它手上只有 8 劑連結，卻有 resolveCareTasks 算出
 * 到期日、可執行區間與逾期狀態，提醒頁直接告訴家長。這裡缺的不是想法，是接線。
 *
 * 狀態判斷走共用的 resolveScheduleStatus，和產檢、幼兒照護任務同一套；
 * 這個檔案負責的只有「疫苗特有的錨點與區間」。
 */

/**
 * 可執行區間的寬容天數。
 *
 * 疾管署的公費時程給的是「滿 N 個月」的建議接種時間，不是一個硬性截止日；
 * 診所要預約、要看孩子當天有沒有感冒。抓太緊會讓正常的一兩週延後被畫成逾期，
 * 家長對著一片紅字反而學會忽略它。
 *
 * 選 30 天：比「下次回診」的常見間隔略寬一點，又短到過期一個月會真的講出來。
 * 這是介面上的寬容度，不是醫學建議——真正的接種時程請看每一劑的 timing。
 */
export const DUE_WINDOW_DAYS = 30;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface ResolvedVaccineDose {
  vaccineId: string;
  /** VaccineSchedule.currentDose；同一支疫苗多劑時用來區分 */
  doseNumber: number;
  name: string;
  /** 疾管署寫的建議時間，逐字沿用，不改寫成數字 */
  timing: string;
  funding: VaccineSchedule['funding'];
  /** 建議接種日 = 出生日 + ageInMonths */
  dueDate: string;
  status: ScheduleStatus;
  /** 已接種且有記日期時才有值 */
  administeredDate?: string;
}

function doseRecord(progress: VaccineProgress, vaccineId: string, doseNumber: number) {
  return progress[vaccineId]?.doses?.[doseNumber];
}

/**
 * 依出生日展開所有有月齡的劑次，依建議接種日遞增排序。
 *
 * 沒有 ageInMonths 的劑次會被跳過：算不出日期就不該假裝算得出來（自費疫苗
 * 有幾筆只寫「與公費同時」這類相對時程）。
 *
 * 完全無 I/O；today 可注入以利測試。
 */
export function resolveVaccineDoses(
  birthday: string,
  schedules: VaccineSchedule[],
  progress: VaccineProgress,
  today: Date = new Date(),
): ResolvedVaccineDose[] {
  if (!birthday) return [];

  const todayLocal = parseLocalDate(toLocalDateKey(today));

  return schedules
    .filter((vaccine) => vaccine.ageInMonths !== undefined)
    .map((vaccine) => {
      const doseNumber = vaccine.currentDose ?? 1;
      const dueDate = addMonths(birthday, vaccine.ageInMonths!);
      const windowEnd = toLocalDateKey(
        new Date(parseLocalDate(dueDate).getTime() + DUE_WINDOW_DAYS * MS_PER_DAY),
      );

      const record = doseRecord(progress, vaccine.id, doseNumber);
      // 已接種但沒填日期時給空字串，讓狀態仍然是 done——勾了就是打了。
      const completedDate = record?.administered ? (record.administeredDate ?? '') : undefined;

      return {
        vaccineId: vaccine.id,
        doseNumber,
        name: vaccine.name,
        timing: vaccine.timing,
        funding: vaccine.funding,
        dueDate,
        status: resolveScheduleStatus(
          completedDate,
          todayLocal,
          parseLocalDate(dueDate),
          parseLocalDate(windowEnd),
        ),
        administeredDate: record?.administeredDate,
      };
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

/**
 * 逾期還要提醒多久。
 *
 * 第一版沒有這個上限，結果 5 個月大、從來沒記過的孩子會拿到 13 筆紅字，
 * 第一筆是「B型肝炎疫苗 第1劑（出生24小時內）」——那不是提醒，是一面沒有下一步
 * 的牆，而家長對著一面牆學會的是忽略它。這個 session 早先在幼兒期那邊修過
 * 一模一樣的東西（「已逾期 425 天」的徽章），我自己又寫了一次。
 *
 * 超過這個天數的劑次仍然在疫苗頁上、仍然沒有勾——它變成要和醫師對帳的病史，
 * 不是今天的待辦。
 */
export const OVERDUE_LOOKBACK_DAYS = 90;

/**
 * 現在該提醒家長的劑次。
 *
 * 三個條件：
 *   1. 已經到期或剛逾期，還沒接種。「還沒到」的不放——把未來半年每一劑都列出來
 *      等於沒有重點。
 *   2. 逾期不超過 OVERDUE_LOOKBACK_DAYS。
 *   3. 只算 national，也就是疾管署公費常規時程。自費疫苗是選擇不是時程，把它
 *      畫成「你漏打了」會讓家長以為自己欠了一劑國家規定的疫苗——這和幼兒期
 *      提醒清單刻意排除自費劑次是同一個判斷。
 *
 * nhi-conditional 刻意也不放進來，即使它可能不用錢。健保給付綁的是「1 歲以下
 * 高危險群」這類條件，而這個 app 不知道這個孩子算不算——把它列成到期的待辦，
 * 等於對每一個健康寶寶的家長說「你漏打了一劑」，那是新的錯誤資訊，只是換了
 * 方向。條件本身在疫苗頁上不必展開就看得到，該知道的家長在那裡會看到。
 */
export function actionableVaccineDoses(
  doses: ResolvedVaccineDose[],
  today: Date = new Date(),
): ResolvedVaccineDose[] {
  const cutoff = parseLocalDate(toLocalDateKey(today)).getTime() -
    (OVERDUE_LOOKBACK_DAYS + DUE_WINDOW_DAYS) * MS_PER_DAY;

  return doses.filter((dose) => {
    if (dose.funding !== 'national') return false;
    if (dose.status === 'due') return true;
    if (dose.status !== 'overdue') return false;

    return parseLocalDate(dose.dueDate).getTime() >= cutoff;
  });
}
