# LittleSteps 新功能設計規格

> 日期：2026-04-30
> 方向：深化記錄與數據分析 + 擴展實用工具
> 策略：方案 C — 快速出成果，再深化分析

---

## 實施分波

### 第一波（無數據依賴，快速交付）
1. 寶寶百科（BabyWiki）
2. 看診摘要（ClinicSummary）

### 第二波（共用分析層 + 數據功能）
3. 共用分析層（Analytics Utils）
4. 儀表板即時警示與趨勢強化
5. 週報月報頁面（Report）

---

## 1. 寶寶百科（BabyWiki）

### 定位
獨立的、可搜尋的知識庫頁面，涵蓋 0-2 歲常見育兒狀況與應對方式。不綁定月齡，家長隨時可查。

### 頁面結構
- **頂部搜尋框** — 即時過濾文章（搜尋標題與內容）
- **分類標籤列** — 可橫向捲動：`皮膚問題`、`口腔與長牙`、`動作發展`、`腸胃與排便`、`發燒與感冒`、`睡眠問題`、`日常照顧`
- **文章卡片列表** — 標題 + 一行摘要 + 分類標籤
- **展開方式** — 點擊卡片手風琴式展開完整內容，不跳頁

### 文章結構（每篇）
- 標題（例如「口水疹怎麼辦？」）
- 常見原因（1-3 點）
- 應對方法（步驟式）
- 什麼時候該看醫生（紅旗警示）
- 相關文章連結

### 資料架構
- 靜態資料檔 `src/data/babyWiki.ts`
- 內容以台灣兒科醫學會及衛福部建議為參考基礎

### 初期內容（約 15-20 篇）
口水疹、尿布疹、長牙不適、厭奶期、腸絞痛、便秘、鼻塞處理、發燒判斷、翻身安全、爬行安全、學步注意事項、嬰兒猝死症預防、異位性皮膚炎、玫瑰疹、腸病毒注意事項等。

### 新增檔案
- `src/data/babyWiki.ts` — 文章資料
- `src/types/index.ts` — 新增 `BabyWikiArticle` 類型
- `src/pages/BabyWikiPage.tsx` — 頁面元件
- `src/components/WikiArticleCard.tsx` — 文章卡片元件

### 類型定義
```typescript
interface BabyWikiArticle {
  id: string;
  title: string;
  summary: string;
  category: 'skin' | 'oral' | 'motor' | 'digestive' | 'fever' | 'sleep' | 'daily';
  causes: string[];
  solutions: { step: string; detail: string }[];
  warningSignals: string[]; // 什麼時候該看醫生
  relatedArticleIds: string[];
  icon: string; // lucide-react icon name
}
```

### 路由
- `littlesteps/baby-wiki`
- 側邊選單「照顧指南」區塊新增項目

### 不需要登入即可使用（requiresAuth: false）

---

## 2. 看診摘要（ClinicSummary）

### 定位
一鍵產生寶寶近期健康數據摘要，看診時直接秀手機給醫生看。

### 入口
- 儀表板新增「看診摘要」按鈕
- 側邊選單「數據中心」區塊新增項目

### 頁面結構（單頁長捲動，分區塊）

#### 2.1 寶寶基本資料
- 姓名、性別、生日、目前月齡
- 最近一次體重/身高/頭圍（含百分位）

#### 2.2 成長趨勢
- 最近 3 筆成長紀錄簡表（日期、體重、身高、頭圍）
- 趨勢標示（上升/持平/下降箭頭）

#### 2.3 疫苗紀錄
- 已施打疫苗清單（疫苗名稱、劑次、日期）
- 下一劑待施打疫苗提示

#### 2.4 近 7 天日常摘要
- 餵奶：平均每日次數、平均每日總量
- 睡眠：平均每日時數、最長連續睡眠
- 排便：平均每日次數、最近一次排便時間

#### 2.5 特殊事項（選填）
- 家長可手動輸入一段備註（例如：「最近三天有咳嗽」）
- 僅當次使用，不持久化存儲

