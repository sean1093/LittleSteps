# 🚀 快速啟動指南

## 立即開始

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 在瀏覽器中打開
# http://localhost:5173/LittleSteps/
```

## 常用指令

### 開發
```bash
npm run dev          # 啟動開發伺服器（熱重載）
```

### 建置
```bash
npm run build        # 建置生產版本到 dist/
npm run preview      # 預覽建置結果
```

### 程式碼品質
```bash
npm run lint         # 執行 ESLint 檢查
```

## 專案結構速覽

```
LittleSteps/
├── src/
│   ├── components/        # React 組件
│   │   ├── MonthPicker.tsx       # 月齡選擇器
│   │   ├── CategoryFilter.tsx    # 分類過濾
│   │   ├── MilestoneCard.tsx     # 里程碑卡片
│   │   └── MilestoneModal.tsx    # 詳細彈窗
│   ├── data/
│   │   └── milestones.ts         # 里程碑資料
│   ├── hooks/
│   │   └── useLocalStorage.ts    # 本地儲存 Hook
│   ├── types/
│   │   └── index.ts              # TypeScript 類型
│   ├── utils/
│   │   └── share.ts              # 分享工具
│   ├── App.tsx                   # 主應用
│   └── main.tsx                  # 進入點
├── public/                # 靜態資源
└── dist/                  # 建置輸出（git ignored）
```

## 快速修改指南

### 新增里程碑
編輯 `src/data/milestones.ts`：

```typescript
{
  id: "m0-2-physical-1",
  monthRange: "0-2",
  category: "physical",
  title: "抬頭 45 度",
  summary: "趴著時可以短暫抬頭 45 度",
  details: "詳細說明...",
  tips: ["提示1", "提示2"]
}
```

### 修改主題色
編輯 `tailwind.config.js`：

```javascript
colors: {
  primary: {
    DEFAULT: '#F472B6',  // 改這裡！
  }
}
```

### 修改網站資訊
編輯 `index.html` 的 `<head>` 區段

### 新增分類
1. 在 `src/types/index.ts` 加入新的 category 類型
2. 在 `src/data/milestones.ts` 的 `categories` 陣列加入新項目
3. 選擇對應的 Lucide 圖示

## 部署到 GitHub Pages

### 自動部署（推薦）
```bash
git add .
git commit -m "feat: your changes"
git push origin master

# GitHub Actions 會自動建置並部署！
```

### 檢查部署狀態
1. 訪問：https://github.com/sean1093/LittleSteps/actions
2. 查看最新的 workflow 執行狀態
3. 成功後訪問：https://sean1093.github.io/LittleSteps/

## 常見問題

### Q: 開發伺服器無法啟動？
A: 檢查 Node.js 版本（需要 18+），刪除 `node_modules` 重新安裝：
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: 建置後樣式沒有載入？
A: 確認 `vite.config.ts` 中的 `base` 設定：
```typescript
base: '/LittleSteps/'  // 必須與 GitHub repo 名稱一致
```

### Q: PWA 功能無法使用？
A: PWA 需要 HTTPS 才能運作，在本地開發時某些功能可能受限。
部署到 GitHub Pages 後即可正常使用。

### Q: 如何更新依賴？
```bash
npm update              # 更新所有依賴到符合 package.json 的最新版本
npm outdated            # 查看過期的套件
npm install pkg@latest  # 更新特定套件到最新版本
```

## 效能優化建議

1. **程式碼分割**: 使用 React.lazy() 延遲載入組件
2. **圖片優化**: 使用 WebP 格式，加入 lazy loading
3. **Bundle 分析**: 執行 `npm run build` 檢查 bundle 大小警告

## 需要協助？

- 📖 查看完整文檔：[README.md](./README.md)
- 🚀 部署說明：[DEPLOYMENT.md](./DEPLOYMENT.md)
- 📊 專案總結：[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- 🐛 回報問題：https://github.com/sean1093/LittleSteps/issues

---

Happy Coding! 🎉
