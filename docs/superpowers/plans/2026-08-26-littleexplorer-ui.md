# LittleExplorer UI 層 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 LittleExplorer 的資料層接上使用者介面——RTDB 讀寫 hooks、底部 Tab Bar 外框、四個分頁（成長／提醒／日記／百科），以及路由與首頁入口。

**Architecture:** 獨立子應用，自帶 chrome（比照 LittleBloom／BabyOasis），不使用 LittleSteps 的 Sidebar。四條 hash 路由平行，底部 Tab Bar 切換，無 Hub 總覽頁。資料存於既有 `children/{childId}` RTDB 子樹，不需修改安全規則。

**Tech Stack:** React 18 + TypeScript 5.2、Vite 5、Tailwind 3.4、Framer Motion 10、Firebase RTDB 12、lucide-react

**Spec:** `docs/superpowers/specs/2026-08-26-littleexplorer-toddler-design.md`

**Prerequisite plans（皆須先完成）:**
1. `docs/superpowers/plans/2026-08-26-littlesteps-data-corrections.md`
2. `docs/superpowers/plans/2026-08-26-littleexplorer-data-layer.md`

本計畫的每個任務都消費上游產出的型別、純函式與內容資料，不重新定義任何一項。

## Global Constraints

- 語言：所有使用者可見字串為繁體中文。
- **嚴格互補**：LittleExplorer 只實作 LittleSteps 沒有的能力。成長曲線、睡眠分析、快速日誌、疫苗勾選一律以 `window.location.hash` 深連結跳回 LittleSteps 既有頁面，**不得**在 LittleExplorer 內重建任何等價視圖。
- 疫苗完成狀態的唯一真相來源是 `ChildProfile.vaccineProgress`。提醒分頁的疫苗列**不得**提供標記完成按鈕。
- 資料存取一律 Firebase RTDB，全站強制登入。**沒有** LocalStorage fallback。
- **RTDB 寫入器一律照抄既有慣例**：`if (!userId) throw new Error('User not authenticated');` 開頭（是 `throw` 不是 `return`）、寫入前過 `removeUndefined()`、新增用 `set`、部分更新用 `update` 並補 `updatedAt`、刪除用 `remove`。見 `useFirebaseChildren.ts:159-210`。
- **`useChildStore` 包裝器一律照抄既有慣例**：`if (!user || !currentChild) return;` 守衛、`try/catch` 內 `console.error('中文訊息:', error)`。見 `useChildStore.ts:62-84`。
- 樣式沿用既有共用 token：`rounded-3xl`、`shadow-soft`、`shadow-soft-lg`；顏色使用 Task 2 新增的 `explorer-*` namespace。
- 不新增任何 npm 依賴。
- 不新增頁面級或 E2E 測試（本 repo 現況 0 個頁面測試；不引入第二套慣例）。驗證靠 `npm run build` 的型別檢查與 Task 7 的手動煙霧測試。
- husky pre-commit hook 會執行 `npm run build`（`tsc && vite build`）。

## 規格粒度

Task 1（hooks 與寫入器）以完整可貼上的程式碼指定——它是介面契約，任何偏差都會在四個頁面同時斷掉。

Task 2-6（外框與四個頁面）改以「指名要照抄的既有檔案 ＋ 逐項行為規格 ＋ 明確的 props 介面」指定，不轉錄 JSX。理由：本專案的頁面樣式慣例活在 `LittleBloomPage.tsx` 與 `LittleBloomWikiPage.tsx` 裡，直接讀那兩個檔案比讀本計畫的轉錄副本準確——轉錄品會隨原檔演進而失真，而失真的樣板比沒有樣板更糟。每個頁面任務的 **Interfaces** 區塊仍以程式碼明確定義 props 型別，那是 Task 7 接線時唯一會出錯的地方。

---

### Task 1: Firebase 寫入器與讀取 hooks

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/common/hooks/useFirebaseChildren.ts`
- Modify: `src/common/hooks/useChildStore.ts`
- Modify: `src/common/hooks/useChildStore.test.ts`
- Create: `src/littleexplorer/hooks/useCareTasks.ts`
- Create: `src/littleexplorer/hooks/useDiary.ts`

**Interfaces:**
- Consumes: `useFirebaseCollection<T>` from `src/common/hooks/useFirebaseCollection.ts`；`removeUndefined` from `src/utils/firebaseData.ts`；`resolveCareTasks` from `src/littleexplorer/utils/careSchedule.ts`；`careTaskTemplates` from `src/littleexplorer/data/careTasks.ts`
- Produces（`ChildStore` 新增 5 個 mutator，皆已綁定 `currentChild.id`）:
  - `toggleDevelopmentCheck(checkItemId: string): Promise<void>`
  - `upsertCareTaskRecord(record: CareTaskRecord): Promise<void>`
  - `addDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'childId' | 'createdAt'>): Promise<string | undefined>`
  - `updateDiaryEntry(entryId: string, updates: Partial<DiaryEntry>): Promise<void>`
  - `deleteDiaryEntry(entryId: string): Promise<void>`
- Produces（hooks）:
  - `useCareTasks(child): { tasks: ResolvedCareTask[] }` — 純 `useMemo`，無 listener
  - `useDiary(childId, user): { entries: DiaryEntry[]; loading: boolean }`

`toggleDevelopmentCheck` 只收 `checkItemId`，達成狀態由 store 內部反轉、日期由寫入器自動帶入——完全比照既有的 `toggleMilestone`（`useChildStore.ts:62-71`）與 `updateMilestoneProgress`（`useFirebaseChildren.ts:159-167`）。呼叫端不需要知道目前狀態。

**只有兩個 hook。** 發展檢核與照護時程的進度都掛在 `children/{childId}` 節點下，而 `useUserChildren` 早已整份訂閱該節點——它們隨 `ChildProfile` 一起到手。再為它們各開一個 `useFirebaseCollection` listener 是對同一份資料訂閱兩次，也會製造第二條取值路徑。因此 `useCareTasks` 退化為純 `useMemo`（連 `user` 都不需要），發展進度則直接由 store 的 `currentChildDevelopmentProgress` 提供，不另設 hook。

日記是唯一需要自己的 listener 的：條目無上限地累積，塞進 `ChildProfile` 會讓 app 每一次子女資料更新都拖著全部日記。這與 `dailyLogs` 的處理方式一致。

- [ ] **Step 1: 於 `ChildProfile` 新增欄位（必須最先做）**

In `src/types/index.ts`, add to the `ChildProfile` interface（`:136-149`）, next to `foodTrackingProgress`:

```ts
  developmentProgress?: DevelopmentCheckProgress; // Optional: LittleExplorer 發展檢核
  careTaskProgress?: CareTaskProgress;            // Optional: LittleExplorer 照護時程完成記錄
