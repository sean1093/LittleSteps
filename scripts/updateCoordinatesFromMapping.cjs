/**
 * Update nursing room coordinates from provided mapping files
 * Run with: node scripts/updateCoordinatesFromMapping.cjs
 */

const fs = require('fs');
const path = require('path');

// Read mapping files
const mapping1Path = path.join(__dirname, '../src/data/nursingRoom/mapping1.json');
const mapping2Path = path.join(__dirname, '../src/data/nursingRoom/mapping2.json');
const dataPath = path.join(__dirname, '../src/data/nursingRoomsData.ts');

console.log('Reading mapping files...');
const mapping1 = JSON.parse(fs.readFileSync(mapping1Path, 'utf-8'));
const mapping2 = JSON.parse(fs.readFileSync(mapping2Path, 'utf-8'));
const allMappings = [...mapping1, ...mapping2];

console.log(`Loaded ${mapping1.length} mappings from mapping1.json`);
console.log(`Loaded ${mapping2.length} mappings from mapping2.json`);
console.log(`Total: ${allMappings.length} address-coordinate mappings\n`);

// Normalize address for matching
function normalizeAddress(addr) {
  // Remove spaces, 之, -, and convert all variations to standard format
  return addr
    .replace(/\s+/g, '')
    .replace(/[之\-]/g, '')
    .replace(/臺/g, '台') // Convert 臺 to 台 for consistency
    .toLowerCase();
}

// Normalize name for matching
function normalizeName(name) {
  return name
    .replace(/\s+/g, '')
    .replace(/[()（）]/g, '')
    .toLowerCase();
}

// Create lookup maps
const addressMap = new Map();
const nameMap = new Map();

allMappings.forEach(item => {
  const normalizedAddr = normalizeAddress(item.address);
  const normalizedName = normalizeName(item.name);

  addressMap.set(normalizedAddr, {
    lat: item.latitude,
    lng: item.longitude,
    name: item.name,
    address: item.address
  });

  nameMap.set(normalizedName, {
    lat: item.latitude,
    lng: item.longitude,
    name: item.name,
    address: item.address
  });
});

console.log('Building lookup indexes...');
console.log(`Address index: ${addressMap.size} unique addresses`);
console.log(`Name index: ${nameMap.size} unique names\n`);

// Read the TypeScript file
console.log('Reading nursing room data...');
const content = fs.readFileSync(dataPath, 'utf-8');

// Extract the JSON array
const arrayDeclaration = 'export const nursingRoomsTaipei: NursingRoom[] = ';
const declarationIndex = content.indexOf(arrayDeclaration);
if (declarationIndex === -1) {
  throw new Error('Could not find nursingRoomsTaipei array declaration');
}

const searchStart = declarationIndex + arrayDeclaration.length;
const jsonStart = content.indexOf('[', searchStart);
const jsonEnd = content.lastIndexOf(']') + 1;

if (jsonStart === -1 || jsonEnd === 0) {
  throw new Error('Could not find array boundaries');
}

const jsonContent = content.substring(jsonStart, jsonEnd);
const nursingRooms = JSON.parse(jsonContent);

console.log(`Found ${nursingRooms.length} nursing rooms\n`);
console.log('='.repeat(60));
console.log('Updating coordinates...\n');

// Update coordinates
let matchedByAddress = 0;
let matchedByName = 0;
let alreadyHaveCoords = 0;
let notFound = 0;
const notFoundList = [];

nursingRooms.forEach((room, index) => {
  const normalizedAddr = normalizeAddress(room.address);
  const normalizedName = normalizeName(room.name);

  // Check if already has valid coordinates (not default)
  const hasDefaultCoords = room.latitude === 25.033 && room.longitude === 121.5654;

  if (!hasDefaultCoords) {
    alreadyHaveCoords++;
    return;
  }

  // Try to match by address first
  let coords = addressMap.get(normalizedAddr);
  let matchType = '';

  if (coords) {
    matchType = 'address';
    matchedByAddress++;
  } else {
    // Try to match by name
    coords = nameMap.get(normalizedName);
    if (coords) {
      matchType = 'name';
      matchedByName++;
    }
  }

  if (coords) {
    console.log(`[${index + 1}/${nursingRooms.length}] ✓ Matched by ${matchType}`);
    console.log(`  Name: ${room.name}`);
    console.log(`  Address: ${room.address}`);
    console.log(`  Coords: ${coords.lat}, ${coords.lng}`);

    room.latitude = coords.lat;
    room.longitude = coords.lng;
  } else {
    notFound++;
    notFoundList.push({
      id: room.id,
      name: room.name,
      address: room.address
    });
  }
});

console.log('\n' + '='.repeat(60));
console.log('Update Summary:');
console.log('='.repeat(60));
console.log(`✓ Matched by address: ${matchedByAddress}`);
console.log(`✓ Matched by name: ${matchedByName}`);
console.log(`→ Already had coordinates: ${alreadyHaveCoords}`);
console.log(`✗ Not found (still default): ${notFound}`);
console.log(`Total: ${nursingRooms.length}`);
console.log('='.repeat(60));

// Generate updated TypeScript file
const header = content.substring(0, jsonStart);
const footer = content.substring(jsonEnd);
const tsContent = header + JSON.stringify(nursingRooms, null, 2) + footer;

fs.writeFileSync(dataPath, tsContent, 'utf-8');
console.log(`\n✅ Updated: ${dataPath}`);

// Save not found list if any
if (notFoundList.length > 0) {
  const notFoundPath = path.join(__dirname, '../src/data/nursingRoom/not_found.json');
  fs.writeFileSync(notFoundPath, JSON.stringify(notFoundList, null, 2), 'utf-8');
  console.log(`\n⚠️  ${notFoundList.length} rooms still need coordinates`);
  console.log(`   Saved to: ${notFoundPath}`);

  if (notFoundList.length <= 10) {
    console.log('\n   Details:');
    notFoundList.forEach((item, i) => {
      console.log(`   ${i + 1}. ${item.name}`);
      console.log(`      ${item.address}`);
    });
  }
}

console.log('\n🎉 Done! You can now test the map at http://localhost:5173/#/babyoasis');
