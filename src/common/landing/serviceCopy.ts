import type { Page } from '../../types/routes';
import type { ServiceId } from '../ui/serviceTheme';

/**
 * What each service says about itself, in one place.
 *
 * The landing page and the intro pages used to keep their own copies: the hub
 * had one feature line per service, `StepsLanding` had a hand-written page and
 * `ServiceLanding` a third wording for LittleBloom and LittleExplorer. The
 * same service was therefore described three ways, with three sets of numbers
 * to keep true. Both surfaces now read this file.
 *
 * Every number in here is compared with the data it describes by
 * `serviceCopy.test.ts`. Do not edit one from memory.
 */

/** The three services a family moves through as the child grows. */
export type StagedService = 'littlebloom' | 'littlesteps' | 'littleexplorer';
/** The three that apply at any age and are fully public. */
export type AnytimeService = 'babyoasis' | 'littleouting' | 'littleguard';

/**
 * The two halves of the product are different kinds of thing: a family uses
 * one staged service at a time, while the other three are open to anyone at
 * any age. `SERVICE_GROUPS` must cover `SERVICE_ORDER` exactly — a service
 * left out has no entry anywhere, because no sub-app links to a sibling.
 */
export const STAGED_SERVICES: StagedService[] = ['littlebloom', 'littlesteps', 'littleexplorer'];
export const ANYTIME_SERVICES: AnytimeService[] = ['babyoasis', 'littleouting', 'littleguard'];

/**
 * The order is the order on the page. The public tools come first: they are
 * what a visitor can use this minute, and they used to sit a screen and a half
 * down behind three cards that end at a sign-in wall. Whether that order costs
 * sign-ins is an open question the `login_start` event exists to answer.
 *
 * The staged note does not say "sign in": a signed-in parent reads it too, and
 * the page adds that sentence only for a visitor.
 */
export const SERVICE_GROUPS: { title: string; note: string; ids: ServiceId[] }[] = [
  {
    title: '不用登入，現在就能用',
    note: '在外面、出門前，打開就查。',
    ids: ANYTIME_SERVICES,
  },
  {
    title: '一份檔案，從懷孕記到三歲',
    note: '孩子長大就換到下一段，紀錄跟著走。',
    ids: STAGED_SERVICES,
  },
];

/**
 * The age range each staged service covers. The role names alone ("寶寶成長",
 * "幼兒期陪伴") cannot tell the parent of a fifteen-month-old which one is
 * theirs, and that is the question the landing page has to answer.
 */
export const STAGE_RANGE: Record<StagedService, string> = {
  littlebloom: '懷孕 0-40 週',
  littlesteps: '0-12 個月',
  littleexplorer: '1-3 歲',
};

/** One or two sentences per service: what it does that the other five do not. */
export const SERVICE_PITCH: Record<ServiceId, string> = {
  littlebloom:
    '14 次公費產檢排好時程，每一週的身體變化先知道。寶寶出生後登記一次，檔案直接接到下一階段。',
  littlesteps:
    '餵奶、睡眠、尿布點幾下記完。36 劑疫苗時程、33 項里程碑，身高體重對照 WHO 生長曲線，看診前整理成一頁摘要。',
  littleexplorer:
    '12-36 個月的 30 項發展檢核，健檢、疫苗、塗氟依生日排好，可以匯出到行事曆。',
  // The three tools carry their count in `TOOL_FIGURE`, set large above the
  // line, so the line itself does not repeat it.
  babyoasis: '全台 22 縣市都有。定位找最近的，或選一個捷運站，看附近有哪幾間。',
  littleouting:
    '依孩子會不會坐、會不會走、會不會跑跳，推薦適合去的地方。親子館的收費與預約，查得到的都寫上。',
  // No "this week" and no "more or less than usual" here. The board withholds
  // every verdict once its dataset is over a month old, and this line must
  // stay true on that day too.
  littleguard:
    '你住的縣市的門診人次。資料來自疾管署的健保門診統計，是哪一週的都寫在上面。',
};