```

這一步必須先於後面所有步驟：Step 3 的 store 與 Step 4 的 `useCareTasks` 都會讀這兩個欄位，順序顛倒會在編輯器裡看到一整片紅線。

- [ ] **Step 2: 新增 5 個 RTDB 寫入器**

In `src/common/hooks/useFirebaseChildren.ts`, add `CareTaskRecord` and `DiaryEntry` to the existing `../../types` import, then add these functions immediately after `updateVaccineProgress`（`:177`）:

```ts
  // LittleExplorer methods
  const updateDevelopmentProgress = async (childId: string, checkItemId: string, achieved: boolean) => {
    if (!userId) throw new Error('User not authenticated');

    const progressRef = ref(database, `children/${childId}/developmentProgress/${checkItemId}`);
    await set(progressRef, removeUndefined({
      achieved,
      achievedDate: achieved ? new Date().toISOString().split('T')[0] : undefined,
    }));
  };

  const upsertCareTaskRecord = async (childId: string, record: CareTaskRecord) => {
    if (!userId) throw new Error('User not authenticated');

    const taskRef = ref(database, `children/${childId}/careTaskProgress/${record.taskId}`);
    await set(taskRef, removeUndefined(record));
  };

  const addDiaryEntry = async (childId: string, entry: Omit<DiaryEntry, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');

    const entryId = `diary_${Date.now()}`;
    const newEntry: DiaryEntry = { ...entry, id: entryId };

    const entryRef = ref(database, `children/${childId}/diaryEntries/${entryId}`);
    await set(entryRef, removeUndefined(newEntry));

    return entryId;
  };

  const updateDiaryEntry = async (childId: string, entryId: string, updates: Partial<DiaryEntry>) => {
    if (!userId) throw new Error('User not authenticated');

    const entryRef = ref(database, `children/${childId}/diaryEntries/${entryId}`);
    await update(entryRef, removeUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const deleteDiaryEntry = async (childId: string, entryId: string) => {
    if (!userId) throw new Error('User not authenticated');

    const entryRef = ref(database, `children/${childId}/diaryEntries/${entryId}`);
    await remove(entryRef);
  };
```

Add all five names to the hook's returned object.

這五個函式逐行對應既有的 `updateMilestoneProgress`／`addDailyLog`／`updateDailyLog`／`deleteDailyLog`（`:159-210`）。特別注意守衛是 `throw new Error('User not authenticated')` 而非 `return`——寫入器拋錯、由上層 store 的 `try/catch` 接住並轉成中文訊息，這是本檔案一致的分工。

- [ ] **Step 3: 於 `useChildStore` 透出 5 個 mutator**

In `src/common/hooks/useChildStore.ts`:

1. Add `CareTaskRecord`、`DiaryEntry`、`DevelopmentCheckProgress` to the `../../types` import.
2. Add to the `ChildStore` interface（`:18-32`）:

```ts
  currentChildDevelopmentProgress: DevelopmentCheckProgress;
  toggleDevelopmentCheck: (checkItemId: string) => Promise<void>;
  upsertCareTaskRecord: (record: CareTaskRecord) => Promise<void>;
  addDiaryEntry: (
    entry: Omit<DiaryEntry, 'id' | 'childId' | 'createdAt'>,
  ) => Promise<string | undefined>;
  updateDiaryEntry: (entryId: string, updates: Partial<DiaryEntry>) => Promise<void>;
  deleteDiaryEntry: (entryId: string) => Promise<void>;
```

3. Add the implementations in the hook body, after `toggleVaccineDose`（`:84`）:

```ts
  const currentChildDevelopmentProgress: DevelopmentCheckProgress = useMemo(
    () => (currentChild ? currentChild.developmentProgress || {} : {}),
    [currentChild],
  );

  const toggleDevelopmentCheck = async (checkItemId: string) => {
    if (!user || !currentChild) return;
    try {
      const achieved = !currentChildDevelopmentProgress[checkItemId]?.achieved;
      await firebaseChildren.updateDevelopmentProgress(currentChild.id, checkItemId, achieved);
    } catch (error) {
      console.error('更新發展檢核失敗:', error);
    }
  };

  const upsertCareTaskRecord = async (record: CareTaskRecord) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.upsertCareTaskRecord(currentChild.id, record);
    } catch (error) {
      console.error('更新照護記錄失敗:', error);
    }
  };

  const addDiaryEntry = async (
    entry: Omit<DiaryEntry, 'id' | 'childId' | 'createdAt'>,
  ) => {
    if (!user || !currentChild) return;
    try {
      return await firebaseChildren.addDiaryEntry(currentChild.id, {
        ...entry,
        childId: currentChild.id,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('新增日記失敗:', error);
    }
  };

  const updateDiaryEntry = async (entryId: string, updates: Partial<DiaryEntry>) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.updateDiaryEntry(currentChild.id, entryId, updates);
    } catch (error) {
      console.error('更新日記失敗:', error);
    }
  };

  const deleteDiaryEntry = async (entryId: string) => {
    if (!user || !currentChild) return;
    try {
      await firebaseChildren.deleteDiaryEntry(currentChild.id, entryId);
    } catch (error) {
      console.error('刪除日記失敗:', error);
    }
  };
