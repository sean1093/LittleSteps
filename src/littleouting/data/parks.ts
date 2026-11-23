/**
 * Parks and playgrounds from OpenStreetMap, as LittleOuting reads them.
 *
 * The file itself is `public/data/outingParks.json`, built by
 * `scripts/buildOutingParks.cjs`; that script's header says where each field
 * comes from. It is fetched when the parks tab is first opened and never
 * imported, so it stays out of the JS bundle.
 */

export interface ParkVenue {
  /** OSM type and id, e.g. `w123456`. Stable across rebuilds. */
  id: string;
  kind: 'park' | 'playground';
  name: string;
  /** One of the 22 counties, in this app's spelling. */
  city: string;
  lat: number;
  lng: number;
  /** Parks only: area of the mapped outline, to two significant figures. */
  areaM2?: number;
  /** Parks only: playgrounds mapped inside the outline. */
  playgrounds?: number;
}

export interface ParkData {
  attribution: string;
  /** The day the file was built from the extract, YYYY-MM-DD. */
  builtOn: string;
  venues: ParkVenue[];
}

/**
 * What a stage asks of a park.
 *
 * `any`: somewhere to walk a pram round. `large`: room to crawl on a mat or
 * to run — one hectare, about a football pitch and a half. `playground`: a
 * playground is mapped there.
 */
export type ParkFilter = 'any' | 'large' | 'playground';

export const LARGE_PARK_M2 = 10000;

export const PARK_FILTERS: { id: ParkFilter; label: string }[] = [
  { id: 'any', label: '全部' },
  { id: 'playground', label: '有遊戲場' },
  { id: 'large', label: '1 公頃以上' },
];

export function matchesParkFilter(venue: ParkVenue, filter: ParkFilter): boolean {
  if (filter === 'playground') return venue.kind === 'playground' || (venue.playgrounds ?? 0) > 0;
  if (filter === 'large') return (venue.areaM2 ?? 0) >= LARGE_PARK_M2;
  return true;
}

/** "約 2.4 公頃" from one hectare up, "約 3,200 平方公尺" below. */
export function formatArea(areaM2: number): string {
  if (areaM2 >= LARGE_PARK_M2) {
    const hectares = areaM2 / 10000;
    return `約 ${hectares >= 10 ? Math.round(hectares) : Number(hectares.toFixed(1))} 公頃`;
  }
  return `約 ${areaM2.toLocaleString('en-US')} 平方公尺`;
}

const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * Distance in kilometres. Equirectangular: across Taiwan the error against
 * the haversine is metres, and the list only needs the order and one decimal.
 */
export function distanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const x = toRadians(to.lng - from.lng) * Math.cos(toRadians((from.lat + to.lat) / 2));
  const y = toRadians(to.lat - from.lat);
  return Math.sqrt(x * x + y * y) * EARTH_RADIUS_KM;
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 100) * 10} 公尺` : `${km.toFixed(1)} 公里`;
}
