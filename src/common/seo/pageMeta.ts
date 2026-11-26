import { ROUTE_PATH, articlePath, type Page, type WikiPage } from '../../types/routes';
import { requiresAuth } from '../routePolicy';
import { ARTICLE_SEARCH_TITLE } from './articleSearchTitles';

export const SITE_ORIGIN = 'https://littlesteps-c6ab6.web.app';
const SITE_NAME = 'LittleSteps';

interface PageMeta {
  /** <title>；已含服務名，不要再另外串。 */
  title: string;
  description: string;
}

/**
 * 每一頁的 title 與 description。
 *
 * 結尾一律是產品名 LittleSteps。原本各服務掛自己的英文代號（｜BabyOasis、
 * ｜LittleGuard…），但介面上已經不用那些名字，也沒有人拿它們來搜尋；搜尋結果
 * 上看到的品牌和點進來看到的品牌要是同一個。
 *
 * 只有公開頁面值得寫得像搜尋結果——它們是唯一會被索引的頁。需登入的頁面
 * 仍然給一組像樣的文字，因為分享到 LINE 時 og:title 也吃這裡；但它們一律
 * 帶 noindex，不會進搜尋結果。
 *
 * description 一律照著「這頁實際上有什麼」寫，不寫行銷詞。搜尋結果的摘要
 * 對不上內容，使用者點進來就跳出，排名只會更差。
 */
const PAGE_META: Record<Page, PageMeta> = {
  home: {
    title: 'LittleSteps｜懷孕到三歲的育兒工具：產檢、疫苗、哺乳室地圖',
    description:
      '給台灣爸媽的育兒工具：公費產檢與疫苗時程、每日餵奶睡眠記錄、WHO 生長曲線與幼兒發展檢核；全台哺乳室地圖、親子館與兒童傳染病門診統計不用登入就能查。',
  },
  about: {
    title: '關於資料與來源｜LittleSteps',
    description:
      '孩子的紀錄存在哪裡、誰看得到、我們用它做什麼，以及每一頁的內容出自哪一份政府或 WHO 的公開資料。',
  },
  join: {
    title: '加入家人的紀錄｜LittleSteps',
    description: '家人邀請你一起記錄孩子的成長。登入之後確認加入，就能和家人看同一份紀錄。',
  },
  littlesteps: {
    title: '寶寶成長｜0-1 歲里程碑、疫苗與日常記錄｜LittleSteps',
    description: '記錄 0-1 歲寶寶的發展里程碑、疫苗接種、副食品與每日餵奶睡眠，並可產生看診摘要。',
  },
  'littlesteps/dashboard': {
    title: '成長總覽｜LittleSteps',
    description: '一頁看完寶寶的里程碑進度、下一劑疫苗、今日記錄與睡眠趨勢。',
  },
  'littlesteps/milestones': {
    title: '寶寶發展里程碑追蹤｜LittleSteps',
    description: '依月齡整理的寶寶發展里程碑，逐項記錄達成日期，掌握大動作、精細動作與語言發展。',
  },
  'littlesteps/care-guide': {
    title: '0-1 歲寶寶照顧重點｜各月齡注意事項｜LittleSteps',
    description:
      '依月齡整理新生兒到 1 歲的照顧重點：餵食、睡眠、安全與常見狀況。',
  },
  'littlesteps/vaccine-tracking': {
    title: '寶寶疫苗接種時程追蹤｜公費、健保給付與自費｜LittleSteps',
    description:
      '依衛福部建議時程記錄寶寶疫苗接種，逐劑標明公費、健保有條件給付或自費與出處，含接種時機與可能副作用。',
  },
  'littlesteps/complementary-food': {
    title: '副食品添加完整指南｜4-12 個月｜LittleSteps',
    description:
      '副食品添加時機與原則、三階段奶量轉換、月份菜單、蔬果過敏等級與一次試一種新食材的做法，並可記錄寶寶的食物嘗試。',
  },
  'littlesteps/daily-log': {
    title: '快速日誌｜餵奶、睡眠與尿布記錄｜LittleSteps',
    description: '三個按鈕記錄餵奶、睡眠與尿布，累積成可分析的日常照顧資料。',
  },
  'littlesteps/growth-charts': {
    title: '寶寶成長曲線圖｜身高體重頭圍百分位｜LittleSteps',
    description: '依 WHO 兒童生長標準計算身高、體重與頭圍百分位，追蹤寶寶的成長趨勢。',
  },
  'littlesteps/sleep-training': {
    title: '寶寶睡眠訓練指南｜各月齡睡眠需求｜LittleSteps',
    description: '各月齡的睡眠需求時數、常見睡眠訓練方法與作息安排建議。',
  },
  'littlesteps/sleep-analysis': {
    title: '寶寶睡眠分析｜LittleSteps',
    description: '從日誌分析寶寶的睡眠時數、夜醒次數與規律性，找出作息問題。',
  },
  'littlesteps/baby-wiki': {
    title: '寶寶百科｜0-1 歲常見狀況與處理方式｜LittleSteps',
    description:
      '新生兒到 1 歲常見狀況的成因、處理方式與就醫時機。',
  },
  'littlesteps/clinic-summary': {
    title: '看診摘要｜一鍵整理寶寶就醫資料｜LittleSteps',
    description: '把成長、疫苗與近期日常記錄整理成一頁，看診時直接給醫師看。',
  },
  'littlesteps/report': {
    title: '週報月報｜寶寶照顧數據趨勢｜LittleSteps',
    description: '把每日記錄彙整成週報與月報，看出餵奶、睡眠與尿布的長期趨勢。',
  },
  'littlesteps/vaccine-schedule': {
    title: '寶寶疫苗時程試算｜填生日算出每一劑日期｜LittleSteps',
    description:
      '填寶寶生日，列出每一劑疫苗建議在哪一天打，標明公費或自費，可以加到行事曆。不用登入，生日不會被存下來。',
  },
  'littlesteps/growth-percentile': {
    title: '寶寶生長百分位試算｜身高體重頭圍｜LittleSteps',
    description:
      '填性別、月齡與健檢量到的身高、體重、頭圍，對照 WHO 兒童生長標準算出百分位，並說明百分位該怎麼看。不用登入。',
  },
  littlebloom: {
    title: '孕期陪伴｜每週身體變化與產檢時程｜LittleSteps',
    description: '依懷孕週數顯示身體變化與本週提醒，管理 14 次公費產檢時程，出生後轉為寶寶檔案。',
  },
  'littlebloom/prenatal': {
    title: '產檢時程表｜14 次公費產檢｜LittleSteps',
    description: '依末次月經自動排出 14 次公費產檢時程，記錄每次產檢的日期、院所與備註。',
  },
  'littlebloom/wiki': {
    title: '孕期知識庫｜常見孕期狀況與就醫時機｜LittleSteps',
    description:
      '孕吐、妊娠糖尿病、產兆判斷等常見孕期狀況的成因與處理方式。',
  },
  'littlebloom/checkup-schedule': {
    title: '產檢時程試算｜填預產期排出每次產檢｜LittleSteps',
    description:
      '填預產期或最後一次月經，列出每一次公費產檢與篩檢各在第幾週、哪幾天，可以加到行事曆。不用登入。',
  },
  'littlebloom/weekly-guide': {
    title: '孕期每週指南｜填預產期看這一週｜LittleSteps',
    description:
      '填預產期，看懷孕這一週寶寶與身體的變化、該注意的事與就醫警訊，前後週都能翻。不用登入，日期不會被存下來。',
  },
  littleexplorer: {
    title: '幼兒期陪伴｜1-3 歲發展檢核｜LittleSteps',
    description: '依年齡分段的幼兒發展檢核、健檢與疫苗提醒、成長日記與幼兒百科。',
  },
  'littleexplorer/reminders': {
    title: '幼兒健檢與疫苗提醒｜LittleSteps',
    description: '依出生日排出兒童健檢、疫苗與塗氟時程，逾期與即將到期一目了然，可加入 Google 日曆。',
  },
  'littleexplorer/diary': {
    title: '成長日記｜LittleSteps',
    description: '記下那些不會出現在數據裡的時刻，依月份整理成孩子的成長軌跡。',
  },
  'littleexplorer/wiki': {
    title: '幼兒百科｜1-3 歲照顧問題｜LittleSteps',
    description:
      '如廁訓練、語言發展、入園準備、睡眠轉換等 1-3 歲常見照顧問題，依年齡篩選。',
  },
  littleouting: {
    title: '帶孩子去哪裡｜依動作發展選場地、全台親子館｜LittleSteps',
    description:
      '還不會坐、會爬、剛會走、會跑跳的孩子適合去的地方各不相同：依動作發展推薦場地類型與注意事項，並附全台親子館與親子餐廳名冊。',
  },
  babyoasis: {
    title: '全台哺乳室地圖｜3,844 處哺乳室查詢｜LittleSteps',
    description:
      '全台 3,844 處哺乳室的地圖查詢，依所在位置找出最近的哺乳室，資料來源為政府公開資料。',
  },
  littleguard: {
    title: '兒童傳染病門診就診統計｜各縣市疫情雷達｜LittleSteps',
    description:
      '腸病毒、手足口病、疱疹性咽峽炎、類流感、COVID-19、腹瀉、水痘的門診就診人次，可依縣市與孩子年齡查看，資料來自衛福部疾管署開放資料。',
  },
};