### 設計重點
- 純瀏覽用，不需編輯數據（數據來自現有 hooks）
- 排版清晰、字體略大，方便醫生快速掃讀
- 頂部顯示「產生時間」標記數據時效

### 新增檔案
- `src/pages/ClinicSummaryPage.tsx` — 頁面元件
- `src/components/ClinicSummarySection.tsx` — 各區塊共用容器
- `src/hooks/useClinicSummary.ts` — 組裝各來源數據的 hook

### 路由
- `littlesteps/clinic-summary`
- 需要登入（requiresAuth: true）

---

## 3. 共用分析層（Analytics Utils）

### 定位
為儀表板警示、週報月報、看診摘要提供共用的數據分析邏輯。

### 模組

#### 3.1 `src/utils/trendCalculator.ts`
- `calculateDailyAverage(logs, days)` — 計算 N 天平均值
- `calculateTrend(logs, days)` — 計算趨勢方向（上升/下降/持平）
- `calculateChangeRate(logs, days)` — 計算變化率百分比
- `generateSparklineData(logs, days)` — 產生迷你圖表數據點
- `compareWithRecommended(value, ageMonths, type)` — 與月齡建議值比較

#### 3.2 `src/utils/alertEngine.ts`
- `detectFeedingAlerts(logs, ageMonths)` — 餵奶異常偵測
  - 今日餵奶量比 7 天平均少 30% 以上
  - 今日尚未記錄餵奶（超過最後一次餵奶後 6 小時）
- `detectPoopAlerts(logs)` — 排便異常偵測
  - 排便間隔超過 48 小時
  - 排便型態連續異常
- `detectSleepAlerts(logs, ageMonths)` — 睡眠異常偵測
  - 今日總睡眠時數低於月齡建議值的 70%
  - 今日尚未記錄睡眠
- `getActiveAlerts(logs, ageMonths)` — 取得所有當前警示

#### 3.3 `src/utils/reportGenerator.ts`
- `generateWeeklyReport(logs, growthRecords, ageMonths)` — 週報數據
- `generateMonthlyReport(logs, growthRecords, ageMonths)` — 月報數據
- `calculateScores(logs, ageMonths)` — 餵奶規律度/睡眠品質/排便正常度評分（0-100）
- `generateSummaryText(report)` — 自動產生 2-3 句結論文字

### 類型定義
```typescript
type AlertSeverity = 'warning' | 'danger';
type AlertCategory = 'feeding' | 'sleep' | 'poop';
type TrendDirection = 'increasing' | 'decreasing' | 'stable';

interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  icon: string;
}

interface TrendData {
  direction: TrendDirection;
  changeRate: number; // 百分比
  currentValue: number;
  averageValue: number;
  sparklinePoints: number[];
}

interface ReportScores {
  feeding: { score: number; label: string };
  sleep: { score: number; label: string };
  poop: { score: number; label: string };
}

interface WeeklyReport {
  period: { start: string; end: string };
  scores: ReportScores;
  feeding: {
    dailyAmounts: number[];
    avgDailyCount: number;
    avgDailyAmount: number;
    maxDay: { date: string; amount: number };
    minDay: { date: string; amount: number };
  };
  sleep: {
    dailyDurations: number[];
    avgDailyHours: number;
    longestContinuous: number;
    nightWakingsTrend: TrendDirection;
    recommendedHours: number;
  };
  poop: {
    dailyCounts: number[];
    avgDailyCount: number;
    longestGap: number; // hours
    consistencyDistribution: Record<string, number>;
  };
  growth?: {
    weightChange: number;
    heightChange: number;
    latestPercentiles: Record<string, number>;
  };
  summaryText: string;
}
```

---

## 4. 儀表板即時警示與趨勢強化

### 新增元素

