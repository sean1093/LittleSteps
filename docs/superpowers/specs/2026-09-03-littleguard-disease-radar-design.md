# LittleGuard 疫情雷達設計規格

> 日期：2026-09-03
> 定位：LittleSteps 家族的第六個服務。回答一個家長每週都在問、而政府資料答得出來但答得不好懂的問題：**我這個縣市、我小孩這個年齡，這週有什麼可以多留意。**
> 決策前提：純公開（不讀任何孩子資料）、縣市與年齡層手選、每週手動重建並 commit（排程在實作後證明不可行，見 §3.3）、六種 0-6 歲相關且有分母的病種、靖藍 ramp
> **語氣前提（貫穿全文，優先於任何視覺或資訊密度考量）**：這個服務要讓家長「多留意」，不是讓家長緊張。狀態文案用日常說法、顏色最強只到 `butter-dark`、不用箭頭與紅點、每個「變多」都必須同時給得出可以做的事。細節見 §4.5 與 §6.1，並有測試把關（§9）。

---

## 1. 背景與問題

### 1.1 選題來源

從 `https://data.gov.tw/datasets/export/csv`（68.8 MB，53,101 筆）全量掃出符合五條篩選器的資料集：高頻更新（日／小時／分／週）、免費、非地方機關（單一全國來源）、有機器可讀下載網址 → 884 筆；再以消費者決策關鍵字收斂到 172 筆，逐筆實抓驗證。

疾管署這組資料是唯一同時滿足下列條件的：單一來源自動更新、政府有資料但呈現不可讀、有能換算成決策訊號的 last-mile、免打字免登入即可回答、零成本可建置。

被同一輪掃描判死的題目與死因記錄在此，避免日後重複評估：定存牌告利率（央行 9464，taiwanrate.com／ifa.ai／Money101 已飽和）、路邊停車動態（交通部 174353／174357，停車 App 飽和）、油價（中油 6339）、電影票房（文化部 94224，抓取需 referer 且無決策價值）、機場即時航班（民航局 8 支，Google Flights 覆蓋）、紫外線指數（氣象署 9039，天氣 App 全都有）。

### 1.2 競品盤點

| 誰 | 做到什麼 | 缺口 |
|---|---|---|
| 疾管署 NIDSS（`nidss.cdc.gov.tw`） | 70 種傳染病的流行趨勢、統計圖表、地理分布 | 定位是「供民眾、學術界與媒體查詢」的專業儀表板，不是「今天要不要讓小孩去公園」 |
| 「流感預報站，用 AI 預測疫情」 | 唯一登記在這組資料上的活化應用，掛在急診類流感（dataset 14584） | 只做類流感、只到全國層級的未來四週預測 |
| data.gov.tw 活化應用逐筆查 | 門診腸病毒 14590、急診腸病毒 14587、門診類流感 14593 → 全部「目前沒有相關活化應用」 | 手足口病、疱疹性咽峽炎、腹瀉、水痘無人使用 |
| 民間 | COVID 期間的足跡地圖、官方臺灣社交距離 App | 沒有以家長為對象、以縣市×年齡層為切面的兒童傳染病雷達 |

### 1.3 既有覆蓋度盤點（決定不做什麼）

| 領域 | 現況 | 本案處置 |
|---|---|---|
| 疫苗時程與追蹤 | `littlesteps/data/vaccines.ts`，32 劑 | **不重做**。雷達講的是「現在外面在流行什麼」，與「你家孩子打了幾劑」是兩件事 |
| 寶寶百科 15 篇疾病條目 | `littlesteps/data/babyWiki.ts` | **不重做**。雷達的抽屜連到疾管署該病介紹頁，不在此重寫醫療內容 |
| 幼兒百科 45 篇（含生病照顧） | `littleexplorer/data/` | **不重做**，同上 |
| 地圖能力 | `babyoasis` 的 Leaflet + 空間索引 | **不使用**。縣市層級的資料用 22 顆 chip 就夠，加地圖等於把 gzip 14.7 KB 的板變成要載 Leaflet 的頁 |
| 定位能力 | `BabyOasisPage.tsx` 的 `navigator.geolocation` + toast 失敗處理 | **沿用同一模式**，座標對縣市用內建中心點表，不引入 geocoding 服務（本 repo 已測試並否決台灣地址 geocoding） |

---

## 2. 資料來源

### 2.1 六支資料集

全部來自衛生福利部疾病管制署「健保門診及住院就診人次統計」系列，政府資料開放授權條款第 1 版，免費，無需 API key。

| 病種 | dataset | 檔案 |
|---|---|---|
| 腸病毒 | 14590 | `https://od.cdc.gov.tw/eic/NHI_EnteroviralInfection.csv` |
| 手足口病 | 14592 | `https://od.cdc.gov.tw/eic/NHI_HandFootMouthDisease.csv` |
| 疱疹性咽峽炎 | 14591 | `https://od.cdc.gov.tw/eic/NHI_Herpangina.csv` |
| 類流感 | 14593 | `https://od.cdc.gov.tw/eic/NHI_Influenza_like_illness.csv` |
| 腹瀉 | 14597 | `https://od.cdc.gov.tw/eic/NHI_Diarrhea.csv` |
| 水痘 | 14599 | `https://od.cdc.gov.tw/eic/NHI_Varicella.csv` |

欄位（實測 `NHI_EnteroviralInfection.csv`，188,583 列，8.2 MB，UTF-8 with BOM，CRLF）：

```
年, 週, 就診類別(門診|住院), 年齡別, 縣市, <病名>健保就診人次, 健保就診總人次, 縣市別代碼
```

