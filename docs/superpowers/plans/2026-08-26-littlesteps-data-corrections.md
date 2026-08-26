# LittleSteps 資料勘誤 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正 LittleSteps 兩處過期的疫苗時程資料與一個里程碑完成率計算漏洞，並把里程碑資料集收斂至 0-12 個月，為後續的 LittleExplorer 幼兒期子應用清出正確的資料基礎。

**Architecture:** 純資料與純函式層的修正，不動任何 UI 元件。四個任務彼此獨立，各自一個 commit；Task 3 必須先於 Task 4，因為 Task 4 的刪除會引爆 Task 3 修的漏洞。

**Tech Stack:** TypeScript 5.2、Vitest 4.1（happy-dom、globals: true）、co-located `*.test.ts`

**Spec:** `docs/superpowers/specs/2026-08-26-littleexplorer-toddler-design.md` §8

## Global Constraints

- 語言：所有使用者可見字串為繁體中文。
- **疫苗 id 一律不得更名或新增。** 既有使用者的進度存於 RTDB `children/{childId}/vaccineProgress/{vaccineId}/doses/{n}`，改 id 會製造孤兒鍵並需要一次性遷移腳本。只允許修改 `name`／`timing`／`ageInMonths`／`ageLabel`／`doses`／`currentDose`／`notes` 等顯示與結構欄位，以及刪除整筆已不存在的劑次。
- 測試不得硬編資料集大小；一律由 `vaccineSchedules` / `milestones` 推導期望值，沿用 `src/utils/summaryCalculator.test.ts:15-17` 既有慣例。
- 每個 commit 前 husky pre-commit hook 會執行 `npm run build`（`tsc && vite build`），型別錯誤會擋下 commit。
- 不新增任何 npm 依賴。
- 不新增頁面級或 E2E 測試。

---

### Task 1: 日本腦炎時程勘誤

`vaccines.ts` 保留的是 2017 年即已淘汰的鼠腦不活化疫苗 4 劑時程。國內自 106/5/22 起改採細胞培養活性減毒疫苗，幼兒常規僅 2 劑：出生滿 15 個月第 1 劑、間隔 12 個月（滿 27 個月）第 2 劑。現有資料還自我矛盾——`je-15m`/`je-15m-2`/`je-27m` 宣告 `doses: 3`，`je-5y` 卻宣告 `doses: 4` 且自稱「第 4 劑」。

**Files:**
- Create: `src/littlesteps/data/vaccines.test.ts`
- Modify: `src/littlesteps/data/vaccines.ts:311-322`（`je-15m`）、`:323-334`（`je-15m-2`，刪除）、`:335-346`（`je-27m`）、`:398-408`（`je-5y`，刪除）

**Interfaces:**
- Consumes: `vaccineSchedules: VaccineSchedule[]` from `src/littlesteps/data/vaccines.ts`；`VaccineSchedule` from `src/types/index.ts:37-53`
- Produces: `je-15m`（`currentDose: 1`, `ageInMonths: 15`, `doses: 2`）與 `je-27m`（`currentDose: 2`, `ageInMonths: 27`, `doses: 2`）為日本腦炎僅存的兩筆記錄。Task 4（LittleExplorer 計畫的 `careTasks.ts`）以這兩個 id ＋ dose 編號連動。

- [ ] **Step 1: 建立資料完整性測試檔（此時應失敗）**

