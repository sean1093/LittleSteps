# LittleExplorer 幼兒期（1-3 歲）子應用設計規格

> 日期：2026-08-26
> 定位：LittleSteps 家族的第四個子應用，銜接 0-1 歲之後的空窗
> 決策前提：獨立子 app＋嚴格互補、底部 Tab Bar 四分頁、App 內提醒＋匯出行事曆、日記純文字、里程碑 clean cutover

---

## 1. 背景與問題

現行三個子應用覆蓋孕期（LittleBloom）、0-1 歲（LittleSteps）、外出哺乳（BabyOasis）。`src/common/pages/MainLandingPage.tsx:341-350` 的旅程時間軸已經畫出「幼兒期 / 1-3 歲」這一格，但背後沒有任何路由——這是產品敘事上的明顯斷點。

LittleExplorer 的目標不是再多一個工具，而是成為 1-3 歲家長的單一入口：**孩子現在會什麼、接下來該做什麼、遇到狀況怎麼辦、以及把這段時間留下來。**

### 1.1 既有覆蓋度盤點（決定做什麼、不做什麼）

| 領域 | 現況與證據 | 本次處置 |
|---|---|---|
| 疫苗追蹤 | `littlesteps/data/vaccines.ts` 34 筆中 15 筆 `ageInMonths >= 12`，涵蓋至 60 個月；`VaccineTrackingPage.tsx:41-44` 由資料自動產生月齡篩選 | 追蹤**功能不重做**，提醒引擎連動既有進度；但該檔案的日本腦炎與 A 肝時程已過期，須先勘誤，見 §8 |
| 快速日誌 | `DailyLogPage.tsx` 為餵奶／睡眠／尿布的結構化速記，不含年齡判斷 | **不重做**，深連結回 LittleSteps。與本案的成長日記邊界見 §5.4 |
| 睡眠 | `sleep.ts:53-54` 最後一段 `1.5-2 歲`；`trendCalculator.ts:178-181`、`sleepAnalysis.ts:247-248` 分支至 24 個月 | **不重做**，深連結回 LittleSteps |
| 成長曲線 | `growthChartData.ts:160-161` 超過 24 個月直接 `throw`；`GrowthChartDisplay.tsx:62` 以 `Math.min(24, ...)` 夾住 x 軸 | **非目標**，見 §10 |
| 里程碑 | 37 筆中僅 4 筆落在單一大桶 `'12+'`（`milestones.ts:319-353`） | **搬移至 LittleExplorer 並移除該桶**，見 §8.1 |
| 照顧重點 | `careGuides.ts` 以 `month: 1..12` 整數編號，最後一筆 `month: 12` | 由本案的「月齡注意事項」承接，見 §5.3 |
| 副食品 | `foodStages` 天花板 `10-12個月`；`ComplementaryFoodPage.tsx:156` 標題寫死「4-12個月」 | 由本案百科的 `eating` 分類承接 |
| 提醒 | 全 repo 無任何排程／到期／通知機制 | **本次核心新增** |
| 質性成長紀錄 | 全 repo 無任何自由書寫的記錄功能 | **本次核心新增** |

### 1.2 需要更正的既有文件

`.claude/CLAUDE.md` 描述的 dual-mode（LocalStorage 或 Firebase）已於 commit `f9d8031 refactor: require login and remove guest/LocalStorage mode` 失效。現況為全站強制登入、純 Firebase RTDB；全 repo 僅 `useTimerPersistence.ts` 使用 localStorage 保存計時器暫態。本規格一律以 Firebase-only 為前提。

---

## 2. 台灣制度錨點

提醒的時程資料全部來自可依出生日精算的法定時程，不含任何推測性內容。

| 制度 | 幼兒期涵蓋 | 出處 |
|---|---|---|
| 兒童預防保健服務「7+2」（免費健檢，未滿 7 歲共 **9** 次） | 1 歲 6 個月-未滿 2 歲 1 次（第 6 次）、2-未滿 3 歲 1 次（第 7 次）、3-未滿 5 歲 1 次（第 8 次） | 國健署（115/7/1 起由 7 次增為 9 次：4-10 個月拆成 4-6、6-12 個月，3-7 歲拆成 3-5、5-7 歲） |
| 兒童發展篩檢服務（113/7/1 上路，6 階段） | 10 個月-1 歲 6 個月、1 歲 6 個月-2 歲、2-3 歲 | 衛福部 |
| 常規疫苗 | 12m MMR／水痘／13 價肺鏈第 3 劑；15m 日本腦炎活減第 1 劑；18m 五合一第 4 劑、A 肝第 1 劑；27m 日本腦炎第 2 劑、A 肝第 2 劑 | 疾管署（A 肝自 114/1/1 起調整為 18、27 個月） |
| 兒童牙齒塗氟 | 未滿 6 歲每 6 個月 1 次 | 健保給付 |
| 幼兒專責醫師計畫 | 未滿 3 歲可登記 | 衛福部 |