`健保就診總人次` 是這組資料的關鍵：它是分母，所以跨縣市可以比。`RODS_*`（急診監測）那 7 支沒有分母，只能看趨勢不能比大小，**本案不使用**。

年齡別由資料給定：`0~2 / 3~6 / 7~12 / 13~15 / 16~18 / 19~24 / 25~64 / 65+ / 不詳`。本案只取前三段，剛好對齊托嬰、幼兒園、國小。涵蓋範圍 2016 W01 起至今，22 縣市齊全。

### 2.2 更新節奏

data.gov.tw 標示「每 1 日」，但實際內容以「週」為單位：NIDSS 的說明是「RODS 及健保次級統計資料因考量週別資料完整性，於每週一及週二清晨更新上一週資料」。因此：

- 資料粒度是週，不是日。UI 不得暗示即時。
- 更新定在**每週三之後**，確保上週資料已進來。
- 最新一週永遠落後今天 3–9 天。這是資料的性質，不是缺陷，但必須寫在畫面上（見 §7）。

### 2.3 憑證鏈問題與解法

`od.cdc.gov.tw` 送出的憑證鏈是斷的：leaf 由 `TWCA SSL Certification Authority`（OU=SSL Sub-CA，上層 `TWCA CYBER Root CA`）簽發，但伺服器送出的中介是另一條線的 `TWCA Secure SSL Certification Authority`（上層 `TWCA Global Root CA`）。兩段接不起來。

實測結果：

| 做法 | 結果 |
|---|---|
| `fetch()`（Node 24 預設） | `UNABLE_TO_VERIFY_LEAF_SIGNATURE` |
| `node --use-openssl-ca` | `UNABLE_TO_VERIFY_LEAF_SIGNATURE` |
| `ca: [中介]`（會取代整個信任庫） | `UNABLE_TO_GET_ISSUER_CERT` |
| `ca: [...tls.rootCertificates, 中介]` | 200 OK — 但依賴該 runtime 的信任庫剛好有 TWCA CYBER Root |
| `ca: [中介, 根]`（完全不用系統信任庫） | 200 OK, 8,184,212 bytes — 證明兩張自帶憑證已足以建立信任鏈 |
| **`ca: [...tls.rootCertificates, 中介, 根]`** | **200 OK, 8,184,212 bytes** ← 採用：信任錨點寫死，行為與 runtime 內建信任庫的版本無關 |

採用最後一種（見 `scripts/buildDiseaseRadar.cjs:57`）：兩張憑證 vendor 進 `scripts/data/`，附加兩張自帶憑證到系統信任庫之後，明確指定信任錨點。理由是 CI 用的是 Node 20（見 `.github/workflows/firebase-hosting-merge.yml:17`），而 Node 20 與 Node 24 的內建 Mozilla 信任庫版本不同；把信任錨點寫死，行為就與 runtime 版本無關。`ca: [中介, 根]` 同樣實測回 200，但那會取代整個系統信任庫；這支腳本只連 `od.cdc.gov.tw`，兩者對它都成立，差別只在於對其他主機是否仍信任系統庫，所以附加的寫法保留了系統庫又不失去寫死的錨點。

| 憑證 | 檔案 | SHA-256 | 效期 |
|---|---|---|---|
| `TWCA SSL Certification Authority`（中介） | `scripts/data/twca-ssl-ca.pem` | `01:AF:23:24:D0:98:09:8F:5E:0C:DF:6F:AA:BA:DA:43:0B:21:CC:E7:77:F4:7E:AC:B2:62:48:B2:FD:A3:E5:31` | 2023-02-23 → **2033-02-23** |
| `TWCA CYBER Root CA`（根） | `scripts/data/twca-cyber-root.pem` | `3F:63:BB:28:14:BE:17:4E:C8:B6:43:9C:F0:8D:6D:56:F0:B7:C4:05:88:3A:56:48:A3:34:42:4D:6B:3E:C5:58` | 2022-11-22 → **2047-11-22** |

**禁止**用 `NODE_TLS_REJECT_UNAUTHORIZED=0` 或 `rejectUnauthorized: false` 繞過。憑證來源（leaf 的 AIA 擴充）：`http://sslserver.twca.com.tw/cacert/Cyber_SSL_2023.crt`、`http://sslserver.twca.com.tw/cacert/cyber_root_2022.crt`；vendor 進 repo 而不是 build 時抓，因為那兩個是明文 HTTP。

---

## 3. 架構決策

### 3.1 形態：第六個服務，純公開

雷達不讀也不寫任何孩子的資料，判準與 `routePolicy.ts` 既有的一致（「這一頁需不需要某個孩子的資料才有意義」），所以：

- 進 `PUBLIC_PAGES`，與 `littleouting`、`babyoasis` 同類。
- 不碰 Firebase，不碰 `useChildStore`，不動 `database.rules.json`，不需要 `npm run test:rules`。
- 縣市與年齡層都由使用者手選。**不做**「登入後用孩子生日自動帶入年齡層」——那會讓一個公開頁的行為隨登入狀態改變，把 `routePolicy` 乾淨的判準弄濁。
- 孩子檔案本來也沒有縣市欄位（`city` 只存在於哺乳室與場館資料上），所以縣市不存在可自動帶入的來源。

代價誠實記錄：全 repo 沒有偏好持久化機制，所以每次進來都要點一次縣市。定位鈕把它縮成一次點擊，但不做記憶。

### 3.2 導覽形狀：單頁 + 兩排 chip + 抽屜

現有五種形狀分別是 hub+返回（LittleBloom）、側邊選單 12 頁（LittleSteps）、底部四分頁（LittleExplorer）、頁內三分頁（LittleOuting）、全螢幕地圖（BabyOasis）。雷達是第六種：單頁、板優先、免打字。

