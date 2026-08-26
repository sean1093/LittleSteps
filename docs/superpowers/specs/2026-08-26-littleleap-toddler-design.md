# LittleLeap 幼兒期（1-3 歲）子應用設計規格

> 日期：2026-08-26
> 定位：LittleSteps 家族的第四個子應用，銜接 0-1 歲之後的空窗
> 決策前提：獨立子 app＋嚴格互補、App 內提醒中心＋匯出行事曆、里程碑 clean cutover

---

## 1. 背景與問題

現行三個子應用覆蓋孕期（LittleBloom）、0-1 歲（LittleSteps）、外出哺乳（BabyOasis）。`src/common/pages/MainLandingPage.tsx:341-350` 的旅程時間軸已經畫出「幼兒期 / 1-3 歲」這一格，但背後沒有任何路由——這是產品敘事上的明顯斷點。

### 1.1 既有覆蓋度盤點（決定做什麼、不做什麼）

| 領域 | 現況與證據 | 本次處置 |
|---|---|---|
| 疫苗追蹤 | `littlesteps/data/vaccines.ts` 34 筆中 15 筆 `ageInMonths >= 12`，涵蓋至 60 個月；`VaccineTrackingPage.tsx:41-44` 由資料自動產生月齡篩選 | 追蹤**功能不重做**，提醒引擎連動既有進度；但該檔案的日本腦炎與 A 肝時程已過期，須先勘誤，見 §7.2／§7.3 |
| 快速日誌 | `DailyLogPage.tsx` 不含任何年齡判斷 | **不重做**，深連結回 LittleSteps |
| 睡眠 | `sleep.ts:53-54` 最後一段 `1.5-2 歲`；`trendCalculator.ts:178-181`、`sleepAnalysis.ts:247-248` 分支至 24 個月 | **不重做**，深連結回 LittleSteps |
| 成長曲線 | `growthChartData.ts:160-161` 超過 24 個月直接 `throw`；`GrowthChartDisplay.tsx:62` 以 `Math.min(24, ...)` 夾住 x 軸 | **非目標**，見 §9 |
| 里程碑 | 37 筆中僅 4 筆落在單一大桶 `'12+'`（`milestones.ts:319-353`） | **搬移至 LittleLeap 並移除該桶**，見 §7 |
| 照顧重點 | `careGuides.ts` 以 `month: 1..12` 整數編號，最後一筆 `month: 12` | 由 LittleLeap 發展檢核與百科承接 |
| 副食品 | `foodStages` 天花板 `10-12個月`；`ComplementaryFoodPage.tsx:156` 標題寫死「4-12個月」 | 由 LittleLeap 百科 `eating` 分類承接 |
| 提醒 | 全 repo 無任何排程／到期／通知機制 | **本次核心新增** |

### 1.2 需要更正的既有文件

`.claude/CLAUDE.md` 描述的 dual-mode（LocalStorage 或 Firebase）已於 commit `f9d8031 refactor: require login and remove guest/LocalStorage mode` 失效。現況為全站強制登入、純 Firebase RTDB；全 repo 僅 `useTimerPersistence.ts` 使用 localStorage 保存計時器暫態。本規格一律以 Firebase-only 為前提。

---

## 2. 台灣制度錨點

提醒引擎的資料全部來自可依出生日精算的法定時程，不含任何推測性內容。

| 制度 | 幼兒期涵蓋 | 出處 |
|---|---|---|
| 兒童預防保健服務（免費健檢，未滿 7 歲共 7 次） | 1 歲 6 個月-未滿 2 歲 1 次、2-未滿 3 歲 1 次、3-未滿 7 歲 1 次 | 國健署 |
| 兒童發展篩檢服務（113/7/1 上路，6 階段） | 10 個月-1 歲 6 個月、1 歲 6 個月-2 歲、2-3 歲 | 衛福部 |
| 常規疫苗 | 12m MMR／水痘／13 價肺鏈第 3 劑；15m 日本腦炎活減第 1 劑；18m 五合一第 4 劑、A 肝第 1 劑；27m 日本腦炎第 2 劑、A 肝第 2 劑 | 疾管署（A 肝自 114/1/1 起調整為 18、27 個月） |
| 兒童牙齒塗氟 | 未滿 6 歲每 6 個月 1 次 | 健保給付 |
| 幼兒專責醫師計畫 | 未滿 3 歲可登記 | 衛福部 |

