# LittleExplorer 資料與純函式層 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 LittleExplorer 的全部型別、純函式與靜態內容——提醒引擎、行事曆序列化、日記分組、四份內容資料集。交付後這一層可獨立驗證，UI 層只需消費。

**Architecture:** 零 React、零 I/O。所有邏輯為可注入時間的純函式，所有內容為靜態陣列，全部以資料完整性測試把關。`children/{childId}` RTDB 子樹的讀寫留給 UI 層計畫。

**Tech Stack:** React 18 + TypeScript 5.2、Vite 5、Tailwind 3.4、Framer Motion 10、Firebase RTDB 12、Vitest 4.1、lucide-react

**Spec:** `docs/superpowers/specs/2026-08-26-littleexplorer-toddler-design.md`

**Prerequisite plan:** `docs/superpowers/plans/2026-08-26-littlesteps-data-corrections.md` 必須先完成。Task 3 的 `careTasks.ts` 直接連動勘誤後的疫苗 id 與劑次；未修正前建立的對應表會指向錯誤劑次。

**Downstream plan:** `docs/superpowers/plans/2026-08-26-littleexplorer-ui.md` 消費本計畫的全部產出。本計畫完成前不要開始它。

## Global Constraints

- 語言：所有使用者可見字串為繁體中文。
- **嚴格互補**：LittleExplorer 只實作 LittleSteps 沒有的能力。成長曲線、睡眠分析、快速日誌一律以 `window.location.hash` 深連結跳回 LittleSteps 既有頁面，**不得**在 LittleExplorer 內重建任何等價視圖。
- 疫苗完成狀態的唯一真相來源是 `ChildProfile.vaccineProgress`。疫苗類提醒**不得**擁有自己的完成記錄。
- 資料存取一律 Firebase RTDB，全站強制登入。**沒有** LocalStorage fallback（`.claude/CLAUDE.md` 描述的 dual-mode 已於 commit `f9d8031` 移除）。
- 所有時間相依的純函式必須接受可注入的 `today?: Date` 參數，遵循 commit `a9c17ab` 建立的慣例。
- 不新增任何 npm 依賴。
- 不新增頁面級或 E2E 測試（本 repo 現況 11 個測試檔中 9 個為純邏輯、0 個頁面測試；不引入第二套慣例）。
- 顏色 token 由 UI 層計畫新增（`explorer-*` namespace）；本計畫不產生任何樣式。
- husky pre-commit hook 會執行 `npm run build`（`tsc && vite build`）。
- 醫療與制度性內容不得憑記憶撰寫。每筆檢核題目與每篇文章都必須對照衛福部國健署「兒童健康手冊」、疾管署預防接種時程，或台灣兒科醫學會發布之指引，並在資料檔以註解標註出處。

## 規格粒度

本計畫全部以完整可貼上的程式碼指定——它產出的是介面契約與內容資料，任何偏差都會在 UI 層斷掉。唯二例外是 Task 4 與 Task 5 的衛教文字：那些受 Global Constraints 最後一條規範，必須逐筆查證來源後撰寫，不得由本計畫代填。兩個任務都以完整列表釘死了 id、標題與分類，只留文字本身待填。

---

### Task 1: 型別定義與提醒引擎純函式

**Files:**
- Modify: `src/types/index.ts`（於檔案末端、`PregnancyWikiArticle` 之後新增 LittleExplorer 區塊）
- Create: `src/littleexplorer/utils/careSchedule.ts`
- Test: `src/littleexplorer/utils/careSchedule.test.ts`

**Interfaces:**
- Consumes: `VaccineProgress` from `src/types/index.ts:125-134`
- Produces:
  - `ToddlerAgeBand = '12-15' | '15-18' | '18-24' | '24-30' | '30-36'`
  - `DevelopmentDomain = 'gross-motor' | 'fine-motor' | 'language' | 'cognitive' | 'social'`
  - `DevelopmentCheckItem`, `DevelopmentWarning`, `DevelopmentCheckProgress`
  - `CareTaskKind`, `CareTaskTemplate`, `CareTaskRecord`, `CareTaskProgress`, `CareTaskStatus`, `ResolvedCareTask`
  - `addMonths(isoDate: string, months: number): string`
  - `resolveCareTasks(birthday, templates, careProgress, vaccineProgress, today?): ResolvedCareTask[]`

- [ ] **Step 1: 新增型別**

Append to `src/types/index.ts`:

```ts
// ============================================================
// LittleExplorer（幼兒期 1-3 歲）
// ============================================================

export type ToddlerAgeBand = '12-15' | '15-18' | '18-24' | '24-30' | '30-36';

export type DevelopmentDomain =
  | 'gross-motor'   // 粗動作
  | 'fine-motor'    // 細動作
  | 'language'      // 語言溝通
  | 'cognitive'     // 認知
  | 'social';       // 身邊處理與社會性

export interface DevelopmentCheckItem {
  id: string;
  ageBand: ToddlerAgeBand;
  domain: DevelopmentDomain;
  /** 家長可直接判斷的題目 */
  title: string;
  /** 觀察情境與判準 */
  detail: string;
  /** 在家可以怎麼練 */
  tips: string[];
}

export interface DevelopmentWarning {
  ageBand: ToddlerAgeBand;
  /** 以「缺席」描述的警訊，例：「18 個月仍不會獨立行走」 */
  signals: string[];
  /** 轉介建議 */
  action: string;
}

export interface DevelopmentCheckProgress {
  [checkItemId: string]: {
    achieved: boolean;
    achievedDate?: string; // YYYY-MM-DD
  };
}

export type CareTaskKind =
  | 'health-check'
  | 'dev-screening'
  | 'vaccine'
  | 'dental'
  | 'admin';

export interface CareTaskTemplate {
  id: string;
  kind: CareTaskKind;
  title: string;
  description: string;
  /** 建議施行月齡；到期日 = birthday + dueMonth */
  dueMonth: number;
  /** 可執行區間起（月齡） */
  fromMonth: number;
  /** 可執行區間迄（月齡），逾此即 overdue */
  toMonth: number;
  /** 法源／出處 */
  source: string;
  /**
   * 若完成狀態已由 LittleSteps 的 vaccineProgress 承載，指向該筆記錄。
   * 必須與 vaccineDose 成對出現。
   */
  vaccineId?: string;
  /** 對應 VaccineSchedule.currentDose；單靠 vaccineId 無法分辨劑次 */
  vaccineDose?: number;
}

export interface CareTaskRecord {
  taskId: string;
  completedDate: string; // YYYY-MM-DD
  location?: string;     // 院所
  notes?: string;
}

export interface CareTaskProgress {
  [taskId: string]: CareTaskRecord;
}

export type CareTaskStatus = 'upcoming' | 'due' | 'overdue' | 'done';

export interface ResolvedCareTask {
  template: CareTaskTemplate;
  dueDate: string;   // YYYY-MM-DD
  windowEnd: string; // YYYY-MM-DD
  status: CareTaskStatus;
  /** 距建議日的天數；負數表示已過 */
  daysUntilDue: number;
  completedDate?: string;
}

export type ToddlerTipCategory = 'safety' | 'feeding' | 'behavior' | 'health';

export interface ToddlerCareTip {
  ageBand: ToddlerAgeBand;
  category: ToddlerTipCategory;
  title: string;
  /** 3-4 條具體重點 */
  highlights: string[];
}

export type DiaryMood = 'happy' | 'proud' | 'tired' | 'worried' | 'funny';

export interface DiaryEntry {
  id: string;
  childId: string;
  /** YYYY-MM-DD，家長可改，預設今天 */
  date: string;
  content: string;
  mood?: DiaryMood;
  /** 由成長分頁勾選時建立的條目會帶此欄，指向該檢核項目 */
  linkedCheckItemId?: string;
  createdAt: string; // ISO 8601
  updatedAt?: string;
}
```

