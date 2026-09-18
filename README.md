# GTA: Liberty City Stories — 100% Interactive Map & Checklist

[![GitHub Pages](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-blue?logo=github)](https://gillian.github.io/gta-lcs-map/)
[![Vanilla JS](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20%26%20Leaflet-orange?logo=javascript)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An interactive, high-performance web map and complete 100% completion checklist tracker for **Grand Theft Auto: Liberty City Stories**. Built with modern vanilla JavaScript, Leaflet.js, and CSS3—no bulky frameworks, no build step, and zero external runtime dependencies.

Designed for instant offline capability, fast mobile navigation, and seamless hosting on **GitHub Pages**.

---

## 🌟 Key Features

- **🗺️ High-Definition 4K Anti-Aliased Map**:
  - Reconstructed from high-resolution multi-layer radar source assets with smooth, clean anti-aliasing on curves, roads, and coastlines.
  - Dedicated island quick-jump controls for **Portland**, **Staunton Island**, and **Shoreside Vale**.
  - Dynamic scale clamping with smooth gesture zooming and panning.

- **📋 100% Completion Checklist & Progress Tracker**:
  - Comprehensive database covering all **73 mandatory missions and side activities** required for 100% completion, plus all optional side challenges.
  - Live progress tracking with percentage calculation, island filtering, and keyword search.
  - Interactive "Show on Map" button linking every checklist item directly to its map coordinates.
  - Dedicated **Safehouse Weapon Milestone** counter (unlocking weapons at 10, 20, 30... 100 packages).
  - Persistent user preferences (including "Show Optional Tasks" and "Hide Found Items") saved automatically in `localStorage`.

- **📍 Distinct Marker Pins & Same-Spot Clustering**:
  - Custom SVG pin silhouettes tailored for each category:
    - 🤘 **Hidden Packages** (Authentic rock horns charm)
    - 💀 **Rampages** (Skull)
    - 📐 **Unique Stunt Jumps** (Ramp)
    - 🚗 **Vehicle Sub-Missions** (Steering Wheel)
    - 💼 **Odd Jobs** (Briefcase)
    - 🏎️ **Races** (Sports Car)
    - 🎯 **Side Challenges** (Stopwatch)
  - Smart same-spot clustering with shoulder count badges for markers located at identical coordinates.

- **🎨 Accessible Colorblind-Friendly Palettes**:
  - Choose between **Default (Subdued)**, **Protan / Deutan (Red-Green)**, **Tritanopia (Blue-Yellow)**, and **High Contrast** modes.
  - Features dual-layer black-outlined vector glyphs on colorblind modes for maximum legibility on all displays.

- **🎬 Video Walkthroughs & In-Game Screenshot Tips**:
  - In-game screenshot tip cards for all collectibles.
  - Embedded 540p lightweight MP4 walkthrough clips for all 100 Hidden Packages with sequential "◀ Prev" and "Next ▶" stepping.

- **💾 Data Backup & Portability**:
  - Export and import full checklist and collectible progress as standard JSON files to seamlessly transfer progress across devices or browsers.

---

## 📂 Project Structure

```text
├── assets/
│   ├── images/              # Clean in-game screenshot tips (.webp)
│   ├── map/                 # 4K high-res radar map source (.png)
│   └── videos/              # Trimmed package walkthrough clips (.mp4)
├── css/
│   └── style.css            # Dark mode responsive stylesheet
├── data/
│   ├── markers_data.js      # Canonical marker definitions (178 pins)
│   └── checklist_data.js    # Complete 100% & optional task database
├── js/
│   └── app.js               # Application logic, Leaflet controller, & storage
├── scripts/
│   ├── extract_data.py      # Data extraction and parsing utilities
│   └── slice_videos.py      # Video clipping & optimization script
├── index.html               # Main web application entrypoint
└── README.md
```

---

## 🚀 Running Locally

No npm install, bundler, or build step is needed! You can run the application locally using any static web server:

### Using Python 3:
```bash
python -m http.server 8080
```

### Using Node.js (`npx serve`):
```bash
npx serve -l 8080 .
```

Then open your browser to **[http://localhost:8080](http://localhost:8080)**.

---

## 🌐 Deploying to GitHub Pages

1. Fork or push this repository to your GitHub account:
   ```bash
   git branch -M main
   git push -u origin main
   ```
2. Navigate to your repository on GitHub:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select the `main` branch and `/ (root)` folder.
   - Click **Save**.
3. GitHub Pages will publish the site in seconds at `https://<username>.github.io/<repo-name>/`.

---

## 🤝 Contributing

Contributions from the community are warmly welcomed! Please read our [Contributing Guide](CONTRIBUTING.md) for full details on project standards, local workflows, and pull request steps.

### 1. Modifying or Adding Markers (`data/markers_data.js`)
Marker pins are structured in `data/markers_data.js`:
```javascript
{
  "id": "hp_2",
  "category": "hidden_packages",
  "number": 2,
  "title": "Hidden Package #2",
  "location": "Harwood",
  "island": "Portland",
  "objective": "Locate and collect package in Harwood.",
  "lat": -56.02592,
  "lng": 87.10944,
  "image": "assets/images/lcs_hp_2.webp",
  "video": "assets/videos/hp_1.mp4",
  "video_start": 45,
  "video_end": 64,
  "video_timestamp": "0:45"
}
```
- Coordinates (`lat`, `lng`) map directly onto the simple coordinate system (`[[-128, 0], [0, 128]]`).

### 2. Updating the Checklist (`data/checklist_data.js`)
Checklist tasks are grouped under categories:
```javascript
{
  "id": "mission_slashes",
  "title": "Slash / Walk in the Park",
  "giver": "Vincenzo Cilli",
  "island": "Portland",
  "required": true,
  "reward": "$1,000",
  "coords": [-76.4, 98.2],
  "desc": "Kill the Leone traitor in Harwood park."
}
```
- Set `required: true` for mandatory 100% completion items, or `required: false` for optional bonus tasks.
- If a task correlates directly to a map pin, link it via `markerId: "marker_id"`.

### 3. Media Guidelines
- **Screenshots**: Place screenshots in `assets/images/`. Format as WebP at `800x450` or `1280x720` resolution with high-quality compression to ensure fast loading times.
- **Videos**: Videos should be MP4 format (H.264 video, AAC audio), 540p resolution, with an initial 2-3 second map preview followed by the pickup location.

### 4. Code Conventions
- Keep scripts clean, modular, and dependency-free.
- Test across desktop and mobile screens before opening a pull request.

---

## 🏆 Credits & Sources

We are grateful to the following creators and resources whose work made this project possible:

- **[SonofUgly](https://github.com/SonofUgly/LCS-Texture-Pack)**: High-resolution Liberty City radar map redraw decompressed from the open-source Paint.NET multi-layer assets.
- **[GTASeriesVideos](https://www.youtube.com/c/GTASeriesVideos)**: Walkthrough gameplay video guides and collectible timestamps.
- **[GTAMap.net](https://gtamap.net)**: Original interactive coordinate database and marker positions.
- **[GTA Wiki / Fandom](https://gta.fandom.com/wiki/Grand_Theft_Auto:_Liberty_City_Stories)**: Comprehensive mission descriptions, unlock requirements, and completion criteria.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
Grand Theft Auto and Grand Theft Auto: Liberty City Stories are trademarks of Take-Two Interactive / Rockstar Games. This project is a non-commercial, fan-made resource.
