#!/usr/bin/env node
'use strict';

/**
 * Builds public/data/outingParks.json: parks and playgrounds in Taiwan, with
 * coordinates, for LittleOuting's recommendations.
 *
 * Why OpenStreetMap
 *   Park data from the government is one dataset per city, in a different
 *   shape each time, and most counties publish none; inclusive-playground
 *   lists exist for Taipei and Taichung only. OSM covers all 22 counties in
 *   one schema, already carries coordinates, and is the source this app uses
 *   for metro stations and for the map itself. Licence: ODbL, attribution
 *   required (see ATTRIBUTION below and the about page).
 *
 * Why this reads a .osm.pbf extract and not the Overpass API
 *   `buildMrtStations.cjs` queries Overpass, which is fine for 263 points.
 *   Parks need their polygons — area, and which playgrounds lie inside — and
 *   that is several hundred megabytes of geometry through a rate-limited
 *   public endpoint. An extract is one static download and the same file
 *   gives the county boundaries.
 *
 * What a record says, and why nothing else
 *   Every field is a fact OSM states or geometry implies: the name, where it
 *   is, which county it falls in, how large it is, and whether a playground is
 *   mapped inside it. There is no rating and no "good for toddlers". A park
 *   with no playground mapped is not a park without one, so the page says
 *   "mapped", never "has none".
 *
 * Usage
 *   1. Install osmium-tool (`apt-get install osmium-tool`, `brew install osmium-tool`).
 *   2. Download the Taiwan extract:
 *        https://download.geofabrik.de/asia/taiwan-latest.osm.pbf
 *   3. node scripts/buildOutingParks.cjs path/to/taiwan-latest.osm.pbf
 *
 *   Any extract that covers Taiwan works; anything outside the 22 counties is
 *   dropped by the boundary test.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline');
const { execFileSync } = require('node:child_process');

const OUT_FILE = path.join(__dirname, '..', 'public', 'data', 'outingParks.json');

const ATTRIBUTION = '© OpenStreetMap 貢獻者，依 ODbL 授權';

/** The 22 counties, in the spelling the rest of LittleOuting uses. */
const COUNTIES = [
  '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市',
  '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '臺東縣', '澎湖縣', '金門縣', '連江縣',
];

/**
 * Below this the query or the extract is wrong; do not overwrite good data.
 * Taiwan has several thousand named parks in OSM.
 */
const MIN_PARKS = 2000;

/**
 * Parks smaller than this are dropped. A 150 m² traffic island tagged as a
 * park is not somewhere to take a child, and thousands of them would bury the
 * ones that are.
 */
const MIN_PARK_AREA_M2 = 500;

/** A playground this close to a park's edge counts as that park's. */
const NEAR_PARK_M = 30;

const EARTH_RADIUS_M = 6371008.8;
const rad = (deg) => (deg * Math.PI) / 180;

/** Ring area on a sphere, in m². Rings are [lng, lat] pairs. */
function ringArea(ring) {
  let total = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    const [lng1, lat1] = ring[i];
    const [lng2, lat2] = ring[i + 1];
    total += rad(lng2 - lng1) * (2 + Math.sin(rad(lat1)) + Math.sin(rad(lat2)));
  }
  return Math.abs((total * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2);
}