只有一個路由 `/littleguard`。沒有子頁——這個服務只回答一個問題，多一層導覽就是多一層阻力。

### 3.3 資料管線：每週手動重建並 commit

```
6 支 CSV ≈ 47 MB
   ↓ scripts/buildDiseaseRadar.cjs（ca: [中介, 根]）
public/data/diseaseRadar.json   68,511 bytes / gzip 14,667（實測）
   ↓ 有 diff 才 commit 到 master
既有 firebase-hosting-merge workflow 自動部署
```

700:1 的壓縮比是這個設計成立的原因：nursingRooms.json 是 1.1 MB 所以被 `globIgnores` 排除在 PWA precache 外；68.5 KB（gzip 14.7 KB）則可以直接被預先快取，板因此離線可用。

更新時機：每週三之後（CDC 週一／週二已更新上週資料）。在本機跑
`node scripts/buildDiseaseRadar.cjs`，再用 `scripts/diffDiseaseRadar.cjs` 判斷要不要
commit，且必須 push 到 **`master`**（`firebase-hosting-merge.yml:6`），否則不會觸發部署。

**排程在實作後被證明不可行，已移除。** `od.cdc.gov.tw`（35.229.205.172）從 GitHub
託管的 runner 連不上：兩次 `workflow_dispatch` 都是 `connect ETIMEDOUT`，各卡約
2 分 17 秒，TCP 都沒建立。同一個 IP 從台灣的機器連得上、DNS 也解到同一個位址，
所以是來源 IP 被擋（GitHub runner 在 Azure 上），不是 DNS 分流。cron 留著只會每週三
準時寄一封失敗信。workflow 本身與 `permissions: contents: write` 都保留，改成只能
手動觸發；接上有台灣線路的 self-hosted runner 後換掉 `runs-on` 即可恢復自動化。

被否決的做法：

- **完全手動**（比照 nursingRooms 現況）：原本以此為否決——疫情資料過期不是「不新鮮」而是「誤導」，放著會讓降級狀態變成常態而不是例外。**實作後這條否決被推翻兩次**：(a) 排程這個選項並不存在（見上），真正的選擇是「手動」對「每週失敗一次的 cron」；(b) §7 的降級是設計好的，過期超過一個月時九個狀態文案全部收起、只留數字與週次，所以板不會對過期資料做出任何論斷——「誤導」的風險由 UI 承接，不是由更新頻率承接。
- **client 端直抓 CDC**：單支 8.2 MB、六支 47 MB，行動網路不可行；且瀏覽器對缺中介憑證的容忍度不一致（Chrome 會用 AIA 補抓，Safari／Firefox 可能直接失敗）。
- **排程時直接 build+deploy 不 commit**：線上資料與 repo 不一致，git 查不到當前線上是哪一週。
- **Cloud Function 代理**：Firebase Functions 需要 Blaze 付費方案。

### 3.4 服務識別

| 項目 | 值 |
|---|---|
| Wordmark | LittleGuard |
| `role`（中文角色標） | 疫情雷達 |
| 路由 | `/littleguard` |
| `icon` | `ShieldAlert`——**已在 `src/common/lucideIcons.ts:41` 的白名單裡**，不需新增圖示。識別用的唯一圖示，比照 `serviceTheme.ts` 的既有規則 |

靖藍 ramp，不撞 `secondary` 的天藍（BabyOasis）也不撞 `outing` 的青綠。對比值全部實算（對 `warm-white` `#FDFBF7`）：

| Token | 值 | 對 warm-white | 白字在其上 | 角色 |
|---|---|---|---|---|
| `guard.DEFAULT` | `#A8ADDB` | 2.10:1 | 2.17:1 | 裝飾填色，**永不承載文字**（與 `outing.DEFAULT` 的 2.10:1 同級，維持家族一致） |
| `guard.light` | `#E4E6F5` | 1.20:1 | — | 面板淡底（`ink` 在其上 9.17:1） |
| `guard.soft` | `#F3F4FB` | 1.06:1 | — | 最淡的洗色（`ink` 在其上 10.37:1） |
| `guard.ink` | `#5A61A8` | **5.48:1** | 5.66:1 | 標題、連結、白底上的圖示；也是主要按鈕與 active chip 的實色底（白字 5.66:1） |
| `guard.deep` | `#474C86` | 7.68:1 | 7.94:1 | hover 與邊框的更深填色 |

**燈號不新增任何顏色 token**，全部沿用既有語意：↑↑ `primary-dark`（4.92:1）、↑ `butter-dark`（4.92:1，既有語意是「溫和警告」）、→ `ink-muted`、↓ `mint-dark`（4.81:1，既有語意是「安全／完成」）。

---

## 4. 指標與門檻

### 4.1 就診率

```
rate(病, 縣市, 年齡層, 週) = 該病門診就診人次 / 健保門診就診總人次 × 10,000
```

只取 `就診類別 == '門診'`。用率不用人次的理由是實測的：2026 W34，0-6 歲腸病毒新北市 205 人次、花蓮縣 76 人次，但花蓮的就診率是新北的 6 倍。人次會把人口多的縣市永遠排在前面，率才回答「這裡現在兇不兇」。率也自動吸收就診人口的長期變化與少子化趨勢。

### 4.2 被否決的基線：前 5 年同週中位數

第一版設計用「同縣市、同年齡層、前 5 年同一週別的中位數」當基線。實測打掉它：

```
全國 3~6 歲 腸病毒 W30-38 就診率（/萬）
2019  268.3   ← 疫前
2020   21.4   ┐
2021   24.3   ├ NPI 期間，腸病毒幾乎消失
2022    6.5   ┘
2023  177.8
2024  233.0
2025  109.2
```