/**
 * The one number each public tool stands on, shown large on its row.
 *
 * These used to sit in a four-cell strip between the hero and the cards: four
 * nouns with no verb, each repeated in a card further down, in a shape that
 * looked tappable and was not. A number now appears once, on the thing it
 * counts. The radar's is how many diseases the board covers, which stays true
 * however old its dataset is.
 */
export const TOOL_FIGURE: Record<AnytimeService, string> = {
  babyoasis: '3,844 處',
  littleouting: '234 間親子館',
  littleguard: '7 種傳染病',
};

export interface ServiceIntroCopy {
  /** One line: what a parent gets. */
  promise: string;
  /** What signing in unlocks. Four at most; each detail is one sentence. */
  features: { title: string; detail: string }[];
  /**
   * What can be read with no account. Which pages belong here is not decided
   * by this file — the test derives the list from `routePolicy`.
   */
  publicContent: { title: string; detail: string; page: Page }[];
}

export const SERVICE_INTRO: Record<StagedService, ServiceIntroCopy> = {
  littlebloom: {
    promise: '14 次公費產檢什麼時候做、這一週身體會怎樣，先幫妳排好。',
    features: [
      { title: '每週孕期指南', detail: '記住預產期，每次打開就是這一週，前後週也能翻。' },
      { title: '產檢時程', detail: '公費產檢各在第幾週，做完的記下日期與院所。' },
      { title: '出生登記', detail: '寶寶出生後登記一次，孕期檔案直接變成寶寶檔案。' },
    ],
    publicContent: [
      {
        title: '孕期知識庫',
        detail: '27 篇：成因、怎麼處理、什麼時候該看醫生。',
        page: 'littlebloom/wiki',
      },
      {
        title: '產檢時程試算',
        detail: '填預產期，算出每一次產檢與篩檢在哪幾天。',
        page: 'littlebloom/checkup-schedule',
      },
      {
        title: '孕期每週指南',
        detail: '填預產期，看這一週的身體變化和該注意的事。',
        page: 'littlebloom/weekly-guide',
      },
    ],
  },
  littlesteps: {
    promise: '餵奶、睡眠、疫苗、里程碑記在同一份檔案，看診前整理成一頁。',
    features: [
      { title: '每日記錄', detail: '餵奶、睡眠、尿布點幾下記完，自動整理成一天的作息。' },
      { title: '疫苗追蹤', detail: '依出生日排好時程，公費、自費分清楚，下一針什麼時候一眼看得到。' },
      {
        title: '里程碑與生長曲線',
        detail: '記下會翻身、會坐的那一天；身高、體重、頭圍對照 WHO 生長標準。',
      },
      { title: '看診摘要', detail: '把成長、疫苗和最近的紀錄整理成一頁，不用憑印象回答醫師。' },
    ],
    publicContent: [
      {
        title: '寶寶百科',
        detail: '20 篇常見狀況：怎麼處理、什麼時候該看醫生。',
        page: 'littlesteps/baby-wiki',
      },
      { title: '照顧重點', detail: '依月齡整理的照顧與安全注意事項。', page: 'littlesteps/care-guide' },
      {
        title: '副食品指南',
        detail: '什麼時候開始、怎麼試新食材、哪些一歲前不能給。',
        page: 'littlesteps/complementary-food',
      },
      {
        title: '睡眠指南',
        detail: '各年齡需要睡多久，以及睡前儀式怎麼安排。',
        page: 'littlesteps/sleep-training',
      },
      {
        title: '疫苗時程試算',
        detail: '填寶寶生日，算出每一劑建議在哪一天打。',
        page: 'littlesteps/vaccine-schedule',
      },
      {
        title: '生長百分位試算',
        detail: '填健檢量到的數字，對照 WHO 生長標準。',
        page: 'littlesteps/growth-percentile',
      },
    ],
  },
  littleexplorer: {
    promise: '他這個年紀會了什麼、還在練什麼，一項一項看。',
    features: [
      { title: '發展檢核', detail: '12-36 個月分五個階段，看孩子會了什麼、還在練什麼。' },
      { title: '照護提醒', detail: '健檢、疫苗、塗氟依生日排好，可以匯出到行事曆。' },
      { title: '成長日記', detail: '寫下那些不會出現在數據裡的時刻。' },
    ],
    publicContent: [
      {
        title: '幼兒百科',
        detail: '45 篇：如廁、語言、情緒、挑食、生病。',
        page: 'littleexplorer/wiki',
      },
    ],
  },
};