- [ ] **Step 2: 寫失敗測試**

Create `src/littleexplorer/utils/careSchedule.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import type {
  CareTaskProgress,
  CareTaskTemplate,
  VaccineProgress,
} from '../../types';
import { addMonths, resolveCareTasks } from './careSchedule';

const BIRTHDAY = '2024-01-15';

const healthCheck: CareTaskTemplate = {
  id: 'health-check-18m',
  kind: 'health-check',
  title: '兒童預防保健第 5 次',
  description: '1 歲 6 個月至未滿 2 歲',
  dueMonth: 18,
  fromMonth: 18,
  toMonth: 24,
  source: '國民健康署',
};

const jeDose1: CareTaskTemplate = {
  id: 'vaccine-je-1',
  kind: 'vaccine',
  title: '日本腦炎疫苗 第 1 劑',
  description: '出生滿 15 個月',
  dueMonth: 15,
  fromMonth: 15,
  toMonth: 18,
  source: '疾病管制署',
  vaccineId: 'je-15m',
  vaccineDose: 1,
};

const noProgress: CareTaskProgress = {};
const noVaccines: VaccineProgress = {};

const statusOf = (
  template: CareTaskTemplate,
  today: string,
  careProgress: CareTaskProgress = noProgress,
  vaccineProgress: VaccineProgress = noVaccines,
) =>
  resolveCareTasks(
    BIRTHDAY,
    [template],
    careProgress,
    vaccineProgress,
    new Date(`${today}T12:00:00`),
  )[0];

describe('addMonths', () => {
  it('加上整數月份', () => {
    expect(addMonths('2024-01-15', 18)).toBe('2025-07-15');
  });

  it('溢位到不存在的日期時退回當月最後一日', () => {
    // 2024-02-29 是閏日；加 12 個月落在 2025 年 2 月，該月只有 28 天
    expect(addMonths('2024-02-29', 12)).toBe('2025-02-28');
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
  });
});

describe('resolveCareTasks', () => {
  it('由生日與 dueMonth 推算到期日與 window 結束日', () => {
    const task = statusOf(healthCheck, '2024-06-01');
    expect(task.dueDate).toBe('2025-07-15');
    expect(task.windowEnd).toBe('2026-01-15');
  });

  it('到期日前一天為 upcoming', () => {
    expect(statusOf(healthCheck, '2025-07-14').status).toBe('upcoming');
  });

  it('到期日當天為 due', () => {
    expect(statusOf(healthCheck, '2025-07-15').status).toBe('due');
  });

  it('window 最後一天仍為 due', () => {
    expect(statusOf(healthCheck, '2026-01-15').status).toBe('due');
  });

  it('window 結束隔天為 overdue', () => {
    expect(statusOf(healthCheck, '2026-01-16').status).toBe('overdue');
  });

  it('daysUntilDue 在到期前為正、逾期後為負', () => {
    expect(statusOf(healthCheck, '2025-07-05').daysUntilDue).toBe(10);
    expect(statusOf(healthCheck, '2025-07-25').daysUntilDue).toBe(-10);
  });

  it('有完成記錄時為 done，且蓋過 overdue', () => {
    const progress: CareTaskProgress = {
      'health-check-18m': {
        taskId: 'health-check-18m',
        completedDate: '2025-08-01',
      },
    };
    const task = statusOf(healthCheck, '2026-06-01', progress);
    expect(task.status).toBe('done');
    expect(task.completedDate).toBe('2025-08-01');
  });

  it('對應劑次已接種時，疫苗任務為 done', () => {
    const vaccines: VaccineProgress = {
      'je-15m': { doses: { 1: { administered: true, administeredDate: '2025-04-20' } } },
    };
    const task = statusOf(jeDose1, '2026-06-01', noProgress, vaccines);
    expect(task.status).toBe('done');
    expect(task.completedDate).toBe('2025-04-20');
  });

  it('只有其他劑次被勾選時，不得判定為 done', () => {
    const vaccines: VaccineProgress = {
      'je-15m': { doses: { 2: { administered: true } } },
    };
    expect(statusOf(jeDose1, '2026-06-01', noProgress, vaccines).status).toBe(
      'overdue',
    );
  });

  it('劑次存在但 administered 為 false 時，不得判定為 done', () => {
    const vaccines: VaccineProgress = {
      'je-15m': { doses: { 1: { administered: false } } },
    };
    expect(statusOf(jeDose1, '2025-04-01', noProgress, vaccines).status).toBe(
      'due',
    );
  });

  it('生日為閏日時仍能算出有效到期日', () => {
    const [task] = resolveCareTasks(
      '2024-02-29',
      [healthCheck],
      noProgress,
      noVaccines,
      new Date('2025-09-01T12:00:00'),
    );
    expect(task.dueDate).toBe('2025-08-29');
  });

  it('birthday 為空字串時回傳空陣列而非拋錯', () => {
    expect(
      resolveCareTasks('', [healthCheck], noProgress, noVaccines),
    ).toEqual([]);
  });

  it('結果依到期日遞增排序', () => {
    const tasks = resolveCareTasks(
      BIRTHDAY,
      [healthCheck, jeDose1],
      noProgress,
      noVaccines,
      new Date('2024-06-01T12:00:00'),
    );
    expect(tasks.map((t) => t.template.id)).toEqual([
      'vaccine-je-1',
      'health-check-18m',
    ]);
  });
});
```

- [ ] **Step 3: 執行測試確認失敗**

Run: `npx vitest run src/littleexplorer/utils/careSchedule.test.ts`
Expected: FAIL —「Failed to resolve import "./careSchedule"」。

- [ ] **Step 4: 實作 `careSchedule.ts`**

Create `src/littleexplorer/utils/careSchedule.ts`:

```ts
import type {
  CareTaskProgress,
  CareTaskStatus,
  CareTaskTemplate,
  ResolvedCareTask,
  VaccineProgress,
} from '../../types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** 將 YYYY-MM-DD 解析為當地時區正午的 Date，避開 UTC 位移造成的差一天。 */
function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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

  return formatLocalDate(result);
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

  const todayLocal = parseLocalDate(formatLocalDate(today));

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
```

- [ ] **Step 5: 執行測試確認通過**

Run: `npx vitest run src/littleexplorer/utils/careSchedule.test.ts`
Expected: PASS，全部 15 個測試。

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/littleexplorer/utils/careSchedule.ts src/littleexplorer/utils/careSchedule.test.ts
git commit -m "feat: add LittleExplorer care-task types and schedule resolver

Pure, I/O-free engine that expands a static care schedule into
dated tasks from a child's birthday. Vaccine tasks carry no
completion state of their own: they read the existing
vaccineProgress subtree, keyed by both id and dose number so a
neighbouring dose cannot mark them done.

Month arithmetic clamps to the last day of the target month so
explorer-day birthdays and month-end dates stay valid.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: 行事曆匯出

**Files:**
- Create: `src/littleexplorer/utils/icsExport.ts`
- Test: `src/littleexplorer/utils/icsExport.test.ts`

**Interfaces:**
- Consumes: `ResolvedCareTask` from Task 1
- Produces:
  - `buildIcs(tasks: ResolvedCareTask[], childName: string): string`
  - `buildGoogleCalendarUrl(task: ResolvedCareTask, childName: string): string`
  - `downloadIcs(tasks: ResolvedCareTask[], childName: string): void`

- [ ] **Step 1: 寫失敗測試**

