import { SERVICE_THEME, type ServiceId } from './ui/serviceTheme';

/**
 * A parent telling us that a published venue record is wrong.
 *
 * The three fully public services run on datasets nobody here can verify: the
 * MOHW nursing-room map, and a family-centre roster published as a PDF with no
 * opening hours for most counties. The app already carries that honestly — it
 * labels rooms that look staff-only, and says outright when a county's access
 * rules are unverified — but all of it is inference. The parent standing at
 * the door is the only source of truth that exists for "is it still there" and
 * "can I get in", so the report has to cost them one tap and one choice.
 *
 * Why the context travels as text, not as columns
 *   The report is written as the `title` and `content` of an ordinary feedback
 *   record. `database.rules.json` validates `feedbacks/$feedbackId` field by
 *   field and rejects anything else (`"$other": { ".validate": false }`), so a
 *   `venueId`/`reason` pair of columns is a rules change — and that file is the
 *   only real authorisation boundary in the product, so changing it without
 *   `npm run test:rules` behind it is a guess. Composing the context into the
 *   two fields the inbox already reads keeps the write inside a shape that is
 *   already proven, and a human triaging it still gets the venue id, the name
 *   and the disputed claim without the parent having typed any of them.
 *
 * Reports are an inbox, not a data source. Nothing here feeds back into what
 * the map or the venue list shows; the build scripts stay the source of truth
 * until somebody verifies a report and edits the pipeline.
 */

/**
 * The five states the datasets actually get wrong. A free-text box would
 * collect the same five sentences in fifty spellings, and none of them
 * sortable.
 */
export type VenueReportReason =
  | 'gone'
  | 'noEntry'
  | 'hoursWrong'
  | 'undisclosedEnquiry'
  | 'locationWrong';

/** Display order: the ones that waste a whole trip come first. */
export const VENUE_REPORT_REASONS = [
  'gone',
  'noEntry',
  'hoursWrong',
  'undisclosedEnquiry',
  'locationWrong',
] as const satisfies readonly VenueReportReason[];

export const VENUE_REPORT_REASON_LABEL: Record<VenueReportReason, string> = {
  gone: '已經沒有了／找不到',
  noEntry: '進不去（需要員工或學生身分）',
  hoursWrong: '開放時間不對',
  undisclosedEnquiry: '需要洽詢或登記，但沒寫',
  locationWrong: '位置不對',
};

/**
 * One thing the screen currently claims about this venue.
 *
 * `value` is left undefined where the source published nothing, which is a
 * different fact from an empty string and has to reach the inbox as such: half
 * the family-centre roster has no opening hours at all, and a report that says
 * "the hours are wrong" against a blank field means something else entirely.
 */
export interface VenueClaim {
  readonly label: string;
  readonly value?: string;
}

export const CLAIM_NOT_PUBLISHED = '來源未提供';

export interface VenueReportTarget {
  readonly service: ServiceId;
  /** The row id in the published dataset — the one field that makes a report actionable. */
  readonly id: string;
  readonly name: string;
  readonly address: string;
  /** What the parent is looking at, in the order the screen shows it. */
  readonly claims: readonly VenueClaim[];
}

/** Field limits from `database.rules.json`; a longer string is rejected outright. */
const TITLE_LIMIT = 200;
const CONTENT_LIMIT = 5000;

/**
 * The optional note. Short on purpose: the reason carries the report, and the
 * note is for the one sentence a reason cannot say ("the sign says it moved to
 * the third floor").
 */
export const VENUE_REPORT_NOTE_LIMIT = 500;

const truncate = (text: string, limit: number): string =>
  text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;

/** `場館資料回報：<name>｜<reason>`, clipped to what the rules accept. */
export function venueReportTitle(target: VenueReportTarget, reason: VenueReportReason): string {
  return truncate(
    `場館資料回報：${target.name}｜${VENUE_REPORT_REASON_LABEL[reason]}`,
    TITLE_LIMIT,
  );
}

/**
 * One field per line, so the inbox reads as prose rather than as JSON. The
 * reason leads because it is the report; everything after it is what the app
 * was showing when the parent disagreed with it.
 */
export function venueReportContent(
  target: VenueReportTarget,
  reason: VenueReportReason,
  note = '',
): string {
  const theme = SERVICE_THEME[target.service];
  const lines = [
    `回報原因：${VENUE_REPORT_REASON_LABEL[reason]}`,
    `服務：${theme.name}（${theme.role}）`,
    `場所名稱：${target.name}`,
    `場所編號：${target.id}`,
    `地址：${target.address}`,
    ...target.claims.map(
      (claim) => `畫面上的${claim.label}：${claim.value ?? CLAIM_NOT_PUBLISHED}`,
    ),
  ];

  const trimmed = note.trim();
  if (trimmed !== '') {
    lines.push(`家長補充：${truncate(trimmed, VENUE_REPORT_NOTE_LIMIT)}`);
  }

  return truncate(lines.join('\n'), CONTENT_LIMIT);
}
