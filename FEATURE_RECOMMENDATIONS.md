# LittleSteps 功能建議報告
> 基於網路育兒論壇研究與父母實際需求分析

## 📋 執行摘要

**目前定位**：教育型參考工具（里程碑、疫苗、副食品指南）
**建議轉型**：教育型 + 日常記錄型混合工具

**關鍵發現**：
- ✅ 現有教育內容品質優秀（里程碑、疫苗、副食品）
- ❌ 缺少父母最常使用的「日常記錄」功能
- 🎯 建議：保留教育功能，新增輕量級日常記錄

---

## 🎯 功能建議（按優先級）

### 🔥 Priority 1：快速日誌（Daily Log）

#### 功能描述
單頁快速記錄介面，3 秒內完成記錄

#### 核心追蹤項目
1. **餵奶 (Feeding)**
   - 類型：母乳（左/右/兩邊）、配方奶、副食品
   - 記錄：時間、量（ml）、時長（分鐘）
   - 計時器：支援背景運行（父母可以關閉 App）

2. **睡眠 (Sleep)**
   - 開始/結束時間
   - 自動計算總時長
   - 顯示「上次睡眠是 2 小時前」

3. **換尿布 (Diaper)**
   - 類型：大便/小便/兩者
   - 大便性狀（可選）：正常/稀/硬
   - 時間記錄

4. **快速按鈕**
   ```
   [🍼 餵奶]  [💤 睡覺]  [💩 尿布]  [🌡️ 其他]

   點擊後立即記錄當前時間
   長按可進入詳細編輯
   ```

#### UX 設計重點
- ✅ 大按鈕（至少 60x60px）適合單手操作
- ✅ 預設值智能填寫（例如：上次餵奶量）
- ✅ 支援快速修改（剛才記錄錯了）
- ✅ 時間軸顯示（今日所有記錄）

#### 技術實作
```typescript
interface DailyLog {
  id: string;
  childId: string;
  type: 'feeding' | 'sleep' | 'diaper' | 'health';
  timestamp: string; // ISO
  data: FeedingData | SleepData | DiaperData | HealthData;
}

interface FeedingData {
  feedingType: 'breast_left' | 'breast_right' | 'breast_both' | 'formula' | 'solid';
  amount?: number; // ml
  duration?: number; // minutes
  notes?: string;
}
```