---

## 3. 架構決策

### 3.1 形態：獨立子應用，嚴格互補

LittleExplorer 自帶 chrome（比照 LittleBloom／BabyOasis），在 `App.tsx` 的 `isStandaloneSubApp` 判斷式中加入，不使用 LittleSteps 的 Sidebar。

**互補紀律（本規格最重要的約束）**：LittleExplorer 只實作 LittleSteps 沒有的能力。成長曲線、睡眠分析、快速日誌一律以 `window.location.hash` 深連結跳回 LittleSteps 既有頁面，不在 LittleExplorer 內重建任何等價視圖。違反此紀律等同於製造第二套維護成本。

### 3.2 導覽：底部 Tab Bar，四分頁平行

```
littleexplorer            成長   — 這個年紀會什麼、該學什麼（預設分頁）
littleexplorer/reminders  提醒   — 有日期的待辦 ＋ 這個月齡的注意事項
littleexplorer/wiki       百科   — 疑難雜症查詢
littleexplorer/diary      日記   — 質性成長記錄
```

**不做 Hub 總覽頁。** 四個分頁平行，任一頁一指即達。理由有三：

1. LittleExplorer 沒有 Sidebar（`LittleStepsPage` 是封閉 union，結構上不服務其他子 app），必須自備導覽機制。
2. 本專案自己的 `FEATURE_RECOMMENDATIONS.md`「UX 改進建議 2」就提議過底部導航列，理由是「符合行動 App 慣例、單手拇指易觸及、減少點擊次數」，但一直沒實作。四個分區正好是 tab bar 的標準數量。
3. Hub 模式下每次跨頁都要兩次點擊（A → Hub → B），且 Hub 的內容必然與四個分頁大量重複，維護成本雙倍。

**取代 Hub 的總覽功能**：提醒分頁的 tab icon 上顯示紅點 badge，數量為 `overdue` ＋ `due` 的任務數。家長不必進去也知道有沒有逾期事項——這是 Hub 唯一無法被分頁取代的價值，用一個 badge 就能補上。

### 3.3 共用外框

三段式：`ExplorerShell` = 頁首（`Sun` icon、標題、孩子名字與年齡）＋ 內容 slot ＋ `ExplorerTabBar`。四個頁面各自包在 shell 裡，chrome 只寫一次。

Tab bar 固定於底部（`fixed bottom-0`），需處理 iOS 安全區（`pb-[env(safe-area-inset-bottom)]`）；內容區保留 `pb-24` 避免被遮住。

### 3.4 品牌識別

新增 `tailwind.config.js` 的 `explorer` 色票 namespace，比照 `bloom` 的作法：

```js
explorer: {
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

**命名**：LittleExplorer，中文「小小探險家」。

1-3 歲的定義性行為就是探索——開始走、什麼都要摸、到處跑、「我自己來」。名字直接描述這個階段在做什麼，而非只是階段的代號。「小小探險家」是台灣繪本與幼兒園的既有慣用語，家長一看就懂、唸得出來。

**評估過但否決的兩個候選**：

- **LittleLeap（小躍）** — 語意上 `steps → leap` 有遞進感，但「LittleSteps」同時是整個專案與其中一個子 app 的名字（`package.json` 的 `name`、頁尾版權宣告、repo 名稱皆是）。再放一個語意幾乎同義的移動名詞進去，兩者會被混淆。且「小躍」在台灣華語裡偏書面，家長不會這樣講。
- **LittleSprout（小芽）** — 與 LittleBloom 的植物意象成對，但順序是反的：植物先發芽再開花。Bloom 給孕期、Sprout 給其後的幼兒期，隱喻方向錯置。

中文名只在一處露出：成長分頁頁首的副標「小小探險家 · 2歲3個月」。首頁卡片副標維持功能描述「幼兒期陪伴」，與 LittleBloom 的「孕期陪伴」、LittleSteps 的「寶寶成長追蹤」一致——既有三張卡的副標都是功能描述，不為了新名字破壞這個模式。

Tailwind namespace 取 `explorer`（`LittleExplorer` 的識別半部），與 `bloom` 對應 `LittleBloom` 的作法一致。

---

## 4. 成長分頁

### 4.1 定位：先看見會了什麼，再看見該注意什麼

這是家長最常回訪的一頁，語氣決定一切。**進度與鼓勵在前，警訊收在後。**

初版設計曾把紅旗警訊當成主軸，整頁讀起來像篩檢工具——那會讓家長每次打開都在找孩子哪裡不對勁。翻過來：家長先看到「這個年紀的 6 件事，你的孩子會了 4 件」，警訊收成底部一個可展開區塊。

### 4.2 頁面結構

1. **年齡段選擇器** — 橫向 chip 列，5 段。**預設選中孩子目前月齡所屬的段**，而非固定第一段（`MilestonesPage.tsx:20` 固定預設 `'0-2'` 是既知的體驗缺陷，此處不重蹈）。
2. **進度摘要** — 「已達成 N／6」，`explorer-meadow` 進度條。
3. **檢核清單** — 依 5 個發展面向分組，每題可勾選、可展開看觀察判準與練習建議。
4. **勾選後的日記入口** — 勾選為「會了」時，就地展開一個單行輸入框：「要記一筆嗎？」。填寫後直接建立一則帶 `linkedCheckItemId` 的日記，**不跳頁**。留空或關閉則只記錄勾選。
5. **可展開的警訊區** — 預設收合，標題「什麼時候該諮詢醫師」，展開後列出該段的紅旗與轉介建議。
6. **免責說明** — 頁尾小字：發展有個別差異，本表僅供參考，正式評估請至兒童發展聯合評估中心。

第 4 點是讓四個分頁互相餵養的關鍵：「他今天會自己用湯匙了」同時是一次勾選與一則有日期的回憶。少了它，四個分頁只是四個各自為政的工具。

### 4.3 資料模型

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
  title: string;    // 家長可直接判斷的題目
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
    achievedDate?: string; // YYYY-MM-DD
  };
}
```

