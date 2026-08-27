import type { ChildProfile } from '../types';

/**
 * 這份檔案目前代表的是「還沒出生的孩子」。
 *
 * 判斷同時看 `isPregnancy` 與 `pregnancyData.status`：出生之後我們保留
 * `pregnancyData` 當作孕期紀錄，只把 status 改成 archived，所以只看
 * `isPregnancy` 或只看 `pregnancyData` 是否存在都會判錯。
 *
 * 有名字的原因是這個判斷散在四個地方（側邊欄、LittleSteps 儀表板、
 * LittleExplorer 年齡守門、LittleBloom），語意必須一致。
 */
export function isPregnancyProfile(child: ChildProfile | null | undefined): boolean {
  return child?.isPregnancy === true && child.pregnancyData?.status !== 'archived';
}
