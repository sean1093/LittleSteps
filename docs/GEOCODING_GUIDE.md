# 哺乳室地址轉座標指南

本文檔說明如何使用 Google Maps Geocoding API 將 306 筆台北市哺乳室地址轉換為經緯度座標。

## 📋 前置準備

### 1. 建立 Google Cloud Platform 專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 登入你的 Google 帳號
3. 建立新專案或選擇現有專案
   - 點擊上方專案選單
   - 點擊「新增專案」
   - 輸入專案名稱（例如：LittleSteps）
   - 點擊「建立」

### 2. 啟用 Geocoding API

1. 在左側選單點擊「API 和服務」→「資料庫」
2. 搜尋「Geocoding API」
3. 點擊進入並按「啟用」
4. 等待啟用完成（約 1-2 分鐘）

### 3. 建立 API 金鑰

1. 在左側選單點擊「API 和服務」→「憑證」
2. 點擊「建立憑證」→「API 金鑰」
3. 複製產生的 API 金鑰（格式：`AIzaSy...`）
4. **重要**：點擊「限制金鑰」設定安全性
   - API 限制：選擇「限制金鑰」
   - 勾選「Geocoding API」
   - 儲存

### 4. 設定帳單（啟用免費額度）

1. 點擊左側選單「帳單」
2. 新增付款方式（信用卡）
3. **不用擔心費用**：
   - Google 提供每月 $200 美金免費額度
   - 相當於 40,000 次 geocoding 請求
   - 本專案只需約 306 次（約 $1.50）
   - 完全在免費額度內

## 🚀 執行 Geocoding

### 方法 1：使用環境變數

```bash
# 設定 API Key（替換成你的金鑰）
export GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# 執行 geocoding 腳本
node scripts/geocodeWithGoogleMaps.cjs
```

### 方法 2：一行指令

```bash
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX node scripts/geocodeWithGoogleMaps.cjs
```

### 預期輸出

```
Starting Google Maps geocoding process...
API Key: AIzaSyXX...XXXX
This should complete in about 30-60 seconds.

Found 306 nursing rooms to geocode
[1/306] Geocoding: 內政部國土管理署
  Address: 臺北市松山區八德路2段342號
  ✓ Found: 25.0478, 121.5598
  Formatted: 342號, No. 342號八德路二段松山區台北市台灣 105
[2/306] Geocoding: 交通部運輸研究所
  ...

=== Geocoding Complete ===
Success: 305
Failed: 1
Estimated cost: $1.53 (well within $200 free tier)

✅ Updated: /Users/sean_chou/Dev/personal/LittleSteps/src/data/nursingRoomsData.ts
⏱️  Duration: 45.2s

🎉 Done! You can now test the map at http://localhost:5173/#/babyoasis
```

## 📊 執行後

### 1. 檢查結果

```bash
# 檢查有多少筆座標已更新（應該接近 0）
grep -c '"latitude": 25.033' src/data/nursingRoomsData.ts

# 檢查是否有失敗的地址
cat src/data/geocoding_failed.json
```

### 2. 測試地圖

```bash
npm run dev
# 瀏覽器開啟 http://localhost:5173/#/babyoasis
```

### 3. 提交變更

```bash
git add src/data/nursingRoomsData.ts
git commit -m "chore: geocode nursing room addresses with Google Maps API

- Successfully geocoded 305/306 addresses
- Updated coordinates from default Taipei center
- Estimated cost: $1.53 (within free tier)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
```

## 💰 費用說明

### Google Maps Geocoding API 定價

- **基本價格**：$5 USD / 1,000 requests
- **每月免費額度**：$200 USD credit
- **相當於**：40,000 次免費請求

### 本專案使用量

- **請求次數**：306 次
- **預估費用**：$1.53 USD
- **實際費用**：$0（在免費額度內）

### 費用監控

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 左側選單 →「帳單」→「報表」
3. 可查看實際使用量和費用

## ⚠️ 注意事項

### API 金鑰安全

- ✅ **DO**：設定 API 限制（只允許 Geocoding API）
- ✅ **DO**：定期更換 API 金鑰
- ❌ **DON'T**：將 API 金鑰提交到 Git
- ❌ **DON'T**：在前端程式碼中使用（應該在後端或腳本中）

### .gitignore 檢查

確保 `.env` 和包含 API 金鑰的檔案都在 `.gitignore` 中：

```bash
# 檢查是否已忽略
cat .gitignore | grep -E "\.env|api.*key"

# 如果沒有，請新增
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

## 🔧 疑難排解

### 錯誤：API key not set

```bash
# 確認環境變數設定
echo $GOOGLE_MAPS_API_KEY

# 如果是空的，重新設定
export GOOGLE_MAPS_API_KEY=你的金鑰
```

### 錯誤：API not enabled

前往 Google Cloud Console 啟用 Geocoding API。

### 錯誤：Request denied

檢查 API 金鑰限制設定，確保 Geocoding API 在允許清單中。

### 執行速度慢

腳本有速率限制（每 100ms 一次請求），這是正常的。預計 30-60 秒完成。

## 🎯 替代方案

如果不想使用 Google Maps API，可以考慮：

1. **手動標記重點位置**
   - 台北 101、微風、誠品等熱門地點
   - 使用 Google Maps 查詢座標
   - 手動更新 `nursingRoomsData.ts`

2. **使用其他 Geocoding 服務**
   - MapBox Geocoding API
   - Here Maps Geocoding API
   - Azure Maps

3. **暫時使用預設座標**
   - 先讓功能上線
   - 未來再補完座標

## 📚 參考資源

- [Google Maps Geocoding API 文件](https://developers.google.com/maps/documentation/geocoding)
- [Google Cloud Free Tier](https://cloud.google.com/free)
- [API 金鑰最佳實踐](https://cloud.google.com/docs/authentication/api-keys)