---

## 3. 架構決策

### 3.1 形態：獨立子應用，嚴格互補

LittleLeap 自帶 chrome（比照 LittleBloom／BabyOasis），在 `App.tsx` 的 `isStandaloneSubApp` 判斷式中加入，不使用 LittleSteps 的 Sidebar 與 Header。

**互補紀律（本規格最重要的約束）**：LittleLeap 只實作 LittleSteps 沒有的能力。成長曲線、睡眠分析、快速日誌一律以 `window.location.hash` 深連結跳回 LittleSteps 既有頁面，不在 LittleLeap 內重建任何視圖。違反此紀律等同於製造第二套維護成本。

### 3.2 頁面結構：3 頁

```
littleleap            Hub —— 目前年齡、未來 90 天到期事項、逾期警示、匯出行事曆、跨 app 深連結
littleleap/checkup    發展檢核 —— 12-36 個月，5 年齡段 × 5 發展面向，含紅旗警訊
littleleap/wiki       幼兒知識庫 —— 7 分類，沿用共用 WikiArticleCard
```

Hub 本身即是提醒中心，不另闢頁面：家長開啟此 app 的第一個問題恆為「現在該做什麼」。

### 3.3 為何不採用其他方案

- **合併為 2 頁**（檢核嵌入 Hub）：發展檢核是 5 段 × 5 面向、需獨立篩選狀態的清單頁，塞入 Hub 會讓主動線被淹沒，且 Hub 將膨脹成第二個 `ComplementaryFoodPage.tsx`（990 行，本 repo 最大檔）。
- **單頁時間軸 feed**：知識庫失去可搜尋性，違反本 repo 三個既有內容頁一致採用的搜尋互動慣例；且每個月齡都需湊齊三種內容才不開天窗，1-3 歲共 24 格，內容成本使第一版難以交付。

### 3.4 品牌識別

新增 `tailwind.config.js` 的 `leap` 色票 namespace，比照 `bloom` 的作法：

```js
leap: {
  'sunbeam': '#F5B843',       // 主色：溫暖陽光黃
  'sunbeam-light': '#FBE0A6',
  'sunbeam-dark': '#D99A22',
  'meadow': '#7FB77E',        // 輔色：草地綠，用於已完成／通過
  'meadow-light': '#B7D9B6',
  'meadow-dark': '#5C9159',
  'sky': '#6FB3D2',           // 強調色：呼應首頁時間軸該格既有的 secondary 藍
  'sky-light': '#B3D8E8',
  'clay': '#E08D6F',          // 警示色：暖橘，紅旗與逾期用，避免刺眼正紅
  'sand': '#FDF8EE',          // 頁面底色
  'bark': '#6B5B4E',          // 文字色
}
```

命名理由：既有家族為 LittleSteps／LittleBloom，`steps → leap` 的語意遞進對應學步到奔跑；首頁時間軸「幼兒期」格既有的 `Sun` icon 可直接沿用。

---

## 4. 資料模型

全部新增於 `src/types/index.ts`，比照既有分區以註解分隔。

### 4.1 發展檢核

```ts
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
  title: string;    // 家長可直接判斷的題目，例：「會自己用湯匙舀起食物送進嘴裡」
  detail: string;   // 觀察情境與判準
  tips: string[];   // 在家可以怎麼練
}

export interface DevelopmentWarning {
  ageBand: ToddlerAgeBand;
  signals: string[];  // 以「缺席」描述，例：「18 個月仍不會獨立行走」
  action: string;     // 轉介建議
}

export interface DevelopmentCheckProgress {
  [checkItemId: string]: {
    achieved: boolean;
    achievedDate?: string;  // YYYY-MM-DD
  };
}
```

