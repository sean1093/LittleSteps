/**
 * Where to take a child, by what the child can do.
 *
 * The page used to be a register: 247 family centres and 12 restaurants,
 * the same list for a three-month-old and a three-year-old. But what a parent
 * needs from an outing changes with how the child moves, not with the venue
 * list — a baby who cannot sit needs shade and a mat, a child who runs needs
 * room. So the page now asks one question first, and answers it with venue
 * TYPES in priority order.
 *
 * Why the stages are gross-motor abilities and not ages
 *   Two children of fourteen months can be a crawler and a confident walker,
 *   and they need different places. A parent can also answer "does she walk
 *   on her own yet" at a glance, where "which age band" needs arithmetic and,
 *   for a preterm baby, a correction. The month ranges below are only the
 *   fallback for a child with nothing ticked.
 *
 * Where a recommendation leads
 *   Family centres (the SFAA national list) and restaurants (a verified
 *   sample) open this page's own registers. Parks and playgrounds open the
 *   park list, built from OpenStreetMap, narrowed to what the stage asks of a
 *   park: any park, a large one, or one with a playground mapped. Libraries
 *   and zoos have no dataset behind them and link out to a map search; the
 *   page says so.
 *
 * What may be written here
 *   Every health or safety statement carries the ids of the sources it rests
 *   on, and `outingStages.test.ts` fails if one does not. Each source was
 *   opened and read on its `verifiedOn` date; the sentence it supports is
 *   quoted in `supports` so the next reader can find it on the page. Several
 *   things parents are commonly told were left out because no page that could
 *   be opened said them: age bands for public playground
 *   equipment, anything about ball pits, and "tiring a child out" improving
 *   sleep. Reasons that are not health claims — "indoors, so it works on a
 *   rainy day" — carry no source because there is nothing to cite.
 *
 * The word 放電 ("burning off energy") is deliberately not the frame. A child
 * has no charge to drain; activity is a daily need like sleep, and the WHO
 * figures below apply before a child can walk, too.
 */

import type { Page } from '../../types/routes';
import type { ParkFilter } from '../parks';

export type OutingSourceId =
  | 'whoActivity'
  | 'aapSun'
  | 'aapPlayground'
  | 'hpaDrowning'
  | 'hpaSafety'
  | 'cdcEnterovirus';

export interface OutingSource {
  /** Short name, shown beside the sentence it supports. */
  short: string;
  publisher: string;
  title: string;
  url: string;
  /** The day the page was opened and read, YYYY-MM-DD. */
  verifiedOn: string;
  /** The wording on the page that the app's sentences rest on. */
  supports: string;
}

export const OUTING_SOURCES: Record<OutingSourceId, OutingSource> = {
  whoActivity: {
    short: 'WHO',
    publisher: '世界衛生組織（WHO）',
    title: '5 歲以下兒童身體活動、靜態行為與睡眠指引（2019）',
    url: 'https://www.who.int/news/item/24-04-2019-to-grow-up-healthy-children-need-to-sit-less-and-play-more',
    verifiedOn: '2026-11-23',
    supports:
      'Infants: floor-based play several times a day; not yet mobile, at least 30 minutes in prone position. ' +
      'Ages 1-2 and 3-4: at least 180 minutes of physical activity, for 3-4 of which at least 60 minutes moderate- to vigorous. ' +
      'All ages: not be restrained for more than 1 hour at a time (prams/strollers, high chairs).',
  },
  aapSun: {
    short: '美國兒科學會',
    publisher: '美國兒科學會（AAP）HealthyChildren.org',
    title: 'Sun Safety: Information for Parents About Sunburn & Sunscreen',
    url: 'https://www.healthychildren.org/English/safety-prevention/at-play/Pages/Sun-Safety.aspx',
    verifiedOn: '2026-11-23',
    supports:
      'Keep babies younger than 6 months out of direct sunlight. Find shade under a tree, an umbrella, or the stroller canopy. ' +
      'Dress yourself and your children in cool, comfortable clothing that covers the body. ' +
      'Limit your sun exposure between 10:00 a.m. and 4:00 p.m., when UV rays are strongest. ' +
      'Use sunscreen on small areas of the body, such as the face, if protective clothing and shade are not available.',
  },
  aapPlayground: {
    short: '美國兒科學會',
    publisher: '美國兒科學會（AAP）HealthyChildren.org',
    title: 'Safety on the Playground',
    url: 'https://www.healthychildren.org/English/safety-prevention/at-play/Pages/Safety-on-the-Playground.aspx',
    verifiedOn: '2026-11-23',
    supports:
      'Choose a playground with equipment that is geared toward your child\'s age. ' +
      'Most playground injuries happen when a child falls from the equipment onto the ground. ' +
      'Metal slides can get very hot from the sun and seriously burn a child\'s hands and legs. ' +
      'Adult guidance and supervision is the best way to prevent injuries.',
  },
  hpaDrowning: {
    short: '國健署',
    publisher: '衛生福利部國民健康署',
    title: '預防夏日溺水意外 防溺10招、救溺5步',
    url: 'https://www.hpa.gov.tw/Pages/Detail.aspx?nodeid=4878&pid=19221',
    verifiedOn: '2026-11-23',
    supports:
      '1至4歲是溺水高風險年齡，家長須隨時陪同、視線不離。針對戶外戲水，國民健康署呼籲家長與幼兒保持一手臂可及之距離。',
  },
  hpaSafety: {
    short: '國健署',
    publisher: '衛生福利部國民健康署 孕產兒關懷網站',
    title: '嬰幼兒意外事故防制與居家安全',
    url: 'https://mammy.hpa.gov.tw/Home/NewsKBContent?id=1830&type=01',
    verifiedOn: '2026-11-23',
    supports:
      '跌倒、墜落是最常見的意外……如果跌倒後接觸的地面為硬質地面，則可能使傷害更加嚴重。' +
      '將小東西如：錢幣、玩具或彈珠等小物品妥善收納在孩子拿不到的抽屜或櫥櫃。',
  },
  cdcEnterovirus: {
    short: '疾管署',
    publisher: '衛生福利部疾病管制署',
    title: '腸病毒感染併發重症、腸病毒 Q&A',
    url: 'https://www.cdc.gov.tw/Category/QAPage/uWGc1UXjKbX7uC1uTG5_2Q',
    verifiedOn: '2026-11-23',
    supports:
      '5歲以下的幼兒為重症的高危險群。流行期間儘量避免出入公共場所。' +
      '家有嬰幼兒的成人工作或外出返家後，務必先更衣洗手，在摟抱、餵食嬰幼兒前，應以肥皂正確洗手。',
  },
};