Create `src/littleexplorer/utils/icsExport.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import type { ResolvedCareTask } from '../../types';
import { buildGoogleCalendarUrl, buildIcs } from './icsExport';

const task = (
  overrides: Partial<ResolvedCareTask> = {},
): ResolvedCareTask => ({
  template: {
    id: 'health-check-18m',
    kind: 'health-check',
    title: '兒童預防保健第 5 次',
    description: '1 歲 6 個月至未滿 2 歲，攜帶健保卡與兒童健康手冊',
    dueMonth: 18,
    fromMonth: 18,
    toMonth: 24,
    source: '國民健康署',
  },
  dueDate: '2025-07-15',
  windowEnd: '2026-01-15',
  status: 'upcoming',
  daysUntilDue: 100,
  ...overrides,
});

describe('buildIcs', () => {
  it('產生完整的 VCALENDAR 外框', () => {
    const ics = buildIcs([task()], '小樹');
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect(ics).toContain('VERSION:2.0');
  });

  it('每個任務產生一個全天 VEVENT', () => {
    const ics = buildIcs([task()], '小樹');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('DTSTART;VALUE=DATE:20250715');
    // 全天事件的 DTEND 為隔日（exclusive）
    expect(ics).toContain('DTEND;VALUE=DATE:20250716');
  });

  it('標題含孩子名字', () => {
    expect(buildIcs([task()], '小樹')).toContain('小樹');
  });

  it('附提前 7 天的 VALARM', () => {
    const ics = buildIcs([task()], '小樹');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:-P7D');
    expect(ics).toContain('END:VALARM');
  });

  it('排除已完成的任務', () => {
    const ics = buildIcs(
      [task({ status: 'done', completedDate: '2025-08-01' })],
      '小樹',
    );
    expect(ics).not.toContain('BEGIN:VEVENT');
  });

  it('依 RFC 5545 跳脫反斜線、分號、逗號與換行', () => {
    const ics = buildIcs(
      [
        task({
          template: {
            ...task().template,
            title: 'a\\b;c,d',
            description: 'line1\nline2',
          },
        }),
      ],
      '小樹',
    );
    expect(ics).toContain('a\\\\b\\;c\\,d');
    expect(ics).toContain('line1\\nline2');
  });

  it('每一列以 CRLF 結尾', () => {
    const ics = buildIcs([task()], '小樹');
    const bareNewlines = ics.split('\n').filter((line) => !line.endsWith('\r'));
    // 只有結尾的空字串不以 \r 收尾
    expect(bareNewlines).toEqual(['']);
  });

  it('UID 具唯一性且穩定', () => {
    const first = buildIcs([task()], '小樹');
    const second = buildIcs([task()], '小樹');
    const uidOf = (ics: string) => ics.match(/UID:(.+)\r\n/)![1];
    expect(uidOf(first)).toBe(uidOf(second));
    expect(uidOf(first)).toContain('health-check-18m');
  });
});

describe('buildGoogleCalendarUrl', () => {
  it('產生帶 TEMPLATE action 與全天日期區間的連結', () => {
    const url = new URL(buildGoogleCalendarUrl(task(), '小樹'));
    expect(url.origin + url.pathname).toBe(
      'https://calendar.google.com/calendar/render',
    );
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('dates')).toBe('20250715/20250716');
  });

  it('標題與說明經過 URL 編碼', () => {
    const url = new URL(buildGoogleCalendarUrl(task(), '小樹'));
    expect(url.searchParams.get('text')).toContain('小樹');
    expect(url.searchParams.get('details')).toContain('國民健康署');
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run src/littleexplorer/utils/icsExport.test.ts`
Expected: FAIL —「Failed to resolve import "./icsExport"」。

- [ ] **Step 3: 實作 `icsExport.ts`**

Create `src/littleexplorer/utils/icsExport.ts`:

```ts
import type { ResolvedCareTask } from '../../types';

const CRLF = '\r\n';

/** RFC 5545 §3.3.11 文字跳脫。反斜線必須最先處理。 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** YYYY-MM-DD → YYYYMMDD */
function toIcsDate(isoDate: string): string {
  return isoDate.replace(/-/g, '');
}

/** 全天事件的 DTEND 為 exclusive，需為隔日。 */
function nextDay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function eventTitle(task: ResolvedCareTask, childName: string): string {
  return `${childName}：${task.template.title}`;
}

function eventDetails(task: ResolvedCareTask): string {
  return `${task.template.description}\n可執行區間至 ${task.windowEnd}\n資料來源：${task.template.source}`;
}

function buildEvent(task: ResolvedCareTask, childName: string): string[] {
  return [
    'BEGIN:VEVENT',
    `UID:${task.template.id}-${toIcsDate(task.dueDate)}@littleexplorer`,
    `DTSTART;VALUE=DATE:${toIcsDate(task.dueDate)}`,
    `DTEND;VALUE=DATE:${toIcsDate(nextDay(task.dueDate))}`,
    `SUMMARY:${escapeText(eventTitle(task, childName))}`,
    `DESCRIPTION:${escapeText(eventDetails(task))}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:-P7D',
    `DESCRIPTION:${escapeText(eventTitle(task, childName))}`,
    'END:VALARM',
    'END:VEVENT',
  ];
}

/**
 * 將未完成的照護任務序列化為 RFC 5545 行事曆。
 * 全天事件，各附提前 7 天的顯示提醒。
 */
export function buildIcs(tasks: ResolvedCareTask[], childName: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LittleExplorer//幼兒照護時程//ZH-TW',
    'CALSCALE:GREGORIAN',
    ...tasks
      .filter((task) => task.status !== 'done')
      .flatMap((task) => buildEvent(task, childName)),
    'END:VCALENDAR',
  ];
  return lines.join(CRLF) + CRLF;
}

/** 單筆任務的 Google 日曆快速加入連結。 */
export function buildGoogleCalendarUrl(
  task: ResolvedCareTask,
  childName: string,
): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(task, childName),
    details: eventDetails(task),
    dates: `${toIcsDate(task.dueDate)}/${toIcsDate(nextDay(task.dueDate))}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** 觸發 .ics 下載。純瀏覽器副作用，故不在單元測試涵蓋範圍。 */
export function downloadIcs(
  tasks: ResolvedCareTask[],
  childName: string,
): void {
  const blob = new Blob([buildIcs(tasks, childName)], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${childName}-照護時程.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run src/littleexplorer/utils/icsExport.test.ts`
Expected: PASS，全部 10 個測試。

- [ ] **Step 5: Commit**

```bash
git add src/littleexplorer/utils/icsExport.ts src/littleexplorer/utils/icsExport.test.ts
git commit -m "feat: add ics and Google Calendar export for care tasks

Zero-dependency RFC 5545 serialiser. Outstanding tasks become
all-day events with a seven-day display alarm, so delivery is
handled by the parent's own calendar app instead of push
infrastructure.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: 照護提醒時程資料

**Files:**
- Create: `src/littleexplorer/data/careTasks.ts`
- Test: `src/littleexplorer/data/careTasks.test.ts`

**Interfaces:**
- Consumes: `CareTaskTemplate` from Task 1；`vaccineSchedules` from `src/littlesteps/data/vaccines.ts`（**必須為前置計畫勘誤後的版本**）
- Produces: `careTaskTemplates: CareTaskTemplate[]`（20 筆）、`careTaskKindLabels: Record<CareTaskKind, string>`

- [ ] **Step 1: 寫失敗測試**

Create `src/littleexplorer/data/careTasks.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { vaccineSchedules } from '../../littlesteps/data/vaccines';
import { careTaskKindLabels, careTaskTemplates } from './careTasks';

