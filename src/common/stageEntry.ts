import type { ChildProfile } from '../types';
import type { Page } from '../types/routes';
import { isPregnancyProfile } from './pregnancy';
import { correctedAgeMonths } from './correctedAge';
import { TODDLER_MAX_MONTHS, TODDLER_MIN_MONTHS } from '../littleexplorer/utils/ageBands';
import type { ServiceId } from './ui/serviceTheme';

/**
 * 這個孩子現在屬於哪一個階段。
 *
 * 登入後原本一律跳 littlesteps/dashboard，只看「有沒有孩子」這個布林值——
 * LandingPage 對 isPregnancy 和 birthday 一個字都沒讀。所以只有孕期檔案的
 * 使用者，登入後會落在嬰兒儀表板上；兩歲孩子的家長也一樣，落在一個里程碑
 * 資料早就到頂的頁面。
 *
 * 這裡回傳的是「該去哪」，不是「該顯示什麼」——各服務自己的年齡邊界處理
 * 不受影響。
 */
export type Stage = 'pregnancy' | 'baby' | 'toddler' | 'beyond';

export function stageOfChild(child: ChildProfile | undefined): Stage | undefined {
  if (!child) return undefined;
  if (isPregnancyProfile(child)) return 'pregnancy';

  // 矯正年齡，而且上界不含 36 個月——這兩件事都要跟 LittleExplorer 自己的
  // 門檻（DevelopmentPage）一致。這裡原本用實際年齡、上界含 36：一個實際
  // 13 個月、矯正 10 個月的早產寶寶會被送進 LittleExplorer，那一頁說「矯正
  // 年齡還不到 1 歲，請回 LittleSteps」，而儀表板又叫他過去；剛滿三歲的
  // 孩子則是被送進去看「已經滿 3 歲了」。同一個孩子，兩個服務各說各話。
  const months = correctedAgeMonths(child);
  if (months < TODDLER_MIN_MONTHS) return 'baby';
  if (months < TODDLER_MAX_MONTHS) return 'toddler';

  return 'beyond';
}

/**
 * 登入完成、或從入口進入時，這個孩子該落在哪一頁。
 *
 * 滿三歲之後仍然回 LittleSteps 的儀表板：那裡有疫苗到期卡片，而 32 劑裡有
 * 10 劑排在 12 個月之後、3 劑排在 48-60 個月。幼兒期的資料到 36 個月就停了，
 * 送過去只會看到畢業卡。
 */
export function entryPageForChild(child: ChildProfile | undefined): Page {
  switch (stageOfChild(child)) {
    case 'pregnancy':
      return 'littlebloom';
    case 'toddler':
      return 'littleexplorer';
    case 'baby':
    case 'beyond':
      return 'littlesteps/dashboard';
    default:
      // 還沒有孩子時不該自動跳去任何服務——那一頁會是空的，而下一步是新增檔案。
      return 'home';
  }
}

/**
 * 這個階段對應哪一個服務。
 *
 * 給入口頁標出「現在該看哪一個」用的。刻意不改變卡片順序：一個選擇器如果在
 * 使用者拇指底下換位置，記得住的位置就沒了，而階段一輩子只換三次
 * （出生、滿一歲、滿三歲）。標記給得出同樣的資訊，又不會移動目標。
 *
 * 三歲以後仍然指向 LittleSteps，理由同 entryPageForChild。
 */
export function serviceForStage(stage: Stage | undefined): ServiceId | undefined {
  switch (stage) {
    case 'pregnancy':
      return 'littlebloom';
    case 'toddler':
      return 'littleexplorer';
    case 'baby':
    case 'beyond':
      return 'littlesteps';
    default:
      return undefined;
  }
}