2026 的「前 5 年」有三年落在那個斷層裡，基線被壓到不合理的低。該基準下 ratio 的實測分布是 P50 = 1.63、P75 = 3.98、P90 = 8.58（n = 46,025）——中位數就已經是 1.63 倍，任何「超過 1.5 倍就警示」的門檻都會全年亮燈。

**處置**：不當燈號依據。保留在抽屜裡作為次要脈絡，並明寫「2020-2022 年因防疫措施，數值偏低」。

### 4.3 趨勢基準（燈號依據）

```
本週      = week（六支資料共同存在的最新一週）
trendBase = median(本週之前 8 週的 rate)    ← 不含本週，至少 6 週要有值
ratio     = rate / trendBase                ← trendBase 為 0 時為 null，見 §4.5
spark     = 含本週在內的最近 8 週 rate       ← 與 trendBase 的視窗刻意差一週：
                                              基線不能包含被評估的那一週
```

實測分布（近 3 年、分母 ≥ 300、n = 48,725）：

| P25 | P75 | P90 |
|---|---|---|
| 0.78 | 1.26 | 1.77 |

這三個就是燈號的門檻。它們由 `buildDiseaseRadar.cjs` 每次重建時實算並寫入 JSON 的 `calibration` 欄位（見 §5），`radar.ts` 的 `RADAR_THRESHOLDS` 是它們的鏡像，兩邊漂開超過 0.05 測試就紅（見 §9）。表上只列這三個，因為出貨管線只算這三個——其餘百分位沒有對應的新量測，不補。

設計階段的原型另外量到 P50 **1.01**。**P50 ≈ 1.01、正確地以 1.0 為中心且完全不跨 NPI 斷層，是選這個基準而不選 §4.2 的理由**，這個論證仍然成立。但那個數字量在**較窄的視窗**上（只算第 9–52 週、不跳年，n = 40,040）；實作依本節規格從第 1 週起算並跳年取值（跨年退回前一年的最後一週，2025 確實有 W53），樣本因此從 40,040 增到 48,725，三個門檻百分位隨之下移。§4.2、§4.4、§4.6 的分布數字同樣出自那批原型量測，出貨管線沒有重算它們。

### 4.4 空間基準（抽屜內的第二個視角）

```
geoRatio = rate(縣市) / rate(全國同週同年齡層同病種)
```

實測分布（n = 42,882）：P10 0.25、P25 0.66、P50 0.93、P75 1.19、P90 1.58、P95 2.01。回答「我這裡比全台高還是低」，與趨勢是兩個獨立問題，不合併成一個分數。

### 4.5 狀態與門檻

門檻取百分位，不是手感。常數與其來源百分位一併寫在 `radar.ts`。

**語氣是這一節的硬約束**：這個服務的用途是提醒家長多留意，不是製造焦慮。所以狀態名稱一律用「跟平常比」的日常說法，**不用**「警戒」「升溫」「爆發」「危險」；顏色最強只到 `butter-dark`（既有語意是「溫和警告」），**明確不用** `primary-dark`——那是全 app 最強的文字色，用在「比平常多一點」上會讀成急診警報。

| `status` | 文案 | 條件 | 顏色 | 來源百分位 |
|---|---|---|---|---|
| `risingStrong` | 最近變多，多留意 | `ratio >= 1.77` | `butter-dark` | P90：歷史上只有十分之一的週這麼高 |
| `rising` | 稍微變多 | `1.26 <= ratio < 1.77` | `ink` | P75 |
| `steady` | 跟平常差不多 | `0.78 <= ratio < 1.26` | `ink-muted` | P25–P75 |
| `falling` | 比平常少 | `ratio < 0.78` | `mint-dark` | P25 |
| `noBaseline` | 還不夠資料比較 | `trendBase === null` | `ink-muted` | 前 8 週算不出基線（需至少 6 週有值），見下 |
| `none` | 最近沒有個案 | `trendBase === 0 && rate === 0` | `ink-muted` | 基線為零，比值無意義。2026 W34 在分母 ≥ 1,000 的 330 格中有 **13 格**基線為零，全部是水痘——其中 9 格 `none`、4 格 `emerged` |
| `emerged` | 這週開始出現 | `trendBase === 0 && rate > 0` | `ink` | 從零變成有是資訊，但不能算成倍數 |
| `smallSample` | 樣本偏小，僅供參考 | `reliability === 'small'` | `ink-muted` | 見 §4.6 |
| `insufficient` | 資料不足 | `reliability === 'insufficient'` | `ink-muted` | 見 §4.6 |

**`noBaseline` 與 `none` 必須分開。** 前者是「我們算不出基線」（本週之前 8 週裡有值的週數不足 6），後者是「基線真的是零」。只有後者有資格說「這週開始出現」；把算不出來的格子併進 `none`，等於對家長宣稱那個縣市那個年齡層最近沒有個案，而我們並不知道。`trendBase` 有效但 `ratio` 仍是 `null` 的格子也歸入 `noBaseline`，理由相同：不拿「跟平常差不多」替算不出來的數字背書。shipped 資料目前有 **0 格**落在這個狀態（24 格 `trendBase === null` 全部先被 `insufficient` 接走，因為判定順序是可靠度優先），所以它是潛在而非現行——但不拆這一格，資料稍有變化就會對家長講不實的話。

**四個弱狀態用 `ink-muted`，不用 `ink-faint`。** `ink-faint` 的對比只有 3.2:1，`tailwind.config.js` 在那個 token 上的註解自己寫著「captions, never body text」；而狀態文案是那一列的意義載體，不是說明性小字——`rate` 與 `visits` 都在，唯一告訴家長「這個數字算什麼」的就是那幾個字。`ink-muted` 是 5.4:1、定位為 secondary copy，才是正確層級。`noBaseline` / `none` / `smallSample` / `insufficient` 四個都適用。