```

4. Add all six names to the hook's returned object.

`currentChildDevelopmentProgress` 由 `ChildProfile` 直接讀出，與既有的 `currentChildMilestoneProgress`（`:52-55`）同形——`useUserChildren` 已經整份訂閱 `children/{childId}`，發展進度隨之而來。

- [ ] **Step 4: 建立 `useCareTasks`**

Create `src/littleexplorer/hooks/useCareTasks.ts`:

```ts
import { useMemo } from 'react';
import { ChildProfile, ResolvedCareTask } from '../../types';
import { careTaskTemplates } from '../data/careTasks';
import { resolveCareTasks } from '../utils/careSchedule';

/**
 * Combines the static care schedule with the child's own completion records
 * and LittleSteps' vaccine progress into dated, status-bearing tasks.
 *
 * No listener of its own: both progress maps hang off the children/{childId}
 * node that useUserChildren already subscribes to.
 */
export function useCareTasks(
  child: ChildProfile | undefined | null,
): { tasks: ResolvedCareTask[] } {
  const tasks = useMemo(
    () =>
      child
        ? resolveCareTasks(
            child.birthday,
            careTaskTemplates,
            child.careTaskProgress ?? {},
            child.vaccineProgress ?? {},
          )
        : [],
    [child],
  );

  return { tasks };
}
```

`resolveCareTasks` 內部以 `new Date()` 取當下時間，所以這個 `useMemo` 只在 `child` 改變時重算，跨日不會自動更新狀態。這是可接受的：使用者跨日後重新載入頁面即可，為此加一個計時器是為了極少發生的情境付出常駐成本。

- [ ] **Step 5: 建立 `useDiary`**

Create `src/littleexplorer/hooks/useDiary.ts`, mirroring `src/littlesteps/hooks/useDailyLogs.ts`:

```ts
import type { User } from 'firebase/auth';
import { DiaryEntry } from '../../types';
import { useFirebaseCollection } from '../../common/hooks/useFirebaseCollection';

/**
 * Realtime listener for a child's growth-diary entries (Firebase). Writes go
 * through useChildStore.
 */
export function useDiary(childId: string | null, user: User | null) {
  const { data: entries, loading } = useFirebaseCollection<DiaryEntry[]>(childId, user, {
    firebasePath: `children/${childId}/diaryEntries`,
    empty: [],
    fromFirebase: (data) => (data ? (Object.values(data) as DiaryEntry[]) : []),
    errorLabel: 'Error fetching diary entries:',
  });

  return { entries, loading };
}
```

排序不在此處做——`groupEntriesByMonth`（資料層 Task 7）已負責分組與排序，在 hook 裡先排一次是重複工。

- [ ] **Step 6: 補上既有測試的 mock**

`src/common/hooks/useChildStore.test.ts` mocks `useFirebaseChildren`. Add the five new methods to that mock object as `vi.fn()` so the store's new wrappers have something to delegate to.

- [ ] **Step 7: 型別檢查與既有測試**

Run: `npm run build && npx vitest run src/common/hooks/useChildStore.test.ts`
Expected: build 成功；測試 PASS。

- [ ] **Step 8: Commit**

```bash
git add src/types/index.ts src/common/hooks/ src/littleexplorer/hooks/
git commit -m "feat: add LittleExplorer data hooks and RTDB writers

Development-check progress, care-task completion, and diary
entries all live under the existing children/{childId} subtree,
so the current security rule covers them with no change.

Writers go into useFirebaseChildren, the single write point for
that subtree, rather than a parallel local hook.

Progress maps hang off ChildProfile, which useUserChildren
already subscribes to. Diary entries deliberately do not: they
accumulate without bound, and folding them into that payload
would drag every entry through every child-profile update.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: 品牌色票與共用外框

**Files:**
- Modify: `tailwind.config.js`
- Create: `src/littleexplorer/components/ExplorerTabBar.tsx`
- Create: `src/littleexplorer/components/ExplorerShell.tsx`

**Interfaces:**
- Consumes: `calculateAgeDisplay` from `src/utils/summaryCalculator.ts`
- Produces:

```ts
export type ExplorerTab = 'development' | 'reminders' | 'diary' | 'wiki';

interface ExplorerTabBarProps {
  active: ExplorerTab;
  /** 提醒分頁的紅點數量；0 或 undefined 不顯示 */
  reminderBadge?: number;
}

interface ExplorerShellProps {
  active: ExplorerTab;
  childName?: string;
  /** 已格式化的年齡字串，例：2歲3個月 */
  ageLabel?: string;
  reminderBadge?: number;
  children: React.ReactNode;
}
```

- [ ] **Step 1: 新增 `explorer` 色票**

In `tailwind.config.js`, add to `theme.extend.colors` after the `bloom` object:

```js
        // LittleExplorer（幼兒期）Palette
        explorer: {
          'sunbeam': '#F5B843',
          'sunbeam-light': '#FBE0A6',
          'sunbeam-dark': '#D99A22',
          'meadow': '#7FB77E',
          'meadow-light': '#B7D9B6',
          'meadow-dark': '#5C9159',
          'sky': '#6FB3D2',
          'sky-light': '#B3D8E8',
          'clay': '#E08D6F',
          'sand': '#FDF8EE',
          'bark': '#6B5B4E',
        }
```

