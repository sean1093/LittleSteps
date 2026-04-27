/**
 * Geocode nursing room addresses using OpenStreetMap Nominatim API
 * Run with: node scripts/geocodeNursingRooms.cjs
 *
 * This script:
 * 1. Reads nursingRoomsData.ts
 * 2. Geocodes addresses using Nominatim API (with rate limiting)
 * 3. Updates the coordinates in the data file
 *
 * Note: Nominatim has usage limits (1 request/second)
 * For 306 rooms, this will take ~5-6 minutes
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const dataPath = path.join(__dirname, '../src/data/nursingRoomsData.ts');

// Read the TypeScript file
const content = fs.readFileSync(dataPath, 'utf-8');

// Extract the JSON array - find the actual array start after the variable declaration
const arrayDeclaration = 'export const nursingRoomsTaipei: NursingRoom[] = ';
const declarationIndex = content.indexOf(arrayDeclaration);
if (declarationIndex === -1) {
  throw new Error('Could not find nursingRoomsTaipei array declaration');
}

// Skip past the declaration to find the actual array opening bracket
const searchStart = declarationIndex + arrayDeclaration.length;
const jsonStart = content.indexOf('[', searchStart);
const jsonEnd = content.lastIndexOf(']') + 1;

if (jsonStart === -1 || jsonEnd === 0) {
  throw new Error('Could not find array boundaries');
}

const jsonContent = content.substring(jsonStart, jsonEnd);
const nursingRooms = JSON.parse(jsonContent);

console.log(`Found ${nursingRooms.length} nursing rooms to geocode`);

// Geocode a single address using Nominatim
function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=tw`;

    https.get(url, {
      headers: {
        'User-Agent': 'LittleSteps-BabyOasis-App/1.0'
      }
    }, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results && results.length > 0) {
            resolve({
              latitude: parseFloat(results[0].lat),
              longitude: parseFloat(results[0].lon)
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Geocode all rooms with rate limiting
async function geocodeAll() {
  let successCount = 0;
  let failCount = 0;
  const failed = [];

  for (let i = 0; i < nursingRooms.length; i++) {
    const room = nursingRooms[i];

    // Skip if already has valid coordinates (not default Taipei center)
    if (room.latitude !== 25.033 && room.longitude !== 121.5654) {
      console.log(`[${i + 1}/${nursingRooms.length}] ✓ ${room.name} - already geocoded`);
      successCount++;
      continue;
    }

    try {
      console.log(`[${i + 1}/${nursingRooms.length}] Geocoding: ${room.name} (${room.address})...`);

      const coords = await geocodeAddress(room.address);

      if (coords) {
        room.latitude = coords.latitude;
        room.longitude = coords.longitude;
        console.log(`  ✓ Found: ${coords.latitude}, ${coords.longitude}`);
        successCount++;
      } else {
        console.log(`  ✗ Not found`);
        failCount++;
        failed.push({ id: room.id, name: room.name, address: room.address });
      }

      // Rate limiting: 1 request per second
      if (i < nursingRooms.length - 1) {
        await delay(1100);
      }
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      failCount++;
      failed.push({ id: room.id, name: room.name, address: room.address });
      await delay(1100);
    }
  }

  console.log(`\n=== Geocoding Complete ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  if (failed.length > 0) {
    console.log(`\nFailed addresses:`);
    failed.forEach(item => {
      console.log(`  - ${item.name} (${item.address})`);
    });
  }

  return { successCount, failCount, failed };
}

// Main execution
(async () => {
  console.log('Starting geocoding process...');
  console.log('This will take approximately 5-6 minutes due to rate limiting.\n');

  const results = await geocodeAll();

  // Generate updated TypeScript file
  const header = content.substring(0, jsonStart);
  const tsContent = header + JSON.stringify(nursingRooms, null, 2) + ';\n';

  fs.writeFileSync(dataPath, tsContent, 'utf-8');
  console.log(`\n✅ Updated: ${dataPath}`);

  // Save failed addresses to a separate file for manual processing
  if (results.failed.length > 0) {
    const failedPath = path.join(__dirname, '../src/data/nursingRoomsData_failed.json');
    fs.writeFileSync(failedPath, JSON.stringify(results.failed, null, 2), 'utf-8');
    console.log(`⚠️  Failed addresses saved to: ${failedPath}`);
  }
})();
