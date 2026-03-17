# SPEC: LittleSteps - 新手父母育兒里程碑追蹤站

## 1. 專案概述 (Project Overview)
* **目標**：建立一個行動裝置優先 (Mobile-First) 的靜態 Web App，協助新手父母輕鬆掌握小孩各階段的發展重點。
* **核心價值**：溫馨、明亮、專業、無壓力。
* **設計原則**：
    * **視覺風格**：暖色系、粉嫩感 (Pastel Colors)、大量的圓角 (Rounded-2xl) 與柔軟陰影。
    * **互動邏輯**：單手操作優化，導航列置於底部，內容區域支持橫滑。

## 2. 技術棧 (Tech Stack)
* **框架**：React 18 + TypeScript (使用 Vite 構建)
* **樣式**：Tailwind CSS (自定義主題以符合溫馨感)
* **圖示**：Lucide React (線條簡潔、具備現代感)
* **狀態管理**：React Hooks (useState, useEffect) + LocalStorage (紀錄勾選進度)
* **部署**：GitHub Pages (搭配 GitHub Actions 自動化部署)
* **PWA**：vite-plugin-pwa (支援「新增至主畫面」功能)

## 3. 功能規格 (Functional Requirements)

### A. 雙軸導航系統 (Dual-Axis Navigation)
1.  **頂部時光軸 (Horizontal Month Picker)**：
    * 顯示月齡區段：0-2m, 3-4m, 5-6m, 7-9m, 10-12m, 1y+。
    * 點擊時平滑切換當前顯示的里程碑資料。
2.  **分類過濾 (Category Filter)**：
    * 提供「大動作」、「精細動作」、「語言認知」、「飲食營養」等分類標籤。

### B. 里程碑管理 (Milestone Management)
1.  **卡片式清單**：
    * 展示里程碑標題、簡短描述。
    * 點擊卡片彈出（Modal 或 Expand）詳細衛教資訊與練習建議。
2.  **進度儲存**：
    * 使用者勾選完成後，狀態需永久儲存於瀏覽器 LocalStorage。

### C. 分享與互動 (Sharing)
1.  **里程碑分享**：
    * 利用 Web Share API 分享特定里程碑標題 + 網站連結。
    * 預設分享文字範例：「我的寶貝達成了【會翻身】里程碑了！推薦給新手父母的育兒神器：[URL]」。

### D. PWA 支援
1.  **Manifest 配置**：設定正確的 App Icon 與主題色，確保在 iOS/Android 上能像 App 一樣安裝。

## 4. 資料結構定義 (Data Schema)

資料建議存放於 `src/data/milestones.json` 或 `ts` 檔案中：

```ts
export interface Milestone {
  id: string;
  monthRange: "0-2" | "3-4" | "5-6" | "7-9" | "10-12" | "12+";
  category: "physical" | "motor" | "cognitive" | "feeding";
  title: string;
  summary: string;
  details: string;
  tips: string[]; // 給父母的練習小撇步
}
```

## 5. UI 規範細節 (UI Specification)
色彩計畫：

Background: #FAFAF9 (暖白)

Primary: #F472B6 (粉嫩紅) 或 #60A5FA (天空藍)

Card: #FFFFFF (純白，帶微弱陰影)

組件間距：統一使用 Tailwind 的 p-4 到 p-6，確保畫面不擁擠。

字體：優先使用系統預設黑體，確保在手機上的易讀性。

## 6. 實作路徑 (Implementation Roadmap)
Phase 1：初始化 Vite + Tailwind 並設定 PWA 環境。
Phase 2：實作靜態資料層 (依據衛教手冊內容填充)。
Phase 3：開發主頁面 UI（時光軸與卡片清單）。
Phase 4：加入 LocalStorage 儲存邏輯與 Web Share 功能。
Phase 5：配置 GitHub Actions 並部署上線。

## 7. 加分項需求 (Optional Enhancements)
* **動畫與微交互**：
  - 使用 `framer-motion` 處理卡片進出場動畫。
  - 列表過濾時使用 Layout Animation 確保視覺流暢。
* **SEO 優化**：
  - 確保 Open Graph (OG) 標籤完整，分享至 LINE/FB 時能顯示正確的標題與暖色調預覽圖。
* **Empty State 設計**：
  - 若該月齡尚未有勾選項目，顯示一張溫馨的小插圖引導父母開始觀察紀錄。