/**
 * How a recommendation is acted on.
 *
 * `register` opens one of this page's own verified lists. `parks` opens the
 * park list, narrowed to what the stage asks of a park. `service` leaves for
 * another public service of the app. `map` leaves the app for a map search,
 * for the types this app has no data for.
 */
export type PlaceAction =
  | { kind: 'register'; view: 'centre' | 'restaurant'; label: string }
  | { kind: 'parks'; filter: ParkFilter; label: string }
  | { kind: 'service'; page: Page; label: string }
  | { kind: 'map'; query: string; label: string };

export type PlaceTypeId =
  | 'centre'
  | 'shadedPark'
  | 'lawn'
  | 'playground'
  | 'library'
  | 'mall'
  | 'restaurant'
  | 'zoo'
  | 'riverside';

export const PLACE_TYPES: Record<PlaceTypeId, { label: string; action: PlaceAction }> = {
  centre: {
    label: '親子館',
    action: { kind: 'register', view: 'centre', label: '看親子館名冊' },
  },
  shadedPark: {
    label: '有樹蔭的公園或步道',
    action: { kind: 'parks', filter: 'any', label: '看附近的公園' },
  },
  lawn: {
    label: '公園草地',
    action: { kind: 'parks', filter: 'large', label: '看 1 公頃以上的公園' },
  },
  playground: {
    label: '有遊戲場的公園',
    action: { kind: 'parks', filter: 'playground', label: '看有遊戲場的公園' },
  },
  library: {
    label: '圖書館親子區',
    action: { kind: 'map', query: '圖書館', label: '在地圖上找附近的圖書館' },
  },
  mall: {
    label: '有哺乳室的百貨或賣場',
    action: { kind: 'service', page: 'babyoasis', label: '用哺乳室地圖找' },
  },
  restaurant: {
    label: '親子餐廳',
    action: { kind: 'register', view: 'restaurant', label: '看親子餐廳' },
  },
  zoo: {
    label: '動物園、農場',
    action: { kind: 'map', query: '動物園 農場', label: '在地圖上找動物園與農場' },
  },
  riverside: {
    label: '河濱、大草地',
    action: { kind: 'parks', filter: 'large', label: '看 1 公頃以上的公園' },
  },
};

export type OutingStageId = 'lying' | 'crawling' | 'cruising' | 'walking' | 'running';

export interface OutingStage {
  id: OutingStageId;
  /** What the parent taps. */
  label: string;
  /** The observable thing a parent recognises their child by. */
  criterion: string;
  /** Typical range, shown as a hint only. */
  typicalAge: string;
  /**
   * Month range used when nothing has been ticked. Half-open: `fromMonth`
   * inclusive, `toMonth` exclusive; the last stage has no upper bound.
   */
  fromMonth: number;
  toMonth: number | null;
  /**
   * Ids in `milestones.ts` or `developmentChecks.ts` whose being ticked means
   * the child has reached this stage. The test checks each one exists.
   */
  reachedBy: string[];
  /** What the child needs from an outing at this stage. */
  needs: { text: string; sources: OutingSourceId[] };
  /** Venue types, most useful first. */
  places: { type: PlaceTypeId; why: string }[];
  /** How long, and around what. */
  pacing: { text: string; sources: OutingSourceId[] };
  /** What to watch for at this stage in particular. */
  safety: { text: string; sources: OutingSourceId[] }[];
}