- [ ] **Step 2: 建立 `ExplorerTabBar`**

Create `src/littleexplorer/components/ExplorerTabBar.tsx`.

四個分頁，由上方 `ExplorerTab` union 驅動，各自的 icon、標籤與 hash：

| tab | icon | 標籤 | hash |
|---|---|---|---|
| `development` | `Sprout` | 成長 | `#/littleexplorer` |
| `reminders` | `BellRing` | 提醒 | `#/littleexplorer/reminders` |
| `diary` | `NotebookPen` | 日記 | `#/littleexplorer/diary` |
| `wiki` | `BookOpen` | 百科 | `#/littleexplorer/wiki` |

以模組層級的 `const TABS = [...]` 陣列宣告，比照 `Sidebar.tsx:52-158` 的 `menuSections` 慣例（資料驅動，不是四段複製的 JSX）。Icon 直接從 `lucide-react` 具名 import——這是元件內的固定 icon，不需要經過 `getLucideIcon` registry（那個 registry 服務的是資料檔裡的字串名稱）。

行為與樣式：

- 外層 `fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-explorer-sand`，內層 `pb-[env(safe-area-inset-bottom)]` 處理 iOS 底部安全區。
- 每個 tab 是 `flex-1` 的直式按鈕：icon 在上、標籤在下（`text-xs`），最小高度 56px 以符合單手觸控目標。
- 作用中：`text-explorer-sunbeam-dark`，icon 加 `fill-explorer-sunbeam/20`；非作用中：`text-gray-400`。
- 導覽以 `window.location.hash = tab.hash` 完成——`App.tsx` 已監聽 `hashchange`，不需要回呼 prop。
- `reminderBadge` 大於 0 時，在提醒 tab 的 icon 右上角疊一個 `bg-explorer-clay` 圓點，內含數字；超過 9 顯示 `9+`。

- [ ] **Step 3: 建立 `ExplorerShell`**

Create `src/littleexplorer/components/ExplorerShell.tsx`.

三段式：頁首 ＋ 內容 slot ＋ `ExplorerTabBar`。

- 根層 `min-h-screen bg-explorer-sand`。
- 頁首：白底 `shadow-soft` 卡片，`Sun` icon、標題「LittleExplorer」、副標「小小探險家 · {ageLabel}」。`childName` 有值時副標改為「{childName} · {ageLabel}」，兩者皆無則只顯示「小小探險家」。
- 內容區：`max-w-4xl mx-auto px-4 pb-24`，`pb-24` 是為了不被固定的 tab bar 遮住。
- 底部渲染 `<ExplorerTabBar active={active} reminderBadge={reminderBadge} />`。

頁首不做返回鍵——四個分頁是平行關係，沒有上層可返回。要離開子應用走首頁卡片或瀏覽器上一頁。

- [ ] **Step 4: 型別檢查**

Run: `npm run build`
Expected: 成功。此時元件尚未被任何路由引用，僅驗證型別正確。

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js src/littleexplorer/components/
git commit -m "feat: add LittleExplorer shell and bottom tab bar

Four parallel tabs instead of a hub: every page is one thumb tap
away, and the project's own FEATURE_RECOMMENDATIONS.md asked for
a bottom nav that never got built.

The tab bar navigates by writing location.hash directly, since
App.tsx already listens for hashchange - no callback prop has to
thread through four pages.

A badge on the reminders tab covers the one thing a hub page did
better than tabs: knowing there is something overdue without
going to look.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: 成長分頁

**Files:**
- Create: `src/littleexplorer/pages/DevelopmentPage.tsx`

**Interfaces:**
- Consumes: `ExplorerShell` from Task 2；`developmentCheckItems`、`developmentWarnings`、`ageBandLabels`、`domainLabels`、`domainIcons` from `src/littleexplorer/data/developmentChecks.ts`；`getLucideIcon` from `src/common/lucideIcons.ts`；`calculateAgeDisplay` from `src/utils/summaryCalculator.ts`
- Produces:

```ts
interface DevelopmentPageProps {
  currentChild?: ChildProfile | null;
  progress: DevelopmentCheckProgress;
  reminderBadge?: number;
  onToggleCheck: (checkItemId: string) => Promise<void>;
  onQuickDiary: (content: string, linkedCheckItemId: string) => Promise<void>;
}
```

- [ ] **Step 1: 建立頁面**

Create `src/littleexplorer/pages/DevelopmentPage.tsx`, wrapped in `<ExplorerShell active="development" …>`.

**語氣是這一頁的設計核心：進度與鼓勵在前，警訊收在後。** 初版設計把紅旗當主軸，整頁讀起來像篩檢工具，會讓家長每次打開都在找孩子哪裡不對勁。翻過來。

由上而下：

1. **年齡守門** — 由 `currentChild.birthday` 算月齡：
   - `< 12`：只渲染引導卡「寶寶還不到 1 歲，先到 LittleSteps 追蹤里程碑與副食品」＋ 按鈕跳 `#/littlesteps`。不渲染下方任何區塊。
   - `>= 36`：正常渲染，但年齡段鎖在 `30-36`，頂端加一張畢業卡「已經滿 3 歲了，幼兒期的追蹤告一段落」。
   - 無 `currentChild`：引導卡「請先於 LittleSteps 新增寶寶」。
