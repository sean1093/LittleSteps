import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { ChildProfile } from '../../types';
import { useClinicSummary } from './useClinicSummary';

/**
 * 回歸測試：看診摘要在真實資料下會整頁白掉。
 *
 * Firebase Realtime Database 不儲存空物件——addChild 寫進去的
 * `vaccineProgress: {}` 讀回來是 undefined。所以任何還沒勾過任何一劑疫苗的
 * 孩子（也就是每一個剛建立的檔案），這一頁在 render 期間就丟 TypeError。
 * 這個 app 沒有任何 ErrorBoundary，一丟就是整個畫面空白。
 *
 * 型別看不出來：ChildProfile 把這些欄位宣告成必填，但那是寫入端的形狀，
 * 不是讀回來的形狀。
 */

const childWithoutProgressMaps = (): ChildProfile =>
  ({
    id: 'c1',
    name: '小豆',
    birthday: '2025-12-28',
    createdAt: '2025-12-28T00:00:00.000Z',
    createdBy: 'u1',
    // milestoneProgress / vaccineProgress 故意不給：這就是 Firebase 回來的樣子。
  }) as unknown as ChildProfile;

describe('useClinicSummary', () => {
  it('孩子還沒勾過任何疫苗時不會炸掉', () => {
    const { result } = renderHook(() => useClinicSummary(childWithoutProgressMaps(), [], null));

    expect(result.current.data).toBeTruthy();
    expect(result.current.data?.administeredVaccines).toEqual([]);
  });

  it('沒有性別因而算不出百分位時，仍然給得出最新測量', () => {
    // 由 LittleBloom 登記出生轉過來的孩子一律沒有性別：recordBirth 只改
    // birthday 與 isPregnancy，不會補 gender。
    // growthRecords 由 useGrowthTracking 從 Firebase 取得；測試環境下是空的，
    // 所以這一條驗的是「沒有測量紀錄時也不炸」，百分位缺失的情況由
    // ClinicSummaryPage 的 ?. 守住。
    const { result } = renderHook(() => useClinicSummary(childWithoutProgressMaps(), [], null));

    expect(result.current.data?.latestGrowth).toBeUndefined();
  });

  // 這一頁的百分位是用矯正年齡算的。年齡欄位若只給實際年齡，醫師手上就是
  // 兩個對不起來的數字，而且看不出哪一個對應哪一個。
  it('早產寶寶的摘要同時給出生週數與矯正年齡', () => {
    const preterm = {
      ...childWithoutProgressMaps(),
      birthday: '2026-02-01',
      gestationalAgeWeeks: 32,
      gestationalAgeDays: 3,
    } as ChildProfile;
    const { result } = renderHook(() => useClinicSummary(preterm, [], null));

    expect(result.current.data?.gestationalAge).toBe('出生 32 週 3 天');
    expect(result.current.data?.correctedAgeDisplay).toMatch(/個月$/);
  });

  it('足月寶寶的摘要不多出矯正年齡欄位', () => {
    const { result } = renderHook(() => useClinicSummary(childWithoutProgressMaps(), [], null));

    expect(result.current.data?.gestationalAge).toBeUndefined();
    expect(result.current.data?.correctedAgeDisplay).toBeUndefined();
  });
});