**不用箭頭符號。** 文案本身已經帶方向（「變多」「差不多」「比平常少」），再加 `↑↑` 只是把同一件事說兩次，而兩個並排的上升箭頭本身就是警報視覺——正是要避免的東西。這也符合 CLAUDE.md 的「圖示重複相鄰文字就是噪音」。

`buildDiseaseRadar.cjs` 每次執行都重算這些百分位並寫進 JSON 的 `calibration`；一個 vitest 斷言程式碼常數與 shipped `calibration` 的差距 ≤ 0.05。資料分布若隨年份漂移，測試會紅，門檻就必須被重新決定而不是默默失準。

### 4.6 樣本可靠度

小縣市的分母極小：2026 W34 連江縣 0~2 歲的健保門診就診總人次是 **11**，3~6 歲 **29**，7~12 歲 **79**；金門 0~2 歲 **256**。全部 66 格（22 縣市 × 3 年齡層）的中位數是 4,193。

ratio 的離散度（P90 − P10）隨分母單調收斂，實測：

| 分母 | n | P10 | P50 | P90 | 離散度 |
|---|---|---|---|---|---|
| < 100 | 565 | 0.00 | 0.65 | 3.88 | 3.88 |
| 100–300 | 167 | 0.00 | 0.91 | 3.74 | 3.74 |
| 300–1,000 | 2,943 | 0.00 | 0.97 | 2.75 | 2.75 |
| 1,000–3,000 | 7,890 | 0.42 | 1.01 | 2.13 | 1.70 |
| > 3,000 | 29,207 | 0.57 | 1.01 | 1.77 | 1.20 |

分母低於 1,000 時 P10 是 0，也就是超過十分之一的週會是零例，ratio 沒有意義。分級：

| `reliability` | 分母 | 顯示 | 2026 W34 格數 |
|---|---|---|---|
| `ok` | ≥ 1,000 | 亮燈 | 55 / 66 |
| `small` | 300 – 999 | 給數字與人次，標「樣本偏小」，**不亮燈** | 7 / 66 |
| `insufficient` | < 300 | 「資料不足」，不給率也不給燈 | 4 / 66（連江縣三個年齡層、金門 0~2） |

合併 0~2 與 3~6 也救不了：連江縣合併後 40、金門 713，仍低於 1,000。所以據實顯示資料不足，不替它編一個燈。

---

## 5. 資料契約

`public/data/diseaseRadar.json`，由 `scripts/buildDiseaseRadar.cjs` 產生並 commit。

```json
{
  "week": "2026-W34",
  "weekStart": "2026-08-23",
  "weekEnd": "2026-08-29",
  "generatedAt": "2026-09-03T01:07:42Z",
  "verifiedOn": "2026-09-03",
  "source": "衛生福利部疾病管制署 健保門診及住院就診人次統計",
  "sourceUrls": ["https://od.cdc.gov.tw/eic/NHI_EnteroviralInfection.csv", "其餘五支見 §2.1"],
  "license": "政府資料開放授權條款-第1版",
  "diseases": ["腸病毒", "手足口病", "疱疹性咽峽炎", "類流感", "腹瀉", "水痘"],
  "ageBands": ["0~2", "3~6", "7~12"],
  "calibration": { "trendP25": 0.78, "trendP75": 1.26, "trendP90": 1.77, "sampleSize": 48725 },
  "national": { "3~6": { "腸病毒": { "rate": 114.1 } } },
  "counties": {
    "花蓮縣": {
      "3~6": {
        "腸病毒": {
          "rate": 169.0, "trendBase": 79.4, "ratio": 2.13, "geoRatio": 1.48,
          "visits": 35, "denom": 2071, "reliability": "ok",
          "spark": [63.7, 84.3, 38.1, 113.4, 91.8, 74.5, 119.1, 169.0]
        }
      }
    }
  }
}
```

產生規則：

- `week` 取六支資料共同存在的最新一週；任一支缺該週就退到前一週，避免六張卡來自不同週。
- `weekStart` / `weekEnd` 由 ISO 週次換算，畫面上顯示的是日期而不是週號——「第 34 週」對家長沒有意義，「8/23–8/29」有。
- `spark` 固定 8 個元素、**含本週**，缺值填 `null`；`trendBase` 的視窗是本週之前 8 週。兩者差一週是刻意的：基線不能包含被評估的那一週。
- `trendBase` 為 0（前 8 週皆無個案）時，`ratio` 與 `geoRatio` 皆為 `null`，`status` 改用 §4.5 的 `none`（最近沒有個案）／`emerged`（這週開始出現）。`trendBase` 為 `null`（前 8 週有值的週數不足 6，算不出基線）時 `status` 是 `noBaseline`（還不夠資料比較）——與基線真的是零不是同一件事，見 §4.5。
- `national` 節點含 3 年齡層 × 6 病種的全國就診率，供 `geoRatio` 與抽屜的全國比較使用。
- `reliability` 為 `insufficient` 時，`rate` / `trendBase` / `ratio` / `geoRatio` 一律 `null`，只留 `visits` 與 `denom`。不留半個數字讓 UI 自己猜。
- `verifiedOn` 由腳本寫入當日日期，直接滿足 `src/common/dataFreshness.test.ts` 的規則（`查證|查核|verifiedOn|dateModified` 後 60 字內要有 `YYYY-MM-DD`）。**這份新資料檔不進 `UNDATED` 豁免名單**——那份名單只能變短。
- 任一支 CSV 抓取失敗或解析出 0 列 → 腳本以非零狀態結束、不寫檔。Workflow 因此不會 commit，線上維持上一週。