`DevelopmentCheckProgress` 刻意與既有 `MilestoneProgress`（`types/index.ts:11-16`）同形，讓寫入器可沿用同一模式。

紅旗警訊獨立於檢核題目，因為它們的語意是「缺席」而非「可勾選的正向項目」，硬塞成 `isRedFlag` 旗標會讓 UI 必須反轉語意。

---

## 5. 提醒分頁

### 5.1 定位：兩種不同性質的「該注意的事」

家長口中的「提醒」其實是兩件事，混在一起會兩件都做不好：

- **有日期的待辦** — 健檢、疫苗、塗氟。可由出生日精算到期日，會逾期，可標記完成。
- **這個月齡的注意事項** — 安全、飲食、行為、健康。沒有日期，不會逾期，也不需要打勾，只需要在對的月齡出現在眼前。

兩者在同一頁但分成上下兩區，各自的互動模式不同。

### 5.2 待辦時程

依 §6 的引擎產出，排序為 `overdue` → `due` → `upcoming`（僅顯示 90 天內），`done` 不顯示以免清單被歷史記錄淹沒。

每列顯示：類別標籤、標題、到期日、「還有 N 天」或「已逾期 N 天」。

- 非疫苗任務：有「標記完成」按鈕，就地展開填院所與備註（皆選填）。
- **疫苗任務：沒有標記完成按鈕**，改為深連結「到疫苗追蹤勾選」→ `#/littlesteps/vaccine-tracking`。疫苗完成狀態的唯一真相來源是 `vaccineProgress`。

區塊底部：「匯出全部時程（.ics）」；每列附「加入 Google 日曆」小連結。

### 5.3 月齡注意事項

這是 `careGuides.ts`（硬停在 `month: 12`）的 12-36 個月延續，但改以年齡段而非單月為單位——幼兒期的照顧重點不會月月都變。

```ts
export type ToddlerTipCategory = 'safety' | 'feeding' | 'behavior' | 'health';

export interface ToddlerCareTip {
  ageBand: ToddlerAgeBand;
  category: ToddlerTipCategory;
  title: string;
  highlights: string[];
}
```

5 段 × 4 類 = 20 筆，每筆 3-4 條重點。預設顯示孩子目前所屬年齡段，可切換。

### 5.4 與成長日記的邊界

提醒分頁只回答「該做什麼」，不涉及記錄。任何「我做了什麼／孩子今天怎麼了」都屬日記。

---

## 6. 提醒引擎

### 6.1 純函式，可注入時間

實作於 `src/littleexplorer/utils/careSchedule.ts`，無任何 I/O：

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

### 6.2 資料模型

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
  vaccineId?: string;   // 完成狀態改由 vaccineProgress 承載時指向該筆
  vaccineDose?: number; // 與 vaccineId 成對，指向該筆的 currentDose
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

`vaccineId` ＋ `vaccineDose` 是互補紀律在型別層的具體化：疫苗類任務**不擁有自己的完成狀態**。兩者必須成對，因為 `VaccineProgress` 的形狀是 `{ [id]: { doses: { [n]: { administered } } } }`（`types/index.ts:125-134`）——單靠 `vaccineId` 無法分辨劑次，以 `je-15m`（`doses: 3`）為例，任一劑被勾選都會誤判整組完成。

