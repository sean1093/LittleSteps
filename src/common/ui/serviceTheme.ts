import type { LucideIcon } from 'lucide-react';
import { Baby, Flower2, MapPin, Sun, Trees } from 'lucide-react';

/**
 * One layout language, four personalities.
 *
 * Every sub-app used to hand-write its own chrome, so the four of them ended up
 * disagreeing on header fill, container width, card padding, heading colour and
 * even which off-white counted as "the background". The structure is now shared
 * (see `Screen`, `PageHeader`, `EmptyState`) and the *only* thing a sub-app
 * varies is the palette below.
 *
 * `ServiceLanding` already proved this pattern with a local `theme` object; this
 * is that idea promoted to the one place every surface can read it.
 *
 * Contrast rule, inherited from `tailwind.config.js`: `accent` is a fill and
 * never carries text; `ink`/`fill` are the readable shades (>=4.5:1). Getting
 * this wrong is what made white-on-pastel buttons unreadable across the app.
 */
export type ServiceId =
  | 'littlesteps'
  | 'littlebloom'
  | 'littleexplorer'
  | 'babyoasis'
  | 'littleouting';

export interface ServiceTheme {
  id: ServiceId;
  /** Wordmark, shown in the page header. */
  name: string;
  /** Two-to-four character Chinese role label sitting under the wordmark. */
  role: string;
  /** The one icon this service is allowed to use as identity. */
  icon: LucideIcon;

  /** Page background. */
  pageBg: string;
  /** Faint tint for a panel that needs to sit apart from a white sibling. */
  tint: string;
  /** Decorative fill: progress bars, dots, active indicators. Never text. */
  accent: string;
  /** Readable brand shade: headings, links, icon glyphs on white. */
  ink: string;
  /**
   * Solid bed for a primary button or active chip. Pair it with `fillText` —
   * a yellow brand cannot reach 4.5:1 under white text without going brown
   * and losing the colour entirely, so LittleExplorer keeps its bright amber
   * and puts dark ink on it (6.31:1) instead.
   */
  fill: string;
  /** Text colour that belongs on `fill`. */
  fillText: string;
  /** Body copy. */
  body: string;
  /** Muted captions. */
  muted: string;
}

export const SERVICE_THEME: Record<ServiceId, ServiceTheme> = {
  littlesteps: {
    id: 'littlesteps',
    name: 'LittleSteps',
    role: '寶寶成長',
    icon: Baby,
    pageBg: 'bg-warm-white',
    tint: 'bg-primary-soft',
    accent: 'bg-primary',
    ink: 'text-primary-dark',
    fill: 'bg-primary-dark',
    fillText: 'text-white',
    body: 'text-ink',
    muted: 'text-ink-muted',
  },
  littlebloom: {
    id: 'littlebloom',
    name: 'LittleBloom',
    role: '孕期陪伴',
    icon: Flower2,
    pageBg: 'bg-bloom-cream',
    tint: 'bg-bloom-blush/50',
    accent: 'bg-bloom-dusty-rose',
    ink: 'text-bloom-dusty-rose-ink',
    fill: 'bg-bloom-dusty-rose-deep',
    fillText: 'text-white',
    body: 'text-bloom-stone-ink',
    // /80 keeps muted visibly lighter than body while still clearing the 3:1
    // floor on bloom-cream (3.38:1). /70 was 2.82:1 there — under the floor.
    muted: 'text-bloom-stone-ink/80',
  },
  littleexplorer: {
    id: 'littleexplorer',
    name: 'LittleExplorer',
    role: '幼兒期陪伴',
    icon: Sun,
    pageBg: 'bg-explorer-sand',
    tint: 'bg-explorer-sunbeam-light/30',
    accent: 'bg-explorer-sunbeam',
    ink: 'text-explorer-sunbeam-ink',
    fill: 'bg-explorer-sunbeam',
    fillText: 'text-ink',
    body: 'text-explorer-bark',
    muted: 'text-explorer-bark/70',
  },
  babyoasis: {
    id: 'babyoasis',
    name: 'BabyOasis',
    role: '哺乳室地圖',
    icon: MapPin,
    pageBg: 'bg-warm-white',
    tint: 'bg-secondary-soft',
    accent: 'bg-secondary',
    ink: 'text-secondary-dark',
    fill: 'bg-secondary-dark',
    fillText: 'text-white',
    body: 'text-ink',
    muted: 'text-ink-muted',
  },
  littleouting: {
    id: 'littleouting',
    name: 'LittleOuting',
    role: '親子好去處',
    icon: Trees,
    pageBg: 'bg-warm-white',
    tint: 'bg-outing-soft',
    accent: 'bg-outing',
    ink: 'text-outing-ink',
    fill: 'bg-outing-ink',
    fillText: 'text-white',
    body: 'text-ink',
    muted: 'text-ink-muted',
  },
};

/**
 * Entry-point order: the timeline a family actually moves through, with the
 * two "where can we go" services last because they apply at every stage.
 */
export const SERVICE_ORDER: ServiceId[] = [
  'littlebloom',
  'littlesteps',
  'littleexplorer',
  'littleouting',
  'babyoasis',
];