`src/littleguard/data/diseases.ts` 另存六種病的家長向說明，每筆必須有六個欄位：`name`、`meaning`（這個名字在上游資料裡指什麼，一行）、`actions`（可以做什麼，2–3 條）、`seeDoctor`（什麼情況要看醫生，一行）、`sourceUrl`（疾管署引用頁，**六筆的網址已查證並列在附錄 A**）、`verifiedOn`。contract test 強制六個欄位皆非空、且 `actions` 至少兩條——`actions` 是 §6.1 第 2 條「每一個『變多』都必須同時給得出可以做什麼」的資料層保證，缺了它整個語氣就垮了。這裡不寫醫療建議，只寫日常可做的事與就醫指標，並連到疾管署。

---

## 6. 頁面規格

```
AppBar（LittleGuard / 疫情雷達）
┌────────────────────────────────────────────────────┐
│ 8/23–8/29 · 疾管署健保門診就診統計                  │ ← 永遠在最上面
├────────────────────────────────────────────────────┤
│ [花蓮縣] [台北市] [新北市] …                  ⊙定位 │ ← 22 顆，橫向滑動
│ [0-2 歲] [3-6 歲] [7-12 歲]                         │
├────────────────────────────────────────────────────┤
│ 腸病毒          最近變多，多留意   169/萬   35 人次  │
│ 手足口病        最近變多，多留意    72/萬   15 人次  │
│ 疱疹性咽峽炎    稍微變多            97/萬   20 人次  │
│ 類流感          比平常少           314/萬   65 人次  │
│ 腹瀉            跟平常差不多       251/萬   52 人次  │
│ 水痘            最近沒有個案          —      0 人次  │
├────────────────────────────────────────────────────┤
│ 這是健保門診的就診人次，用來提醒你多留意；它不是確診  │
│ 數，也不代表你的孩子會生病。身體不舒服請看醫生。      │
└────────────────────────────────────────────────────┘
```

### 6.1 文案與語氣原則

這一節是 §4.5 語氣約束的完整版，實作時每一條都可被 review 拿來檢查：

1. **主詞是「最近」或「這週」，不是「你的孩子」。** 板上講的是縣市層級的就診統計，不是對某個孩子的預測。文案一旦寫成「你的孩子要小心」就越界了。
2. **每一個「變多」都必須同時給得出「可以做什麼」。** 只講風險不講行動，就是製造焦慮。`risingStrong` 與 `rising` 的卡片點開後，抽屜第一段就是可做的事（見下）。
3. **禁用詞**：警戒、升溫、爆發、危險、疫情嚴峻、拉警報、恐、慎防。
4. **數字不放大。** 就診率與人次維持本文字級，不加驚嘆號、不加紅色、不加百分比漲幅的大字。
5. **顏色最強只到 `butter-dark`。** 不使用 `primary-dark`。
6. **不用箭頭、不用警示三角、不用紅點 badge。** 這個服務不搶注意力，它在被打開時才說話。
7. **降級與空狀態也照這個語氣**（見 §7）：資料舊了就說「這份資料有點舊了」，不說「資料異常」。

### 6.2 版面規則

- 六張卡用既有 `.card-tap`；排序固定（不依狀態重排），因為家長是在找特定的病，位置跳動會讓人找不到。**特別是不把「變多」的排到最前面**——那會讓每次打開都像在看壞消息排行榜。
- chip 列用既有 `useCentreSelectedChip`，把選中的那顆滾到中間——預設選項不是第一顆時，390px 下它會落在畫面外。
- 定位鈕沿用 `BabyOasisPage.tsx:481-490` 的模式：沒有 `geolocation` 就 toast，不靜默失敗。座標對縣市用 `countyCentroids.ts`（22 縣市中心點，取最近者）。
- 抽屜用既有 `ModalFrame` + `motion.ts` 的 `sheet` / `backdrop`，`max-h-[85vh] overflow-y-auto`。內容依序是：
  1. **這個名字在資料裡是什麼意思**（一行，附錄 A 的落差表）
  2. **可以做什麼**（2–3 條平常做得到的事，例如勤洗手、玩具與餐具清潔、生病時不上學不上課；來源為附錄 A 的疾管署 Q&A 頁）
  3. **什麼情況要看醫生**（該病的就醫指標，同樣引自疾管署）
  4. 8 週 sparkline（inline SVG，`viewBox` + `w-full`，無固定像素寬高）
  5. 與全國同週的比較（`geoRatio`）
  6. 分母與樣本可靠度說明
  7. 前 5 年同週脈絡（附 NPI 註記）
  8. 疾管署該病介紹連結
- 順序是刻意的：**先給行動，再給數字**。數字放前面會讓家長先嚇一跳再才知道能做什麼。
- 率、人次、分母三者都要出現。只給率會被問「那是幾個人」，只給人次會被跨縣市誤比。
- 圖示只出現在定位鈕上（它的圖示是它的全部標籤）。狀態不用圖示、標題旁不放圖示。
- 全部在 390px 下檢查，chip 在 320px 下檢查。

---

## 7. 新鮮度降級階梯

`age = 今天 − weekEnd`

| 條件 | 行為 | 文案 |
|---|---|---|
| `age <= 14 天` | 正常 | 週次帶顯示日期區間與「疾管署健保門診就診統計」 |
| `14 < age <= 35 天` | 板照常顯示（stale beats blank），加一行說明 | 「這份資料有點舊了，最新一週是 8/23–8/29」 |
| `age > 35 天` | **狀態文案全部收起**，只留數字與週次 | 「這份資料超過一個月沒更新，最新情況請看疾管署」＋連出去 |
| 檔案抓不到 / 解析失敗 | `EmptyState`，不顯示空板也不假裝有資料 | 「現在抓不到資料，可以先看疾管署的傳染病統計」＋連出去 |