#### 4.1 即時警示橫幅（Alert Banner）
- 位置：儀表板最頂部，寶寶資料下方
- 僅在有異常時顯示
- 黃色背景 = 提醒（warning），紅色背景 = 需注意（danger）
- 可關閉（當天不再顯示，用 state 管理）
- 數據來源：`alertEngine.getActiveAlerts()`

#### 4.2 餵奶摘要卡片強化
- 新增：近 7 天每日餵奶量迷你折線圖（sparkline）
- 新增：與平均值的比較文字（「今天 480ml，平均 520ml」）

#### 4.3 排便摘要（新增卡片）
- 最後一次排便距今時間
- 近 7 天每日排便次數迷你柱狀圖
- 異常標示：超過 48 小時未排便

#### 4.4 睡眠摘要卡片強化
- 現有 SleepAnalyticsCard 保持不動
- 新增：與同月齡建議睡眠時數的比較提示文字

### 新增檔案
- `src/components/AlertBanner.tsx` — 警示橫幅元件
- `src/components/SparklineChart.tsx` — 迷你折線圖元件（共用）
- `src/components/PoopSummaryCard.tsx` — 排便摘要卡片

### 修改檔案
- `src/pages/DashboardPage.tsx` — 整合 AlertBanner、強化卡片
- `src/components/DailyLogSummaryCard.tsx` — 加入 sparkline 和比較文字
- `src/components/SleepAnalyticsCard.tsx` — 加入月齡比較提示

---

## 5. 週報月報頁面（ReportPage）

### 入口
- 側邊選單「數據中心」區塊新增「週報月報」項目

### 頁面結構

#### 5.1 時間切換
- 頂部 Tab：`近 7 天` / `近 30 天`
- 顯示報告涵蓋的日期區間

#### 5.2 總覽評分卡
- 三個圓形進度指標：餵奶規律度、睡眠品質、排便正常度
- 每個 0-100 分，顏色（綠 ≥ 70 / 黃 40-69 / 紅 < 40）
- 一句話評語（例如：睡眠 82 分 —「作息穩定，持續保持！」）

#### 5.3 餵奶報告
- 每日餵奶量折線圖（7 天或 30 天）
- 統計：平均每日次數、平均每日總量、最高/最低日
- 母乳 vs 配方奶比例（如有記錄）

#### 5.4 睡眠報告
- 每日總睡眠時數折線圖
- 統計：平均每日時數、最長連續睡眠、夜醒次數趨勢
- 與同月齡建議時數的比較

#### 5.5 排便報告
- 每日排便次數柱狀圖
- 統計：平均每日次數、最長間隔、便便型態分布

#### 5.6 成長紀錄（僅月報）
- 期間內的體重/身高變化
- 百分位趨勢

#### 5.7 本期重點摘要
- 自動產生 2-3 句結論
- 例如：「本週餵奶量穩定成長 8%，睡眠時數略低於建議值，排便規律正常」

### 新增檔案
- `src/pages/ReportPage.tsx` — 頁面元件
- `src/components/ScoreCircle.tsx` — 圓形評分元件
- `src/components/ReportChart.tsx` — 報告用圖表元件（折線圖/柱狀圖）
- `src/hooks/useReport.ts` — 呼叫 reportGenerator 並管理時間切換

### 路由
- `littlesteps/report`
- 需要登入（requiresAuth: true）

---

## 側邊選單更新

```
📊 數據中心
  - 儀表板（現有）
  - 快速日誌（現有）
  - 成長曲線圖（現有）
  - 週報月報（新增）
  - 看診摘要（新增）

🎯 發展追蹤
  - 里程碑追蹤（現有）
  - 疫苗追蹤（現有）

🍼 飲食與睡眠
  - 副食品指南（現有）
  - 睡眠訓練（現有）
  - 睡眠分析（現有）

📖 照顧指南
  - 照顧重點（現有）
  - 寶寶百科（新增）
```

---

## 不在範圍內
- 匯出 PDF/圖片（未來再評估）
- 推播通知
- 寶寶百科用戶投稿/評論
- 多語系（維持繁體中文）