2. **年齡段選擇器** — 橫向可捲動 chip 列，選項來自 `ageBandLabels`。**初始值為孩子目前月齡所屬的段**，不是固定第一段。`MilestonesPage.tsx:20` 固定預設 `'0-2'` 是既知的體驗缺陷，此處不重蹈。
3. **進度摘要** — 「這個階段的 6 件事，已經會了 N 件」，`bg-explorer-meadow` 進度條。文案用「已經會了」而非「完成率」——這是孩子的成長，不是待辦清單。
4. **檢核清單** — 依 `domain` 分組，每組小標為 `domainLabels[domain]` ＋ `getLucideIcon(domainIcons[domain])`。每題一列：勾選框、`title`、可展開看 `detail` 與 `tips`。勾選呼叫 `onToggleCheck(item.id)`。
5. **勾選後的日記入口** — 當某題由未勾選變為勾選時，就地在該列下方展開一個單行輸入框，`placeholder` 為「要記一筆嗎？（選填）」，附「記下來」與關閉鍵。送出呼叫 `onQuickDiary(content, item.id)` 後收合並顯示短暫的成功提示。**留空或關閉則只保留勾選**，不建立日記。**不跳頁。**
6. **可展開的警訊區** — 預設收合的 `bg-explorer-clay/10` 卡片，標題「什麼時候該諮詢醫師」。展開後列出該年齡段 `developmentWarnings` 的 `signals` 與 `action`。**內容不依勾選狀態變化**——警訊的價值在於幫家長辨識模式，不是由 app 下判斷。
7. **免責說明** — 頁尾小字：發展有個別差異，本表僅供參考，正式評估請至兒童發展聯合評估中心。

第 5 點是讓四個分頁互相餵養的關鍵。少了它，四個分頁只是四個各自為政的工具。

- [ ] **Step 2: 型別檢查**

Run: `npm run build`
Expected: 成功。

- [ ] **Step 3: Commit**

```bash
git add src/littleexplorer/pages/DevelopmentPage.tsx
git commit -m "feat: add growth page

Leads with what the child can already do; red flags collapse
into a section at the bottom. A screening-first layout makes a
parent hunt for what is wrong on every single visit.

Defaults the age-band picker to the child's actual age rather
than the first bucket, avoiding the fixed '0-2' default that
makes MilestonesPage awkward for older babies.

Ticking an item offers an inline one-line diary composer, so
'he used a spoon today' becomes both a tick and a dated memory
without leaving the page.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: 提醒分頁

**Files:**
- Create: `src/littleexplorer/pages/RemindersPage.tsx`

**Interfaces:**
- Consumes: `ExplorerShell` from Task 2；`toddlerCareTips`、`tipCategoryLabels`、`tipCategoryIcons` from `src/littleexplorer/data/monthlyTips.ts`；`careTaskKindLabels` from `src/littleexplorer/data/careTasks.ts`；`downloadIcs`、`buildGoogleCalendarUrl` from `src/littleexplorer/utils/icsExport.ts`
- Produces:

```ts
interface RemindersPageProps {
  currentChild?: ChildProfile | null;
  tasks: ResolvedCareTask[];
  reminderBadge?: number;
  onCompleteTask: (record: CareTaskRecord) => Promise<void>;
}
```

- [ ] **Step 1: 建立頁面**

Create `src/littleexplorer/pages/RemindersPage.tsx`, wrapped in `<ExplorerShell active="reminders" …>`.

兩個性質不同的區塊，上下排列：

**區塊一：待辦時程**

顯示 `overdue` → `due` → `upcoming`（僅 `daysUntilDue <= 90`）。`done` 不顯示，避免清單被歷史記錄淹沒。三種狀態各一個小標題；某狀態無項目時整段不渲染。

每列：`careTaskKindLabels[template.kind]` 標籤、`template.title`、`dueDate`、以及「還有 N 天」或「已逾期 N 天」。`overdue` 列以 `bg-explorer-clay/10 border-explorer-clay` 強調。

互動依類別分岔：

- **非疫苗任務** — 「標記完成」按鈕，點擊就地展開表單：完成日期（預設今天）、院所（選填）、備註（選填）。送出呼叫 `onCompleteTask({ taskId, completedDate, location, notes })`。
- **疫苗任務**（`template.vaccineId` 有值）— **沒有標記完成按鈕**。改為連結「到疫苗追蹤勾選」，`onClick` 設 `window.location.hash = '#/littlesteps/vaccine-tracking'`。疫苗完成狀態的唯一真相來源是 `vaccineProgress`，在這裡開第二個入口就會產生兩份互相矛盾的記錄。

區塊底部：「匯出全部時程到行事曆」按鈕呼叫 `downloadIcs(tasks, currentChild.name)`；每列右側一個小的「加入 Google 日曆」連結，`href={buildGoogleCalendarUrl(task, currentChild.name)}`、`target="_blank"`、`rel="noopener noreferrer"`。

**區塊二：這個月齡的注意事項**

`toddlerCareTips` 依目前年齡段過濾，4 張分類卡（`tipCategoryLabels` ＋ `getLucideIcon(tipCategoryIcons[category])`），每張列出 `highlights`。

**這一區沒有任何勾選或完成狀態。** 注意事項是提醒，不是待辦；加上打勾會讓家長以為「看過了就處理完了」。頂端附一個與區塊一共用的年齡段切換，預設為孩子目前所屬段。

**年齡守門**：`< 12` 個月顯示引導卡跳 `#/littlesteps`；`>= 36` 個月仍渲染區塊一的逾期項目與 `30-36` 段的注意事項。

- [ ] **Step 2: 型別檢查**

Run: `npm run build`
Expected: 成功。

- [ ] **Step 3: Commit**