塗氟為每 6 個月一次，不引入 recurrence 欄位，改以 5 筆離散 template 表達——與 `vaccines.ts` 用離散記錄表達多劑次的既有作法一致，且省掉一整套週期展開邏輯。

### 6.3 狀態判定規則（優先序由上而下）

1. `done` — `careProgress[taskId]` 存在；或具備 `vaccineId` ＋ `vaccineDose` 且 `vaccineProgress[vaccineId]?.doses?.[vaccineDose]?.administered === true`
2. `overdue` — `today > windowEnd`
3. `due` — `dueDate <= today <= windowEnd`
4. `upcoming` — `today < dueDate`

日期一律以本地時區的日界計算（僅比較 `YYYY-MM-DD`），避免 UTC 位移造成到期日差一天。

### 6.4 邊界情況

- **閏年生日（2/29）**：`birthday + N months` 落在非閏年 2 月時，取當月最後一日（2/28）。
- **超出範圍**：`ageMonths < 12` 時全部分頁顯示引導卡（「寶寶還不到 1 歲，先到 LittleSteps 追蹤」＋深連結）；`ageMonths >= 36` 時成長分頁顯示畢業卡並鎖在 `30-36` 段，提醒分頁仍顯示逾期任務，日記與百科照常可用。
- **無 birthday**：不可能發生（`AddChildModal` 強制必填），但 `resolveCareTasks` 對空字串回傳空陣列而非拋錯。

### 6.5 行事曆匯出

實作於 `src/littleexplorer/utils/icsExport.ts`，純字串組裝，**零新增依賴**。

- `buildIcs(tasks, childName): string` — RFC 5545 `VCALENDAR`。每個非 `done` 任務一個 `VEVENT`，全天事件（`DTSTART;VALUE=DATE`），附 `VALARM` 於前 7 天觸發。`SUMMARY`／`DESCRIPTION` 需依 RFC 5545 跳脫（`\` `;` `,` 與換行）。
- `buildGoogleCalendarUrl(task, childName): string` — 單筆快速加入用的 `calendar.google.com/calendar/render?action=TEMPLATE` 連結。
- 下載以 `Blob` + `URL.createObjectURL` 觸發，不需後端。

兩者並存的理由：`.ics` 一次匯出全部時程，Google 連結服務「只想加這一筆」的情境。兩者都落到使用者自己的行事曆 App，由作業系統負責真正的通知送達——這是零後端、零費用能達到的最高送達率。

**明確不做**：FCM Web Push。需 Firebase 升級 Blaze 付費方案、新增 `functions/` 後端專案與排程、新增 `firebase-messaging-sw.js`，且 iOS Safari 必須使用者先「加入主畫面」才收得到，權限拒絕率高。列為第二階段候選。

---

## 7. 成長日記分頁

### 7.1 定位：質性記錄，與快速日誌切乾淨

`DailyLogPage` 是餵奶／睡眠／尿布的**結構化速記**，服務的是「這是第幾次、幾點、幾 ml」。1-3 歲的家長多半已經不記那些。

成長日記記的是另一種東西：今天冒出新的詞、第一次自己穿鞋、公園裡不肯回家。**自由書寫，沒有欄位。**

日記**不顯示**快速日誌的資料。混合時間軸看似整合，實際上會讓兩個記錄入口的界線模糊，家長不知道該去哪裡寫。

### 7.2 資料模型

```ts
export type DiaryMood = 'happy' | 'proud' | 'tired' | 'worried' | 'funny';

