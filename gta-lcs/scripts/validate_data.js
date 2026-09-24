const fs = require('fs');
const path = require('path');
const vm = require('vm');

const BASE_DIR = path.resolve(__dirname, '..');
const markersCode = fs.readFileSync(path.join(BASE_DIR, 'data/markers_data.js'), 'utf8');
const MARKERS_DATA = vm.runInNewContext(markersCode + '; MARKERS_DATA;');

console.log('--- MARKERS DATA VALIDATION ---');
console.log('Categories:', Object.keys(MARKERS_DATA.categories));
console.log('Total markers:', MARKERS_DATA.markers.length);

const markerIds = new Set();
let dupes = 0;
let missingCoords = 0;
let missingImages = 0;
let missingVideos = 0;

for (const m of MARKERS_DATA.markers) {
  if (markerIds.has(m.id)) {
    console.error('Duplicate marker ID:', m.id);
    dupes++;
  }
  markerIds.add(m.id);

  if (typeof m.lat !== 'number' || typeof m.lng !== 'number') {
    console.error('Missing coords for:', m.id);
    missingCoords++;
  }

  if (m.image) {
    if (!fs.existsSync(path.join(BASE_DIR, m.image))) {
      console.warn('Image not found on disk:', m.image, 'for', m.id);
      missingImages++;
    }
  }

  if (m.video) {
    if (!fs.existsSync(path.join(BASE_DIR, m.video))) {
      console.warn('Video not found on disk:', m.video, 'for', m.id);
      missingVideos++;
    }
  }
}
console.log('Duplicates:', dupes, 'Missing Coords:', missingCoords, 'Missing Images:', missingImages, 'Missing Videos:', missingVideos);

// Verify category counts match marker totals
for (const [catKey, catObj] of Object.entries(MARKERS_DATA.categories)) {
  const actual = MARKERS_DATA.markers.filter(m => m.category === catKey).length;
  if (catObj.count !== actual) {
    console.error(`Category count mismatch for ${catKey}: defined ${catObj.count}, actual ${actual}`);
    process.exitCode = 1;
  }
}

const checklistCode = fs.readFileSync(path.join(BASE_DIR, 'data/checklist_data.js'), 'utf8');
const CHECKLIST_DATA = vm.runInNewContext(checklistCode + '; CHECKLIST_DATA;');

console.log('\n--- CHECKLIST DATA VALIDATION ---');
let totalTasks = 0;
let mandatoryTasks = 0;
let optionalTasks = 0;
let brokenMarkerRefs = 0;

for (const cat of CHECKLIST_DATA.categories) {
  for (const item of cat.items) {
    totalTasks++;
    if (item.required) mandatoryTasks++;
    else optionalTasks++;

    if (item.markerId && !markerIds.has(item.markerId)) {
      console.warn('Broken markerId in checklist:', item.markerId, 'for item:', item.title);
      brokenMarkerRefs++;
    }
  }
}
console.log('Total checklist items:', totalTasks, 'Mandatory:', mandatoryTasks, 'Optional:', optionalTasks, 'Broken Marker Refs:', brokenMarkerRefs);

// --- MARKER COLLISION & OVERLAP VALIDATION ---
console.log('\n--- MARKER COLLISION & OVERLAP VALIDATION ---');
const MIN_MARKER_DISTANCE = 0.35; // Coordinate units (~22px clearance at zoom 5)
let collisions = 0;
const markers = MARKERS_DATA.markers;

for (let i = 0; i < markers.length; i++) {
  for (let j = i + 1; j < markers.length; j++) {
    const m1 = markers[i];
    const m2 = markers[j];
    const dist = Math.hypot(m1.lat - m2.lat, m1.lng - m2.lng);
    if (dist < MIN_MARKER_DISTANCE) {
      console.error(`COLLISION DETECTED (${dist.toFixed(4)} < ${MIN_MARKER_DISTANCE}):`);
      console.error(`  1. [${m1.category}] "${m1.title}" (${m1.id}) at [${m1.lat}, ${m1.lng}]`);
      console.error(`  2. [${m2.category}] "${m2.title}" (${m2.id}) at [${m2.lat}, ${m2.lng}]`);
      collisions++;
    }
  }
}
if (collisions > 0) {
  console.error(`FAILED: Found ${collisions} overlapping marker pair(s) closer than ${MIN_MARKER_DISTANCE} units!`);
  process.exitCode = 1;
} else {
  console.log(`PASSED: All ${markers.length} markers have sufficient clearance (min distance >= ${MIN_MARKER_DISTANCE} units).`);
}

// Verify synchronization between markers.json and markers_data.js
const rawMarkersJson = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'data/markers.json'), 'utf8'));
if (rawMarkersJson.markers.length !== MARKERS_DATA.markers.length) {
  console.error(`SYNC ERROR: markers.json (${rawMarkersJson.markers.length}) vs markers_data.js (${MARKERS_DATA.markers.length})`);
  process.exitCode = 1;
} else {
  console.log('PASSED: markers.json and markers_data.js are in sync.');
}