```bash
git add src/littleexplorer/pages/RemindersPage.tsx
git commit -m "feat: add reminders page

Splits two things parents lump together: dated appointments that
can go overdue and be completed, and undated month-age
precautions that only need to show up at the right time. Giving
the latter checkboxes would suggest reading them is a task you
finish.

Vaccine rows offer no complete button - they deep link to the
existing tracker, keeping one source of truth for dose state.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: 日記分頁

**Files:**
- Create: `src/littleexplorer/pages/DiaryPage.tsx`

**Interfaces:**
- Consumes: `ExplorerShell` from Task 2；`groupEntriesByMonth` from `src/littleexplorer/utils/diaryHelpers.ts`；`developmentCheckItems` from `src/littleexplorer/data/developmentChecks.ts`（用於解析 `linkedCheckItemId` 的標題）
- Produces:

```ts
interface DiaryPageProps {
  currentChild?: ChildProfile | null;
  entries: DiaryEntry[];
  reminderBadge?: number;
  onAdd: (entry: Omit<DiaryEntry, 'id' | 'childId' | 'createdAt'>) => Promise<string | undefined>;
  onUpdate: (entryId: string, updates: Partial<DiaryEntry>) => Promise<void>;
  onDelete: (entryId: string) => Promise<void>;
}
```

- [ ] **Step 1: 建立頁面**

Create `src/littleexplorer/pages/DiaryPage.tsx`, wrapped in `<ExplorerShell active="diary" …>`.

由上而下：

1. **新增區** — 頁面頂端一個收合狀態的輸入框，`placeholder` 為「今天發生了什麼？」。點擊展開：日期（`<input type="date">`，預設今天）、內容 `<textarea>`、5 個心情 chip（`DiaryMood` 的五個值，以 emoji ＋ 中文標籤呈現：😊 開心／🥹 感動／😮‍💨 累／😟 擔心／😂 好笑）。心情為選填。送出呼叫 `onAdd`，成功後清空並收合。內容為空時送出鍵停用。
2. **時間軸** — `groupEntriesByMonth(entries)` 的結果，每組一個 sticky 的月份標題（「2026 年 8 月」），組內每則一張 `bg-white rounded-3xl shadow-soft` 卡片：日期、心情 emoji、內容。
3. **成長連結標籤** — 條目帶 `linkedCheckItemId` 時，卡片底部顯示一個 `bg-explorer-meadow/15 text-explorer-meadow-dark` 小標籤，內容為 `developmentCheckItems.find(i => i.id === …)?.title`。查不到（資料集調整後的孤兒 id）時整個標籤不渲染，**不顯示空標籤也不報錯**。
4. **編輯與刪除** — 每張卡片右上角一個 `MoreHorizontal` 選單，含「編輯」與「刪除」。編輯就地把卡片換成與新增區相同的表單，送出呼叫 `onUpdate`。刪除需二次確認（`window.confirm`，與本專案既有的破壞性操作一致）。
5. **空狀態** — 無任何條目時，顯示引導文案而非空白畫面：「還沒有任何紀錄。這裡適合記下那些不會出現在數據裡的時刻——今天冒出的新詞、第一次自己穿鞋、公園裡不肯回家。」

**這一頁不顯示 LittleSteps 快速日誌的資料。** 混合時間軸看似整合，實際上會讓兩個記錄入口的界線模糊，家長不知道該去哪裡寫。

**年齡守門**：日記不設年齡限制——即使孩子未滿 1 歲或已滿 3 歲，既有的記錄都必須看得到、寫得了。這是唯一不做年齡守門的分頁。

- [ ] **Step 2: 型別檢查**

Run: `npm run build`
Expected: 成功。

- [ ] **Step 3: Commit**

```bash
git add src/littleexplorer/pages/DiaryPage.tsx
git commit -m "feat: add growth diary page

Free writing, deliberately unlike LittleSteps' DailyLog: that
one captures structured feed/sleep/diaper counts, this one
captures the things that never show up in data.

The two are kept apart on purpose. A merged timeline looks like
integration but blurs which entry point a parent should use.

Diary is the one tab with no age gate: entries must stay
readable and writable whether the child is 11 months or four
years old.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: 幼兒百科分頁

**Files:**
- Create: `src/littleexplorer/pages/ToddlerWikiPage.tsx`

**Interfaces:**
- Consumes: `ExplorerShell` from Task 2；`toddlerWikiArticles`、`toddlerWikiCategoryLabels`、`toddlerWikiCategoryColors` from `src/littleexplorer/data/toddlerWiki.ts`；`WikiArticleCard` from `src/common/components/wiki/WikiArticleCard.tsx`
- Produces:

```ts
interface ToddlerWikiPageProps {
  currentChild?: ChildProfile | null;
  reminderBadge?: number;
}
```

- [ ] **Step 1: 建立頁面**

Create `src/littleexplorer/pages/ToddlerWikiPage.tsx`, wrapped in `<ExplorerShell active="wiki" …>`, following `src/littlebloom/pages/LittleBloomWikiPage.tsx` closely for everything below the shell:

- 搜尋輸入框，`focus:ring-explorer-sunbeam`。過濾以 `useMemo` ＋ `.toLowerCase().includes()` 比對 `title` 與 `summary`，與既有兩個 wiki 頁一致。
- **加上分類 chip 列**（`toddlerWikiCategoryLabels`，含「全部」）。LittleBloom 的 wiki 沒有分類篩選，但它只有 1 篇文章；20 篇沒有分類篩選會難以瀏覽。分類與搜尋為 AND 關係。
- 單一展開的手風琴（`expandedId: string | null`），渲染共用 `<WikiArticleCard>`，傳入 `article`、`isExpanded`、`onToggle`、`categoryLabel={toddlerWikiCategoryLabels[article.category]}`、`categoryColors={toddlerWikiCategoryColors[article.category]}`。
- 過濾後為空時顯示空狀態：「找不到符合的文章，換個關鍵字試試」。

