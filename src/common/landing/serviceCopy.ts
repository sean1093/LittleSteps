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
  babyoasis: '3,852 處',
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
      { title: '每週孕期指南', detail: '依懷孕週數，看這一週的身體變化和該注意的事。' },
      { title: '產檢時程', detail: '公費產檢各在第幾週，做完的記下日期與院所。' },
      { title: '出生登記', detail: '寶寶出生後登記一次，孕期檔案直接變成寶寶檔案。' },
    ],
    publicContent: [
      {
        title: '孕期知識庫',
        detail: '25 篇：成因、怎麼處理、什麼時候該看醫生。',
        page: 'littlebloom/wiki',
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
        detail: '15 篇常見狀況：怎麼處理、什麼時候該看醫生。',
        page: 'littlesteps/baby-wiki',
      },
      { title: '照顧重點', detail: '依月齡整理的照顧與安全注意事項。', page: 'littlesteps/care-guide' },
      {
        title: '睡眠指南',
        detail: '各年齡需要睡多久，以及睡前儀式怎麼安排。',
        page: 'littlesteps/sleep-training',
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
 * 85 sourced articles are public, and the landing page had no way to reach
 * them except through an intro page that leads with a sign-in button.
 */
export const WIKI_LINKS: { page: Page; title: string; count: number }[] = STAGED_SERVICES.flatMap(
  (service) =>
    SERVICE_INTRO[service].publicContent.flatMap(({ page, title, detail }) => {
      const count = /^(\d+) 篇/.exec(detail);
      return count ? [{ page, title, count: Number(count[1]) }] : [];
    }),
);