export const OUTING_STAGES: OutingStage[] = [
  {
    id: 'lying',
    label: '還不會坐',
    criterion: '放著坐會倒，移動全靠大人抱或推車。',
    typicalAge: '約 0-6 個月',
    fromMonth: 0,
    toMonth: 6,
    reachedBy: [],
    needs: {
      text: '這個階段出門是換環境，不是運動。孩子要的是清醒時能趴著玩的地方：一天合計至少 30 分鐘。',
      sources: ['whoActivity'],
    },
    places: [
      { type: 'shadedPark', why: '推車或揹巾走一圈，離家近，隨時能回頭。' },
      { type: 'centre', why: '有地墊可以趴著玩，室內，雨天和大熱天都能去。' },
      { type: 'library', why: '室內、安靜、有冷氣，待的時間可以很短。' },
      { type: 'mall', why: '需要餵奶、換尿布時有地方，選人少的時段去。' },
    ],
    pacing: {
      text: '排在兩次餵奶之間。待在推車或汽座裡連續不超過 1 小時，中途抱出來。',
      sources: ['whoActivity'],
    },
    safety: [
      {
        text: '未滿 6 個月不直接曬太陽：用樹蔭、推車遮陽篷和衣物擋。遮不到的小面積，例如臉，才擦防曬。',
        sources: ['aapSun'],
      },
      {
        text: '腸病毒流行期間少去人多的公共場所。大人回到家先換衣服、用肥皂洗手，再抱孩子、餵奶。',
        sources: ['cdcEnterovirus'],
      },
    ],
  },
  {
    id: 'crawling',
    label: '會坐會爬',
    criterion: '不用扶能自己坐著，或已經會爬。',
    typicalAge: '約 6-10 個月',
    fromMonth: 6,
    toMonth: 10,
    reachedBy: ['m6-physical-1', 'm8-physical-1'],
    needs: {
      text: '孩子要的是一塊乾淨、能放手讓他爬的地面。每天要有好幾次在地上活動的時間，越多越好。',
      sources: ['whoActivity'],
    },
    places: [
      { type: 'centre', why: '有軟墊的爬行空間，不必自己帶地墊。' },
      { type: 'lawn', why: '樹蔭下鋪野餐墊，坐著、趴著、爬都可以。' },
      { type: 'library', why: '可以坐在地上翻硬頁書。' },
      { type: 'restaurant', why: '名單上標出哪幾家有遊戲區。吃飯時孩子有地方待。' },
    ],
    pacing: {
      text: '排在兩次小睡之間。待在推車、餐椅裡連續不超過 1 小時。',
      sources: ['whoActivity'],
    },
    safety: [
      {
        text: '孩子爬到的地面先看一遍，把硬幣、彈珠這類小東西撿走。',
        sources: ['hpaSafety'],
      },
      {
        text: '上午 10 點到下午 4 點紫外線最強，這段時間待在樹蔭下，穿遮得住身體的薄衣服、戴帽子。',
        sources: ['aapSun'],
      },
      {
        text: '腸病毒流行期間少去人多的公共場所。離開遊戲區用肥皂洗手。',
        sources: ['cdcEnterovirus'],
      },
    ],
  },
  {
    id: 'cruising',
    label: '扶著走、剛會走',
    criterion: '扶著家具橫著走，或放手走幾步就坐下。',
    typicalAge: '約 10-15 個月',
    fromMonth: 10,
    toMonth: 15,
    reachedBy: ['m10-physical-1', 'm11-physical-1', 'check-12-15-gross-motor'],
    needs: {
      text: '孩子要的是平坦、有東西可扶、跌了不那麼痛的地方練習走。滿 1 歲起，一天合計至少活動 180 分鐘，分散在整天。',
      sources: ['whoActivity'],
    },
    places: [
      { type: 'centre', why: '軟墊地面，有矮櫃和扶手可以扶著走。' },
      { type: 'lawn', why: '平坦、空間大，練走不會撞到東西。' },
      { type: 'playground', why: '只用低矮、適合他年齡的設施。' },
      { type: 'mall', why: '雨天的替代：寬走道可以練走，選人少的時段。' },
    ],
    pacing: {
      text: '配合小睡安排。去程讓他自己走，回程再坐推車；推車連續不超過 1 小時。',
      sources: ['whoActivity'],
    },
    safety: [
      {
        text: '跌倒、墜落是幼兒最常見的意外，跌在硬地面上傷得比較重。練走選有軟墊的地方。',
        sources: ['hpaSafety'],
      },
      {
        text: '有水的地方，淺水池也算，大人保持一隻手臂伸得到的距離。1 到 4 歲是溺水的高風險年齡。',
        sources: ['hpaDrowning'],
      },
      {
        text: '大熱天先摸一下溜滑梯再讓孩子上去。曬過的溜滑梯會燙傷手腳。',
        sources: ['aapPlayground'],
      },
    ],
  },
  {
    id: 'walking',
    label: '走得穩',
    criterion: '走路不常跌，會蹲下撿東西再站起來。',
    typicalAge: '約 15-24 個月',
    fromMonth: 15,
    toMonth: 24,
    reachedBy: ['check-15-18-gross-motor', 'check-18-24-gross-motor'],
    needs: {
      text: '孩子要的是夠大的空間，自己決定往哪裡走：上下坡、台階、蹲下撿東西。一天合計至少活動 180 分鐘。',
      sources: ['whoActivity'],
    },
    places: [
      { type: 'lawn', why: '走、小跑、上下緩坡，空間夠大。' },
      { type: 'playground', why: '沙坑和矮滑梯。選適合他年齡的設施。' },
      { type: 'zoo', why: '走得久，一路有東西看。' },
      { type: 'centre', why: '雨天和大熱天的替代。' },
      { type: 'restaurant', why: '可以去，但坐著吃飯的時間不算活動量。' },
    ],
    pacing: {
      text: '午睡前回到家或上車。整趟都坐推車的行程不算活動：連續不超過 1 小時。',
      sources: ['whoActivity'],
    },
    safety: [
      {
        text: '遊戲場的傷多半是從設施上跌下來。選適合他年齡的設施，大人在旁邊看著。',
        sources: ['aapPlayground'],
      },
      {
        text: '戲水時大人保持一隻手臂伸得到的距離。',
        sources: ['hpaDrowning'],
      },
      {
        text: '腸病毒流行期間少去人多的室內場所。5 歲以下是重症的高危險群。',
        sources: ['cdcEnterovirus'],
      },
    ],
  },
  {
    id: 'running',
    label: '會跑會跳',
    criterion: '會跑，雙腳能同時離地跳起來。',
    typicalAge: '約 2 歲起',
    fromMonth: 24,
    toMonth: null,
    reachedBy: ['check-24-30-gross-motor', 'check-30-36-gross-motor'],
    needs: {
      text: '孩子要的是能跑、跳、攀爬的地方。一天合計至少活動 180 分鐘；滿 3 歲起，其中至少 60 分鐘要是會喘的活動。',
      sources: ['whoActivity'],
    },
    places: [
      { type: 'playground', why: '攀爬、溜滑梯、盪鞦韆。選適合他年齡的設施。' },
      { type: 'riverside', why: '空間夠大，可以跑、踢球、騎滑步車。' },
      { type: 'zoo', why: '一趟下來走路的量很大。' },
      { type: 'centre', why: '雨天的替代。名冊上的親子館收 0 到 6 歲。' },
      { type: 'restaurant', why: '室內遊戲區不夠跑，當吃飯的地方，不當當天的活動。' },
    ],
    pacing: {
      text: '可以排半天到一天。還在午睡的孩子，把午睡的時間留出來。',
      sources: [],
    },
    safety: [
      {
        text: '遊戲場的傷多半是從設施上跌下來。選適合他年齡的設施，大人在旁邊看著。',
        sources: ['aapPlayground'],
      },
      {
        text: '大熱天先摸一下溜滑梯。曬過的溜滑梯會燙傷手腳。',
        sources: ['aapPlayground'],
      },
      {
        text: '戲水時大人保持一隻手臂伸得到的距離，會游泳的孩子也一樣。1 到 4 歲是溺水的高風險年齡。',
        sources: ['hpaDrowning'],
      },
    ],
  },
];

/** The daily activity figures, as one list. Shown once, under the guide. */
export const DAILY_ACTIVITY: { age: string; amount: string }[] = [
  { age: '未滿 1 歲', amount: '每天多次在地上活動；還不會移動的，清醒時趴著玩合計至少 30 分鐘。' },
  { age: '1-2 歲', amount: '合計至少 180 分鐘，強度不限，分散在整天。' },
  { age: '3-4 歲', amount: '合計至少 180 分鐘，其中至少 60 分鐘是會喘的活動。' },
  { age: '各年齡', amount: '在推車、汽座、餐椅裡連續不超過 1 小時。' },
];

export const DAILY_ACTIVITY_SOURCE: OutingSourceId = 'whoActivity';