export interface ResolvedMeta extends PageMeta {
  canonical: string;
  /** 讀得到某個孩子資料的頁面一律不進搜尋結果。 */
  noindex: boolean;
  siteName: string;
}

export function metaFor(page: Page): ResolvedMeta {
  return {
    ...PAGE_META[page],
    canonical: `${SITE_ORIGIN}${ROUTE_PATH[page]}`,
    noindex: requiresAuth(page),
    siteName: SITE_NAME,
  };
}

/** 會被索引的頁面；sitemap 與預先產生 HTML 都只認這一份。 */
export const INDEXABLE_PAGES = (Object.keys(ROUTE_PATH) as Page[]).filter(
  (page) => !requiresAuth(page),
);

/** 知識庫在文章標題後面的名字，例如「發燒怎麼判斷｜寶寶百科｜LittleSteps」。 */
const WIKI_NAME: Record<WikiPage, string> = {
  'littlesteps/baby-wiki': '寶寶百科｜LittleSteps',
  'littlebloom/wiki': '孕期知識庫｜LittleSteps',
  'littleexplorer/wiki': '幼兒百科｜LittleSteps',
};

/**
 * 一篇百科文章自己的 title、description 與 canonical。
 *
 * description 就是文章的摘要：那是作者為這一篇寫的一句話，比任何另外編的
 * 搜尋摘要都更對得上內容。
 */
export function metaForArticle(
  page: WikiPage,
  article: { id: string; title: string; summary: string },
): ResolvedMeta {
  return {
    title: `${ARTICLE_SEARCH_TITLE[article.id] ?? article.title}｜${WIKI_NAME[page]}`,
    description: article.summary,
    canonical: `${SITE_ORIGIN}${articlePath(page, article.id)}`,
    noindex: requiresAuth(page),
    siteName: SITE_NAME,
  };
}