Create `src/littlesteps/data/vaccines.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import type { VaccineSchedule } from '../../types';
import { vaccineSchedules } from './vaccines';

/**
 * 明列同一支疫苗的所有劑次記錄。
 * 以顯式清單而非 id 前綴推導，因為 id 命名不規則
 * （例：`pneumococcal-15v-6m` 與 `pneumococcal-12m` 並非同一支疫苗）。
 */
const VACCINE_FAMILIES: Record<string, { idPrefix: string; ids: string[] }> = {
  日本腦炎: { idPrefix: 'je-', ids: ['je-15m', 'je-27m'] },
};

const byId = (id: string): VaccineSchedule | undefined =>
  vaccineSchedules.find((v) => v.id === id);

describe('vaccineSchedules 時程正確性', () => {
  describe.each(Object.entries(VACCINE_FAMILIES))(
    '%s',
    (_name, { idPrefix, ids }) => {
      it('資料集中恰好只有這些劑次記錄', () => {
        const actual = vaccineSchedules
          .filter((v) => v.id.startsWith(idPrefix))
          .map((v) => v.id)
          .sort();
        expect(actual).toEqual([...ids].sort());
      });

      it('所有劑次宣告相同的 doses 總數，且等於實際劑次數', () => {
        const records = ids.map((id) => byId(id));
        records.forEach((r, i) => expect(r, `缺少 ${ids[i]}`).toBeDefined());
        const declared = new Set(records.map((r) => r!.doses));
        expect(declared.size).toBe(1);
        expect([...declared][0]).toBe(ids.length);
      });

      it('currentDose 為連號 1..N，且 ageInMonths 隨劑次嚴格遞增', () => {
        const records = ids.map((id) => byId(id)!);
        expect(records.map((r) => r.currentDose)).toEqual(
          records.map((_, i) => i + 1),
        );
        const ages = records.map((r) => r.ageInMonths!);
        for (let i = 1; i < ages.length; i++) {
          expect(ages[i]).toBeGreaterThan(ages[i - 1]);
        }
      });
    },
  );

  it('日本腦炎採 15／27 個月的 2 劑活性減毒時程', () => {
    expect(byId('je-15m')!.ageInMonths).toBe(15);
    expect(byId('je-27m')!.ageInMonths).toBe(27);
    expect(byId('je-27m')!.name).toContain('第2劑');
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run src/littlesteps/data/vaccines.test.ts`

Expected: FAIL。至少三項——「資料集中恰好只有這些劑次記錄」實際得到 `['je-15m','je-15m-2','je-27m','je-5y']`；「所有劑次宣告相同的 doses」得到 `Set{3, 4}` 而 size 為 2；「日本腦炎採 15／27 個月」中 `je-27m` 的 `name` 為「第3劑」。

- [ ] **Step 3: 修正 `je-15m`**

Replace `src/littlesteps/data/vaccines.ts:311-322` with:

```ts
  {
    id: "je-15m",
    name: "日本腦炎疫苗 第1劑",
    timing: "出生滿15個月",
    fundingType: "public",
    ageInMonths: 15,
    ageLabel: "15個月",
    doses: 2,
    currentDose: 1,
    sideEffects: ["發燒", "注射部位紅腫", "頭痛"],
    notes: "細胞培養活性減毒疫苗，間隔12個月接種第2劑"
  },
```

- [ ] **Step 4: 刪除 `je-15m-2`**

Delete `src/littlesteps/data/vaccines.ts:323-334` in its entirety（原 `id: "je-15m-2"`、`ageInMonths: 15.5`、`timing: "第1劑後2週"` 該筆物件）。此劑次不存在於現行時程。

- [ ] **Step 5: 修正 `je-27m` 為第 2 劑**

Replace the `je-27m` object with:

```ts
  {
    id: "je-27m",
    name: "日本腦炎疫苗 第2劑",
    timing: "出生滿27個月",
    fundingType: "public",
    ageInMonths: 27,
    ageLabel: "27個月",
    doses: 2,
    currentDose: 2,
    sideEffects: ["發燒", "注射部位紅腫", "頭痛"],
    notes: "與第1劑間隔12個月；完成此劑即完成幼兒常規接種"
  },
```

- [ ] **Step 6: 刪除 `je-5y`**

Delete the `je-5y` object in its entirety（原 `name: "日本腦炎疫苗 第4劑"`、`timing: "滿5歲至入小學前"`、`doses: 4`、`currentDose: 4`）。活性減毒疫苗時程無第 3、4 劑。