/**
 * The three knowledge bases, as the landing page links to them.
 *
 * Derived from `SERVICE_INTRO` so each article count is written in one place.
 * 92 sourced articles are public, and the landing page had no way to reach
 * them except through an intro page that leads with a sign-in button.
 */
export const WIKI_LINKS: { page: Page; title: string; count: number }[] = STAGED_SERVICES.flatMap(
  (service) =>
    SERVICE_INTRO[service].publicContent.flatMap(({ page, title, detail }) => {
      const count = /^(\d+) 篇/.exec(detail);
      return count ? [{ page, title, count: Number(count[1]) }] : [];
    }),
);

/**
 * The public guides, which sit beside the knowledge bases in the "read first"
 * row. They are reference pages like the wikis, they need no account, and the
 * landing page had no link to any of them.
 */
export const GUIDE_LINKS: { page: Page; title: string }[] = [
  { page: 'littlesteps/care-guide', title: '照顧重點' },
  { page: 'littlesteps/complementary-food', title: '副食品指南' },
  { page: 'littlesteps/sleep-training', title: '睡眠指南' },
];

/**
 * The calculators: a date or a few numbers in, an answer out, nothing stored.
 *
 * They are the public face of four things that used to exist only behind
 * sign-in: the vaccine tracker, the prenatal schedule, the weekly pregnancy
 * guide and the growth chart. Each answers a question a parent searches for
 * with nothing but a date or a measurement,
 * and each ends by saying what signing in adds — which is a better reason to
 * sign in than any line on this page.
 *
 * No counts in these lines: the number of doses and of checkups is already
 * claimed once above, and a second copy is where drift starts.
 */
export const CALCULATORS_HEADING = {
  title: '算一下',
  note: '填一個日期或幾個數字就有答案。不用登入，填的東西不會被存下來。',
};

export const CALCULATORS: { page: Page; title: string; line: string }[] = [
  {
    page: 'littlesteps/vaccine-schedule',
    title: '疫苗時程試算',
    line: '填寶寶生日，每一劑疫苗在哪一天打、公費還是自費，可以加到行事曆。',
  },
  {
    page: 'littlebloom/checkup-schedule',
    title: '產檢時程試算',
    line: '填預產期，每一次產檢與篩檢各在第幾週、哪幾天。',
  },
  {
    page: 'littlebloom/weekly-guide',
    title: '孕期每週指南',
    line: '填預產期，看這一週寶寶與身體的變化、該注意的事，前後週都能翻。',
  },
  {
    page: 'littlesteps/growth-percentile',
    title: '生長百分位試算',
    line: '填健檢量到的身高、體重、頭圍，對照 WHO 生長標準，並說明這個數字該怎麼看。',
  },
];

/**
 * What a family member can do about someone else's access, said once.
 *
 * The landing page, the intro pages, the about page and the share sheet all
 * make this promise, and they used to make it four ways — three of them said
 * any member could be removed while the share sheet could not remove the
 * person who created the record. Each surface now reads this sentence, and
 * `ShareChildUuidModal.joiner.test.tsx` holds it to what the sheet can do.
 *
 * Every word has to be true of the share sheet, not of `database.rules.json`:
 * a parent only ever meets the sheet. The sheet lists every member with a
 * remove button, the creator's row included, and offers none on the last
 * member left, which is what the rules' never-zero-members guard refuses.
 */
export const SHARING_REMOVAL =
  '之後隨時可以關掉代碼，也可以把名單上的任何一位移除，包括建立這份紀錄的人，只要名單上還留著一個人。';