**參考來源**：
- [Best Baby Tracker Apps 2026](https://medium.com/@muharremyurtsever/best-baby-tracker-apps-in-2026-an-honest-comparison-from-a-parent-who-tried-them-all-8fa1f738c681) - "速度是關鍵，父母需要在 3 秒內完成記錄"
- [台灣育兒 App 推薦](https://www.sundaykiss.com/嬰兒/育兒app-記錄-成長進度-新手媽媽-實用-sk07-512968/) - "哺乳餵食記錄、睡眠時間、排便記錄"

---

### 🌟 Priority 2：成長曲線圖（Growth Chart）

#### 功能描述
視覺化寶寶成長數據，對照 WHO 生長曲線

#### 核心功能
1. **數據輸入**
   - 體重（kg）
   - 身高/身長（cm）
   - 頭圍（cm）
   - 記錄日期

2. **視覺化圖表**
   - WHO 標準曲線（3rd, 15th, 50th, 85th, 97th percentile）
   - 寶寶個人曲線
   - 百分位數顯示（例如：「體重在第 45 百分位」）

3. **智能提醒**
   - 健檢日提醒（1個月、2個月、4個月...）
   - 異常提示（突然掉出正常範圍）

#### UX 參考
```
📊 成長曲線
┌─────────────────────┐
│ [體重] [身高] [頭圍] │  ← Tab 切換
│                     │
│     📈 圖表區域      │
│                     │
│ 最新：9.5kg (↑0.5kg)│
│ 百分位：45th        │
│ 上次測量：7天前     │
└─────────────────────┘
[+ 新增測量記錄]
```

**參考來源**：
- [台灣媽媽論壇](https://www.mababy.com/knowledge-detail?id=9781) - "記錄小朋友的身高和體重、成長記錄"
- [Consumer Reports](https://www.consumerreports.org/babies-kids/baby-tracking-apps/best-baby-tracking-apps-a6067862820/) - "Growth tracking with WHO curves"

---

### 📊 Priority 3：統計圖表與趨勢（Analytics）

#### 功能描述
自動生成每日/每週統計，幫助父母了解寶寶規律

#### 視覺化內容
1. **今日總覽卡片**
   ```
   今日統計 (2026/03/27)
   🍼 餵奶：8次 (總計 720ml)
   💤 睡眠：6次 (總計 14小時)
   💩 尿布：7次 (3大4小)
   ```

2. **每週趨勢圖**
   - 餵奶頻率曲線
   - 睡眠時長趨勢
   - 預測下次餵奶時間

3. **模式識別**
   - "寶寶通常在 21:00-22:00 之間餵奶後會睡較長時間"
   - "過去 3 天，寶寶夜間醒來次數減少了"

**參考來源**：
- [Best Baby Tracking Apps](https://www.slashgear.com/1864409/best-baby-tracking-apps-parents-2025/) - "APP會將用餐、睡眠、排便及體溫等自動統計成每週圖表"
- [Medium Review](https://medium.com/@muharremyurtsever/best-baby-tracker-apps-in-2026-an-honest-comparison-from-a-parent-who-tried-them-all-8fa1f738c681) - "Predictive 'what's next' windows based on history"

---

### 🌙 Priority 4：深色模式（Dark Mode）

#### 功能描述
凌晨餵奶時的護眼模式

#### 實作重點
- OLED 純黑背景（#000000）
- 降低藍光（使用暖色調）
- 自動切換（22:00-06:00）
- 手動切換按鈕

**參考來源**：
- [Reddit Parents Discussion](https://medium.com/@social.devonwheels/top-5-baby-tracking-apps-in-2025-ecbfa428535b) - "OLED dark mode for 3 AM feeds"

---

### 👥 Priority 5：多照顧者同步（Coming Soon）

#### 功能描述
夫妻/祖父母可以同步查看與記錄

#### 技術挑戰
- 目前：LocalStorage（單機）
- 未來：需要後端服務（Firebase Firestore）
- 權限管理：Admin / Caregiver / Viewer

**階段性建議**：
1. **Phase 1**（現在）：匯出/匯入功能（JSON 檔案）
2. **Phase 2**（未來）：雲端同步（需要後端）

**參考來源**：
- [Le Baby App](https://www.lebaby.app/a-baby-tracker-to-share-with-your-partner) - "A baby tracker to share with your partner"
- [台灣育兒 App](https://www.mababy.com/knowledge-detail?id=9781) - "夫妻能同步分享育兒記錄"

---

## 🎨 UX 改進建議

### 1. 首頁重新設計

#### 目前問題
- 首頁是 Landing Page（適合新用戶）
- 老用戶每次打開都要點選功能

#### 建議改進
```
已有寶寶檔案 → 首頁改為「今日總覽 Dashboard」
  ├─ 今日快速記錄按鈕
  ├─ 最近 3 筆記錄時間軸
  ├─ 快速導航（里程碑、疫苗、副食品）
  └─ 每日統計卡片

沒有寶寶檔案 → 顯示 Landing Page
```

### 2. 底部導航列（Tab Bar）

```
┌─────────────────────────────────┐
│         Content Area            │
│                                 │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ [🏠 首頁] [📝 記錄] [📊 里程碑] [更多] │
└─────────────────────────────────┘
```

**優點**：
- 符合行動 App 慣例
- 單手拇指易觸及
- 減少點擊次數

### 3. 手勢操作

- **下拉刷新**：更新時間線
- **左滑刪除**：刪除記錄項目
- **長按**：進入編輯模式

**參考來源**：
- [Best Baby Tracker App Review](https://www.bestbabytracker.com/) - "One-hand operation is critical"

---

## 🚀 實作路線圖

### Phase 1: 快速記錄 MVP（2-3 週）
- [ ] 新增「今日記錄」頁面
- [ ] 實作餵奶、睡眠、尿布記錄
- [ ] LocalStorage 儲存
- [ ] 時間軸顯示
- [ ] 基礎統計（今日總覽）

### Phase 2: 成長與視覺化（2 週）
- [ ] 成長曲線圖（WHO 標準）
- [ ] 每週統計圖表
- [ ] 趨勢分析

### Phase 3: 體驗優化（1-2 週）
- [ ] 深色模式
- [ ] 首頁 Dashboard
- [ ] 底部導航列
- [ ] 手勢操作

### Phase 4: 進階功能（未來）
- [ ] 智能提醒
- [ ] 健康記錄（體溫、用藥）
- [ ] 匯出/匯入
- [ ] 雲端同步（需後端）

---

## 📊 競品參考

根據 2026 年市場調查：

1. **Baby Tracker** - 極簡主義，3 秒記錄
2. **Huckleberry** - AI 預測下次睡眠時間
3. **Baby Connect** - 功能最全面，但介面複雜
4. **Dr.B** (台灣) - 中文化良好，有提醒功能

**LittleSteps 差異化優勢**：
- ✅ 台灣在地化（疫苗時程、副食品）
- ✅ 教育內容專業（里程碑、照護指南）
- ✅ PWA 免安裝，跨平台
- ✅ 隱私優先（LocalStorage，無需註冊）

**建議補強**：
- ❌ 日常記錄功能（目前最大缺口）
- ❌ 視覺化圖表
- ❌ 預測與提醒

---

## 💰 商業模式建議（未來考慮）

目前：免費工具
未來可能：
1. **Freemium**
   - 免費：基礎記錄 + 教育內容
   - 付費：進階圖表、AI 預測、雲端同步

2. **廣告**
   - 母嬰用品推薦（非侵入式）

3. **資料分析**（匿名）
   - 協助研究機構了解台灣嬰兒成長趨勢

---

## 📚 參考資料

### 網路論壇研究
- [Best Baby Tracker Apps 2026 - Medium](https://medium.com/@muharremyurtsever/best-baby-tracker-apps-in-2026-an-honest-comparison-from-a-parent-who-tried-them-all-8fa1f738c681)
- [台灣育兒 App 推薦 - Sundaykiss](https://www.sundaykiss.com/嬰兒/育兒app-記錄-成長進度-新手媽媽-實用-sk07-512968/)
- [育兒 App 推薦 - Mababy](https://www.mababy.com/knowledge-detail?id=9781)
- [孕期&育兒 App - Mombaby](https://www.mombaby.com.tw/articles/9917972)
- [Consumer Reports Review](https://www.consumerreports.org/babies-kids/baby-tracking-apps/best-baby-tracking-apps-a6067862820/)
- [SlashGear - Best Apps 2025](https://www.slashgear.com/1864409/best-baby-tracking-apps-parents-2025/)

### 技術參考
- WHO Growth Charts API
- React + TypeScript + Vite
- Chart.js / Recharts for 視覺化
- Framer Motion for 動畫

---

**報告產生時間**：2026-03-27
**分析工具**：Claude Code + Web Research
**建議有效期**：6 個月（建議每半年重新評估市場需求）