- [ ] **Step 7: 執行測試確認通過**

Run: `npx vitest run src/littlesteps/data/vaccines.test.ts`
Expected: PASS，全部 4 個測試。

- [ ] **Step 8: 確認既有測試未被波及**

Run: `npx vitest run src/utils/summaryCalculator.test.ts`
Expected: PASS。`calculateVaccineSummary` 以 `vaccineSchedules.forEach` 迭代、再用 `vaccineProgress[vaccine.id]` 查表（`summaryCalculator.ts:79-89`），刪除記錄不會讓殘留進度被誤計，故此檔應原樣通過。若失敗，代表有硬編劑次總數的斷言，需改為由 `vaccineSchedules` 推導。

- [ ] **Step 9: Commit**

```bash
git add src/littlesteps/data/vaccines.ts src/littlesteps/data/vaccines.test.ts
git commit -m "fix: correct Japanese encephalitis vaccine schedule to 2-dose regimen

vaccines.ts carried the pre-2017 mouse-brain inactivated 4-dose
schedule. Taiwan switched to the cell-culture live-attenuated
vaccine on 106/5/22: routine childhood immunisation is 2 doses,
at 15 months and 27 months.

Removes je-15m-2 (the 2-week interval second dose) and je-5y
(the pre-school fourth dose), neither of which exists in the
current schedule, and relabels je-27m from dose 3 to dose 2.

Adds a data-integrity suite pinning dose numbering, shared dose
totals, and monotonic age ordering per vaccine family.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: A 型肝炎時程勘誤

A 肝自 114/1/1 起調整為滿 18、27 個月接種第 1、2 劑。現有兩筆記錄仍是調整前的 12 個月／18-21 個月。

**Files:**
- Modify: `src/littlesteps/data/vaccines.ts:250-260`（`hepa-12m`）、`:299-310`（`hepa-18m`）
- Modify: `src/littlesteps/data/vaccines.test.ts`（`VACCINE_FAMILIES` 新增一族 ＋ 一個專屬斷言）

**Interfaces:**
- Consumes: Task 1 建立的 `VACCINE_FAMILIES` / `byId` 測試輔助結構
- Produces: `hepa-12m`（`currentDose: 1`, `ageInMonths: 18`）與 `hepa-18m`（`currentDose: 2`, `ageInMonths: 27`）。id 字面月齡與實際時程不符為**刻意保留**，LittleExplorer 的 `careTasks.ts` 依此對應。

- [ ] **Step 1: 擴充測試（此時應失敗）**

In `src/littlesteps/data/vaccines.test.ts`, extend the `VACCINE_FAMILIES` constant to:

```ts
const VACCINE_FAMILIES: Record<string, { idPrefix: string; ids: string[] }> = {
  日本腦炎: { idPrefix: 'je-', ids: ['je-15m', 'je-27m'] },
  A型肝炎: { idPrefix: 'hepa-', ids: ['hepa-12m', 'hepa-18m'] },
};
```

and append this test inside the top-level `describe('vaccineSchedules 時程正確性', ...)` block, after the 日本腦炎 assertion:

```ts
  it('A 型肝炎採 18／27 個月時程（114/1/1 起調整）', () => {
    expect(byId('hepa-12m')!.ageInMonths).toBe(18);
    expect(byId('hepa-12m')!.timing).toBe('出生滿18個月');
    expect(byId('hepa-18m')!.ageInMonths).toBe(27);
    expect(byId('hepa-18m')!.timing).toBe('出生滿27個月');
  });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run src/littlesteps/data/vaccines.test.ts`
Expected: FAIL —「A 型肝炎採 18／27 個月時程」得到 `ageInMonths` 為 12 與 18。同時 A型肝炎族的「ageInMonths 隨劑次嚴格遞增」仍會通過（12 < 18），故該項不會報錯。

- [ ] **Step 3: 修正 `hepa-12m`**

Replace `src/littlesteps/data/vaccines.ts:250-260` with:

```ts
  {
    // id 保留歷史命名，避免既有使用者的 vaccineProgress 鍵變成孤兒。
    // 實際時程自 114/1/1 起已改為出生滿 18 個月，故 id 字面與月齡不符。
    id: "hepa-12m",
    name: "A型肝炎疫苗 第1劑",
    timing: "出生滿18個月",
    fundingType: "public",
    ageInMonths: 18,
    ageLabel: "18個月",
    doses: 2,
    currentDose: 1,
    sideEffects: ["注射部位疼痛", "疲倦", "輕微發燒"]
  },
