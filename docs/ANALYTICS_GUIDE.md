# Google Analytics 數據追蹤指南

## 概述

本專案使用 Firebase Analytics (Google Analytics 4) 追蹤用戶行為，並針對不同頁面和 App 進行分類。

---

## 頁面瀏覽追蹤 (Page View Tracking)

### 自動收集的參數

每次頁面瀏覽都會記錄以下參數：

| 參數名稱 | 說明 | 範例值 |
|---------|------|--------|
| `page_name` | 路由名稱 | `littlesteps/dashboard`, `littlebloom`, `home` |
| `page_path` | URL Hash 路徑 | `#/littlesteps/dashboard` |
| `page_location` | 完整 URL | `https://littlesteps-c6ab6.web.app/#/littlesteps` |
| `page_title` | 頁面標題 | `LittleSteps`, `寶寶的成長總覽` |
| **`app_name`** | **App 分類** | `main`, `littlesteps`, `littlebloom` |
| **`app_section`** | **功能區塊** | `data-tracking`, `development`, `education` |
| **`app_feature`** | **具體功能** | `dashboard`, `milestones`, `vaccine-tracking` |

---

## App 分類 (app_name)

### 1. `main` - 主入口
- **頁面**: `/#/`
- **用途**: 主 Landing Page，雙 App 選擇入口

### 2. `littlesteps` - 寶寶追蹤
- **頁面**: `/#/littlesteps/*`
- **用途**: 寶寶成長追蹤功能

### 3. `littlebloom` - 孕期陪伴
- **頁面**: `/#/littlebloom`
- **用途**: 懷孕媽媽資訊整理（WIP）

---

## 功能區塊分類 (app_section)

### LittleSteps 區塊

| 區塊名稱 | 說明 | 包含功能 |
|---------|------|---------|
| `landing` | 首頁 | 首頁、登入頁面 |
| `data-tracking` | 數據追蹤 | Dashboard, Daily Log, Growth Charts, Sleep Analysis |
| `development` | 發展追蹤 | Milestones, Vaccine Tracking |
| `nutrition-sleep` | 飲食與睡眠 | Complementary Food, Sleep Training |
| `education` | 教育指南 | Care Guide |

### LittleBloom 區塊

| 區塊名稱 | 說明 | 包含功能 |
|---------|------|---------|
| `wip` | 開發中 | 目前所有 LittleBloom 頁面 |

---

## GA4 報表查看方式

### 1. 按 App 區分流量

**路徑**: GA4 → 報表 → 參與 → 網頁和畫面

**步驟**:
1. 點擊右上角「自訂」
2. 新增維度 → 選擇「事件參數」
3. 輸入 `app_name` 作為參數名稱
4. 套用

**結果**: 可以看到 `main`, `littlesteps`, `littlebloom` 的流量分布

---

### 2. 按功能區塊分析

**路徑**: GA4 → 探索 → 建立新探索

**步驟**:
1. 選擇「任意形式探索」
2. 維度 → 新增「事件參數」
   - 新增 `app_name`
   - 新增 `app_section`
   - 新增 `app_feature`
3. 指標 → 新增「事件計數」、「工作階段」
4. 在報表區拖曳維度和指標

**範例查詢**:
```
app_name = littlesteps
└─ app_section = data-tracking
   └─ app_feature = dashboard (事件數: 1,234)
   └─ app_feature = daily-log (事件數: 567)
```

---

### 3. 建立自訂報表

#### 範例 1: LittleSteps 功能使用率

**維度**:
- `app_section` (主要維度)
- `app_feature` (次要維度)

**指標**:
- 事件計數
- 活躍使用者
- 平均參與時間

**篩選器**:
- `app_name` = `littlesteps`

#### 範例 2: 轉換漏斗分析

**步驟順序**:
1. 主入口 (`app_name` = `main`)
2. 選擇 App (`app_name` = `littlesteps`)
3. 使用功能 (`app_feature` = `dashboard`)

---

## 進階查詢範例

### BigQuery SQL 查詢

如果你有開啟 BigQuery 導出，可以使用以下查詢：

```sql
-- 查詢各 App 的頁面瀏覽量
SELECT
  event_date,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'app_name') AS app_name,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'app_feature') AS feature,
  COUNT(*) AS page_views
FROM
  `your-project.analytics_XXXXX.events_*`
WHERE
  event_name = 'page_view'
  AND _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
GROUP BY
  event_date, app_name, feature
ORDER BY
  event_date DESC, page_views DESC
```

```sql
-- 查詢 LittleSteps 功能區塊使用分布
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'app_section') AS section,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'app_feature') AS feature,
  COUNT(DISTINCT user_pseudo_id) AS unique_users,
  COUNT(*) AS total_views
FROM
  `your-project.analytics_XXXXX.events_*`
WHERE
  event_name = 'page_view'
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'app_name') = 'littlesteps'
  AND _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
GROUP BY
  section, feature
ORDER BY
  total_views DESC
```

---

## 其他追蹤事件

除了頁面瀏覽，我們也追蹤以下事件：

### 1. 里程碑切換 (milestone_toggle)
```javascript
{
  milestone_id: string,
  achieved: boolean
}
```

### 2. 疫苗記錄 (vaccine_toggle)
```javascript
{
  vaccine_id: string,
  dose_number: number,
  administered: boolean
}
```

### 3. 子女管理 (child_profile_action)
```javascript
{
  action: 'create' | 'update' | 'delete' | 'switch'
}
```

### 4. 登入/登出 (auth_action)
```javascript
{
  action: 'login' | 'logout' | 'login_failed'
}
```

---

## 實用的 GA4 指標組合

### 產品使用健康度
1. **DAU/MAU 比率** - 衡量用戶黏著度
2. **平均工作階段時長** - 按 `app_name` 分組
3. **每位使用者的事件數** - 按 `app_feature` 分組

### 功能分析
1. **功能使用排名** - 使用 `app_feature` 維度
2. **功能轉換率** - 從首頁到功能使用的漏斗
3. **功能留存率** - 7 天/30 天回訪特定功能的用戶比例

### 用戶旅程
1. **路徑探索** - 查看用戶從主入口到各 App 的流動
2. **退出頁面** - 找出用戶流失點
3. **登入轉換** - Guest 模式到登入的轉換率

---

## 建議的自訂維度設定

如果想在 GA4 界面直接使用自訂維度，請到：

**GA4 → 管理 → 自訂定義 → 建立自訂維度**

| 維度名稱 | 事件參數 | 範圍 |
|---------|---------|------|
| App 名稱 | `app_name` | 事件 |
| App 區塊 | `app_section` | 事件 |
| App 功能 | `app_feature` | 事件 |

設定後，這些維度會出現在所有標準報表中。

---

## 常見問題

### Q: 為什麼 GA4 沒有顯示自訂參數？
A: 自訂參數需要至少收集到一次事件後才會出現在參數列表中。部署後等待 24-48 小時讓數據填充。

### Q: 如何查看即時數據？
A: GA4 → 報表 → 即時 → 可以看到最近 30 分鐘的活動，但自訂參數可能不會立即顯示。

### Q: BigQuery 導出在哪裡設定？
A: GA4 → 管理 → 產品連結 → BigQuery 連結 → 啟用每日導出

---

## 更新日誌

- **2026-04-26**: 新增 `app_name`, `app_section`, `app_feature` 參數用於 App 分類
- **2026-04-26**: 新增主入口頁面 (`home`) 追蹤
- **2026-04-26**: 新增 LittleBloom 頁面追蹤