百科不做年齡守門——查資料不需要先有孩子。

- [ ] **Step 2: 型別檢查**

Run: `npm run build`
Expected: 成功。

- [ ] **Step 3: Commit**

```bash
git add src/littleexplorer/pages/ToddlerWikiPage.tsx
git commit -m "feat: add toddler wiki page

Adds a category filter on top of the LittleBloom wiki pattern:
twenty articles are past the point where search alone is enough
to browse.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: 路由註冊與首頁入口

**Files:**
- Modify: `src/types/routes.ts`
- Modify: `src/App.tsx`
- Modify: `src/lib/firebase.ts`
- Modify: `src/common/pages/MainLandingPage.tsx`

**Interfaces:**
- Consumes: 四個頁面元件、`useChildStore` 的 5 個新 mutator、`useCareTasks`、`useDiary`
- Produces: 四條可用路由 `#/littleexplorer`、`#/littleexplorer/reminders`、`#/littleexplorer/diary`、`#/littleexplorer/wiki`

- [ ] **Step 1: 擴充 `Page` union**

In `src/types/routes.ts`, add to the `Page` union（**不要**加入 `LittleStepsPage`，該 union 專供 Sidebar，結構上排除其他子 app）:

```ts
  | 'littleexplorer'
  | 'littleexplorer/reminders'
  | 'littleexplorer/diary'
  | 'littleexplorer/wiki'
```

Also update the file's leading doc comment（`:1-9`）to mention the fourth sub-app.

- [ ] **Step 2: 在 `App.tsx` 註冊路由**

Six edits in `src/App.tsx`:

1. 於 lazy import 區塊末端加入：

```ts
const DevelopmentPage = lazy(() => import('./littleexplorer/pages/DevelopmentPage'));
const RemindersPage = lazy(() => import('./littleexplorer/pages/RemindersPage'));
const DiaryPage = lazy(() => import('./littleexplorer/pages/DiaryPage'));
const ToddlerWikiPage = lazy(() => import('./littleexplorer/pages/ToddlerWikiPage'));
```

2. 於 `getPageFromHash()` 的 `pageMap` 加入：

```ts
      '#/littleexplorer': 'littleexplorer',
      '#/littleexplorer/reminders': 'littleexplorer/reminders',
      '#/littleexplorer/diary': 'littleexplorer/diary',
      '#/littleexplorer/wiki': 'littleexplorer/wiki',
```

3. 於 `navigateToPage()` 的 `hashMap` 加入（`Record<Page, string>` 為窮舉型別，漏一個 `tsc` 就會擋下）：

```ts
      'littleexplorer': '#/littleexplorer',
      'littleexplorer/reminders': '#/littleexplorer/reminders',
      'littleexplorer/diary': '#/littleexplorer/diary',
      'littleexplorer/wiki': '#/littleexplorer/wiki',
```

4. 於 `getPageTitle()` 開頭、既有 `littlebloom` 早退分支旁加入：

```ts
    if (currentPage.startsWith('littleexplorer')) {
      return 'LittleExplorer';
    }
```

5. 修改 `isStandaloneSubApp`（`:196`）:

```ts
  const isStandaloneSubApp =
    currentPage.startsWith('littlebloom') ||
    currentPage.startsWith('littleexplorer') ||
    currentPage === 'babyoasis';
```

6. 於 `AppContent` 內取得資料並渲染四個分頁。先從既有的 `useChildStore(user)` 解構加入 5 個新 mutator 與 `currentChildDevelopmentProgress`，再加入兩個 hook 呼叫：

```ts
  const { tasks: careTasks } = useCareTasks(currentChild);
  const { entries: diaryEntries } = useDiary(currentChildId, user);
  const reminderBadge = careTasks.filter(
    (t) => t.status === 'overdue' || t.status === 'due',
  ).length;
```

Then add four render branches inside `<Suspense>`, before the BabyOasis branch:

```tsx
        {/* LittleExplorer Routes */}
        {currentPage === 'littleexplorer' && (
          <DevelopmentPage
            currentChild={currentChild}
            progress={currentChildDevelopmentProgress}
            reminderBadge={reminderBadge}
            onToggleCheck={toggleDevelopmentCheck}
            onQuickDiary={(content, linkedCheckItemId) =>
              addDiaryEntry({
                date: new Date().toISOString().split('T')[0],
                content,
                linkedCheckItemId,
              }).then(() => undefined)
            }
          />
        )}
        {currentPage === 'littleexplorer/reminders' && (
          <RemindersPage
            currentChild={currentChild}
            tasks={careTasks}
            reminderBadge={reminderBadge}
            onCompleteTask={upsertCareTaskRecord}
          />
        )}
        {currentPage === 'littleexplorer/diary' && (
          <DiaryPage
            currentChild={currentChild}
            entries={diaryEntries}
            reminderBadge={reminderBadge}
            onAdd={addDiaryEntry}
            onUpdate={updateDiaryEntry}
            onDelete={deleteDiaryEntry}
          />
        )}
        {currentPage === 'littleexplorer/wiki' && (
          <ToddlerWikiPage
            currentChild={currentChild}
            reminderBadge={reminderBadge}
          />
        )}
```

`useCareTasks` 與 `useDiary` 在 `AppContent` 頂層呼叫（而非各頁面內部），因為 `reminderBadge` 要餵給全部四個分頁的 tab bar。這與既有的 `useDailyLogs`（`:77`）在同一層取用的作法一致。

- [ ] **Step 3: 修正並擴充 analytics 分頁標記**

