/**
 * Geocode nursing room addresses using Google Maps Geocoding API
 * Run with: GOOGLE_MAPS_API_KEY=your_api_key node scripts/geocodeWithGoogleMaps.cjs
 *
 * This script:
 * 1. Reads nursingRoomsData.ts
 * 2. Geocodes addresses using Google Maps Geocoding API
 * 3. Updates the coordinates in the data file
 *
 * Setup:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a project or select existing
 * 3. Enable "Geocoding API"
 * 4. Create API Key in "Credentials"
 * 5. Set environment variable: export GOOGLE_MAPS_API_KEY=your_key
 *
 * Pricing:
 * - $5 per 1000 requests
 * - $200 free credit per month (40,000 free requests)
 * - This script will use ~306 requests (~$1.50, well within free tier)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Check for API key
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  console.error('❌ Error: GOOGLE_MAPS_API_KEY environment variable not set');
  console.error('\nUsage:');
  console.error('  export GOOGLE_MAPS_API_KEY=your_api_key');
  console.error('  node scripts/geocodeWithGoogleMaps.cjs');
  console.error('\nOr run in one line:');
  console.error('  GOOGLE_MAPS_API_KEY=your_api_key node scripts/geocodeWithGoogleMaps.cjs');
  process.exit(1);
}

const dataPath = path.join(__dirname, '../src/data/nursingRoomsData.ts');

// Read the TypeScript file
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

console.log(`Found ${nursingRooms.length} nursing rooms to geocode`);

// Geocode a single address using Google Maps Geocoding API
function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}&region=tw&language=zh-TW`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.status === 'OK' && response.results && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            resolve({
              latitude: location.lat,
              longitude: location.lng,
              formatted_address: response.results[0].formatted_address
            });
          } else if (response.status === 'ZERO_RESULTS') {
            resolve(null);
          } else {
            reject(new Error(`API error: ${response.status} - ${response.error_message || 'Unknown error'}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Delay helper (Google Maps allows more requests but still good to be polite)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Geocode all rooms with rate limiting
async function geocodeAll() {
  let successCount = 0;
  let failCount = 0;
  const failed = [];
  let totalCost = 0;

  for (let i = 0; i < nursingRooms.length; i++) {
    const room = nursingRooms[i];

    // Skip if already has valid coordinates (not default Taipei center)
    if (room.latitude !== 25.033 && room.longitude !== 121.5654) {
      console.log(`[${i + 1}/${nursingRooms.length}] ✓ ${room.name} - already geocoded`);
      successCount++;
      continue;
    }

    try {
      console.log(`[${i + 1}/${nursingRooms.length}] Geocoding: ${room.name}`);
      console.log(`  Address: ${room.address}`);

      const coords = await geocodeAddress(room.address);
      totalCost += 0.005; // $5 per 1000 requests

      if (coords) {
        room.latitude = coords.latitude;
        room.longitude = coords.longitude;
        console.log(`  ✓ Found: ${coords.latitude}, ${coords.longitude}`);
        console.log(`  Formatted: ${coords.formatted_address}`);
        successCount++;
      } else {
        console.log(`  ✗ Not found`);
        failCount++;
        failed.push({ id: room.id, name: room.name, address: room.address });
      }

      // Rate limiting: ~10 requests per second is safe for Google Maps
      if (i < nursingRooms.length - 1) {
        await delay(100);
      }
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      failCount++;
      failed.push({ id: room.id, name: room.name, address: room.address });
      await delay(100);
    }
  }

  console.log(`\n=== Geocoding Complete ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Estimated cost: $${totalCost.toFixed(2)} (well within $200 free tier)`);

  if (failed.length > 0) {
    console.log(`\nFailed addresses (${failed.length}):`);
    failed.slice(0, 10).forEach(item => {
      console.log(`  - ${item.name} (${item.address})`);
    });
    if (failed.length > 10) {
      console.log(`  ... and ${failed.length - 10} more`);
    }
  }

  return { successCount, failCount, failed };
}

// Main execution
(async () => {
  console.log('Starting Google Maps geocoding process...');
  console.log(`API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log('This should complete in about 30-60 seconds.\n');

  const startTime = Date.now();
  const results = await geocodeAll();
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Generate updated TypeScript file
  const header = content.substring(0, jsonStart);
  const footer = content.substring(jsonEnd);
  const tsContent = header + JSON.stringify(nursingRooms, null, 2) + footer;

  fs.writeFileSync(dataPath, tsContent, 'utf-8');
  console.log(`\n✅ Updated: ${dataPath}`);
  console.log(`⏱️  Duration: ${duration}s`);

  // Save failed addresses to a separate file for manual processing
  if (results.failed.length > 0) {
    const failedPath = path.join(__dirname, '../src/data/geocoding_failed.json');
    fs.writeFileSync(failedPath, JSON.stringify(results.failed, null, 2), 'utf-8');
    console.log(`⚠️  Failed addresses saved to: ${failedPath}`);
  }

  console.log('\n🎉 Done! You can now test the map at http://localhost:5173/#/babyoasis');
})();
