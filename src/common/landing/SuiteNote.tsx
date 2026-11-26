import { useOptionalAuth } from '../../contexts/AuthContext';
import { goTo } from '../navigate';
import { ROUTE_PATH, type Page } from '../../types/routes';

/**
 * One card at the foot of a public page, pointing at the one other part of
 * the product that page leads to.
 *
 * The wikis, the guides and the public tools are the pages search engines
 * index, so they are where most first visits start — and none of them said
 * that a product exists around them. The first version of this card fixed
 * that with one generic line on all seven pages. But a parent reading about
 * fever and one planning a Saturday are not after the same thing, and "see all
 * services" answers neither. Each page now names the feature that continues
 * what the parent was just doing.
 *
 * A note that leads to something behind sign-in is hidden from signed-in
 * parents: its wording is "sign in and…", and they already have the feature
 * in their own navigation. A note that leads to another public page is shown
 * to everyone.
 *
 * It reads auth through the optional hook and never touches the child store,
 * so it is safe on a public page's static import path (see BUNDLE-01/02).
 */
export interface SuiteNoteContent {
  title: string;
  body: string;
  /** The link's words. Says where it goes. */
  cta: string;
  page: Page;
  /** The destination needs no account, so the note is true for everyone. */
  forEveryone?: boolean;
}

const DEFAULT_NOTE: SuiteNoteContent = {
  title: '這一頁是 LittleSteps 的一部分',
  body: '從懷孕到三歲的產檢、疫苗與成長記錄，加上哺乳室地圖與親子館。',
  cta: '看所有服務',
  page: 'home',
};

/**
 * The note each public page carries. Every sentence describes something the
 * destination really does; none promises a notification, because the app
 * sends none.
 */
export const SUITE_NOTES = {
  babyWiki: {
    title: '看診時，醫師會問這幾天的狀況',
    body: '登入後記下餵奶、睡眠與尿布，看診前整理成一頁摘要。',
    cta: '看寶寶成長',
    page: 'littlesteps',
  },
  pregnancyWiki: {
    title: '公費產檢，哪一週做哪一次',
    body: '登入後填預產期，每一次產檢的日期就排好了。',
    cta: '看孕期陪伴',
    page: 'littlebloom',
  },
  toddlerWiki: {
    title: '這個年齡該會的，孩子會了幾項',
    body: '登入後依年齡分段做發展檢核，健檢、疫苗與塗氟的到期日一頁看完。',
    cta: '看幼兒期陪伴',
    page: 'littleexplorer',
  },
  careGuide: {
    title: '下一劑疫苗是哪一天',
    body: '登入後依寶寶生日排出每一劑，標明公費或自費。',
    cta: '看寶寶成長',
    page: 'littlesteps',
  },
  sleepGuide: {
    title: '寶寶實際睡了多久',
    body: '登入後記錄睡眠，自動算出每日時數與夜醒次數。',
    cta: '看寶寶成長',
    page: 'littlesteps',
  },
  outing: {
    title: '出門前，先看哺乳室在哪',
    body: '全台哺乳室地圖，定位找最近的，不用登入。',
    cta: '開哺乳室地圖',
    page: 'babyoasis',
    forEveryone: true,
  },
  radar: {
    title: '孩子發燒了，什麼時候該看醫生',
    body: '寶寶百科有發燒與腸病毒的處理方式和就醫警訊，不用登入。',
    cta: '看寶寶百科',
    page: 'littlesteps/baby-wiki',
    forEveryone: true,
  },
} satisfies Record<string, SuiteNoteContent>;

export default function SuiteNote({ note = DEFAULT_NOTE }: { note?: SuiteNoteContent }) {
  const user = useOptionalAuth()?.user ?? null;
  if (user && !note.forEveryone) return null;

  return (
    <aside aria-label="LittleSteps 的其他功能" className="mt-8">
      <a
        href={ROUTE_PATH[note.page]}
        onClick={(event) => {
          event.preventDefault();
          goTo(note.page);
        }}
        className="card-tap block"
      >
        <span className="block font-semibold text-ink">{note.title}</span>
        <span className="block text-sm text-ink-muted leading-relaxed mt-0.5">{note.body}</span>
        {/* Ink, not the coral brand shade: this sits on the disease radar too,
            whose first rule is that nothing on it reads as an alarm. */}
        <span className="block text-sm font-medium text-ink underline underline-offset-2 mt-1">
          {note.cta}
        </span>
      </a>
    </aside>
  );
}
