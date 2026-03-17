# 🍼 LittleSteps - 育兒里程碑追蹤

> 協助新手父母輕鬆掌握小孩各階段的發展重點

<div align="center">

[![Deploy to GitHub Pages](https://github.com/sean1093/LittleSteps/actions/workflows/deploy.yml/badge.svg)](https://github.com/sean1093/LittleSteps/actions/workflows/deploy.yml)

[線上體驗](https://sean1093.github.io/LittleSteps/) | [問題回報](https://github.com/sean1093/LittleSteps/issues)

</div>

## ✨ 核心特色

- 📱 **行動裝置優先** - 針對手機單手操作優化
- 🎨 **溫馨視覺設計** - 粉嫩色系搭配圓潤介面
- ⏱️ **雙軸導航系統** - 月齡時光軸 + 分類過濾
- ✅ **進度追蹤** - LocalStorage 永久儲存勾選記錄
- 🔗 **一鍵分享** - Web Share API 分享寶貝成就
- 💫 **流暢動畫** - Framer Motion 打造絲滑體驗
- 📲 **PWA 支援** - 可安裝至手機主畫面
- 🚀 **零後端** - 純前端靜態網站，極速載入

## 🛠️ 技術棧

- **框架**: React 18 + TypeScript
- **建置工具**: Vite
- **樣式**: Tailwind CSS
- **動畫**: Framer Motion
- **圖示**: Lucide React
- **PWA**: vite-plugin-pwa
- **部署**: GitHub Pages + GitHub Actions

## 📦 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

## 📂 專案結構

```
LittleSteps/
├── src/
│   ├── components/        # React 組件
│   │   ├── MonthPicker.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── MilestoneCard.tsx
│   │   └── MilestoneModal.tsx
│   ├── data/             # 里程碑資料
│   │   └── milestones.ts
│   ├── hooks/            # 自定義 Hooks
│   │   └── useLocalStorage.ts
│   ├── types/            # TypeScript 類型定義
│   │   └── index.ts
│   ├── utils/            # 工具函數
│   │   └── share.ts
│   ├── App.tsx           # 主應用組件
│   ├── main.tsx          # 應用進入點
│   └── index.css         # 全域樣式
├── public/               # 靜態資源
└── index.html            # HTML 模板
```

## 🎯 里程碑分類

- 🏃 **大動作** - 翻身、坐、爬、走等大肌肉發展
- ✋ **精細動作** - 抓握、傳遞等手部精細動作
- 🧠 **語言認知** - 發聲、理解、說話等認知發展
- 🍼 **飲食營養** - 吸吮、副食品、自主進食

## 🎨 設計理念

- **暖色系配色** - 粉嫩紅 #F472B6、天空藍 #60A5FA
- **圓角設計** - 大量使用 rounded-2xl 營造柔和感
- **柔軟陰影** - 微妙的 shadow-soft 增加立體感
- **觸控友善** - 按鈕大小適合拇指點擊

## 📱 PWA 功能

LittleSteps 支援 PWA（Progressive Web App），可以：

1. 添加到手機主畫面
2. 離線瀏覽
3. 類似原生 App 的體驗
4. 自動更新

### 安裝方式

**iOS (Safari)**:
1. 點擊分享按鈕
2. 選擇「加入主畫面」

**Android (Chrome)**:
1. 點擊選單
2. 選擇「安裝應用程式」

## 📄 授權

MIT License

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
