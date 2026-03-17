# 部署說明

## GitHub Pages 設定

1. 前往 GitHub repository 設定：https://github.com/sean1093/LittleSteps/settings/pages

2. 在「Build and deployment」區段：
   - Source: 選擇「Deploy from a branch」
   - Branch: 選擇「gh-pages」分支，目錄選擇「/ (root)」
   - 點擊「Save」

3. 或者使用 GitHub Actions（推薦）：
   - Source: 選擇「GitHub Actions」
   - 系統會自動偵測 .github/workflows/deploy.yml

## 檢查部署狀態

1. 查看 Actions: https://github.com/sean1093/LittleSteps/actions
2. 等待綠色勾勾表示部署成功
3. 訪問網站: https://sean1093.github.io/LittleSteps/

## 手動觸發部署

如果需要手動觸發部署：

```bash
git commit --allow-empty -m "chore: trigger deployment"
git push origin master
```

## 疑難排解

### 404 錯誤
- 確認 vite.config.ts 中的 base 設定正確：`base: '/LittleSteps/'`
- 確認 GitHub Pages 設定正確

### 樣式沒有載入
- 檢查瀏覽器控制台是否有 CORS 錯誤
- 確認所有資源路徑都是相對路徑

### PWA 無法安裝
- 確認網站使用 HTTPS（GitHub Pages 預設使用）
- 檢查 manifest.webmanifest 是否正確生成