```

- [ ] **Step 4: 修正 `hepa-18m`**

Replace `src/littlesteps/data/vaccines.ts:299-310` with:

```ts
  {
    // id 保留歷史命名（同 hepa-12m）；實際時程自 114/1/1 起為出生滿 27 個月。
    id: "hepa-18m",
    name: "A型肝炎疫苗 第2劑",
    timing: "出生滿27個月",
    fundingType: "public",
    ageInMonths: 27,
    ageLabel: "27個月",
    doses: 2,
    currentDose: 2,
    sideEffects: ["注射部位疼痛", "疲倦", "輕微發燒"],
    notes: "與第1劑至少間隔6個月"
  },
```

- [ ] **Step 5: 執行測試確認通過**

Run: `npx vitest run src/littlesteps/data/vaccines.test.ts`
Expected: PASS，全部 8 個測試（兩族各 3 項 ＋ 兩個專屬斷言）。

- [ ] **Step 6: Commit**

```bash
git add src/littlesteps/data/vaccines.ts src/littlesteps/data/vaccines.test.ts
git commit -m "fix: shift hepatitis A schedule to 18 and 27 months

Taiwan moved hepatitis A doses 1 and 2 to 18 and 27 months
effective 114/1/1; the records still carried the old 12-month
and 18-21-month timings.

Record ids (hepa-12m, hepa-18m) are deliberately left unchanged
so existing vaccineProgress keys in RTDB stay valid; the now
misleading names are called out in comments.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: 修復里程碑完成率的孤兒鍵漏洞

`calculateMilestoneSummary` 計算 `achievedCount` 時完全不比對 id 是否仍存在於 `milestones` 目錄。任何從資料集移除的里程碑，其殘留使用者進度都會被計入分子而不計入分母，使完成率可超過 100%。`recentAchievements` 亦會為孤兒鍵產生 `title: ''` 的空白項目。**此任務必須先於 Task 4**，否則 Task 4 的刪除會直接讓既有使用者看到錯誤數字。

**Files:**
- Modify: `src/utils/summaryCalculator.ts:19-55`
- Modify: `src/utils/summaryCalculator.test.ts`（於 `describe('calculateMilestoneSummary', ...)` 內新增三個測試）

**Interfaces:**
- Consumes: `milestones` from `src/littlesteps/data/milestones.ts`；`MilestoneProgress` from `src/types/index.ts:11-16`
- Produces: `calculateMilestoneSummary(milestoneProgress: MilestoneProgress): MilestoneSummary` 對未知 id 免疫。簽章不變。

- [ ] **Step 1: 寫失敗測試**

In `src/utils/summaryCalculator.test.ts`, append these three tests inside the existing `describe('calculateMilestoneSummary', ...)` block（該 block 已在 scope 內提供 `TOTAL` 與 `achieveFirst`，見 `:17` 與 `:20-26`）:

