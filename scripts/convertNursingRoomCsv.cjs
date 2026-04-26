/**
 * Convert nursing room CSV data to TypeScript format
 * Run with: node scripts/convertNursingRoomCsv.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// CSV file path
const csvPath = path.join(__dirname, '../src/data/nursingRoom/taipei.csv');
const outputPath = path.join(__dirname, '../src/data/nursingRoomsData.ts');

// Convert Big5 to UTF-8 and read CSV
const csvContent = execSync(`iconv -f BIG5 -t UTF-8 "${csvPath}"`).toString();
const lines = csvContent.split('\n').filter(line => line.trim());

// Parse CSV (simple parser - handles basic cases)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

// Parse facilities from text
function parseFacilities(basicFacilities, friendlyFacilities) {
  const facilities = {
    privateCurtain: false,
    nursingChair: false,
    waterDispenser: false,
    changingTable: false,
    washBasin: false,
    refrigerator: false,
    microwave: false,
    airConditioning: false,
    babyBed: false,
    socket: false,
  };

  const combined = `${basicFacilities};${friendlyFacilities}`.toLowerCase();

  // Map keywords to facilities
  if (combined.includes('可由內部上鎖') || combined.includes('獨立空間') || combined.includes('隱私')) {
    facilities.privateCurtain = true;
  }
  if (combined.includes('靠背椅') || combined.includes('哺乳椅') || combined.includes('座椅')) {
    facilities.nursingChair = true;
  }
  if (combined.includes('飲水機') || combined.includes('飲水')) {
    facilities.waterDispenser = true;
  }
  if (combined.includes('尿布台') || combined.includes('換尿布') || combined.includes('更衣台')) {
    facilities.changingTable = true;
  }
  if (combined.includes('洗手台') || combined.includes('洗手設施') || combined.includes('洗手')) {
    facilities.washBasin = true;
  }
  if (combined.includes('冰箱') || combined.includes('冷藏')) {
    facilities.refrigerator = true;
  }
  if (combined.includes('微波爐')) {
    facilities.microwave = true;
  }
  if (combined.includes('冷氣') || combined.includes('空調')) {
    facilities.airConditioning = true;
  }
  if (combined.includes('嬰兒床') || combined.includes('娃娃床')) {
    facilities.babyBed = true;
  }
  if (combined.includes('插座') || combined.includes('電源設備') || combined.includes('延長線')) {
    facilities.socket = true;
  }

  return facilities;
}

// Extract district from address
function extractDistrict(address) {
  const match = address.match(/臺北市(\S{2,3}區)/);
  return match ? match[1] : undefined;
}

// Parse header
const header = parseCSVLine(lines[0]);
console.log('CSV Header:', header);
console.log('Total rows:', lines.length - 1);

// Parse data rows
const nursingRooms = [];
let skippedCount = 0;

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);

  if (row.length < 13) {
    skippedCount++;
    continue;
  }

  const [
    districtCode,
    name,
    address,
    phone,
    extension,
    mobile,
    openingHours,
    locationDescription,
    basicFacilities,
    friendlyFacilities,
    certification,
    wheelchairAccess,
    remarks,
  ] = row;

  // Skip if missing essential data
  if (!name || !address) {
    skippedCount++;
    continue;
  }

  const district = extractDistrict(address);
  const facilities = parseFacilities(basicFacilities || '', friendlyFacilities || '');

  // Format phone number
  let formattedPhone = phone || '';
  if (extension) {
    formattedPhone += ` ${extension}`;
  }
  if (mobile) {
    formattedPhone += mobile ? ` / ${mobile}` : '';
  }

  const room = {
    id: `taipei-${i}`,
    name: name.replace(/\n/g, ' ').trim(),
    address: address.trim(),
    city: '台北市',
    district,
    floor: locationDescription ? locationDescription.split(',')[0] : undefined,
    locationDescription: locationDescription || undefined,
    latitude: 25.0330, // Default to Taipei center - needs geocoding
    longitude: 121.5654,
    facilities,
    openingHours: openingHours || undefined,
    phone: formattedPhone || undefined,
    remarks: remarks || undefined,
    lastUpdated: '2026-04-26',
    isVerified: !!certification,
    rating: undefined,
    reviewCount: undefined,
  };

  nursingRooms.push(room);
}

console.log(`Parsed ${nursingRooms.length} nursing rooms`);
console.log(`Skipped ${skippedCount} rows`);

// Generate TypeScript file
const tsContent = `import { NursingRoom } from '../types';

/**
 * Nursing room data for Taipei City
 * Source: Taiwan government open data
 * Last updated: 2026-04-26
 *
 * NOTE: Latitude/Longitude coordinates are set to Taipei city center by default.
 * These need to be geocoded using the address field.
 *
 * Total rooms: ${nursingRooms.length}
 */
export const nursingRoomsTaipei: NursingRoom[] = ${JSON.stringify(nursingRooms, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`\n✅ Generated: ${outputPath}`);
console.log('\n⚠️  IMPORTANT: All coordinates are set to Taipei center (25.0330, 121.5654)');
console.log('   You need to geocode the addresses to get accurate locations.');
console.log('\n📍 Geocoding options:');
console.log('   1. Use Google Maps Geocoding API');
console.log('   2. Use OpenStreetMap Nominatim API');
console.log('   3. Manual geocoding for important locations');
