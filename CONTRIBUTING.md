# Contributing to Gillian's Interactive Maps

Thank you for your interest in contributing!

All kinds of contributions are welcome: adding new game maps, fixing typos, improving collectible coordinates, enhancing screenshot tips, optimizing walkthrough clips, and improving accessibility or performance across any supported map.

---

## Quick Start (Local Setup)

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

## Validating Data

Before opening a pull request, run the data validator for the relevant map to ensure there are no duplicate IDs, broken links, or missing media files:

```bash
node gta-lcs/scripts/validate_data.js
```

This verifies:
- All marker definitions have valid `lat` / `lng` coordinates.
- All referenced screenshot image paths exist on disk.
- All referenced walkthrough video paths exist on disk.
- All checklist items with a `markerId` correctly reference an existing marker.

---

## Project Architecture

The project consists of a central portal hub at the root and self-contained directories for each game map:

- **`index.html`**: Central portal hub listing all available interactive maps.
- **`css/portal.css`**: Dark-theme responsive styling for the portal hub and game cards.
- **`assets/`**: Shared assets across the portal (e.g. site favicon).

### Game Map Structure (`<game-slug>/`)

Each game map (e.g. `gta-lcs/`, and future additions like `gta-vcs/`, `gta-3/`, etc.) is self-contained:

- **`index.html`**: Map application shell, sidebar navigation, and 100% checklist drawer.
- **`css/style.css`**: Game-specific stylesheet and theme colors.
- **`js/app.js`**: Core client-side logic, Leaflet map initializers, marker clustering, popups, and LocalStorage progress persistence.
- **`data/markers_data.js`**: Canonical database of all map pins and collectible locations.
- **`data/checklist_data.js`**: Comprehensive 100% completion database and requirements.
- **`assets/images/`**: Clean in-game collectible screenshot tips (`.webp` format).
- **`assets/videos/`**: Lightweight walkthrough clips (`.mp4` format).
- **`assets/map/`**: High-resolution radar map imagery.
- **`scripts/`**: Data processing and validation scripts specific to that game.

---

## Adding or Editing Content

### 1. Markers (`<game-slug>/data/markers_data.js`)

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
- **Categories**: Collectibles, rampages, stunt jumps, side missions, races, challenges.

### 2. Checklist Missions (`<game-slug>/data/checklist_data.js`)

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

- Set `required: true` for storyline missions and mandatory side jobs required for 100% completion.
- If an activity has an associated map marker, add `markerId: "<marker_id>"` to enable bidirectional sync between the map pin and checklist row.

### 3. Media Assets

- **Screenshots**: Format as WebP at `1280x720` or `800x450`, compressed at 80-85% quality. Save to `<game-slug>/assets/images/`.
- **Videos**: Format as MP4 (`h264`, `aac`, 540p resolution) with an initial map location preview followed by the pickup walkthrough. Save to `<game-slug>/assets/videos/`.

### 4. Adding a New Game Map

To add a new game map to the portal:
1. Create a new directory for the game (e.g. `gta-vcs/`), using `gta-lcs/` as a reference template.
2. Provide the game's map image, marker data, checklist data, and styles inside that directory.
3. In root `index.html`, add a new card inside `.maps-grid`:

```html
<a href="./gta-vcs/" class="map-card" id="cardVcs">
  <div class="map-card-banner">
    <img src="./gta-vcs/assets/map/vcs_map.webp" alt="GTA: Vice City Stories Map" />
  </div>
  <div class="map-card-body">
    <h3 class="card-game-title">Grand Theft Auto: Vice City Stories</h3>
  </div>
</a>
```

---

## Pull Request Guidelines

1. Create a descriptive feature branch:

   ```bash
   git checkout -b feature/add-new-map
   ```

2. Test your changes locally on both desktop and mobile viewports.
3. If editing or adding map data, run the validator to ensure zero errors.
4. Commit your changes with a clear, descriptive message (e.g. `fix: adjust Stunt Jump #3 coordinates for greater accuracy` or `feat: add initial GTA III map`).
5. Open a Pull Request explaining what was changed and why.