門檻的由來：更新週期是 7 天，14 天等於連續兩週沒進來（異常但可能是上游延遲）；35 天等於五週，那時候的「上週」已經與現況無關，一個可能已經錯的狀態比沒有狀態更糟。

降級文案同樣受 §6.1 語氣原則約束：說「有點舊了」而不是「資料異常」，說「可以先看疾管署」而不是「請以官方為準」——後者聽起來像免責聲明，前者是幫忙。

---

## 8. 接入點與檔案清單

### 8.1 新增

```
scripts/buildDiseaseRadar.cjs                抓 6 支 CSV、聚合、算百分位、寫 JSON
scripts/data/twca-ssl-ca.pem                 中介憑證
scripts/data/twca-cyber-root.pem             根憑證
.github/workflows/refresh-disease-radar.yml  只能手動觸發，有 diff 才 commit 到 master
public/data/diseaseRadar.json                產生物，committed
src/littleguard/pages/RadarPage.tsx
src/littleguard/components/DiseaseRow.tsx
src/littleguard/components/DiseaseDrawer.tsx
src/littleguard/components/CountyPicker.tsx  含定位鈕
src/littleguard/data/diseases.ts             六種病的家長向說明，帶出處與查證日期
src/littleguard/data/countyCentroids.ts      22 縣市中心座標
src/littleguard/utils/radar.ts               門檻常數、燈號判定、新鮮度分級、格式化
```

### 8.2 修改

| 檔案 | 改什麼 |
|---|---|
| `src/types/routes.ts` | `ROUTE_PATH` 加 `littleguard`；`Page` 型別由它推導 |
| `src/common/routePolicy.ts` | `PUBLIC_PAGES` 加一筆、`SERVICE_HOME` 加一筆、`serviceOf()` 加分支——**它最後一行是 `return 'babyoasis'` 的 fallthrough，不改會把新頁面誤判成 BabyOasis** |
| `src/common/ui/serviceTheme.ts` | `SERVICE_THEME` 加 LittleGuard |
| `tailwind.config.js` | `guard` ramp 五個 token |
| `src/common/landing/HubLanding.tsx`、`serviceCopy.ts` | 首頁六宮格與服務文案 |
| `src/App.tsx` | lazy route |
| `src/common/seo/pageMeta.ts` | 新頁 meta（`staticHead` 的 sitemap 與 robots 由路由表自動帶出，不必手動維護） |
| `README.md`、`.claude/CLAUDE.md` | 「五個服務」→ 六個；架構圖加 `littleguard/` |

**`vite.config.ts` 不需要改**：`workbox.globPatterns` 已含 `json`，`globIgnores` 只排除 `nursingRooms.json`，所以 68.5 KB（gzip 14.7 KB）的 `diseaseRadar.json` 自動進 precache，板離線可用（`vite.config.ts:92-95`）。

### 8.3 順帶修掉的既有問題

`ServiceId` 這個 union 目前在 `src/common/routePolicy.ts:3` 與 `src/common/ui/serviceTheme.ts:20-25` **各寫了一份**。加第六個服務要改兩處且必須手動保持同步。改成 `routePolicy.ts` 直接 `import type { ServiceId } from './ui/serviceTheme'`，刪掉第二份事實來源。範圍限於這兩行，不做其他重構。

---

## 9. 測試策略

| 測試 | 斷言 |
|---|---|
| `src/littleguard/data/diseaseRadar.contract.test.ts` | 讀真的 `public/data/diseaseRadar.json`：22 縣市 × 3 年齡層 × 6 病種齊全；`ratio` 與 `rate / trendBase` 相符（浮點容忍）；`reliability` 與分母門檻一致；`spark.length === 8`；`week` 符合 `YYYY-Wnn`；`verifiedOn` 存在且不是未來日期；`insufficient` 與 `trendBase === 0` 的格子 `ratio` 為 `null` |
| `src/littleguard/data/diseases.test.ts` | 六筆說明的 `name` / `meaning` / `actions` / `seeDoctor` / `sourceUrl` / `verifiedOn` 皆非空，且 `actions` 至少兩條 |
| `src/littleguard/utils/radar.test.ts` | `status` 邊界（1.769 → `rising`、1.77 → `risingStrong`、0.779 → `falling`、0.78 → `steady`）；`trendBase === null` 與 `ratio === null` 的 `noBaseline`；`trendBase === 0` 的 `none` / `emerged` 兩種；`small` 與 `insufficient` 的處理；新鮮度三段門檻（14 / 35 天邊界） |
| 校準測試（同上檔） | `RADAR_THRESHOLDS` 常數與 JSON `calibration` 差距 ≤ 0.05 |
| 語氣測試（同上檔） | §6.1 第 3 條的禁用詞（警戒／升溫／爆發／危險／疫情嚴峻／拉警報／慎防）不出現在任何 `status` 文案與降級文案裡；`STATUS_COPY` 的顏色不含 `primary-dark` |
| `src/littleguard/pages/RadarPage.test.tsx` | 切換 chip 換內容；抽屜開關且「可以做什麼」排在數字之前；注入過期 JSON 時出現降級訊息且狀態文案消失；`insufficient` 格顯示「資料不足」；抓檔失敗顯示 `EmptyState`；卡片順序不隨 `status` 重排 |
| 既有測試補一筆 | `routePolicy.test.ts`、`App.routing.test.tsx`、`serviceCopy.test.ts`、`HubLanding.test.tsx`、`designSystem.test.ts` |

表上列的是每個檔案至少要守住的斷言，不是全部：實作後 `src/littleguard` 共 9 個測試檔、181 個測試。

