const fs = require('fs');
const vm = require('vm');

const markersCode = fs.readFileSync('data/markers_data.js', 'utf8');
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
    if (!fs.existsSync(m.image)) {
      console.warn('Image not found on disk:', m.image, 'for', m.id);
      missingImages++;
    }
  }

  if (m.video) {
    if (!fs.existsSync(m.video)) {
      console.warn('Video not found on disk:', m.video, 'for', m.id);
      missingVideos++;
    }
  }
}
console.log('Duplicates:', dupes, 'Missing Coords:', missingCoords, 'Missing Images:', missingImages, 'Missing Videos:', missingVideos);

const checklistCode = fs.readFileSync('data/checklist_data.js', 'utf8');
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