`DevelopmentCheckProgress` 刻意與既有 `MilestoneProgress`（`types/index.ts:11-16`）同形，讓 `useFirebaseChildren` 的寫入器可沿用同一模式。

紅旗警訊獨立於檢核題目，因為它們的語意是「缺席」而非「可勾選的正向項目」，硬塞成 `isRedFlag` 旗標會讓 UI 必須反轉語意。

### 4.2 照護提醒

```ts
export type CareTaskKind = 'health-check' | 'dev-screening' | 'vaccine' | 'dental' | 'admin';

export interface CareTaskTemplate {
  id: string;
  kind: CareTaskKind;
  title: string;
  description: string;
  dueMonth: number;   // 建議施行月齡；到期日 = birthday + dueMonth
  fromMonth: number;  // 可執行區間起
  toMonth: number;    // 可執行區間迄，逾此即 overdue
  source: string;     // 法源／出處
  vaccineId?: string;   // 若完成狀態已由 LittleSteps vaccineProgress 承載，指向該筆 id
  vaccineDose?: number; // 與 vaccineId 成對，指向該筆的 currentDose；缺一不可
}

export interface CareTaskRecord {
  taskId: string;
  completedDate: string;  // YYYY-MM-DD
  location?: string;      // 院所
  notes?: string;
}

export interface CareTaskProgress {
  [taskId: string]: CareTaskRecord;
}

export type CareTaskStatus = 'upcoming' | 'due' | 'overdue' | 'done';

export interface ResolvedCareTask {
  template: CareTaskTemplate;
  dueDate: string;        // YYYY-MM-DD
  windowEnd: string;      // YYYY-MM-DD
  status: CareTaskStatus;
  daysUntilDue: number;   // 負數表示已過建議日
  completedDate?: string;
}
```

`vaccineId` ＋ `vaccineDose` 是互補紀律在型別層的具體化：疫苗類任務**不擁有自己的完成狀態**，一律讀 `ChildProfile.vaccineProgress`。同一件事只有一個真相來源。

兩個欄位必須成對，因為 `VaccineProgress` 的形狀是 `{ [vaccineId]: { doses: { [doseNumber]: { administered } } } }`（`types/index.ts:125-134`）——單靠 `vaccineId` 無法分辨劑次。以 `je-15m` 為例，其 `doses: 3`、`currentDose: 1`（`vaccines.ts:311-322`），若只比對 vaccineId 而不指定劑次，任一劑被勾選都會誤判整組任務完成。

塗氟為每 6 個月一次，不引入 recurrence 欄位，改以 5 筆離散 template（`fluoride-12m`/`18m`/`24m`/`30m`/`36m`）表達——與 `vaccines.ts` 用離散記錄表達多劑次的既有作法一致，且省掉一整套週期展開邏輯。

### 4.3 幼兒知識庫

沿用共用泛型 `WikiArticle<Category>`（`types/index.ts:438-450`），比照 `BabyWikiArticle`／`PregnancyWikiArticle` 的既定模式：

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

### 4.4 RTDB 路徑

| 路徑 | 內容 | 讀 | 寫 |
|---|---|---|---|
| `children/{childId}/developmentProgress` | `DevelopmentCheckProgress` | `useDevelopmentProgress` | `useFirebaseChildren.updateDevelopmentProgress` |
| `children/{childId}/careTaskProgress` | `CareTaskProgress` | `useCareTasks` | `useFirebaseChildren.upsertCareTaskRecord` |

`database.rules.json` **不需修改**：既有 `children/$childId` 規則（`.read: auth != null`、`.write:` 綁 `users/{uid}/childrenIds`）已涵蓋整棵子樹，這與 LittleBloom 新增 `pregnancyData` 時完全相同。

---

## 5. 提醒引擎

### 5.1 純函式，可注入時間

實作於 `src/littleleap/utils/careSchedule.ts`，無任何 I/O：

