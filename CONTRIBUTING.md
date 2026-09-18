# Contributing to GTA: Liberty City Stories Interactive Map

Thank you for your interest in contributing! This project is an open-source, mobile-first interactive map and 100% checklist tracker for Grand Theft Auto: Liberty City Stories.

We welcome all contributions: fixing typos, improving collectible coordinates, enhancing screenshot tips, optimizing walkthrough clips, and improving accessibility or performance.

---

## 🚀 Quick Start (Local Setup)

This project has **zero build steps, zero bundlers, and zero required npm dependencies**.

1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/gta-lcs-map.git
   cd gta-lcs-map
   ```

2. **Start a local static server**:
   - Using Python 3:
     ```bash
     python -m http.server 8080
     ```
   - Using Node.js:
     ```bash
     npx serve -l 8080 .
     ```

3. Open your browser to `http://localhost:8080`.

---

## 🧪 Validating Data

Before opening a pull request, run the data validator to ensure there are no duplicate IDs, broken links, or missing media files:

```bash
node scripts/validate_data.js
```

This verifies:
- All 178 marker definitions have valid `lat` / `lng` coordinates.
- All referenced screenshot image paths exist on disk.
- All referenced walkthrough video paths exist on disk.
- All checklist items with a `markerId` correctly reference an existing marker.

---

## 📂 Project Architecture

- **`index.html`**: Web app shell, sidebar navigation, drawer layouts, and modals.
- **`css/style.css`**: Dark-theme mobile-first styling, Leaflet overrides, responsive layout rules.
- **`js/app.js`**: Core client-side logic, Leaflet map initializers, marker clustering, popups, and LocalStorage persistence.
- **`data/markers_data.js`**: Canonical database of all map pins across 7 categories (Hidden Packages, Rampages, Unique Stunt Jumps, Vehicle Sub-Missions, Odd Jobs, Races, and Side Challenges).
- **`data/checklist_data.js`**: Comprehensive 100% completion database (88 mandatory missions/tasks and 8 optional activities).
- **`assets/images/`**: 1080p clean in-game collectible screenshot tips (`.webp` format).
- **`assets/videos/`**: 540p lightweight MP4 walkthrough clips for all 100 Hidden Packages.
- **`assets/map/`**: 4K radar redraw map asset decompressed from multi-layer Paint.NET source.

---

## 🛠️ Adding or Editing Content

### 1. Markers (`data/markers_data.js`)
Each marker in `MARKERS_DATA.markers` follows this structure:
```javascript
{
  "id": "hp_4",
  "category": "hidden_packages",
  "number": 4,
  "title": "Hidden Package #4",
  "location": "Harwood",
  "island": "Portland",
  "objective": "Locate and collect package in Harwood.",
  "lat": -56.84864,
  "lng": 98.66432,
  "image": "assets/images/lcs_hp_4.webp",
  "video": "assets/videos/hp_4.mp4",
  "video_start": 122,
  "video_end": 145,
  "video_timestamp": "2:02",
  "countable": true
}
```
- **Coordinates**: `lat` spans `[-128, 0]`, `lng` spans `[0, 128]`.
- **Category values**: `hidden_packages`, `rampages`, `unique_stunt_jumps`, `vehicle_missions`, `odd_jobs`, `races`, `challenges`.

### 2. Checklist Missions (`data/checklist_data.js`)
Checklist tasks are defined in `CHECKLIST_DATA.categories`:
```javascript
{
  "id": "mission_snuff",
  "title": "Snuff",
  "giver": "Vincenzo Cilli",
  "island": "Portland",
  "required": true,
  "reward": "$500",
  "coords": [-76.4, 98.2],
  "desc": "Eliminate the Sindacco dealer inside the construction yard."
}
```
- Set `required: true` for storyline missions and mandatory side jobs required for the 100% trophy/achievement.
- If an activity has an associated map marker, add `markerId: "<marker_id>"` to enable bidirectional sync.

### 3. Media Assets
- **Screenshots**: Format as WebP at `1280x720` or `800x450`, compressed at 80-85% quality. Save to `assets/images/`.
- **Videos**: Format as MP4 (`h264`, `aac`, 540p resolution) with an initial 2.5-second map location preview followed by the pickup walkthrough. Save to `assets/videos/`.

---

## 📋 Pull Request Guidelines

1. Create a descriptive feature branch:
   ```bash
   git checkout -b fix/harwood-jump-coords
   ```
2. Test your changes locally on both desktop and mobile viewports.
3. Run `node scripts/validate_data.js` to ensure zero errors.
4. Commit your changes with a clear, descriptive message (e.g. `fix: adjust Stunt Jump #3 coordinates for greater accuracy`).
5. Open a Pull Request explaining what was changed and why.

Thank you for helping make the best GTA: Liberty City Stories companion resource!