```ts
    it('ignores progress entries whose milestone no longer exists', () => {
      const progress: MilestoneProgress = {
        ...achieveFirst(TOTAL),
        'removed-milestone-1': { achieved: true, achievedDate: '2026-01-01' },
        'removed-milestone-2': { achieved: true },
      };

      const summary = calculateMilestoneSummary(progress);

      expect(summary.achievedCount).toBe(TOTAL);
      expect(summary.achievementRate).toBe(100);
    });

    it('never reports an achievement rate above 100 percent', () => {
      const progress: MilestoneProgress = { ...achieveFirst(TOTAL) };
      for (let i = 0; i < 10; i++) {
        progress[`ghost-${i}`] = { achieved: true };
      }

      expect(calculateMilestoneSummary(progress).achievementRate).toBe(100);
    });

    it('omits orphaned entries from recentAchievements', () => {
      const progress: MilestoneProgress = {
        // 日期刻意設為最新，確保未被過濾時一定會排進前三名。
        'removed-milestone-1': { achieved: true, achievedDate: '2099-01-01' },
        [milestones[0].id]: { achieved: true, achievedDate: '2026-01-01' },
      };

      const summary = calculateMilestoneSummary(progress);

      expect(summary.recentAchievements.map((a) => a.id)).toEqual([
        milestones[0].id,
      ]);
    });
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run src/utils/summaryCalculator.test.ts -t 'calculateMilestoneSummary'`

Expected: 三個新測試全部 FAIL。第一個得到 `achievedCount` 為 `TOTAL + 2`、`achievementRate` 約 105；第二個得到約 130；第三個得到 `['removed-milestone-1', milestones[0].id]`。

- [ ] **Step 3: 實作最小修正**

Replace `src/utils/summaryCalculator.ts:22-26` with:

```ts
  const totalMilestones = milestones.length;
  // 只計入仍存在於目錄中的 id。使用者進度可能殘留已從資料集移除的里程碑，
  // 若一併計入分子而分母已縮小，完成率會超過 100%。
  const knownIds = new Set(milestones.map((m) => m.id));
  const achieved = Object.entries(milestoneProgress).filter(
    ([id, progress]) => progress.achieved && knownIds.has(id)
  );
  const achievedCount = achieved.length;
```

`recentAchievements`（`:32-47`）無需修改：它由 `achieved` 衍生，孤兒鍵在上游已被濾除。

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run src/utils/summaryCalculator.test.ts`
Expected: PASS，含既有測試全數通過。

- [ ] **Step 5: Commit**

```bash
git add src/utils/summaryCalculator.ts src/utils/summaryCalculator.test.ts
git commit -m "fix: exclude orphaned milestone ids from completion rate

calculateMilestoneSummary counted every achieved entry in a
child's progress map, including ids no longer present in the
milestone catalogue. Removing a milestone therefore shrank the
denominator while leaving the numerator intact, letting the rate
exceed 100 percent, and surfaced blank-titled cards in
recentAchievements.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: 里程碑資料集收斂至 0-12 個月

移除單一無差別大桶 `'12+'`（37 筆中僅 4 筆）。12 個月以後的發展追蹤改由 LittleExplorer 的發展檢核承接，避免同一件事同時出現在兩個 app。

**Files:**
- Modify: `src/types/index.ts:1-19`
- Modify: `src/littlesteps/data/milestones.ts:1`、`:318-353`、`:356-363`

**Interfaces:**
- Consumes: Task 3 修好的 `calculateMilestoneSummary`（沒有它，本任務會讓既有使用者看到 >100% 完成率）
- Produces: `MonthRange = "0-2" | "3-4" | "5-6" | "7-9" | "10-12"`；`milestones` 縮為 33 筆；`monthRanges` 縮為 5 項。LittleExplorer 的 `ToddlerAgeBand` 從 `'12-15'` 起接續。

- [ ] **Step 1: 寫失敗測試**

Create `src/littlesteps/data/milestones.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { milestones, monthRanges } from './milestones';

describe('milestones 資料集', () => {
  it('只涵蓋 0-12 個月，不含 12 個月以後的大桶', () => {
    const buckets = new Set(milestones.map((m) => m.monthRange));
    expect([...buckets].sort()).toEqual(
      ['0-2', '10-12', '3-4', '5-6', '7-9'],
    );
  });

  it('monthRanges 選項與資料集實際使用的分桶一致', () => {
    const used = new Set(milestones.map((m) => m.monthRange));
    expect(new Set(monthRanges.map((r) => r.value))).toEqual(used);
  });

  it('id 唯一', () => {
    const ids = milestones.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run src/littlesteps/data/milestones.test.ts`