```ts
export function resolveCareTasks(
  birthday: string,
  templates: CareTaskTemplate[],
  careProgress: CareTaskProgress,
  vaccineProgress: VaccineProgress,
  today?: Date,
): ResolvedCareTask[]
```

`today` 可注入，遵循 commit `a9c17ab test: inject base date into sleep-analytics range tests` 建立的慣例——本 repo 所有時間相依計算皆如此，否則測試無法決定性。

### 5.2 狀態判定規則（優先序由上而下）

1. `done` — `careProgress[taskId]` 存在；或該 template 具備 `vaccineId` ＋ `vaccineDose` 且 `vaccineProgress[vaccineId]?.doses?.[vaccineDose]?.administered === true`
2. `overdue` — `today > windowEnd`
3. `due` — `dueDate <= today <= windowEnd`
4. `upcoming` — `today < dueDate`

日期一律以本地時區的日界計算（僅比較 `YYYY-MM-DD`），避免 UTC 位移造成到期日差一天。

### 5.3 邊界情況

- **閏年生日（2/29）**：`birthday + N months` 落在非閏年 2 月時，取當月最後一日（2/28）。
- **超出範圍**：`ageMonths < 12` 時 Hub 顯示引導卡（「寶寶還不到 1 歲，先到 LittleSteps 追蹤」＋深連結）；`ageMonths >= 36` 時顯示畢業卡並只保留仍在區間內的任務。
- **無 birthday**：不可能發生（`AddChildModal` 強制必填），但 `resolveCareTasks` 對空字串回傳空陣列而非拋錯。

---

## 6. 行事曆匯出

實作於 `src/littleleap/utils/icsExport.ts`，純字串組裝，**零新增依賴**。

