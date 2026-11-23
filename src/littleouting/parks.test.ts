import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  LARGE_PARK_M2,
  distanceKm,
  formatArea,
  formatDistance,
  matchesParkFilter,
  type ParkData,
} from './parks';

/**
 * The shipped park file, held to what the page says about it, and the small
 * arithmetic the list is sorted and labelled by.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const data = JSON.parse(
  readFileSync(join(ROOT, 'public', 'data', 'outingParks.json'), 'utf8'),
) as ParkData;

const COUNTIES = [
  '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市',
  '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '臺東縣', '澎湖縣', '金門縣', '連江縣',
];

describe('outingParks.json', () => {
  it('credits OpenStreetMap under the ODbL and carries a build date', () => {
    // The licence requires attribution wherever the data is shown; the page
    // prints this string.
    expect(data.attribution).toContain('OpenStreetMap');
    expect(data.attribution).toContain('ODbL');
    expect(data.builtOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(data.builtOn).getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('has parks in every one of the 22 counties, and nowhere else', () => {
    const present = new Set(data.venues.map((venue) => venue.city));
    expect([...present].sort()).toEqual([...COUNTIES].sort());
  });

  it('is the size of a national list, not a truncated one', () => {
    expect(data.venues.length).toBeGreaterThan(4000);
  });

  it('puts every pin inside the box that holds Taiwan and its outlying islands', () => {
    for (const venue of data.venues) {
      expect(venue.lat, venue.name).toBeGreaterThan(21.7);
      expect(venue.lat, venue.name).toBeLessThan(26.5);
      expect(venue.lng, venue.name).toBeGreaterThan(118.1);
      expect(venue.lng, venue.name).toBeLessThan(122.2);
    }
  });

  it('gives every park a Chinese name, a real area and a playground count', () => {
    for (const venue of data.venues) {
      expect(venue.name, venue.id).toMatch(/[一-鿿]/);
      expect(venue.areaM2, venue.name).toBeGreaterThanOrEqual(500);
      expect(Number.isInteger(venue.playgrounds), venue.name).toBe(true);
      expect(venue.playgrounds, venue.name).toBeGreaterThanOrEqual(0);
    }
  });

  it('has no duplicate ids', () => {
    expect(new Set(data.venues.map((venue) => venue.id)).size).toBe(data.venues.length);
  });

  it('names the district for nearly every park', () => {
    // Two parks called 中興公園 in one city are only told apart by district.
    const without = data.venues.filter((venue) => !venue.district);
    expect(without.length).toBeLessThan(data.venues.length * 0.01);
  });

  it('has something behind each filter the page offers', () => {
    expect(data.venues.some((venue) => matchesParkFilter(venue, 'playground'))).toBe(true);
    expect(data.venues.some((venue) => matchesParkFilter(venue, 'large'))).toBe(true);
    expect(data.venues.some((venue) => !matchesParkFilter(venue, 'large'))).toBe(true);
  });
});

describe('park arithmetic', () => {
  it('measures a known distance: Taipei Main Station to Taipei 101 is about 5 km', () => {
    const km = distanceKm({ lat: 25.0478, lng: 121.517 }, { lat: 25.0339, lng: 121.5645 });
    expect(km).toBeGreaterThan(4.8);
    expect(km).toBeLessThan(5.3);
  });

  it('is zero from a point to itself and symmetric', () => {
    const a = { lat: 24.15, lng: 120.67 };
    const b = { lat: 22.63, lng: 120.3 };
    expect(distanceKm(a, a)).toBe(0);
    expect(distanceKm(a, b)).toBeCloseTo(distanceKm(b, a), 9);
  });

  it('labels short distances in metres and long ones in kilometres', () => {
    expect(formatDistance(0.34)).toBe('340 公尺');
    expect(formatDistance(0.004)).toBe('0 公尺');
    expect(formatDistance(1)).toBe('1.0 公里');
    expect(formatDistance(12.34)).toBe('12.3 公里');
  });

  it('labels area in hectares from one hectare up', () => {
    expect(formatArea(LARGE_PARK_M2 - 1000)).toBe('約 9,000 平方公尺');
    expect(formatArea(LARGE_PARK_M2)).toBe('約 1 公頃');
    expect(formatArea(26000)).toBe('約 2.6 公頃');
    expect(formatArea(260000)).toBe('約 26 公頃');
  });
});