In `src/lib/firebase.ts`, inside `logPageView`'s `getPageMetadata`, add a LittleExplorer branch and **fix the existing LittleBloom bug**: it uses `page === 'littlebloom'`, so `'littlebloom/wiki'` silently falls through to the `app: 'main'` default. Change it to `startsWith`, matching the LittleSteps branch:

```ts
  } else if (page.startsWith('littlebloom')) {
    return { app: 'littlebloom', section: 'wip', feature: 'pregnancy-companion' };
  } else if (page.startsWith('littleexplorer')) {
    return { app: 'littleexplorer', section: 'toddler', feature: 'development-and-reminders' };
  } else if (page.startsWith('littlesteps')) {
```

Also update the `app_name` enumeration comment（`:90`）to include `littleexplorer`.

- [ ] **Step 4: 首頁新增第四張卡並接上時間軸**

In `src/common/pages/MainLandingPage.tsx`:

1. Widen the props union（`:11`）:

```ts
  onNavigate: (page: 'littlesteps' | 'littlebloom' | 'babyoasis' | 'littleexplorer') => void;
```

2. Add a LittleExplorer card. Place it in the same grid as LittleSteps/LittleBloom so the three life-stage apps read as one progression（BabyOasis stays separate below as a standalone utility）。The grid at `:113` becomes `grid-cols-1 md:grid-cols-3`. Copy the LittleSteps card block verbatim and change: icon `Sun`, icon background `from-explorer-sunbeam/20 to-explorer-meadow/20`, icon colour `text-explorer-sunbeam-dark`, title `LittleExplorer`, subtitle 「幼兒期陪伴」, hover border `hover:border-explorer-sunbeam/30`, CTA gradient `from-explorer-sunbeam to-explorer-meadow`, CTA text 「進入幼兒期」, `onClick={() => onNavigate('littleexplorer')}`, status badge 「立即可用」（綠色脈動點，同 LittleSteps）。Four feature bullets: 「12-36 個月成長檢核」、「健檢與疫苗提醒」、「幼兒照顧知識庫」、「成長日記」。

卡片副標維持功能描述「幼兒期陪伴」，與 LittleBloom 的「孕期陪伴」一致——中文名「小小探險家」只在成長分頁頁首露出。

3. Wire the Journey Timeline's 「幼兒期 / 1-3 歲」 marker（`:341-350`）— add `onClick={() => onNavigate('littleexplorer')}` and `cursor-pointer` to its `motion.div`. This slot has been decorative since it was written; it now has a destination.

4. Update the footer copyright literal（`:365`）to include LittleExplorer.

- [ ] **Step 5: 型別檢查與完整測試**

Run: `npm run build && npx vitest run`
Expected: 兩者皆成功。`hashMap` 是 `Record<Page, string>`，漏掉任一新路由 `tsc` 會直接報錯。

- [ ] **Step 6: 手動煙霧測試**

Run: `npm run dev`

逐項確認：

1. 首頁 `#/` 顯示四張卡，LittleExplorer 卡片可點。
2. 首頁時間軸的「幼兒期 1-3 歲」可點且導向 `#/littleexplorer`。
3. `#/littleexplorer` 不顯示 LittleSteps 的 header 與 Sidebar（`isStandaloneSubApp` 生效），底部顯示四個 tab。
4. 四個 tab 互相切換皆正常，作用中的 tab 高亮正確；瀏覽器上一頁／下一頁在四條路由間正常運作。
5. Tab bar 在 iOS Safari（或 devtools 的 iPhone 模擬）不被底部手勢列遮住，內容捲到底不被 tab bar 蓋住。
6. 選一個 1-3 歲的寶寶：成長分頁預設選中的年齡段與實際月齡相符。
7. 勾選一個成長項目 → 出現「要記一筆嗎？」輸入框 → 填字送出 → 切到日記分頁，該則出現且帶有成長項目標籤。
8. 勾選另一個項目後直接關閉輸入框 → 日記不新增，但勾選保留；重新整理後勾選仍在。
9. 提醒分頁：疫苗任務**沒有**標記完成按鈕，只有跳往疫苗追蹤的連結；到疫苗追蹤勾選該劑次後回來，該任務從清單消失。
10. 提醒分頁：非疫苗任務標記完成後從清單消失；重新整理後仍維持完成狀態。
11. 提醒分頁的注意事項區塊顯示 4 張分類卡，切換年齡段內容跟著換。
12. 提醒 tab 的紅點數量等於逾期＋到期的任務數；全部完成後紅點消失。
13. 「匯出全部時程」下載 `.ics`，以行事曆 App 開啟可見全天事件與提前 7 天提醒。
14. 日記分頁：新增、編輯、刪除皆生效並持久化；依月份分組，最新在上。
15. 選一個未滿 1 歲的寶寶：成長與提醒分頁顯示引導卡並可跳回 LittleSteps；日記與百科分頁照常可用。
16. `#/littleexplorer/wiki` 搜尋與分類篩選皆生效，文章可展開。

- [ ] **Step 7: Commit**

```bash
git add src/types/routes.ts src/App.tsx src/lib/firebase.ts src/common/pages/MainLandingPage.tsx
git commit -m "feat: register LittleExplorer routes and landing entry

Wires the fourth sub-app into the hash router, the landing page,
and analytics. The journey timeline's '幼兒期 1-3 歲' marker has
been decorative since it was written; it now has a destination.

Care tasks and diary entries are fetched in AppContent rather
than per page, because the overdue count feeds the tab badge on
all four pages.

Also fixes logPageView's LittleBloom branch, which matched with
=== and so dropped littlebloom/wiki into the generic 'main'
bucket.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 8: Push**

```bash
git push origin master
```