- `buildIcs(tasks: ResolvedCareTask[], childName: string): string` — 產生 RFC 5545 `VCALENDAR`。每個非 `done` 任務一個 `VEVENT`，全天事件（`DTSTART;VALUE=DATE`），附 `VALARM` 於前 7 天觸發。需對 `SUMMARY`／`DESCRIPTION` 進行 RFC 5545 跳脫（`\` `;` `,` 與換行）。
- 下載以 `Blob` + `URL.createObjectURL` 觸發，不需後端。
- `buildGoogleCalendarUrl(task: ResolvedCareTask, childName: string): string` — 單筆快速加入用的 `calendar.google.com/calendar/render?action=TEMPLATE` 連結。

兩者並存的理由：`.ics` 一次匯出全部時程（設定一次即可），Google 連結服務「只想加這一筆」的情境。兩者都落到使用者自己的行事曆 App，由作業系統負責真正的通知送達——這是零後端、零費用能達到的最高送達率。

**明確不做**：FCM Web Push。需 Firebase 升級 Blaze 付費方案、新增 `functions/` 後端專案與排程、新增 `firebase-messaging-sw.js`，且 iOS Safari 必須使用者先「加入主畫面」才收得到，權限拒絕率高。列為第二階段候選。

---

## 7. LittleSteps 前置勘誤

LittleLeap 的提醒引擎會直接連動 LittleSteps 的疫苗資料，且發展檢核與既有里程碑內容重疊。以下勘誤是 LittleLeap 的**前置條件**，各自獨立 commit，不與 LittleLeap 的新增程式碼混雜。

### 7.1 里程碑 clean cutover

#### 動機

在「嚴格互補」前提下，同一件發展事項不得同時出現在兩個 app。`milestones.ts:319-353` 的 4 筆 `'12+'` 記錄（`m12-physical-1`、`m12-motor-1`、`m12-cognitive-1`、`m12-social-1`）內容與 LittleLeap 的 12-15 個月檢核項高度重疊。

#### 觸點（已逐一驗證，共 4 處）

| 檔案:行 | 變更 |
|---|---|
| `src/types/index.ts:3` | `Milestone.monthRange` 移除 `\| "12+"` |
| `src/types/index.ts:18` | `MonthRange` 移除 `\| "12+"` |
| `src/littlesteps/data/milestones.ts:319-353` | 刪除 4 筆記錄 |
| `src/littlesteps/data/milestones.ts:356,362` | `monthRanges` 型別標註與 `{ value: "12+" }` 項目一併移除 |

`MilestonesPage.tsx` 無需修改：`ranges={monthRanges}`（:88）為資料驅動，預設值（:20）已是 `'0-2'`。

#### 必須同時修復的孤兒鍵漏洞

`src/utils/summaryCalculator.ts:22-29` 現況：

```ts
const totalMilestones = milestones.length;
const achieved = Object.entries(milestoneProgress).filter(([_, p]) => p.achieved);
const achievedCount = achieved.length;
```

`achievedCount` **完全不比對 id 是否仍存在於 `milestones`**。刪除 4 筆後，既有使用者殘留的 `m12-*` 鍵仍會被計入，分母卻由 37 降為 33，`achievementRate` 可算出超過 100%。同時 `recentAchievements`（:40-47）會以 `milestone?.title || ''` 產生標題空白的卡片。

修正：在過濾時同時比對已知 id 集合。

```ts
const knownIds = new Set(milestones.map(m => m.id));
const achieved = Object.entries(milestoneProgress).filter(
  ([id, p]) => p.achieved && knownIds.has(id)
);
```

此修正對孤兒鍵一般化免疫，不僅服務本次搬移。RTDB 中的殘留鍵不主動清除——它們不再被讀取，且清除需要一次性遷移腳本，風險高於收益。

### 7.2 疫苗資料勘誤：日本腦炎（嚴重）

`vaccines.ts:311-346` ＋ `je-5y`（:398-407）保留的是 **2017 年即已淘汰的鼠腦不活化疫苗 4 劑時程**。國內自 106/5/22 起改採細胞培養活性減毒疫苗，**幼兒常規僅 2 劑**：出生滿 15 個月第 1 劑，間隔 12 個月（即滿 27 個月）第 2 劑。

現有資料同時自我矛盾：三筆記錄皆宣告 `doses: 3`，但 `je-5y` 卻是「第 4 劑」。

| 記錄 | 現況 | 應為 |
|---|---|---|
| `je-15m`（:311-322） | 第1劑、`doses: 3`、`notes: "間隔2週接種第2劑"` | 第1劑、`doses: 2`、`notes` 改為間隔 12 個月 |
| `je-15m-2`（:323-334） | 第2劑、`ageInMonths: 15.5`、「第1劑後2週」 | **刪除**（此劑次不存在於現行時程） |
| `je-27m`（:335-346） | 第**3**劑、`doses: 3`、`currentDose: 3` | 第**2**劑、`doses: 2`、`currentDose: 2`；`notes`「與第一劑至少間隔12個月」已正確 |
| `je-5y`（:398-407） | 第4劑、滿5歲至入小學前 | **刪除** |

影響：LittleSteps 目前對每位使用者顯示 2 劑不存在的日本腦炎疫苗，家長可能因此帶孩子求診不存在的劑次，或誤以為漏打而焦慮。這是本次調查中最該優先修的缺陷。

**孤兒鍵安全性已驗證**：`summaryCalculator.ts:79-89` 的 `calculateVaccineSummary` 是以 `vaccineSchedules.forEach` 迭代、再用 `vaccineProgress[vaccine.id]` 查表，刪除記錄不會讓殘留進度被誤計。與里程碑（§7.1）不同，此處**不需**額外的孤兒鍵修正。

### 7.3 疫苗資料勘誤：A 型肝炎

A 肝自 114/1/1 起調整為滿 18、27 個月接種第 1、2 劑。現有兩筆記錄的時程皆為調整前的版本。

| 記錄 | 現況 | 應為 |
|---|---|---|
| `hepa-12m`（:250-260） | 第1劑、`timing: "出生滿12個月"`、`ageInMonths: 12` | 第1劑、滿 18 個月、`ageInMonths: 18` |
| `hepa-18m`（:299-310） | 第2劑、`timing: "出生滿18-21個月"`、`ageInMonths: 18` | 第2劑、滿 27 個月、`ageInMonths: 27` |

**id 維持不變**（`hepa-12m` 仍代表第 1 劑，儘管字面月齡已不符）。改 id 會讓既有使用者 `children/{childId}/vaccineProgress` 中的鍵變成孤兒，需要一次性遷移腳本；只改 `timing`／`ageInMonths`／`ageLabel` 三個顯示欄位則零遷移風險。字面不一致以程式碼註解說明即可。

### 7.4 已發現但不在本次範圍的缺陷

`calculateVaccineSummary`（`summaryCalculator.ts:79-89`）以 `totalDoses += vaccine.doses` 累加，但 `doses` 欄位在同一支疫苗的每筆劑次記錄上都重複宣告該疫苗的總劑數（例：`pentavalent-2m`/`4m`/`6m`/`18m` 各宣告 `doses: 4`，加總得 16 而非 4）。`totalDoses` 與 `administrationRate` 因此系統性膨脹。

此缺陷不影響 LittleLeap（提醒引擎讀 `doses[n].administered`，不讀 summary），修正需重新定義整個資料集的 `doses` 語意，屬 LittleSteps 獨立議題。此處記錄以免遺失。

---

## 8. 新增與修改檔案清單

### 8.1 新增（`src/littleleap/`）

| 檔案 | 內容 |
|---|---|
| `pages/LittleLeapPage.tsx` | Hub：年齡、到期清單、逾期警示、匯出、跨 app 深連結 |
| `pages/DevelopmentCheckPage.tsx` | 年齡段 × 面向篩選的檢核清單＋紅旗警訊區 |
| `pages/ToddlerWikiPage.tsx` | 搜尋＋分類篩選，渲染共用 `WikiArticleCard` |
| `hooks/useCareTasks.ts` | 讀 `careTaskProgress`，結合 `vaccineProgress` 與 `birthday` 產出 `ResolvedCareTask[]` |
| `hooks/useDevelopmentProgress.ts` | 讀 `developmentProgress`，建於共用 `useFirebaseCollection` |
| `data/careTasks.ts` | `CareTaskTemplate[]`（20 筆，見 §10） |
| `data/developmentChecks.ts` | `DevelopmentCheckItem[]` ＋ `DevelopmentWarning[]` |
| `data/toddlerWiki.ts` | `toddlerWikiCategoryLabels`／`toddlerWikiCategoryColors`／`toddlerWikiArticles` |
| `utils/careSchedule.ts` | `resolveCareTasks` 及其輔助純函式 |
| `utils/icsExport.ts` | `buildIcs`、`buildGoogleCalendarUrl` |

### 8.2 修改

| 檔案 | 變更 |
|---|---|
| `src/types/routes.ts` | `Page` union 新增 `'littleleap'`、`'littleleap/checkup'`、`'littleleap/wiki'`。**不加入** `LittleStepsPage`（該 union 專供 Sidebar） |
| `src/types/index.ts` | 新增 §4 全部型別；`Milestone.monthRange`（:3）與 `MonthRange`（:18）移除 `"12+"` |
| `src/App.tsx` | 3 個 `lazy()` import；`pageMap` +3；`hashMap` +3；`isStandaloneSubApp`（:196）加 `\|\| currentPage.startsWith('littleleap')`；`getPageTitle` 早退分支；`<Suspense>` 內 +3 個渲染分支 |
| `src/common/pages/MainLandingPage.tsx` | `onNavigate` 型別 union（:11）新增 `'littleleap'`；新增第四張卡；時間軸「幼兒期」格（:341-350）接上 `onClick` |
| `src/lib/firebase.ts` | `logPageView` 的 `getPageMetadata` 新增 `page.startsWith('littleleap')` 分支 |
| `src/common/hooks/useFirebaseChildren.ts` | 新增 `updateDevelopmentProgress`、`upsertCareTaskRecord` 兩個寫入器並納入回傳物件 |
| `src/common/hooks/useChildStore.ts` | `ChildStore` 介面透出上述兩個 mutator |
| `tailwind.config.js` | 新增 `leap` 色票 namespace |
| `src/littlesteps/data/milestones.ts` | §7.1 的刪除 |
| `src/littlesteps/data/vaccines.ts` | §7.2／§7.3 的疫苗時程勘誤 |
| `src/utils/summaryCalculator.ts` | §7.1 的孤兒鍵修正 |

寫入器放入 `useFirebaseChildren.ts` 而非另建本地 hook：該檔案是 `children/{childId}` 子樹**唯一**的寫入點（既有 15 個方法皆在此），另立會製造第二套慣例。代價是該檔案由 287 行成長約 30 行，可接受。

### 8.3 確認不需修改

`src/common/components/Sidebar.tsx`（其 `menuSections` 由封閉的 `LittleStepsPage` 型別把關，結構上不服務其他子 app）、`database.rules.json`、`firebase.json`（hosting 為單一 catch-all rewrite，hash 路由不需伺服器設定）、`vite.config.ts`（`lazy()` 已自動產生 chunk）、`package.json`（零新增依賴）。

---

## 9. 明確非目標

- **24-36 個月成長曲線**：`growthChartData.ts` 的 WHO LMS 表僅至 24 個月，`getWHOStandard`（:160-161）超過即 `throw`。在嚴格互補下成長曲線留在 LittleSteps，補表屬 **LittleSteps 的後續工作**，不併入本次。後果是 24-36 個月的成長曲線目前為空白，此處明文記錄以免遺漏。
- **FCM Web Push**：理由見 §6。
- **24-36 個月睡眠建議**：`sleep.ts` 最後一段為 `1.5-2 歲`，同屬 LittleSteps 後續工作。
- **多語系**：維持繁體中文。
- **幼兒園報名提醒**：各縣市招生時程不同且非由出生日決定，無法以純函式精算，排除。

---

## 10. 內容規劃

### 10.1 照護提醒 template（20 筆）

| kind | 筆數 | 內容 |
|---|---|---|
| `health-check` | 3 | 1.5-2 歲、2-3 歲、3-7 歲兒童預防保健 |
| `dev-screening` | 3 | 10 個月-1.5 歲、1.5-2 歲、2-3 歲兒童發展篩檢 |
| `vaccine` | 8 | 見下表，每筆皆以 `vaccineId` ＋ `vaccineDose` 連動 |
| `dental` | 5 | 12／18／24／30／36 個月塗氟 |
| `admin` | 1 | 幼兒專責醫師計畫登記 |

疫苗 template 與 `vaccines.ts` 的對應（**皆以 §7.2／§7.3 勘誤後的資料為準**）：

| dueMonth | 疫苗 | `vaccineId` | `vaccineDose` |
|---|---|---|---|
| 12 | MMR 第 1 劑 | `mmr-12m` | 1 |
| 12 | 水痘 第 1 劑 | `varicella-12m` | 1 |
| 12 | 13 價肺炎鏈球菌 第 3 劑 | `pneumococcal-12m` | 3 |
| 15 | 日本腦炎活減 第 1 劑 | `je-15m` | 1 |
| 18 | 五合一 第 4 劑 | `pentavalent-18m` | 4 |
| 18 | A 型肝炎 第 1 劑 | `hepa-12m` | 1 |
| 27 | 日本腦炎活減 第 2 劑 | `je-27m` | 2 |
| 27 | A 型肝炎 第 2 劑 | `hepa-18m` | 2 |

最後兩列的 id 字面月齡與實際 dueMonth 不符，這是 §7.3 刻意保留 id 以避免資料遷移的直接後果。`careTasks.ts` 必須在該處加註解說明，否則後續維護者會誤判為錯誤。

### 10.2 發展檢核（約 60-75 題）

5 年齡段 × 5 面向，每格 2-3 題。每段附 1 組紅旗警訊，`action` 統一導向「向兒科醫師反映，或聯繫各縣市早期療育通報轉介中心安排聯合評估」。

各段紅旗示例：12-15m 不會扶物行走、不會用手指出想要的東西；15-18m 不會說任何有意義單字、不模仿家事動作；18-24m 不會獨立行走、詞彙少於 10 個；24-30m 不會說兩詞句、無眼神接觸；30-36m 語句無法被家人以外的人聽懂、不會扶欄杆上下樓梯、無假想遊戲。

### 10.3 幼兒知識庫（18-20 篇）

7 分類各 2-3 篇：如廁訓練起始時機／戒尿布卡關／夜間尿床；語言發展遲緩判斷／雙語環境／螢幕時間；番兩歲情緒風暴／分離焦慮／咬人打人；挑食／幼兒餐份量與轉全脂鮮奶／自主進食；戒夜奶／戒奶嘴／嬰兒床轉小床；學步期居家安全／撞到頭的判斷／誤食異物；入園準備／入園後生病潮／社交衝突。

內容基準與既有 `babyWiki.ts` 一致：以台灣兒科醫學會與衛福部建議為參考，每篇具備 `causes`／`solutions`／`warningSignals`。

---

## 11. 測試策略

遵循本 repo 現況（11 個測試檔中 9 個為純邏輯，0 個頁面級測試）——不引入第二套慣例，不新增頁面級或 E2E 測試。

| 測試檔 | 涵蓋 |
|---|---|
| `littleleap/utils/careSchedule.test.ts` | 四種 status 的日界邊界（到期前一天／當天／window 末日／隔日）；`vaccineId`＋`vaccineDose` 連動使任務轉為 `done`；**僅其他劑次被勾選時不得判定 done**；閏年 2/29 生日；`ageMonths` 超出 12-36 範圍；空 birthday 回傳空陣列 |
| `littleleap/utils/icsExport.test.ts` | `VCALENDAR`／`VEVENT` 結構完整；`DTSTART;VALUE=DATE` 格式；RFC 5545 跳脫（`;` `,` `\` 與換行）；`done` 任務被排除；Google URL 參數編碼 |
| `littleleap/data/developmentChecks.test.ts` | id 唯一；5 段 × 5 面向無空格；每段皆有對應 `DevelopmentWarning` |
| `littleleap/data/careTasks.test.ts` | id 唯一；`fromMonth <= dueMonth <= toMonth`；每筆 `vaccineId` 皆存在於 `vaccines.ts`，且其 `vaccineDose` 等於該筆記錄的 `currentDose` |
| `utils/summaryCalculator.test.ts`（既有，擴充） | 孤兒 milestone 鍵不計入 `achievedCount`；`achievementRate` 不超過 100 |
| `littlesteps/data/vaccines.test.ts`（新增） | 日本腦炎僅 2 劑且 `currentDose` 為 1、2；同一支疫苗的所有記錄 `doses` 值一致；`ageInMonths` 隨 `currentDose` 單調遞增 |

所有時間相依測試一律注入固定基準日期。

---

## 12. 交付順序

0. **前置勘誤（阻塞後續）** — §7.2／§7.3 疫苗時程修正＋`vaccines.test.ts`。獨立 commit。提醒引擎的正確性完全建立在這份資料上，必須先做。
1. **里程碑 cutover** — §7.1 全部（含 `summaryCalculator` 孤兒鍵修正與既有測試擴充）。獨立 commit，與 LittleLeap 解耦。
2. **型別與純函式層** — §4 型別、`careSchedule.ts`＋測試、`icsExport.ts`＋測試。無 UI 依賴，可獨立驗證。
3. **內容資料** — `careTasks.ts`、`developmentChecks.ts`、`toddlerWiki.ts`＋資料完整性測試。
4. **hooks 與寫入器** — `useCareTasks`、`useDevelopmentProgress`、`useFirebaseChildren` 兩個新方法、`useChildStore` 透出。
5. **頁面** — Hub → 發展檢核 → 幼兒百科。
6. **註冊與品牌** — `routes.ts`、`App.tsx`、`MainLandingPage.tsx`、`firebase.ts`、`tailwind.config.js`。

階段 0 與 1 互不相依，可並行；階段 3 的 `careTasks.ts` 硬性依賴階段 0。