不測：顏色值、文案字串、SVG path、以及 `dataFreshness.test.ts` 本身（它會自動涵蓋新檔案）。

`npm run test:rules` 不需要執行——本案不動 `database.rules.json`。

---

## 10. 非目標

- **不做即時疫情**。資料粒度是週，落後 3–9 天，任何「今日確診」的暗示都是錯的。
- **不做確診數**。這是健保門診就診人次，不是通報確診。
- **不做醫療建議**。抽屜只寫日常可做的事與「哪些狀況該就醫」，並連向疾管署。
- **不做地圖**。22 顆 chip 已經覆蓋全國，加 Leaflet 只會讓 gzip 14.7 KB 的板變重。
- **不做推播通知，也不做紅點 badge**。全 repo 沒有通知機制；而且主動推「某個病變多了」正是 §6.1 要避免的事——這個服務在被打開時才說話。
- **不做急診資料（`RODS_*`）**。沒有分母，跨縣市不可比。
- **不做個人化**。見 §3.1。
- **不做鄉鎮市區層級**。上游只給到縣市。

---

## 11. 實作階段切分

四個階段。階段 1 與階段 2 互不相依，可並行；階段 3 依賴 1 與 2；階段 4 依賴 3。

1. **資料管線**：`buildDiseaseRadar.cjs` + 兩張憑證 + 首次產出 `diseaseRadar.json` + `diseaseRadar.contract.test.ts`。驗收：`node scripts/buildDiseaseRadar.cjs` 產出通過 contract test 的 JSON，且 TLS 驗證未被關閉。
2. **服務骨架**：路由、`routePolicy`（含 `serviceOf()` 分支與 `ServiceId` 去重）、`serviceTheme`、`guard` ramp、HubLanding 六宮格、`pageMeta`、既有測試補筆。驗收：`/littleguard` 可深連結進入、未登入可見、`npm run lint` 零警告、`npx vitest run` 全綠。
3. **板與狀態**：`radar.ts`（含 `STATUS_COPY` 與禁用詞測試）、`DiseaseRow`、`CountyPicker`、`RadarPage`、新鮮度降級、`radar.test.ts`、`RadarPage.test.tsx`。驗收：390px 下實際看過六張卡與三段降級狀態，且畫面上沒有任何紅色系文字、箭頭或驚嘆號。
4. **抽屜與病種說明**：`DiseaseDrawer`、sparkline、`diseases.ts`（六欄位，出處用附錄 A 已查證的網址，查證日期 2026-09-03）、`diseases.test.ts`。驗收：390px 下實際開過抽屜，六筆都有「可以做什麼」且排在數字之前，六筆都有可點的疾管署連結與該病名在上游資料裡的定義。

更新流程在階段 1 完成後即可使用，且第一次 commit 必須由人手動確認 diff 內容。（原文寫的是「開啟排程」；排程在實作後證明不可行，見 §3.3。）

---

## 附錄 A：`diseases.ts` 的引用頁與名稱落差

2026-09-03 查證，七個網址全部逐一抓取並以 `<title>` 確認身分，皆回 200。

| 板上病名 | 疾管署引用頁（`sourceUrl`） | 補充 Q&A |
|---|---|---|
| 腸病毒 | [腸病毒感染併發重症](https://www.cdc.gov.tw/Disease/SubIndex/m3zdUk3u9GJVvddeSnhkiA) | [腸病毒 Q&A](https://www.cdc.gov.tw/Category/QAPage/uWGc1UXjKbX7uC1uTG5_2Q) |
| 手足口病 | 同上（無獨立條目） | 同上 |
| 疱疹性咽峽炎 | 同上（無獨立條目） | 同上 |
| 類流感 | [流感併發重症](https://www.cdc.gov.tw/Disease/SubIndex/x7jzGIMMuIeuLM5izvwg_g) | [季節性流感防治](https://www.cdc.gov.tw/Category/QAPage/DQWXG19u2cXMH1jwGKXHug) |
| 腹瀉 | [病毒性腸胃炎](https://www.cdc.gov.tw/Disease/SubIndex/j1rqZjBCeR9vtCRUHefN3g) | [病毒性腸胃炎 Q&A](https://www.cdc.gov.tw/Category/QAPage/h5jfdG8vi3tGUDO8fNAoFQ) |
| 水痘 | [水痘併發症](https://www.cdc.gov.tw/Disease/SubIndex/ipoIA74yjikLAewcRSjXjw) | — |

**上游 dataset 名稱與疾管署疾病介紹不是一對一，抽屜必須寫明落差，不能讓使用者以為是同一件事：**

| 落差 | 內容 |
|---|---|
| 腸病毒 | 板上是**所有腸病毒門診就診**；引用頁是法定傳染病「腸病毒感染併發重症」，只涵蓋重症。範圍差很多 |
| 手足口病、疱疹性咽峽炎 | 疾管署「傳染病介紹」索引裡**沒有**這兩個獨立條目（實查 `https://www.cdc.gov.tw/Disease/Index`，只有「腸病毒」與「水痘」等法定傳染病）。它們是腸病毒的臨床表現，引用頁同腸病毒 |
| 類流感 | 類流感（ILI）是**症候群定義**（發燒加呼吸道症狀），不等於流感確診；引用頁是「流感併發重症」 |
| 腹瀉 | 板上是**所有腹瀉門診**，病因不限病毒；病毒性腸胃炎只是主要病因之一 |
| 水痘 | 板上是所有水痘門診；引用頁是法定傳染病「水痘併發症」 |

這張表也是 §10「不做確診數」在文案層的落實：六個病名一律以「就診人次」描述，抽屜第一行寫清楚該病名在上游資料裡的定義。
