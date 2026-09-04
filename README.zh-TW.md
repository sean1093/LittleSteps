# LittleSteps

[English](README.md) · **繁體中文**

> 六個服務，陪台灣的爸媽從懷孕一路走到幼兒期。
> 一個 mobile-first 的 PWA，涵蓋孕期、寶寶的第一年、幼兒階段、出門在外要找
> 地方餵奶時該去哪，以及這禮拜你住的縣市正在流行什麼。

<div align="center">

[![Deploy to Firebase Hosting](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/sean1093/LittleSteps/actions/workflows/firebase-hosting-merge.yml)

[線上版](https://littlesteps-c6ab6.web.app) · [問題回報](https://github.com/sean1093/LittleSteps/issues)

</div>

---

## 六個服務

`/#/` 這個入口頁列出六個服務。它們共用一套設計系統、一套登入授權模型和一層
資料層；各自保有自己的配色與導覽形狀。

| | 服務 | 階段 | 導覽 |
|---|---|---|---|
| 🌸 | **LittleBloom** | 孕期 · 第 0-40 週 | 中心頁 + 返回鍵 |
| 🍼 | **LittleSteps** | 新生兒 · 0-12 個月 | 側邊欄，12 條路由 |
| ☀️ | **LittleExplorer** | 幼兒 · 1-3 歲 | 4 個底部分頁 |
| 🌳 | **LittleOuting** | 不限 | 頁內 3 個分頁 |
| 📍 | **BabyOasis** | 不限 | 全螢幕地圖 |
| 🛡️ | **LittleGuard** | 不限 | 單一看板 + 抽屜 |

### LittleBloom — 孕期陪伴
- **每週孕期指南** — 逐週的身體變化，以及該注意什麼
- **產檢時程** — 14 次公費產檢，可記下日期與院所
- **孕期知識庫** — 24 篇文章：原因、該怎麼做、什麼時候要就醫
- **登記出生** — 把孕期檔案轉成寶寶檔案，一個家庭就是靠這一步從 LittleBloom 走到 LittleSteps

### LittleSteps — 寶寶成長追蹤
- **成長總覽** — 一個畫面總結里程碑、疫苗、睡眠、尿布與飲食
- **里程碑追蹤** — 33 個里程碑，涵蓋身體、動作、認知與餵食
- **疫苗追蹤** — 依衛福部時程的 32 劑（21 劑公費、11 劑自費），附副作用與緊急處理指引
- **快速日誌** — 餵奶、睡眠、尿布，點兩下就記完
- **睡眠分析** — 從日誌看出作息型態、品質評分與建議
- **睡眠指南** — 0 到 3 歲的睡眠需求、安全守則與訓練方法
- **成長曲線圖** — 體重、身高、頭圍的 WHO 曲線（P3/P15/P50/P85/P97）
- **副食品指南** — 分階段的副食品進程，加上 4×3 過敏原導入法與逐項食物的嘗試記錄
- **照顧重點** — 依月齡該做的照顧與安全提醒
- **寶寶百科** — 15 個常見健康問題
- **看診摘要** — 產出一份可以直接交給小兒科醫師的摘要
- **週報 / 月報** — 趨勢與發展洞察

### LittleExplorer — 幼兒陪伴
- **成長檢核** — 12-36 個月分五個階段共 30 項檢核，另有一張乳牙圖
- **照護提醒** — 從出生日期排出健檢、疫苗與塗氟的時程，可匯出到行事曆
- **成長日記** — 可以寫自由文字並標上心情，記那些永遠不會變成資料的事
- **幼兒百科** — 45 篇文章，談如廁訓練、語言、情緒、挑食、生病，以及家庭醫藥箱
  該備什麼，並依孩子的年齡階段篩選

### LittleOuting — 帶孩子出門的地方
- **全台 22 縣市共 234 間公共親子館**，由一支納入版控的腳本，從衛福部社家署
  公布的全國名單建出來，另外把台北市的 13 間育兒友善園單獨列開，因為那是
  不同的計畫
- 各縣市的使用規則 — 免費或收費、可入場年齡、怎麼預約、設籍限制 — 每一條都
  有自己的來源與查核日期，而那 18 個沒有公布規則的縣市，會明確標成「未查核」
- **12 間親子餐廳**，逐間人工查核，並且明講這是樣本而不是名錄：台灣沒有官方的
  親子餐廳資料集，也沒有認證制度，而觀光署的全國餐廳資料裡那個 Kids-Friendly
  欄位，3,632 筆全部是空的
- 一份出發前檢查清單 — 決定一趟出門順不順的那十一個問題
- 刻意不做地圖：官方的親子館資料來源都不帶座標，而把台灣的門牌地址拿去做
  地理編碼，試過之後被否決了（見下）

### BabyOasis — 哺乳室地圖
- **全台 22 縣市共 3,852 間哺乳室**，來自衛福部開放資料
- 定位搜尋會回傳 10 公里內最近的 8 間，附上實際距離
- **選一站就回答「這一站附近有什麼」**：全台 260 個捷運與輕軌車站，選定之後
  列出 800 公尺內最近的 8 處，附上步行距離。那才是家長真正在排的行程，而定位
  鈕回答不了——手機只知道你現在在哪。哺乳室資料裡只有 56 處的登記名稱帶
  「捷運」，遠少於實際站數，所以站點座標取自 OpenStreetMap（ODbL），不是從
  場所名稱推。800 公尺是量出來的：260 站裡有 246 站在這個半徑內至少有一處，
  平均 7 處
- 先選縣市再選鄉鎮市區，每一區都帶著自己的哺乳室筆數：3,852 處分佈在 364 個
  鄉鎮市區，攤成一張平面清單就是 364 顆 chip
- 六顆場所類型 chip：百貨・賣場、車站・機場、醫院・衛生所、公園・戶外、
  圖書館・展館、親子館・社福
- **3,852 處裡有 2,792 處在依法應設置哺集乳室公共場所名單上**，其餘 1,060 處
  是自願設置。資料本身沒有場所類型欄位，兩類在地圖上長得一模一樣，所以那份
  名單是唯一有來源可依據、分得出百貨公司與工廠員工餐廳的方式
- 474 處讀起來只給員工或學生用 — 228 處公司行號、246 處校園，而且全都不在名單
  上。它們會標成「內部場所」而不是藏起來：場所類型是從登記名稱推論出來的，
  預設就藏掉一間真實存在的哺乳室是更糟的那種錯。按一下「排除內部場所」就會把
  這 474 處收掉
- 973 處的注意事項寫著要洽服務台，會標成「需洽服務台」，家長因此知道要先問人，
  而不是去找一扇打不開的門
- 設備、開放時間、電話，以及一鍵轉手給 Google Maps
- 標記分群搭配空間索引，所以全國這麼大的資料量在任何縮放層級都還能用

### LittleGuard — 疫情雷達
- **六種兒童常見傳染病**，上游各一支資料（腸病毒、手足口病、疱疹性咽峽炎、類流感、腹瀉、水痘）：每週門診就診數，分成 22 個縣市與三個年齡層（0-2 / 3-6 / 7-12）
- **板上是四列，不是六列**：手足口病與疱疹性咽峽炎是腸病毒感染的兩種臨床表現，而上游腸病毒那一支剛好就是兩者相加 — 66 格（22 縣市 × 3 年齡層）裡的人次、率與 8 週折線的每一點都相同。三列並排等於把同一批門診就診人次數了三次，所以板上只列腸病毒一列，兩種表現收在它的抽屜裡；哪天上游不再是精確的拆分，守著這個關係的測試會先變紅，而不是讓板繼續說一句不成立的話
- 狀態是拿一個縣市跟**它自己的前 8 週**比，而不是跟往年的同一週比：2020-2022 年的防疫措施幾乎把腸病毒抹平，所以用五年同週當基準線，會讓每一週都看起來不正常
- 門檻是實測分布的百分位數（P25 0.78 / P75 1.26 / P90 1.77，n=48,725），每次重建都會重新算進 JSON，所以程式裡的常數一旦跟資料脫節，測試就會變紅
- 九種狀態，其中 `noBaseline`（資料不足以比較）刻意跟 `none`（近期沒有病例）分開：「前 8 週算不出基準線」和「基準線真的是零」是兩件不同的事，而只有後者才撐得起「這禮拜開始出現」這句話
- 分母太小的格子會顯示「樣本過小」或「資料不足」，而不是硬給它一個編出來的狀態 — 連江縣和金門 0-2 歲的每週就診數是兩位數
- **板會先解釋自己，才開始給數字**：縣市籤上面有一段簡短的說明，板上面有一句話直接回答所選縣市與年齡層的整塊板 — 哪幾種比平常多、都沒有，或是這個縣市小到根本比不出來。資料過期時這句話就不給，因為過期的板撐不起它；而只有在剩下每一列都真的比得出來的時候，它才會說「其他沒有變多」
- **一列先講白話，不是先給率**：板上給的是這一週的就診人次，抽屜一打開是兩句話 — 這個縣市、這個年齡層這一週有幾次就診、跟它自己的前 8 週比多還是少，以及跟全國同一週相比偏多還是偏少。率（每萬次門診）、前 8 週中位數、全國同一週與分母都收在預設收起來的「詳細數字」裡：「423.0/萬」是統計人員的單位，同一件事不用它也講得清楚。跟全國比的門檻一樣是實測百分位數（P25 0.66 / P75 1.19）
- 語氣是刻意收斂的：請注意這件事，但不必為它慌張。每一句「比平常多」都會附上一件家長可以做的事，而它用到最重的顏色就是 `butter-dark`

---

## 帳號與資料

**凡是讀取或寫入孩子紀錄的功能，都必須登入。** 知識類的內容不用。

`src/common/routePolicy.ts` 放的是一份**公開頁允許清單**，刻意不是一份「需要
登入」的封鎖清單：這個 app 存的是孩子的健康資料，所以新頁面忘了標記時，應該
要往關閉的那一邊倒。公開的頁面是入口頁、三個知識庫、照顧重點、睡眠指南、
LittleOuting、BabyOasis 和 LittleGuard。其他全部都要帳號。

未登入的訪客走到需要登入的路由時，會在同一個 URL 上看到那個服務的介紹頁 —
路徑被保留下來，所以登入之後他們就直接落在原本要去的地方。

- **登入**：Firebase Authentication，Google 登入
- **資料庫**：Firebase Realtime Database（asia-southeast1）
- **同步**：跨裝置即時同步
- **分享**：孩子的檔案透過一組專屬代碼分享給家人，而且分享可以收回 — 見下
- **限制**：免費方案每個帳號 2 個孩子

### 分享，以及把它收回

成員名單放在 `children/$childId/members`，是在孩子節點裡面，而不是在各個帳號
裡面。這正是它的重點所在：既有成員可以移除另一個成員。`joinOpen` 則另外決定
拿到代碼的人能不能把自己加進來，所以一組已經被傳出去的代碼可以被關掉，而不會
動到任何已經在裡面的人。

這些加起來的結果，由 `npm run test:rules` 對著模擬器逐條驗證：

- 既有成員可以移除另一個成員
- 被移除的成員在 `joinOpen` 是 `false` 的時候，無法把自己重新加回來
- `createdBy` 那個使用者自己的成員身分完全不能被刪除 — 就是這一條讓孩子節點
  不會落到沒有任何成員、誰都碰不到的狀態
- 任何成員實際上都等於擁有者。Realtime Database 無法收回在上層節點已經授予的
  寫入權限，所以一個成員可以寫孩子底下的任何東西，包括成員名單本身。這是刻意
  的取捨：讓兩個家長各自都能把對方從共用的紀錄上移除，在這裡的價值大於給他們
  一套誰都沒要求過的角色階層。

### 資料庫結構

```
users/$uid                 email, displayName, childrenIds, currentChildId
                           childrenIds 只是這個帳號要訂閱的孩子清單，
                           授權看的是下面的 members
children/$childId          id, name, birthday, gender, createdAt, createdBy,
                           isPregnancy, pregnancyData
                           members/$uid: true      授權
                           joinOpen                持有代碼的人可以加入嗎？
                           milestoneProgress, vaccineProgress, toothProgress,
                           developmentProgress, prenatalProgress,
                           careTaskProgress, foodTrackingProgress
childRecords/$childId      dailyLogs/$logId        type (feeding|sleep|diaper),
                                                   timestamp, details
                           diaryEntries/$entryId   date, content, mood
                           growthRecords/$recordId date, weight, height,
                                                   percentile
childIndex/$childId        true — 公開的存在索引，讓用代碼加入時
                           永遠不必去讀陌生人的孩子節點
feedbacks/$feedbackId      title, content, userId, timestamp
```

孩子節點放的是「這個孩子是誰」，再加上對固定清單的進度 — 33 個里程碑、32 劑
疫苗、30 項成長檢核 — 所以它的大小是有上限的。`childRecords` 底下那三個集合
沒有上限：每換一次尿布就多一列，永無止盡。它們被放在旁邊的兄弟子樹裡，因為
孩子的監聽器訂閱的是整個 `children/$childId` 節點，日誌放在裡面的時候，換一次
尿布就會把這個孩子的全部歷史重新下載給每一位家人。

存取權限由 `database.rules.json` 落實 — `childRecords/$childId` 和
`childIndex/$childId` 兩者都是透過 `children/$childId/members` 判斷。權威的
規則看那個檔案，而這些規則被斷言要做到什麼，看 `scripts/testRules.cjs`。

---

## 設計系統

所有視覺都出自同一個地方。其中最重要的一條規則：

> **粉彩色階是填色。文字要用該色階可讀的那一支：四組基礎色階用 `-dark`，
> `bloom.*` / `explorer.*` / `outing.*` 用 `-ink`。**

粉彩色對白色大約只有 2:1。拿來當文字、或者拿來墊白字，都是讀不出來的，而在這
條規則被寫下來之前，它們就是這樣被用的 — 主要按鈕上的字是整個畫面上最難讀的
文字。

`bloom.*` 和 `explorer.*` 是陷阱：在那裡 `-dark` 是給 hover 和邊框用的*更深的
填色*，在白底上量出來是 2.44–3.72:1（`explorer-sunbeam-dark` 2.44、
`bloom-dusty-rose-dark` 2.98、`bloom-sage-dark` 3.01），所以這兩套配色裡的文字
一律用 `-ink`。

### 配色 — `tailwind.config.js`

| 色階 | 填色（裝飾用，絕不當文字） | 文字（≥4.5:1） | 用於 |
|---|---|---|---|
| `primary` | `#FF9B9B` | `primary-dark` `#B84A50` | LittleSteps，以及 app 自己的品牌色 |
| `secondary` | `#7EC8E3` | `secondary-dark` `#2A7288` | BabyOasis、資訊性的強調 |
| `mint` | `#81C784` | `mint-dark` `#3F7D43` | 疫苗、「完成」與「安全」 |
| `butter` | `#F0B357` | `butter-dark` `#9A6212` | 飲食、尿布、溫和的警示 |
| `bloom.*` | 莫蘭迪色**以及每一個 `-dark`** | `*-ink`（`bloom-dusty-rose-ink` `#855F5F`）、`*-deep` | LittleBloom |
| `outing.*` | `#5FC0B5` | `outing-ink` `#1F7A70`、`outing-deep` `#14655C` | LittleOuting |
| `explorer.*` | 明亮色**以及每一個 `-dark`** | `*-ink`、`bark` | LittleExplorer |

`ink` / `ink-muted` / `ink-faint` 分別是正文、次要與說明文字 — 在 `warm-white`
（`#FDFBF7`）這個唯一的頁面底色上，它們比 `gray-*` 更暖。

### 共用 class — `src/index.css`

- `.card` — 清單裡的一列 · `.panel` — 頁面裡的一個區塊 · 互動版本用 `.card-tap` / `.panel-tap`
- `.screen` + `.screen-body` / `.screen-body-wide` — 頁面外殼與欄寬
- `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-icon` — 全部 ≥44px
- `.chip` + `.chip-on` — 篩選 chip，≥44px
- `.tag`、`.row-bleed`、`.scrollbar-hide`、`.min-h-dscreen`
- `h1`–`h4` 都有基礎字級，因為 Preflight 會把標題重設成 `inherit`

兩種陰影（`shadow-soft`、`shadow-soft-lg`）和兩種圓角（`rounded-2xl`、
`rounded-3xl`）。如果你需要第三種，那是設計錯了。

### 共用元件 — `src/common/ui/`

| 檔案 | 用途 |
|---|---|
| `serviceTheme.ts` | `SERVICE_THEME[id]` — 唯一一個會依服務而變的東西 |
| `AppBar.tsx` | 唯一的頁面標題列，固定 `h-16`；要黏在它下面的東西用 `top-16` |
| `EmptyState.tsx` | 唯一的「這裡還沒有東西」區塊；除非那個時刻值得，否則**不畫任何 icon** |
| `motion.ts` | `stagger` `listItem` `fadeInUp` `sheet` `backdrop` `collapse` `tap` `hoverLift` |

### 原則

- **Mobile-first。** 從手機往上放大；絕不把桌機尺寸寫成基準。
- 任何可點擊的東西**最小 44px**。不要把小的點擊目標包在大的裡面。
- **icon 必須自己掙到位置。** 重複旁邊文字的 icon 就是雜訊。把它們留給按鈕、導覽目的地、開關、狀態，以及長清單裡每一列的標記。不要在標題旁邊放一個。
- **層級靠字體與間距撐起來**，不是靠色塊，也不是靠徽章。
- **動效是被感覺到的，不是被觀賞的。** 進場要短、位移要小、不要有東西一直循環。`prefers-reduced-motion` 在全域就被尊重。
- **元件裡不寫 hex 字面值。** 如果一個顏色不是 token，就去加一個 token。

---

## 技術堆疊

**前端** — React 18、TypeScript（strict）、Vite 5、Tailwind CSS、Framer
Motion、Lucide icons、React Hooks + Context、Leaflet 加上分群。

**後端** — Firebase Authentication、Realtime Database 與 Analytics。

**工具** — Vitest + Testing Library、ESLint、Husky pre-commit、
`vite-plugin-pwa`、GitHub Actions。

---

## 開始開發

需要 Node 18+。

```bash
git clone https://github.com/sean1093/LittleSteps.git
cd LittleSteps
npm install
```

建立 `.env`（範例看 `.env.example`；絕對不要 commit 它）：

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_FIREBASE_DATABASE_URL=
```

```bash
npm run dev            # http://localhost:5173
npm run build          # tsc && vite build
npm run preview
npm run lint
npm run test           # watch 模式
npm run test:coverage
npm run test:rules     # 用 Database 模擬器驗 database.rules.json
```

`npm run test:rules` 會透過 `firebase emulators:exec`，把 `scripts/testRules.cjs`
跑在 Database 模擬器上，所以它需要 JDK：`brew install openjdk`，而因為那個
formula 是 keg-only，`/opt/homebrew/opt/openjdk/bin` 必須在 `PATH` 上，不然
模擬器會找不到 `java`。每次改完 `database.rules.json` 都要跑一次 — 這是唯一能
讓你發現自己剛剛把一家人擋在孩子的健康紀錄外面、或是把紀錄開放給陌生人的方法。

哺乳室資料集在 `public/data/nursingRooms.json`，由
`scripts/buildNursingRooms.cjs` 重新產生；親子館名單是
`public/data/familyCentres.json`，來自 `scripts/buildFamilyCentres.cjs`。它被
排除在 PWA 預快取之外，改成第一次進地圖時才抓 — 1.1 MB 不該讓一個從來不開
BabyOasis 的人下載。

捷運站清單在 `src/babyoasis/data/mrtStations.json`，由
`scripts/buildMrtStations.cjs` 從 OpenStreetMap 的 Overpass API 重新產生。它
放在 `src/` 裡直接 import 而不是另外抓：22 KB 本來就該待在 BabyOasis 那個
lazy chunk 裡，而選站的選單必須立刻打開。腳本只留帶有 `network` 或 `operator`
標記的車站，未通車的路線因此被排除；輸出裡也刻意沒有路線名 — OpenStreetMap
把轉乘站記成一個節點、只帶一條線的代號，21 個已知轉乘站有 13 個會被標成只有
一半的路線。

疫情雷達的資料在 `public/data/diseaseRadar.json`，由
`scripts/buildDiseaseRadar.cjs` 把衛生福利部疾病管制署（疾管署）的六個 CSV
檔（約 47 MB）彙總成 68.5 KB。gzip 後是 14.7 KB，所以它留在 PWA 預快取裡，
看板可以離線打開。`od.cdc.gov.tw` 送出的憑證鏈不完整，所以腳本自己帶著
`scripts/data/` 底下那兩張 TWCA 憑證；不要用關掉 TLS 驗證的方式來「修」它。

**更新是手動的，一週一次。** 疾管署會在週一或週二一早公布上一週的資料，所以
從週三之後再跑：

```bash
node scripts/buildDiseaseRadar.cjs   # 重建
node scripts/diffDiseaseRadar.cjs    # 0 資料相同 / 1 有變動 / 2 無法比較
```

只有 exit 1 才值得 `git add public/data/diseaseRadar.json` 並 commit。exit 0
的時候跑 `git checkout -- public/data/diseaseRadar.json`，把重建剛剛寫進去的
時間戳丟掉。比較會先把 `generatedAt` 和 `verifiedOn` 剝掉，因為它們每跑一次
就會變，否則每週都會產生一個沒有改到任何資料的 commit。exit 2 代表比較本身
失敗了：停下來看清楚，絕對不要把它當成 1。

`.github/workflows/refresh-disease-radar.yml` 帶著同一套邏輯，但**只能手動
觸發，而且只有在有台灣線路的 runner 上才有用**。從 GitHub 託管的 runner 連
不到 `od.cdc.gov.tw`：兩次 dispatch 都以
`connect ETIMEDOUT 35.229.205.172:443` 收場，連 TCP 握手都沒完成，而同一個
IP 從台灣的機器上是有回應的，兩邊也都解析到同一個位址，所以這是來源 IP 被
封鎖，不是 DNS 依地區分流。現在在 `ubuntu-latest` 上觸發時，它會在大約
20 秒後帶著這個說明停下來，而不是卡上兩分多鐘；把 `runner` 這個輸入指向
台灣的自架 runner 再觸發，這個 job 的其他部分照樣可以跑。

忘記更新是安全的：看板會顯示資料涵蓋到哪一週，而一旦那個時間超過一個月，它會
把這件事講出來，並收掉每一行狀態，只留下數字。

---

## 專案結構

```
src/
├── common/                  六個服務共用
│   ├── ui/                  設計系統：serviceTheme、AppBar、EmptyState、motion
│   ├── components/          Sidebar、ModalFrame、對話框、AppHomeButton、百科瀏覽器
│   ├── landing/             入口頁 + 各服務的介紹頁
│   ├── hooks/               useChildStore 與 Firebase 的孩子資料 hooks
│   ├── utils/               日期、摘要
│   ├── routePolicy.ts       公開頁允許清單
│   └── pregnancy.ts
├── littlesteps/             pages, components/{milestone,vaccine,sleep,growth,
│                            dailylog,food,dashboard,report,shared}, hooks, data
├── littlebloom/             pages, components (BloomShell), data, utils
├── littleexplorer/          pages, components (ExplorerShell, ExplorerTabBar,
│                            ToothChart, AgeBandPicker), hooks, data, utils
├── littleouting/            場館頁 + 卡片、親子館 + 親子餐廳資料、檢查清單
├── babyoasis/               地圖頁、空間索引、資料
├── littleguard/             雷達頁、疾病列 + 抽屜、走勢圖、
│                            狀態門檻、縣市中心點
├── contexts/                AuthContext
├── lib/                     Firebase 初始化
├── types/                   共用型別與路由 union
├── App.tsx                  路由、外殼、頁面 lazy 載入
└── index.css                設計 token 化成 class
```

路由是路徑式的（History API，`firebase.json` 裡有 SPA rewrite），所以每一個
畫面都能分享、也能被爬取。子路由：
`littlesteps/{dashboard,milestones,vaccine-tracking,daily-log,growth-charts,sleep-training,sleep-analysis,complementary-food,care-guide,baby-wiki,clinic-summary,report}`、
`littlebloom/{prenatal,wiki}`、`littleexplorer/{reminders,diary,wiki}`、
`littleouting`、`babyoasis`、`littleguard`。

---

## PWA

可安裝、能離線用、會自己更新。品牌圖檔全部從 `public/favicon.svg` 產生 — 一個
來源生出 favicon、Apple touch icon、192/512 的 PWA 圖示、一個獨立的 maskable
圖示（啟動器會裁成圓形），以及 1200×630 的分享卡。

**iOS** — Safari → 分享 → 加入主畫面。
**Android** — Chrome → 選單 → 安裝應用程式。

---

## 部署

推到 `master` 會透過 GitHub Actions 部署到 Firebase Hosting；pull request 會
拿到一個預覽 URL。環境變數來自 GitHub Secrets。

```bash
npm run build && firebase deploy --only hosting   # 手動
```

### 遷移已上線的資料庫

`scripts/migrateChildRecords.cjs` 是那支一次性的遷移腳本，它把授權搬進
`children/$childId/members`，並把三個會一直長大的集合搬到
`childRecords/$childId`。它在動任何東西之前，會先讀完整個資料庫並寫出
`backups/rtdb-<timestamp>.json`（已 gitignore，權限 600），而且如果那個檔案
寫不出來就拒絕繼續。每個孩子的 `members` 是從「哪些帳號的 `childrenIds` 裡有
這個孩子」算出來的；每個集合都會被複製、讀回、跟來源比對、再確認來源沒有在
這期間被改掉，然後才刪除。它不會替沒有任何人擁有的孩子憑空生出一個成員 —
那個孩子會被回報成需要由人來判斷的孤兒並跳過 — 它也不會覆寫已經存在的
`members` 名單，因為從 `childrenIds` 重算會把某人已經收回的存取權復活。

```bash
node scripts/migrateChildRecords.cjs           # dry run：列出它會做的每一次寫入
node scripts/migrateChildRecords.cjs --apply   # 實際寫入
```

它可以重複執行。已經有 `members`、也沒有舊集合的孩子，會被回報成完成並跳過，
所以被中斷的一次執行，只要再跑同一個指令就能收尾。

順序很重要：

```bash
node scripts/migrateChildRecords.cjs             # 0. dry run，把輸出讀過
firebase deploy --only database                  # 1. 規則
node scripts/migrateChildRecords.cjs --apply     # 2. 遷移
npm run build && firebase deploy --only hosting  # 3. app
```

在部署規則之前先把 dry run 讀過，因為第 1 步會開啟一段什麼都不能用的空窗：
此時還沒有任何孩子有 `members` 名單，所以在第 2 步把它寫進去之前，已上線的
app 既讀不到孩子、也加不了孩子。第 2 步必須在第 3 步之前，因為新版程式在資料
搬完之前去讀 `childRecords`，會完全找不到日誌；而第 3 步必須緊接著做，因為
還開著的舊分頁會把日誌寫回 `children/$childId`，那是新版 app 不會去看的地方。
部署完之後再把遷移跑一次，就會把舊分頁在切換期間寫進去的東西掃乾淨；這就是
「可以重複執行」的用途。

新結構對前端有一個要求：刪除一個孩子**必須**是單一次從根節點展開的 fan-out
更新，在同一次寫入裡把 `children/<id>`、`childRecords/<id>`、
`childIndex/<id>` 和 `users/<uid>/childrenIds/<id>` 全部設成 `null`。
`childRecords` 的授權是透過 `children/<id>/members` 判斷的，而規則運算式裡的
`root` 是寫入*之前*的資料庫，所以把孩子節點放在它自己那一次寫入裡刪掉，會讓
那些紀錄永久失去授權 — 讀不到，也刪不掉。依序分開執行會失敗這件事，在
`scripts/testRules.cjs` 裡有一個測試案例。

---

## 參與貢獻

1. 先讀 `.claude/CLAUDE.md` 和 `.claude/skills/` 裡的 skills。其中兩個講的是
   流程，不是程式：`english-writing`（commit message、PR 內文和文件都用英文；
   `README.md` 和 `README.zh-TW.md` 要一起改）以及 `pr-self-merge`（開分支、
   開 PR、用文字審自己的 diff、修掉它找出來的問題、然後合併）。
2. 遵守上面的設計系統。最該避免的，就是多出第二種畫卡片的方法。
3. Conventional commits：`feat:` `fix:` `refactor:` `style:` `docs:` `test:`
   `chore:`。
4. CI 只會 build PR 並部署一個預覽，所以開 PR 之前，`npm run build`、
   `npm run lint` 和 `npx vitest run` 要自己跑過 — 而且要在 390px 的視窗寬度
   下看過改動。

## 發展藍圖

- **現在** — 六個服務全部上線、多裝置同步、意見回報
- **接下來** — 付費方案、更豐富的分析、LittleBloom 每週內容的深度
- **再之後** — 里程碑照片、社群、英文與簡體中文、深色模式

## 致謝

醫療與時程資訊依循衛生福利部的指引；成長曲線採用 WHO 兒童生長標準；哺乳室
資料來自台灣政府開放資料。內容屬於參考資料，不能取代醫師。

採用 MIT 授權。