/** Polygons as arrays of rings: [outer, hole, hole, ...]. */
function polygonsOf(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

function areaOf(polygons) {
  return polygons.reduce(
    (sum, rings) => sum + ringArea(rings[0]) - rings.slice(1).reduce((s, r) => s + ringArea(r), 0),
    0,
  );
}

function bboxOf(polygons) {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const rings of polygons) {
    for (const [lng, lat] of rings[0]) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [minLng, minLat, maxLng, maxLat];
}

function inRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function inPolygons(lng, lat, polygons) {
  return polygons.some(
    (rings) => inRing(lng, lat, rings[0]) && !rings.slice(1).some((hole) => inRing(lng, lat, hole)),
  );
}

/**
 * A point guaranteed to be inside the shape, for the map pin. The centroid of
 * an L-shaped riverside park can fall in the river; when it does, the first
 * vertex of the largest ring is used instead — on the edge, but on the park.
 */
function pinOf(polygons) {
  const largest = polygons.reduce((best, rings) =>
    ringArea(rings[0]) > ringArea(best[0]) ? rings : best,
  );
  const ring = largest[0];
  let lng = 0;
  let lat = 0;
  for (let i = 0; i < ring.length - 1; i += 1) {
    lng += ring[i][0];
    lat += ring[i][1];
  }
  lng /= ring.length - 1;
  lat /= ring.length - 1;
  return inPolygons(lng, lat, polygons) ? [lng, lat] : ring[0];
}

function metresBetween(lng1, lat1, lng2, lat2) {
  const x = rad(lng2 - lng1) * Math.cos(rad((lat1 + lat2) / 2));
  const y = rad(lat2 - lat1);
  return Math.sqrt(x * x + y * y) * EARTH_RADIUS_M;
}

const round = (value, places) => Number(value.toFixed(places));

function osmium(args) {
  execFileSync('osmium', args, { stdio: ['ignore', 'inherit', 'inherit'] });
}

async function readFeatures(file) {
  const features = [];
  const lines = readline.createInterface({ input: fs.createReadStream(file) });
  for await (const line of lines) {
    // GeoJSON text sequences prefix each record with the RS control character.
    const text = line.replace(/^\u001e/, '').trim();
    if (text) features.push(JSON.parse(text));
  }
  return features;
}

async function main() {
  const input = process.argv[2];
  if (!input || !fs.existsSync(input)) {
    console.error('usage: node scripts/buildOutingParks.cjs path/to/taiwan-latest.osm.pbf');
    process.exit(1);
  }

  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'outing-parks-'));
  const filtered = path.join(work, 'filtered.osm.pbf');
  const places = path.join(work, 'places.geojsonseq');
  const boundaries = path.join(work, 'boundaries.geojsonseq');
  const boundaryPbf = path.join(work, 'boundaries.osm.pbf');

  console.log('filtering parks and playgrounds…');
  osmium(['tags-filter', input, 'nwr/leisure=park,playground', '-o', filtered, '--overwrite']);
  osmium(['export', filtered, '-f', 'geojsonseq', '-o', places, '--overwrite', '--add-unique-id=type_id']);

  console.log('filtering county boundaries…');
  osmium(['tags-filter', input, 'r/admin_level=4', '-o', boundaryPbf, '--overwrite']);
  osmium(['export', boundaryPbf, '-f', 'geojsonseq', '-o', boundaries, '--overwrite', '--geometry-types=polygon']);

  const counties = (await readFeatures(boundaries))
    .map((feature) => {
      const name = (feature.properties.name || '').replace(/^台/, '臺');
      const polygons = polygonsOf(feature.geometry);
      return { name, polygons, bbox: bboxOf(polygons) };
    })
    .filter((county) => COUNTIES.includes(county.name) && county.polygons.length > 0);

  const missing = COUNTIES.filter((name) => !counties.some((county) => county.name === name));
  if (missing.length > 0) {
    throw new Error(`county boundaries missing from the extract: ${missing.join('、')}`);
  }

  const countyOf = (lng, lat) =>
    counties.find(
      ({ bbox, polygons }) =>
        lng >= bbox[0] && lng <= bbox[2] && lat >= bbox[1] && lat <= bbox[3] &&
        inPolygons(lng, lat, polygons),
    )?.name;

  const features = await readFeatures(places);

  const parks = [];
  const playgrounds = [];
  for (const feature of features) {
    const tags = feature.properties;
    // Private gardens and school yards are mapped too; a parent cannot go in.
    if (tags.access === 'private' || tags.access === 'no' || tags.access === 'customers') continue;

    if (tags.leisure === 'park') {
      const polygons = polygonsOf(feature.geometry);
      const name = (tags['name:zh'] || tags.name || '').trim();
      if (polygons.length === 0 || !name) continue;
      const area = areaOf(polygons);
      if (area < MIN_PARK_AREA_M2) continue;
      const [lng, lat] = pinOf(polygons);
      parks.push({ id: feature.id, name, lng, lat, area, polygons, bbox: bboxOf(polygons), playgrounds: 0 });
    } else if (tags.leisure === 'playground') {
      let lng;
      let lat;
      if (feature.geometry.type === 'Point') [lng, lat] = feature.geometry.coordinates;
      else {
        const polygons = polygonsOf(feature.geometry);
        if (polygons.length === 0) continue;
        [lng, lat] = pinOf(polygons);
      }
      playgrounds.push({ id: feature.id, name: (tags['name:zh'] || tags.name || '').trim(), lng, lat });
    }
  }

  // Which park is each playground in? Most playgrounds are unnamed and only
  // mean something as "this park has one".
  const standalone = [];
  const margin = NEAR_PARK_M / 111000;
  for (const playground of playgrounds) {
    const { lng, lat } = playground;
    const host = parks.find(
      (park) =>
        lng >= park.bbox[0] - margin && lng <= park.bbox[2] + margin &&
        lat >= park.bbox[1] - margin && lat <= park.bbox[3] + margin &&
        (inPolygons(lng, lat, park.polygons) ||
          park.polygons.some((rings) =>
            rings[0].some(([x, y]) => metresBetween(lng, lat, x, y) <= NEAR_PARK_M),
          )),
    );
    if (host) host.playgrounds += 1;
    else if (playground.name) standalone.push(playground);
  }

  const rows = [];
  for (const park of parks) {
    const city = countyOf(park.lng, park.lat);
    if (!city) continue;
    rows.push({
      id: park.id,
      kind: 'park',
      name: park.name,
      city,
      lat: round(park.lat, 5),
      lng: round(park.lng, 5),
      // Two significant figures: the outline is a volunteer's tracing, and
      // "12,437 m²" would claim a precision it does not have.
      areaM2: Number(park.area.toPrecision(2)),
      playgrounds: park.playgrounds,
    });
  }
  for (const playground of standalone) {
    const city = countyOf(playground.lng, playground.lat);
    if (!city) continue;
    rows.push({
      id: playground.id,
      kind: 'playground',
      name: playground.name,
      city,
      lat: round(playground.lat, 5),
      lng: round(playground.lng, 5),
    });
  }

  const parkCount = rows.filter((row) => row.kind === 'park').length;
  if (parkCount < MIN_PARKS) {
    throw new Error(`only ${parkCount} parks; expected at least ${MIN_PARKS}. Not writing.`);
  }

  rows.sort(
    (a, b) =>
      COUNTIES.indexOf(a.city) - COUNTIES.indexOf(b.city) ||
      a.name.localeCompare(b.name, 'zh-Hant') ||
      a.id.localeCompare(b.id),
  );

  const output = {
    attribution: ATTRIBUTION,
    // The extract's own timestamp would be better, but not every mirror sets
    // it; the build date is what the page shows as "data as of".
    builtOn: new Date().toISOString().slice(0, 10),
    venues: rows,
  };
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(output)}\n`);
  fs.rmSync(work, { recursive: true, force: true });

  const withPlayground = rows.filter((row) => row.kind === 'park' && row.playgrounds > 0).length;
  console.log(
    `wrote ${rows.length} venues: ${parkCount} parks (${withPlayground} with a playground mapped), ` +
      `${rows.length - parkCount} standalone playgrounds, ${(fs.statSync(OUT_FILE).size / 1024).toFixed(0)} KB`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