export interface DiaryEntry {
  id: string;
  childId: string;
  date: string;      // YYYY-MM-DD，家長可改，預設今天
  content: string;
  mood?: DiaryMood;
  /** 由成長分頁勾選時建立的條目會帶此欄，指向該檢核項目 */
  linkedCheckItemId?: string;
  createdAt: string; // ISO 8601
  updatedAt?: string;
}
```

**第一版純文字，不支援照片。** 照片需導入 Firebase Storage：新的 SDK 面、新的 `storage.rules`、前端影像壓縮（手機直出動輒數 MB），且 2024/10 之後新建的 Firebase 專案啟用 Storage 需 Blaze 付費方案。日後要加只是多一個 `photoUrls?: string[]` 欄位，純新增、不動既有資料——現在不做的代價可逆。

### 7.3 頁面結構

1. **新增區** — 頁面頂端一個「今天發生了什麼？」輸入框，點擊展開：日期（預設今天）、內容 textarea、5 個心情 chip。
2. **時間軸** — 依日期降序，以「YYYY 年 M 月」分組標題。每則顯示日期、心情、內容；帶 `linkedCheckItemId` 者附上該成長項目標題的小標籤。
3. **編輯與刪除** — 每則可就地編輯，刪除需二次確認。
4. **空狀態** — 首次使用顯示引導文案與一則範例的說明，而非空白畫面。

分組邏輯 `groupEntriesByMonth(entries)` 抽為純函式，可單元測試。

---

## 8. LittleSteps 前置勘誤

LittleExplorer 的提醒引擎會直接連動 LittleSteps 的疫苗資料，且成長檢核與既有里程碑內容重疊。以下勘誤是 LittleExplorer 的**前置條件**，各自獨立 commit。

### 8.1 里程碑 clean cutover

在「嚴格互補」前提下，同一件發展事項不得同時出現在兩個 app。`milestones.ts:319-353` 的 4 筆 `'12+'` 記錄（`m12-physical-1`、`m12-motor-1`、`m12-cognitive-1`、`m12-social-1`）內容與 12-15 個月檢核項高度重疊。

觸點（已逐一驗證，共 4 處）：

| 檔案:行 | 變更 |
|---|---|
| `src/types/index.ts:3` | `Milestone.monthRange` 移除 `\| "12+"` |
| `src/types/index.ts:18` | `MonthRange` 移除 `\| "12+"` |
| `src/littlesteps/data/milestones.ts:319-353` | 刪除 4 筆記錄 |
| `src/littlesteps/data/milestones.ts:356,362` | `monthRanges` 型別標註與 `{ value: "12+" }` 項目一併移除 |

`MilestonesPage.tsx` 無需修改：`ranges={monthRanges}`（:88）為資料驅動，預設值（:20）已是 `'0-2'`。

**必須同時修復的孤兒鍵漏洞**：`src/utils/summaryCalculator.ts:22-29` 的 `achievedCount` 完全不比對 id 是否仍存在於 `milestones`。刪除 4 筆後，既有使用者殘留的 `m12-*` 鍵仍會被計入，分母卻由 37 降為 33，`achievementRate` 可算出超過 100%；`recentAchievements`（:40-47）也會以 `milestone?.title || ''` 產生標題空白的卡片。修正為在過濾時同時比對已知 id 集合，此修正對孤兒鍵一般化免疫。RTDB 中的殘留鍵不主動清除——它們不再被讀取，清除需一次性遷移腳本，風險高於收益。

### 8.2 疫苗資料勘誤：日本腦炎（嚴重）

`vaccines.ts:311-346` ＋ `je-5y`（:398-408）保留的是 **2017 年即已淘汰的鼠腦不活化疫苗 4 劑時程**。國內自 106/5/22 起改採細胞培養活性減毒疫苗，**幼兒常規僅 2 劑**：出生滿 15 個月第 1 劑，間隔 12 個月（滿 27 個月）第 2 劑。

現有資料同時自我矛盾：三筆記錄皆宣告 `doses: 3`，但 `je-5y` 卻是「第 4 劑」。

| 記錄 | 現況 | 應為 |
|---|---|---|
| `je-15m`（:311-322） | 第1劑、`doses: 3`、`notes: "間隔2週接種第2劑"` | 第1劑、`doses: 2`、`notes` 改為間隔 12 個月 |
| `je-15m-2`（:323-334） | 第2劑、`ageInMonths: 15.5`、「第1劑後2週」 | **刪除**（此劑次不存在於現行時程） |
| `je-27m`（:335-346） | 第**3**劑、`doses: 3`、`currentDose: 3` | 第**2**劑、`doses: 2`、`currentDose: 2` |
| `je-5y`（:398-408） | 第4劑、滿5歲至入小學前 | **刪除** |

影響：LittleSteps 目前對每位使用者顯示 2 劑不存在的日本腦炎疫苗，家長可能因此帶孩子求診不存在的劑次，或誤以為漏打而焦慮。這是本次調查中最該優先修的缺陷。

**孤兒鍵安全性已驗證**：`summaryCalculator.ts:79-89` 的 `calculateVaccineSummary` 是以 `vaccineSchedules.forEach` 迭代、再用 `vaccineProgress[vaccine.id]` 查表，刪除記錄不會讓殘留進度被誤計。與里程碑不同，此處**不需**額外的孤兒鍵修正。

### 8.3 疫苗資料勘誤：A 型肝炎

A 肝自 114/1/1 起調整為滿 18、27 個月接種第 1、2 劑。現有兩筆記錄的時程皆為調整前的版本。

| 記錄 | 現況 | 應為 |
|---|---|---|
| `hepa-12m`（:250-260） | 第1劑、`timing: "出生滿12個月"`、`ageInMonths: 12` | 第1劑、滿 18 個月、`ageInMonths: 18` |
| `hepa-18m`（:299-310） | 第2劑、`timing: "出生滿18-21個月"`、`ageInMonths: 18` | 第2劑、滿 27 個月、`ageInMonths: 27` |

**id 維持不變**（`hepa-12m` 仍代表第 1 劑，儘管字面月齡已不符）。改 id 會讓既有使用者 `children/{childId}/vaccineProgress` 中的鍵變成孤兒，需要一次性遷移腳本；只改 `timing`／`ageInMonths`／`ageLabel` 三個顯示欄位則零遷移風險。字面不一致以程式碼註解說明即可。

### 8.4 已發現但不在本次範圍的缺陷

`calculateVaccineSummary`（`summaryCalculator.ts:79-89`）以 `totalDoses += vaccine.doses` 累加，但 `doses` 欄位在同一支疫苗的每筆劑次記錄上都重複宣告該疫苗的總劑數（例：`pentavalent-2m`/`4m`/`6m`/`18m` 各宣告 `doses: 4`，加總得 16 而非 4）。`totalDoses` 與 `administrationRate` 因此系統性膨脹。

此缺陷不影響 LittleExplorer（提醒引擎讀 `doses[n].administered`，不讀 summary），修正需重新定義整個資料集的 `doses` 語意，屬 LittleSteps 獨立議題。此處記錄以免遺失。

---

## 9. 新增與修改檔案清單

### 9.1 新增（`src/littleexplorer/`）

| 檔案 | 內容 |
|---|---|
| `components/ExplorerShell.tsx` | 共用外框：頁首 ＋ 內容 slot ＋ tab bar |
| `components/ExplorerTabBar.tsx` | 底部四分頁導覽，含提醒 badge |
| `pages/DevelopmentPage.tsx` | 成長：年齡段 × 面向檢核、進度、勾選後日記入口、可展開警訊 |
| `pages/RemindersPage.tsx` | 提醒：待辦時程 ＋ 月齡注意事項 ＋ 行事曆匯出 |
| `pages/ToddlerWikiPage.tsx` | 百科：搜尋 ＋ 分類篩選，渲染共用 `WikiArticleCard` |
| `pages/DiaryPage.tsx` | 日記：新增區 ＋ 依月分組時間軸 ＋ 編輯刪除 |
| `hooks/useCareTasks.ts` | 純 `useMemo`：結合 `ChildProfile` 上的 `careTaskProgress`、`vaccineProgress` 與 `birthday` 產出 `ResolvedCareTask[]`。無自己的 listener |
| `hooks/useDiary.ts` | 讀 `diaryEntries` collection 的 realtime listener |
| `data/careTasks.ts` | `CareTaskTemplate[]`（20 筆） |
| `data/developmentChecks.ts` | `DevelopmentCheckItem[]`（30 題）＋ `DevelopmentWarning[]`（5 組） |
| `data/monthlyTips.ts` | `ToddlerCareTip[]`（20 筆） |
| `data/toddlerWiki.ts` | 分類標籤、配色、`ToddlerWikiArticle[]`（20 篇） |
| `utils/careSchedule.ts` | `addMonths`、`resolveCareTasks` |
| `utils/icsExport.ts` | `buildIcs`、`buildGoogleCalendarUrl`、`downloadIcs` |
| `utils/diaryHelpers.ts` | `groupEntriesByMonth` |

### 9.2 修改

| 檔案 | 變更 |
|---|---|
| `src/types/routes.ts` | `Page` union 新增 4 個成員。**不加入** `LittleStepsPage`（該 union 專供 Sidebar） |
| `src/types/index.ts` | 新增 §4.3／§5.3／§6.2／§7.2 全部型別；`ChildProfile` 新增 `developmentProgress?` 與 `careTaskProgress?`；`Milestone.monthRange`（:3）與 `MonthRange`（:18）移除 `"12+"` |
| `src/App.tsx` | 4 個 `lazy()` import；`pageMap` +4；`hashMap` +4；`isStandaloneSubApp` 加 `startsWith('littleexplorer')`；`getPageTitle` 早退分支；`<Suspense>` 內 +4 個渲染分支 |
| `src/common/pages/MainLandingPage.tsx` | `onNavigate` 型別 union 新增 `'littleexplorer'`；新增第四張卡；時間軸「幼兒期」格（:341-350）接上 `onClick` |
| `src/lib/firebase.ts` | `logPageView` 新增 `startsWith('littleexplorer')` 分支；順修既有 bug：LittleBloom 分支用 `===` 比對，導致 `littlebloom/wiki` 落到 `app: 'main'` |
| `src/common/hooks/useFirebaseChildren.ts` | 新增 5 個寫入器：`updateDevelopmentProgress`、`upsertCareTaskRecord`、`addDiaryEntry`、`updateDiaryEntry`、`deleteDiaryEntry` |
| `src/common/hooks/useChildStore.ts` | `ChildStore` 介面透出上述 5 個 mutator |
| `tailwind.config.js` | 新增 `explorer` 色票 namespace |
| `src/littlesteps/data/milestones.ts` | §8.1 的刪除 |
| `src/littlesteps/data/vaccines.ts` | §8.2／§8.3 的疫苗時程勘誤 |
| `src/utils/summaryCalculator.ts` | §8.1 的孤兒鍵修正 |

寫入器放入 `useFirebaseChildren.ts` 而非另建本地 hook：該檔案是 `children/{childId}` 子樹**唯一**的寫入點（既有 15 個方法皆在此），另立會製造第二套慣例。代價是該檔案由 287 行成長約 70 行，仍可接受。

### 9.3 RTDB 路徑

| 路徑 | 內容 |
|---|---|
| `children/{childId}/developmentProgress` | `DevelopmentCheckProgress` |
| `children/{childId}/careTaskProgress` | `CareTaskProgress` |
| `children/{childId}/diaryEntries/{entryId}` | `DiaryEntry` |

`database.rules.json` **不需修改**：既有 `children/$childId` 規則（`.read: auth != null`、`.write:` 綁 `users/{uid}/childrenIds`）已涵蓋整棵子樹，這與 LittleBloom 新增 `pregnancyData`、LittleSteps 新增 `dailyLogs` 時完全相同。

### 9.4 確認不需修改

`src/common/components/Sidebar.tsx`（其 `menuSections` 由封閉的 `LittleStepsPage` 型別把關，結構上不服務其他子 app）、`database.rules.json`、`firebase.json`（hosting 為單一 catch-all rewrite，hash 路由不需伺服器設定）、`vite.config.ts`（`lazy()` 已自動產生 chunk）、`package.json`（零新增依賴）。

---

## 10. 明確非目標

- **24-36 個月成長曲線**：`growthChartData.ts` 的 WHO LMS 表僅至 24 個月，`getWHOStandard`（:160-161）超過即 `throw`。在嚴格互補下成長曲線留在 LittleSteps，補表屬 **LittleSteps 的後續工作**，不併入本次。後果是 24-36 個月的成長曲線目前為空白，此處明文記錄以免遺漏。
- **日記照片**：理由見 §7.2。
- **FCM Web Push**：理由見 §6.5。
- **24-36 個月睡眠建議**：`sleep.ts` 最後一段為 `1.5-2 歲`，同屬 LittleSteps 後續工作。
- **日記全文搜尋**：第一版條目量不足以需要搜尋；依月分組的時間軸已足夠瀏覽。
- **多語系**：維持繁體中文。
- **幼兒園報名提醒**：各縣市招生時程不同且非由出生日決定，無法以純函式精算，排除。

---

## 11. 內容規劃

### 11.1 照護提醒 template（20 筆）

| kind | 筆數 | 內容 |
|---|---|---|
| `health-check` | 3 | 1.5-2 歲、2-3 歲、3-7 歲兒童預防保健 |
| `dev-screening` | 3 | 10 個月-1.5 歲、1.5-2 歲、2-3 歲兒童發展篩檢 |
| `vaccine` | 8 | 見下表，每筆以 `vaccineId` ＋ `vaccineDose` 連動 |
| `dental` | 5 | 12／18／24／30／36 個月塗氟 |
| `admin` | 1 | 幼兒專責醫師計畫登記 |

疫苗 template 與 `vaccines.ts` 的對應（**皆以 §8.2／§8.3 勘誤後的資料為準**）：

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

最後兩列的 id 字面月齡與實際 dueMonth 不符，這是 §8.3 刻意保留 id 以避免資料遷移的直接後果。`careTasks.ts` 必須在該處加註解說明，否則後續維護者會誤判為錯誤。

### 11.2 成長檢核（30 題）

5 年齡段 × 6 題。每段的 6 題為 5 個發展面向各 1 題，加上語言溝通面向多 1 題——語言遲緩是幼兒期最常見、也最可行動的轉介原因。每段附 1 組紅旗警訊，`action` 統一導向「向兒科醫師反映，或聯繫各縣市早期療育通報轉介中心安排聯合評估」。

**題數刻意壓低**：台灣官方「學齡前兒童發展檢核表」每個年齡點僅約 5-8 題，本設計每段 6 題與之對齊。檢核表的價值在於家長真的會填完——每段 10-15 題會直接導致棄填，篩檢功能歸零。

### 11.3 月齡注意事項（20 筆）

5 年齡段 × 4 類（`safety`／`feeding`／`behavior`／`health`），每筆 3-4 條重點。涵蓋主題例：學步期居家防護、汽座與外出安全、幼兒餐份量與轉全脂鮮奶、自主進食、情緒風暴與界線、如廁準備、口腔清潔與塗氟、常見傳染病季節。

### 11.4 幼兒百科（20 篇）

7 分類各 2-3 篇：如廁訓練起始時機／戒尿布卡關／夜間尿床；語言發展遲緩判斷／雙語環境／螢幕時間；番兩歲情緒風暴／分離焦慮／咬人打人；挑食／幼兒餐份量／轉全脂鮮奶／自主進食；戒夜奶／戒奶嘴／嬰兒床轉小床；學步期居家安全／撞到頭的判斷／誤食異物；入園準備／入園後生病潮。

### 11.5 內容來源紀律

**醫療與制度性內容不得憑記憶撰寫。** 每筆檢核題目、注意事項與百科文章都必須對照衛福部國健署「兒童健康手冊」、疾管署預防接種時程，或台灣兒科醫學會發布之指引，並在資料檔以註解標註實際查核的來源與日期。

檢核題目的年齡歸屬尤須核對——歸錯年齡會直接產生偽陽性警訊，引發家長不必要的焦慮。

---

## 12. 測試策略

遵循本 repo 現況（11 個測試檔中 9 個為純邏輯、0 個頁面級測試）——不引入第二套慣例，不新增頁面級或 E2E 測試。

| 測試檔 | 涵蓋 |
|---|---|
| `littleexplorer/utils/careSchedule.test.ts` | 四種 status 的日界邊界；`vaccineId`＋`vaccineDose` 連動；僅其他劑次被勾選時不得判定 done；閏年 2/29 生日；空 birthday 回傳空陣列；排序 |
| `littleexplorer/utils/icsExport.test.ts` | `VCALENDAR`／`VEVENT` 結構；`DTSTART;VALUE=DATE` 格式；RFC 5545 跳脫；CRLF 行尾；`done` 任務被排除；Google URL 參數編碼 |
| `littleexplorer/utils/diaryHelpers.test.ts` | 依月分組正確、組內依日期降序、跨年不合併、空輸入回空陣列 |
| `littleexplorer/data/developmentChecks.test.ts` | 30 題、id 唯一、每段 6 題、每段涵蓋 5 面向且語言 2 題、每段有對應警訊、icon 可解析 |
| `littleexplorer/data/careTasks.test.ts` | 20 筆、id 唯一、`fromMonth <= dueMonth <= toMonth`、`vaccineId` 與 `vaccineDose` 成對、每個 `vaccineId` 存在於 `vaccines.ts` 且 dose 與 dueMonth 皆相符 |
| `littleexplorer/data/monthlyTips.test.ts` | 20 筆、5 段 × 4 類無空格、每筆至少 3 條重點 |
| `littleexplorer/data/toddlerWiki.test.ts` | 20 篇、id 唯一、每分類至少 2 篇、必填欄位非空、`relatedArticleIds` 皆存在且不自我參照、icon 可解析 |
| `littlesteps/data/vaccines.test.ts`（新增） | 日本腦炎僅 2 劑；同一支疫苗的所有記錄 `doses` 一致；`ageInMonths` 隨劑次遞增 |
| `littlesteps/data/milestones.test.ts`（新增） | 不含 `'12+'`；`monthRanges` 與資料實際分桶一致；id 唯一 |
| `utils/summaryCalculator.test.ts`（既有，擴充） | 孤兒 milestone 鍵不計入 `achievedCount`；`achievementRate` 不超過 100 |

所有時間相依測試一律注入固定基準日期。

---

## 13. 交付順序

1. **前置勘誤（阻塞後續）** — §8.2／§8.3 疫苗時程修正＋`vaccines.test.ts`。提醒引擎的正確性完全建立在這份資料上。
2. **里程碑 cutover** — §8.1 全部（含 `summaryCalculator` 孤兒鍵修正與既有測試擴充）。
3. **型別與純函式層** — §4.3／§5.3／§6.2／§7.2 型別、`careSchedule.ts`、`icsExport.ts`、`diaryHelpers.ts`，各附測試。無 UI 依賴。
4. **內容資料** — `careTasks.ts`、`developmentChecks.ts`、`monthlyTips.ts`、`toddlerWiki.ts`＋完整性測試。
5. **hooks 與寫入器** — 3 個 hooks、`useFirebaseChildren` 5 個新方法、`useChildStore` 透出。
6. **共用外框** — `ExplorerShell`、`ExplorerTabBar`、`explorer` 色票。四個頁面都依賴它，必須先於頁面。
7. **四個頁面** — 成長 → 提醒 → 日記 → 百科。
8. **註冊與首頁入口** — `routes.ts`、`App.tsx`、`firebase.ts`、`MainLandingPage.tsx`。

階段 1 與 2 互不相依，可並行；階段 4 的 `careTasks.ts` 硬性依賴階段 1。