describe('careTaskTemplates', () => {
  it('共 20 筆，且 id 唯一', () => {
    expect(careTaskTemplates).toHaveLength(20);
    const ids = careTaskTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每筆的月齡區間滿足 fromMonth <= dueMonth <= toMonth', () => {
    for (const t of careTaskTemplates) {
      expect(t.fromMonth, t.id).toBeLessThanOrEqual(t.dueMonth);
      expect(t.dueMonth, t.id).toBeLessThanOrEqual(t.toMonth);
    }
  });

  it('每筆都標註出處', () => {
    for (const t of careTaskTemplates) {
      expect(t.source.length, t.id).toBeGreaterThan(0);
    }
  });

  it('vaccineId 與 vaccineDose 必須成對出現', () => {
    for (const t of careTaskTemplates) {
      expect(
        (t.vaccineId === undefined) === (t.vaccineDose === undefined),
        `${t.id} 的 vaccineId 與 vaccineDose 必須同時有值或同時省略`,
      ).toBe(true);
    }
  });

  it('所有 vaccine 類任務都綁定疫苗記錄，其他類都不綁', () => {
    for (const t of careTaskTemplates) {
      expect(t.vaccineId !== undefined, t.id).toBe(t.kind === 'vaccine');
    }
  });

  it('每個 vaccineId 都存在於 vaccineSchedules，且 vaccineDose 等於其 currentDose', () => {
    for (const t of careTaskTemplates) {
      if (!t.vaccineId) continue;
      const schedule = vaccineSchedules.find((v) => v.id === t.vaccineId);
      expect(schedule, `${t.id} 指向不存在的疫苗 ${t.vaccineId}`).toBeDefined();
      expect(t.vaccineDose, `${t.id} 的劑次與疫苗資料不符`).toBe(
        schedule!.currentDose,
      );
    }
  });

  it('疫苗任務的 dueMonth 與疫苗資料的 ageInMonths 一致', () => {
    for (const t of careTaskTemplates) {
      if (!t.vaccineId) continue;
      const schedule = vaccineSchedules.find((v) => v.id === t.vaccineId)!;
      expect(t.dueMonth, `${t.id} 的到期月齡與疫苗時程不符`).toBe(
        schedule.ageInMonths,
      );
    }
  });

  it('所有任務落在 1-3 歲的服務範圍內（dueMonth 介於 12 與 36）', () => {
    for (const t of careTaskTemplates) {
      expect(t.dueMonth, t.id).toBeGreaterThanOrEqual(12);
      expect(t.dueMonth, t.id).toBeLessThanOrEqual(36);
    }
  });

  it('每個 kind 都有對應的顯示標籤', () => {
    for (const t of careTaskTemplates) {
      expect(careTaskKindLabels[t.kind], t.kind).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run src/littleexplorer/data/careTasks.test.ts`
Expected: FAIL —「Failed to resolve import "./careTasks"」。

- [ ] **Step 3: 實作 `careTasks.ts`**

Create `src/littleexplorer/data/careTasks.ts`。逐筆內容如下；`description` 需簡述家長要做什麼與需攜帶的證件，撰寫前對照 `source` 欄位所指之官方頁面確認文字無誤。

```ts
import type { CareTaskKind, CareTaskTemplate } from '../../types';

export const careTaskKindLabels: Record<CareTaskKind, string> = {
  'health-check': '兒童健檢',
  'dev-screening': '發展篩檢',
  vaccine: '疫苗接種',
  dental: '牙齒塗氟',
  admin: '資格登記',
};

/**
 * 1-3 歲照護時程。全部為可由出生日精算的法定時程，不含推測性內容。
 *
 * 疫苗類任務不擁有自己的完成狀態：vaccineId + vaccineDose 指向
 * LittleSteps 的 vaccineProgress，由該處作為唯一真相來源。
 */
export const careTaskTemplates: CareTaskTemplate[] = [
  // --- 兒童預防保健服務（未滿 7 歲共 7 次，1 歲後 3 次）---
  {
    id: 'health-check-18m',
    kind: 'health-check',
    title: '兒童預防保健 第 5 次',
    description: '1 歲 6 個月至未滿 2 歲的免費健檢，含身體檢查、發展診察與衛教指導。攜帶健保卡與兒童健康手冊。',
    dueMonth: 18,
    fromMonth: 18,
    toMonth: 24,
    source: '衛生福利部國民健康署 — 兒童預防保健服務',
  },
  {
    id: 'health-check-24m',
    kind: 'health-check',
    title: '兒童預防保健 第 6 次',
    description: '2 歲至未滿 3 歲的免費健檢。攜帶健保卡與兒童健康手冊。',
    dueMonth: 24,
    fromMonth: 24,
    toMonth: 36,
    source: '衛生福利部國民健康署 — 兒童預防保健服務',
  },
  {
    id: 'health-check-36m',
    kind: 'health-check',
    title: '兒童預防保健 第 7 次',
    description: '3 歲至未滿 7 歲的免費健檢，本階段僅補助 1 次。攜帶健保卡與兒童健康手冊。',
    dueMonth: 36,
    fromMonth: 36,
    toMonth: 84,
    source: '衛生福利部國民健康署 — 兒童預防保健服務',
  },

  // --- 兒童發展篩檢服務（113/7/1 上路，6 階段，1-3 歲涵蓋 3 個）---
  {
    id: 'dev-screening-12m',
    kind: 'dev-screening',
    title: '兒童發展篩檢（10 個月-1 歲 6 個月）',
    description: '以標準化篩檢工具評估發展狀況，具健保身分即可接受政府補助的篩檢。',
    dueMonth: 12,
    fromMonth: 12,
    toMonth: 18,
    source: '衛生福利部 — 兒童發展篩檢服務',
  },
  {
    id: 'dev-screening-18m',
    kind: 'dev-screening',
    title: '兒童發展篩檢（1 歲 6 個月-2 歲）',
    description: '以標準化篩檢工具評估發展狀況，每階段各補助 1 次。',
    dueMonth: 18,
    fromMonth: 18,
    toMonth: 24,
    source: '衛生福利部 — 兒童發展篩檢服務',
  },
  {
    id: 'dev-screening-24m',
    kind: 'dev-screening',
    title: '兒童發展篩檢（2-3 歲）',
    description: '以標準化篩檢工具評估發展狀況，每階段各補助 1 次。',
    dueMonth: 24,
    fromMonth: 24,
    toMonth: 36,
    source: '衛生福利部 — 兒童發展篩檢服務',
  },

  // --- 常規疫苗（公費）---
  // 註：hepa-12m / hepa-18m 的 id 為歷史命名，實際時程已於 114/1/1
  //     調整為 18 / 27 個月。id 保留是為了不讓既有使用者的接種進度變成孤兒鍵。
  {
    id: 'vaccine-mmr-1',
    kind: 'vaccine',
    title: 'MMR 疫苗 第 1 劑',
    description: '麻疹、腮腺炎、德國麻疹混合疫苗，可與水痘疫苗同時分開不同部位接種。',
    dueMonth: 12,
    fromMonth: 12,
    toMonth: 15,
    source: '衛生福利部疾病管制署 — 現行兒童預防接種時程',
    vaccineId: 'mmr-12m',
    vaccineDose: 1,
  },
  {
    id: 'vaccine-varicella-1',
    kind: 'vaccine',
    title: '水痘疫苗 第 1 劑',
    description: '可與 MMR 同時分開不同部位接種；若未同時接種應至少間隔 28 天。',
    dueMonth: 12,
    fromMonth: 12,
    toMonth: 15,
    source: '衛生福利部疾病管制署 — 現行兒童預防接種時程',
    vaccineId: 'varicella-12m',
    vaccineDose: 1,
  },
  {
    id: 'vaccine-pcv-3',
    kind: 'vaccine',
    title: '13 價肺炎鏈球菌疫苗 第 3 劑',
    description: '完成幼兒基礎接種的最後一劑。',
    dueMonth: 12,
    fromMonth: 12,
    toMonth: 15,
    source: '衛生福利部疾病管制署 — 現行兒童預防接種時程',
    vaccineId: 'pneumococcal-12m',
    vaccineDose: 3,
  },
  {
    id: 'vaccine-je-1',
    kind: 'vaccine',
    title: '日本腦炎疫苗 第 1 劑',
    description: '細胞培養活性減毒疫苗，幼兒常規共 2 劑。2 歲以下建議接種於大腿前外側。',
    dueMonth: 15,
    fromMonth: 15,
    toMonth: 18,
    source: '衛生福利部疾病管制署 — 日本腦炎活性減毒疫苗 Q&A',
    vaccineId: 'je-15m',
    vaccineDose: 1,
  },
  {
    id: 'vaccine-pentavalent-4',
    kind: 'vaccine',
    title: '五合一疫苗 第 4 劑',
    description: '白喉、破傷風、百日咳、小兒麻痺、b 型嗜血桿菌的追加劑。',
    dueMonth: 18,
    fromMonth: 18,
    toMonth: 21,
    source: '衛生福利部疾病管制署 — 五合一疫苗 Q&A',
    vaccineId: 'pentavalent-18m',
    vaccineDose: 4,
  },
  {
    id: 'vaccine-hepa-1',
    kind: 'vaccine',
    title: 'A 型肝炎疫苗 第 1 劑',
    description: '自 114/1/1 起調整為滿 18 個月接種第 1 劑。',
    dueMonth: 18,
    fromMonth: 18,
    toMonth: 21,
    source: '衛生福利部疾病管制署 — 現行兒童預防接種時程',
    vaccineId: 'hepa-12m',
    vaccineDose: 1,
  },
  {
    id: 'vaccine-je-2',
    kind: 'vaccine',
    title: '日本腦炎疫苗 第 2 劑',
    description: '與第 1 劑間隔 12 個月；完成此劑即完成幼兒常規接種。',
    dueMonth: 27,
    fromMonth: 27,
    toMonth: 30,
    source: '衛生福利部疾病管制署 — 日本腦炎活性減毒疫苗 Q&A',
    vaccineId: 'je-27m',
    vaccineDose: 2,
  },
  {
    id: 'vaccine-hepa-2',
    kind: 'vaccine',
    title: 'A 型肝炎疫苗 第 2 劑',
    description: '自 114/1/1 起調整為滿 27 個月接種第 2 劑，與第 1 劑至少間隔 6 個月。',
    dueMonth: 27,
    fromMonth: 27,
    toMonth: 30,
    source: '衛生福利部疾病管制署 — 現行兒童預防接種時程',
    vaccineId: 'hepa-18m',
    vaccineDose: 2,
  },

  // --- 牙齒塗氟（未滿 6 歲每 6 個月 1 次，健保給付）---
  // 以離散記錄表達週期，與 vaccines.ts 表達多劑次的作法一致，
  // 省掉一整套週期展開邏輯。
  {
    id: 'fluoride-12m',
    kind: 'dental',
    title: '牙齒塗氟（滿 1 歲）',
    description: '未滿 6 歲兒童每 6 個月 1 次，由健保給付。長第一顆牙後即可開始。',
    dueMonth: 12,
    fromMonth: 12,
    toMonth: 18,
    source: '中央健康保險署 — 兒童牙齒預防保健',
  },
  {
    id: 'fluoride-18m',
    kind: 'dental',
    title: '牙齒塗氟（滿 1 歲 6 個月）',
    description: '未滿 6 歲兒童每 6 個月 1 次，由健保給付。',
    dueMonth: 18,
    fromMonth: 18,
    toMonth: 24,
    source: '中央健康保險署 — 兒童牙齒預防保健',
  },
  {
    id: 'fluoride-24m',
    kind: 'dental',
    title: '牙齒塗氟（滿 2 歲）',
    description: '未滿 6 歲兒童每 6 個月 1 次，由健保給付。',
    dueMonth: 24,
    fromMonth: 24,
    toMonth: 30,
    source: '中央健康保險署 — 兒童牙齒預防保健',
  },
  {
    id: 'fluoride-30m',
    kind: 'dental',
    title: '牙齒塗氟（滿 2 歲 6 個月）',
    description: '未滿 6 歲兒童每 6 個月 1 次，由健保給付。',
    dueMonth: 30,
    fromMonth: 30,
    toMonth: 36,
    source: '中央健康保險署 — 兒童牙齒預防保健',
  },
  {
    id: 'fluoride-36m',
    kind: 'dental',
    title: '牙齒塗氟（滿 3 歲）',
    description: '未滿 6 歲兒童每 6 個月 1 次，由健保給付。',
    dueMonth: 36,
    fromMonth: 36,
    toMonth: 42,
    source: '中央健康保險署 — 兒童牙齒預防保健',
  },

  // --- 行政登記 ---
  {
    id: 'pediatrician-registration',
    kind: 'admin',
    title: '登記幼兒專責醫師',
    description: '未滿 3 歲幼兒可加入幼兒專責醫師計畫，取得固定的兒科醫師照護。建議選擇平時看診方便且有參與計畫的院所。',
    dueMonth: 12,
    fromMonth: 12,
    toMonth: 36,
    source: '衛生福利部 — 幼兒專責醫師制度計畫',
  },
];
```

- [ ] **Step 4: 執行測試確認通過**

Run: `npx vitest run src/littleexplorer/data/careTasks.test.ts`
Expected: PASS，全部 9 個測試。

若「疫苗任務的 dueMonth 與疫苗資料的 ageInMonths 一致」失敗，代表前置計畫（`2026-08-26-littlesteps-data-corrections.md`）尚未完成。停止本任務，先完成前置計畫。

- [ ] **Step 5: Commit**

```bash
git add src/littleexplorer/data/careTasks.ts src/littleexplorer/data/careTasks.test.ts
git commit -m "feat: add 1-3y care schedule templates

Twenty statutory checkpoints computable from a birthday: three
subsidised health checks, three developmental screenings, eight
vaccine doses, five fluoride applications, and the toddler
physician registration.

Integrity tests cross-check every vaccine link against
vaccines.ts so a schedule change on either side cannot silently
desynchronise the two.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: 發展檢核資料

**Files:**
- Create: `src/littleexplorer/data/developmentChecks.ts`
- Test: `src/littleexplorer/data/developmentChecks.test.ts`

**Interfaces:**
- Consumes: `DevelopmentCheckItem`, `DevelopmentWarning`, `ToddlerAgeBand`, `DevelopmentDomain` from Task 1
- Produces: `developmentCheckItems: DevelopmentCheckItem[]`（30 筆）、`developmentWarnings: DevelopmentWarning[]`（5 筆）、`ageBandLabels: Record<ToddlerAgeBand, string>`、`domainLabels: Record<DevelopmentDomain, string>`、`domainIcons: Record<DevelopmentDomain, string>`

- [ ] **Step 1: 寫失敗測試**

Create `src/littleexplorer/data/developmentChecks.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import type { DevelopmentDomain, ToddlerAgeBand } from '../../types';
import { getLucideIcon } from '../../common/lucideIcons';
import {
  ageBandLabels,
  developmentCheckItems,
  developmentWarnings,
  domainIcons,
  domainLabels,
} from './developmentChecks';

const BANDS: ToddlerAgeBand[] = ['12-15', '15-18', '18-24', '24-30', '30-36'];
const DOMAINS: DevelopmentDomain[] = [
  'gross-motor',
  'fine-motor',
  'language',
  'cognitive',
  'social',
];

describe('developmentCheckItems', () => {
  it('共 30 題，且 id 唯一', () => {
    expect(developmentCheckItems).toHaveLength(30);
    const ids = developmentCheckItems.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每個年齡段恰 6 題', () => {
    for (const band of BANDS) {
      const items = developmentCheckItems.filter((i) => i.ageBand === band);
      expect(items, band).toHaveLength(6);
    }
  });

  it('每個年齡段涵蓋全部 5 個發展面向，語言面向 2 題', () => {
    for (const band of BANDS) {
      const items = developmentCheckItems.filter((i) => i.ageBand === band);
      for (const domain of DOMAINS) {
        const count = items.filter((i) => i.domain === domain).length;
        expect(count, `${band} / ${domain}`).toBe(domain === 'language' ? 2 : 1);
      }
    }
  });

  it('每題都有題目、判準與至少一項練習建議', () => {
    for (const item of developmentCheckItems) {
      expect(item.title.length, item.id).toBeGreaterThan(0);
      expect(item.detail.length, item.id).toBeGreaterThan(0);
      expect(item.tips.length, item.id).toBeGreaterThan(0);
    }
  });
});

describe('developmentWarnings', () => {
  it('每個年齡段各一組紅旗警訊', () => {
    expect(developmentWarnings).toHaveLength(BANDS.length);
    expect(developmentWarnings.map((w) => w.ageBand).sort()).toEqual(
      [...BANDS].sort(),
    );
  });

  it('每組至少 2 條警訊，且都有轉介建議', () => {
    for (const warning of developmentWarnings) {
      expect(warning.signals.length, warning.ageBand).toBeGreaterThanOrEqual(2);
      expect(warning.action.length, warning.ageBand).toBeGreaterThan(0);
    }
  });
});

describe('顯示標籤', () => {
  it('所有年齡段與發展面向都有中文標籤', () => {
    for (const band of BANDS) expect(ageBandLabels[band]).toBeTruthy();
    for (const domain of DOMAINS) expect(domainLabels[domain]).toBeTruthy();
  });

  it('每個發展面向的 icon 名稱可由 lucideIcons registry 解析', () => {
    for (const domain of DOMAINS) {
      const name = domainIcons[domain];
      expect(name, domain).toBeTruthy();
      // getLucideIcon 對未註冊名稱會回退到 HelpCircle，故需比對回退值
      expect(getLucideIcon(name), `${domain} 的 icon ${name} 未註冊`).not.toBe(
        getLucideIcon('__definitely_not_registered__'),
      );
    }
  });
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `npx vitest run src/littleexplorer/data/developmentChecks.test.ts`
Expected: FAIL —「Failed to resolve import "./developmentChecks"」。

- [ ] **Step 3: 建立資料檔骨架與標籤**

Create `src/littleexplorer/data/developmentChecks.ts` starting with:

```ts
import type {
  DevelopmentCheckItem,
  DevelopmentDomain,
  DevelopmentWarning,
  ToddlerAgeBand,
} from '../../types';

export const ageBandLabels: Record<ToddlerAgeBand, string> = {
  '12-15': '1 歲-1 歲 3 個月',
  '15-18': '1 歲 3 個月-1 歲 6 個月',
  '18-24': '1 歲 6 個月-2 歲',
  '24-30': '2 歲-2 歲 6 個月',
  '30-36': '2 歲 6 個月-3 歲',
};

export const domainLabels: Record<DevelopmentDomain, string> = {
  'gross-motor': '粗動作',
  'fine-motor': '細動作',
  language: '語言溝通',
  cognitive: '認知',
  social: '身邊處理與社會性',
};

/** 對應 src/common/lucideIcons.ts registry 中已註冊的名稱。 */
export const domainIcons: Record<DevelopmentDomain, string> = {
  'gross-motor': 'User',
  'fine-motor': 'Hand',
  language: 'MessageCircle',
  cognitive: 'Lightbulb',
  social: 'Users',
};
```

- [ ] **Step 4: 確認 icon 名稱皆已在 registry 註冊，未註冊者補上**

Read `src/common/lucideIcons.ts` and check that `User`、`Hand`、`MessageCircle`、`Lightbulb`、`Users` are all present in the explicit registry. For any missing name, add both the `import` from `lucide-react` and the registry entry, following the file's existing pattern. The registry is explicit for tree-shaking; `getLucideIcon` silently falls back to `HelpCircle` for unknown names, which is why the test compares against the fallback rather than checking for `undefined`.

- [ ] **Step 5: 撰寫 30 筆檢核題目**

Append `developmentCheckItems` to the same file. Item ids follow `check-<ageBand>-<domain>[-2]`. The title列 below fixes the content decisions; write `detail`（該題的觀察情境與通過判準，1-2 句）and `tips`（1-2 條在家練習建議）for each.

**撰寫前必做**：對照衛生福利部國民健康署「兒童健康手冊」之「兒童發展連續圖」與各縣市衛生局「學齡前兒童發展檢核表」核對每題的年齡歸屬。發展年齡有個別差異，題目歸錯年齡段會直接造成偽陽性警訊、引發家長不必要的焦慮。於檔案頂端以註解標註實際查核的版本與日期。

| ageBand | domain | id | title |
|---|---|---|---|
| 12-15 | gross-motor | `check-12-15-gross-motor` | 能獨自站穩，並向前走幾步 |
| 12-15 | fine-motor | `check-12-15-fine-motor` | 能用拇指與食指捏起小東西 |
| 12-15 | language | `check-12-15-language` | 會有意義地叫「爸爸」或「媽媽」 |
| 12-15 | language | `check-12-15-language-2` | 聽得懂並做出簡單指令（如「過來」「給我」） |
| 12-15 | cognitive | `check-12-15-cognitive` | 會用手指出想要的東西 |
| 12-15 | social | `check-12-15-social` | 會模仿大人的動作（如拍手、再見） |
| 15-18 | gross-motor | `check-15-18-gross-motor` | 走得穩，會蹲下撿東西再站起來 |
| 15-18 | fine-motor | `check-15-18-fine-motor` | 會疊起 2-3 塊積木 |
| 15-18 | language | `check-15-18-language` | 會說 5 個以上有意義的單字 |
| 15-18 | language | `check-15-18-language-2` | 被問到時會用手指出身體部位（如眼睛、鼻子） |
| 15-18 | cognitive | `check-15-18-cognitive` | 會把物品放回原本的容器或位置 |
| 15-18 | social | `check-15-18-social` | 會自己用湯匙舀起食物送進嘴裡 |
| 18-24 | gross-motor | `check-18-24-gross-motor` | 能扶著扶手上下樓梯 |
| 18-24 | fine-motor | `check-18-24-fine-motor` | 會轉開瓶蓋或旋轉門把 |
| 18-24 | language | `check-18-24-language` | 會說兩個詞組成的短句（如「喝水水」「媽媽抱」） |
| 18-24 | language | `check-18-24-language-2` | 會使用的詞彙累積達 50 個以上 |
| 18-24 | cognitive | `check-18-24-cognitive` | 會模仿大人畫出直線 |
| 18-24 | social | `check-18-24-social` | 會表達想上廁所，或表示尿布濕了 |
| 24-30 | gross-motor | `check-24-30-gross-motor` | 會雙腳同時離地向前跳 |
| 24-30 | fine-motor | `check-24-30-fine-motor` | 會疊起 6 塊以上積木 |
| 24-30 | language | `check-24-30-language` | 會說出自己的名字 |
| 24-30 | language | `check-24-30-language-2` | 會使用「我」「你」等代名詞 |
| 24-30 | cognitive | `check-24-30-cognitive` | 能配對相同的顏色或形狀 |
| 24-30 | social | `check-24-30-social` | 會玩假想遊戲（如餵娃娃吃飯、假裝講電話） |
| 30-36 | gross-motor | `check-30-36-gross-motor` | 能單腳站立 1-2 秒 |
| 30-36 | fine-motor | `check-30-36-fine-motor` | 會模仿大人畫出圓形 |
| 30-36 | language | `check-30-36-language` | 說的話家人以外的人也能聽懂大半 |
| 30-36 | language | `check-30-36-language-2` | 會回答「這是什麼」「在哪裡」的問題 |
| 30-36 | cognitive | `check-30-36-cognitive` | 會數到 3，並理解數量與物品的對應 |
| 30-36 | social | `check-30-36-social` | 會自己脫下簡單的衣物（如褲子、襪子） |

Shape reference — write all 30 in this form:

```ts
export const developmentCheckItems: DevelopmentCheckItem[] = [
  {
    id: 'check-12-15-gross-motor',
    ageBand: '12-15',
    domain: 'gross-motor',
    title: '能獨自站穩，並向前走幾步',
    detail: '不需扶著任何東西就能站穩數秒，並能自己邁出連續幾步。步態搖晃、雙手張開保持平衡都屬正常。',
    tips: [
      '在安全的空地上，讓孩子在兩位大人之間來回走短距離',
      '避免長時間使用學步車，讓孩子有機會自己練習平衡',
    ],
  },
  // ...其餘 29 題
];
```

- [ ] **Step 6: 撰寫 5 組紅旗警訊**

Append to the same file:

```ts
const REFERRAL_ACTION =
  '請向平時看診的兒科醫師反映，或聯繫各縣市早期療育通報轉介中心，安排兒童發展聯合評估中心進一步評估。發展遲緩越早介入，改善空間越大。';

export const developmentWarnings: DevelopmentWarning[] = [
  {
    ageBand: '12-15',
    signals: [
      '不會扶著家具行走',
      '不會用手指出想要的東西',
      '叫他的名字沒有反應',
    ],
    action: REFERRAL_ACTION,
  },
  {
    ageBand: '15-18',
    signals: [
      '不會說任何有意義的單字',
      '不會模仿大人的日常動作',
      '無法理解簡單的指令',
    ],
    action: REFERRAL_ACTION,
  },
  {
    ageBand: '18-24',
    signals: [
      '仍無法獨立行走',
      '會使用的詞彙少於 10 個',
      '不會用手勢或聲音表達需求',
    ],
    action: REFERRAL_ACTION,
  },
  {
    ageBand: '24-30',
    signals: [
      '不會說兩個詞組成的短句',
      '很少與人有眼神接觸',
      '對其他孩子完全沒有興趣',
    ],
    action: REFERRAL_ACTION,
  },
  {
    ageBand: '30-36',
    signals: [
      '說的話家人以外的人完全聽不懂',
      '不會扶著欄杆上下樓梯',
      '完全沒有出現假想遊戲',
    ],
    action: REFERRAL_ACTION,
  },
];
```

- [ ] **Step 7: 執行測試確認通過**

Run: `npx vitest run src/littleexplorer/data/developmentChecks.test.ts`
Expected: PASS，全部 8 個測試。

- [ ] **Step 8: Commit**

```bash
git add src/littleexplorer/data/developmentChecks.ts src/littleexplorer/data/developmentChecks.test.ts src/common/lucideIcons.ts
git commit -m "feat: add 12-36 month development checklist and red flags

Thirty items across five age bands and five developmental
domains, with language weighted double because language delay is
the most common and most actionable toddler referral reason.

Each band carries its own red-flag set phrased as absence, kept
separate from the checkable items so the UI never has to invert
their meaning.

Item count is deliberately close to the official pre-school
checklist (5-8 per age point): a checklist parents abandon
halfway screens nobody.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: 幼兒知識庫資料

**Files:**
- Create: `src/littleexplorer/data/toddlerWiki.ts`
- Test: `src/littleexplorer/data/toddlerWiki.test.ts`
- Modify: `src/types/index.ts`（新增 `ToddlerWikiCategory` 與 `ToddlerWikiArticle`）

**Interfaces:**
- Consumes: `WikiArticle<Category>` from `src/types/index.ts:438-450`；`WikiCategoryColors` from `:432-436`
- Produces: `ToddlerWikiCategory`、`ToddlerWikiArticle`、`toddlerWikiCategoryLabels`、`toddlerWikiCategoryColors`、`toddlerWikiArticles`（20 篇）

- [ ] **Step 1: 新增型別**

Append to the LittleExplorer block in `src/types/index.ts`:

```ts
export type ToddlerWikiCategory =
  | 'toilet'      // 如廁訓練
  | 'language'    // 語言發展
  | 'emotion'     // 情緒與行為
  | 'eating'      // 飲食與挑食
  | 'sleep'       // 睡眠轉換
  | 'safety'      // 學步期安全
  | 'preschool';  // 入園與社交

export type ToddlerWikiArticle = WikiArticle<ToddlerWikiCategory>;
```

- [ ] **Step 2: 寫失敗測試**

Create `src/littleexplorer/data/toddlerWiki.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import type { ToddlerWikiCategory } from '../../types';
import { getLucideIcon } from '../../common/lucideIcons';
import {
  toddlerWikiArticles,
  toddlerWikiCategoryColors,
  toddlerWikiCategoryLabels,
} from './toddlerWiki';

const CATEGORIES: ToddlerWikiCategory[] = [
  'toilet',
  'language',
  'emotion',
  'eating',
  'sleep',
  'safety',
  'preschool',
];

describe('toddlerWikiArticles', () => {
  it('共 20 篇，且 id 唯一', () => {
    expect(toddlerWikiArticles).toHaveLength(20);
    const ids = toddlerWikiArticles.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每個分類至少 2 篇', () => {
    for (const category of CATEGORIES) {
      const count = toddlerWikiArticles.filter(
        (a) => a.category === category,
      ).length;
      expect(count, category).toBeGreaterThanOrEqual(2);
    }
  });

  it('每篇都有標題、摘要、成因、處理步驟與就醫警訊', () => {
    for (const article of toddlerWikiArticles) {
      expect(article.title.length, article.id).toBeGreaterThan(0);
      expect(article.summary.length, article.id).toBeGreaterThan(0);
      expect(article.causes.length, article.id).toBeGreaterThan(0);
      expect(article.solutions.length, article.id).toBeGreaterThan(0);
      expect(article.warningSignals.length, article.id).toBeGreaterThan(0);
      for (const step of article.solutions) {
        expect(step.step.length, article.id).toBeGreaterThan(0);
        expect(step.detail.length, article.id).toBeGreaterThan(0);
      }
    }
  });

  it('relatedArticleIds 只指向存在的文章，且不自我參照', () => {
    const ids = new Set(toddlerWikiArticles.map((a) => a.id));
    for (const article of toddlerWikiArticles) {
      for (const related of article.relatedArticleIds) {
        expect(ids.has(related), `${article.id} 指向不存在的 ${related}`).toBe(
          true,
        );
        expect(related, article.id).not.toBe(article.id);
      }
    }
  });

  it('每篇的 icon 名稱可由 lucideIcons registry 解析', () => {
    const fallback = getLucideIcon('__definitely_not_registered__');
    for (const article of toddlerWikiArticles) {
      expect(getLucideIcon(article.icon), `${article.id}: ${article.icon}`).not.toBe(
        fallback,
      );
    }
  });
});

describe('分類顯示設定', () => {
  it('每個分類都有標籤與配色', () => {
    for (const category of CATEGORIES) {
      expect(toddlerWikiCategoryLabels[category], category).toBeTruthy();
      const colors = toddlerWikiCategoryColors[category];
      expect(colors?.bg, category).toBeTruthy();
      expect(colors?.text, category).toBeTruthy();
      expect(colors?.pill, category).toBeTruthy();
    }
  });
});
```

- [ ] **Step 3: 執行測試確認失敗**

Run: `npx vitest run src/littleexplorer/data/toddlerWiki.test.ts`
Expected: FAIL —「Failed to resolve import "./toddlerWiki"」。

- [ ] **Step 4: 建立分類標籤與配色**

Create `src/littleexplorer/data/toddlerWiki.ts` starting with:

```ts
import type {
  ToddlerWikiArticle,
  ToddlerWikiCategory,
  WikiCategoryColors,
} from '../../types';

export const toddlerWikiCategoryLabels: Record<ToddlerWikiCategory, string> = {
  toilet: '如廁訓練',
  language: '語言發展',
  emotion: '情緒與行為',
  eating: '飲食與挑食',
  sleep: '睡眠轉換',
  safety: '學步期安全',
  preschool: '入園與社交',
};

export const toddlerWikiCategoryColors: Record<
  ToddlerWikiCategory,
  WikiCategoryColors
> = {
  toilet: { bg: 'bg-sky-50', text: 'text-sky-700', pill: 'bg-sky-100 text-sky-700' },
  language: { bg: 'bg-violet-50', text: 'text-violet-700', pill: 'bg-violet-100 text-violet-700' },
  emotion: { bg: 'bg-rose-50', text: 'text-rose-700', pill: 'bg-rose-100 text-rose-700' },
  eating: { bg: 'bg-amber-50', text: 'text-amber-700', pill: 'bg-amber-100 text-amber-700' },
  sleep: { bg: 'bg-indigo-50', text: 'text-indigo-700', pill: 'bg-indigo-100 text-indigo-700' },
  safety: { bg: 'bg-orange-50', text: 'text-orange-700', pill: 'bg-orange-100 text-orange-700' },
  preschool: { bg: 'bg-emerald-50', text: 'text-emerald-700', pill: 'bg-emerald-100 text-emerald-700' },
};
```

配色沿用 `src/littlebloom/data/wiki.ts` 的 `{bg, text, pill}` 三欄慣例與 Tailwind 預設色階，不使用 `explorer-*` 品牌色——分類色需要 7 種可區分的色相，品牌色只有 3 種。

- [ ] **Step 5: 撰寫 20 篇文章**

Append `toddlerWikiArticles`. 文章清單如下（分類／id／標題）：

| category | id | title |
|---|---|---|
| toilet | `toilet-readiness` | 如廁訓練什麼時候開始？ |
| toilet | `toilet-setback` | 已經會了又退步、抗拒坐馬桶 |
| toilet | `toilet-night` | 夜間尿床要處理嗎？ |
| language | `language-delay-signs` | 怎麼判斷是「大雞晚啼」還是語言遲緩？ |
| language | `language-bilingual` | 家裡講兩種語言會不會讓孩子講話變慢？ |
| language | `language-screen-time` | 螢幕時間對語言發展的影響 |
| emotion | `emotion-terrible-twos` | 番兩歲：情緒風暴當下怎麼辦 |
| emotion | `emotion-separation-anxiety` | 分離焦慮與睡前哭鬧 |
| emotion | `emotion-hitting-biting` | 打人、咬人、搶玩具 |
| eating | `eating-picky` | 挑食與突然不吃飯 |
| eating | `eating-portion` | 幼兒一餐該吃多少？ |
| eating | `eating-milk-transition` | 1 歲後轉全脂鮮奶與戒奶瓶 |
| eating | `eating-self-feeding` | 讓孩子自己吃：弄得一團亂怎麼辦 |
| sleep | `sleep-night-weaning` | 戒夜奶 |
| sleep | `sleep-pacifier-weaning` | 戒奶嘴 |
| sleep | `sleep-crib-to-bed` | 從嬰兒床換到小床 |
| safety | `safety-toddler-proofing` | 學步期居家安全檢查 |
| safety | `safety-head-injury` | 撞到頭：什麼情況要就醫 |
| preschool | `preschool-readiness` | 幼幼班入園準備 |
| preschool | `preschool-sick-season` | 入園後一直生病是正常的嗎？ |

每篇文章是一個 `WikiArticle<ToddlerWikiCategory>`。下方骨架示範**欄位結構與命名**；三個內容陣列（`causes`／`solutions`／`warningSignals`）的實際文字受下方「撰寫規則」第 1 條規範，必須逐篇查證來源後撰寫，不得由本計畫代填。

具體的行文長度與語氣，直接參照既有的 `src/littlesteps/data/babyWiki.ts`——該檔 14 篇文章已定下本專案的衛教文體，是最準確的參考，勝過本計畫轉錄的任何範例。

```ts
export const toddlerWikiArticles: ToddlerWikiArticle[] = [
  {
    id: 'toilet-readiness',
    title: '如廁訓練什麼時候開始？',
    summary: '看的是準備度訊號而不是年齡，多數孩子落在 18-30 個月之間出現。',
    category: 'toilet',
    causes: [],           // 2-3 條，說明影響時機的因素
    solutions: [],        // 3-5 個 { step, detail }，步驟式
    warningSignals: [],   // 1-3 條紅旗
    relatedArticleIds: ['toilet-setback', 'toilet-night'],
    icon: 'Droplets',
  },
  // 其餘 19 篇依上表逐一撰寫
];
```

三個空陣列是骨架佔位，交付時**不得留空**——`toddlerWiki.test.ts` 的「每篇都有標題、摘要、成因、處理步驟與就醫警訊」會擋下任何空陣列。

**撰寫規則**：

1. **不得憑記憶撰寫醫療建議。** 每篇的 `causes` / `solutions` / `warningSignals` 必須對照台灣兒科醫學會發布之衛教資料、衛福部國民健康署「兒童健康手冊」，或國健署健康九九平台之對應主題。於每篇物件上方以註解標註實際引用的來源與查閱日期。
2. `warningSignals` 是紅旗，寫「什麼情況該就醫」，不是一般注意事項。
3. `icon` 必須是 `src/common/lucideIcons.ts` registry 中已註冊的名稱；未註冊者依 Task 4 Step 4 的作法補上。
4. `relatedArticleIds` 至少 1 筆，優先連向同分類的其他文章。
5. 文體與既有 `src/littlesteps/data/babyWiki.ts` 一致：`summary` 一句話，`solutions[].step` 為短動詞片語，`detail` 為 1-2 句具體作法。

- [ ] **Step 6: 執行測試確認通過**

Run: `npx vitest run src/littleexplorer/data/toddlerWiki.test.ts`
Expected: PASS，全部 6 個測試。

- [ ] **Step 7: Commit**

```bash
git add src/types/index.ts src/littleexplorer/data/toddlerWiki.ts src/littleexplorer/data/toddlerWiki.test.ts src/common/lucideIcons.ts
git commit -m "feat: add toddler knowledge base content

Twenty articles across toilet training, language, behaviour,
eating, sleep transitions, safety, and starting preschool -
the 1-3y topics with no coverage anywhere in the existing apps.

Reuses the shared WikiArticle<Category> generic, so the same
WikiArticleCard renders LittleSteps, LittleBloom, and LittleExplorer
articles with each app owning only its own categories.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---