Expected: FAIL —前兩個測試的實際值含 `'12+'`。第三個測試（id 唯一）應已通過。

- [ ] **Step 3: 收斂型別，並消除重複的聯集宣告**

Replace `src/types/index.ts:1-19` with:

```ts
export type MonthRange = "0-2" | "3-4" | "5-6" | "7-9" | "10-12";

export interface Milestone {
  id: string;
  monthRange: MonthRange;
  category: "physical" | "motor" | "cognitive" | "feeding";
  title: string;
  summary: string;
  details: string;
  tips: string[];
}

export interface MilestoneProgress {
  [milestoneId: string]: {
    achieved: boolean;
    achievedDate?: string; // Optional: date in 'YYYY-MM-DD' format
  };
}

export type Category = "physical" | "motor" | "cognitive" | "feeding" | "all";
```

`MonthRange` 上移至 `Milestone` 之前，讓 `Milestone.monthRange` 直接引用它——原本兩處各自寫一份相同的聯集，是重複的來源。

- [ ] **Step 4: 刪除 4 筆 `'12+'` 記錄**

Delete `src/littlesteps/data/milestones.ts:318-353` in its entirety —— 即 `id: "m12-physical-1"`、`"m12-motor-1"`、`"m12-cognitive-1"`、`"m12-social-1"` 四個物件。保留 `:317` 的 `},`（陣列尾端多餘逗號在 TS 中合法）與 `:354` 的 `];`。

- [ ] **Step 5: 收斂 `monthRanges` 並改用 `MonthRange`**

Replace `src/littlesteps/data/milestones.ts:1` with:

```ts
import { Milestone, MonthRange } from '../../types';
```

Replace the `monthRanges` export（原 `:356-363`）with:

```ts
export const monthRanges: { value: MonthRange; label: string }[] = [
  { value: "0-2", label: "0-2 個月" },
  { value: "3-4", label: "3-4 個月" },
  { value: "5-6", label: "5-6 個月" },
  { value: "7-9", label: "7-9 個月" },
  { value: "10-12", label: "10-12 個月" }
];
```

- [ ] **Step 6: 執行測試確認通過**

Run: `npx vitest run src/littlesteps/data/milestones.test.ts src/utils/summaryCalculator.test.ts`
Expected: PASS。`summaryCalculator.test.ts` 的期望值由 `milestones.length` 推導（`:17`），資料集縮小不會使其失敗。

- [ ] **Step 7: 型別檢查**

Run: `npm run build`

Expected: 成功。`MilestonesPage.tsx` 無需修改——`ranges={monthRanges}`（`:88`）為資料驅動、預設值（`:20`）已是 `'0-2'`。若 `tsc` 在他處報 `'12+'` 相關錯誤，代表有本計畫未涵蓋的硬編字面值，將該處一併改為由 `monthRanges` 推導。

- [ ] **Step 8: 執行完整測試套件**

Run: `npx vitest run`
Expected: 全數 PASS。

- [ ] **Step 9: Commit**

```bash
git add src/types/index.ts src/littlesteps/data/milestones.ts src/littlesteps/data/milestones.test.ts
git commit -m "refactor: narrow milestones to 0-12 months

The '12+' bucket held 4 of 37 records in a single undifferentiated
catch-all. Toddler development tracking moves to the LittleExplorer
sub-app, so the same item never appears in two places.

MonthRange moves above Milestone so the union is declared once
instead of duplicated in both.

Existing users keep orphaned m12-* keys in RTDB; they are no
longer read, and calculateMilestoneSummary now ignores unknown
ids so completion rates stay correct.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 10: Push**

```bash
git push origin master
```
