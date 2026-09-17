# GTA: Liberty City Stories — Interactive Mobile Map & Checklist

A lightweight, mobile-first interactive map for **Grand Theft Auto: Liberty City Stories**, specifically focused on **100 Hidden Packages** and **Side Activities & Challenges** (Rampages, Unique Stunt Jumps, Street Races, and Side Missions).

Designed to be hosted seamlessly on **GitHub Pages**.

---

## 🌟 Key Features

- **📱 Mobile-First & Responsive UX**:
  - Optimized for touch screens, smartphones (iPhone, Android) with safe-area insets (notch/dynamic island).
  - Floating controls designed for single-hand thumb navigation.
  - Slide-up bottom sheet with smooth drag handle to view details without blocking the map.

- **🎬 Video Walkthroughs for all 100 Hidden Packages**:
  - Each of the 100 packages includes an embedded, lightweight 540p MP4 clip.
  - **Trimmed Location Preview**: Features a 2.5-second lead-in showing the exact flashing red pin on the map, followed immediately by the complete 3D in-game pickup walkthrough.
  - Native inline playback (`playsinline`, muted autoplay with controls) that works universally across iOS Safari and Android Chrome.
  - **Sequential Stepper**: "◀ Prev" and "Next ▶" buttons automatically pan the camera across Liberty City from package to package in sequence.

- **📷 Official Image Tips**:
  - Over 150 official tip photos bundled locally for instant offline loading with zero broken CDN links.

- **💾 LocalStorage 100% Checklist Tracking**:
  - Mark any collectible as found/completed with one tap.
  - Markers visually update on the map (dimmed/crossed-out with checkmark badge).
  - Live progress counter and visual progress bar (e.g. `24 / 100 Packages`).
  - Option to **"Hide Found Items"** to declutter the map as you explore.
  - Export and Import your completion progress as a JSON file to transfer between devices.

- **📖 Rich GTA Fandom Wiki Details**:
  - Exact unlock requirements (e.g., *Unlocks after mission "Driving Mr. Leone"*, *Unlocks after "Love on the Rocks"*).
  - Objectives, required weapons/vehicles, and reward milestones.

- **🗺️ High-Resolution Map**:
  - Accurate high-definition Liberty City tile layer with 6 zoom levels.
  - Quick-jump buttons for **Portland**, **Staunton Island**, and **Shoreside Vale**.

---

## 📂 Project Structure

```text
├── assets/
│   ├── images/              # 155 localized tip screenshots (.webp)
│   └── videos/              # 100 trimmed package video walkthroughs (.mp4)
├── css/
│   └── style.css            # Dark mode mobile-first stylesheet
├── data/
│   ├── markers.json         # Complete dataset of 166 markers with Fandom notes
│   └── packages_timestamps.json # Video timestamp intervals
├── js/
│   └── app.js               # Interactive Leaflet logic, player, & LocalStorage tracker
├── scripts/
│   ├── extract_data.py      # Data generation & image download script
│   ├── slice_videos.py      # Multi-threaded FFmpeg video cutting script
│   └── verify_server.py     # Automated endpoint verification
├── index.html               # Web app entrypoint
└── README.md
```

---

## 🚀 Running Locally

You can run this project locally using Python's built-in HTTP server:

```bash
python -m http.server 8080
```

Then open your browser to [http://localhost:8080](http://localhost:8080).

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of GTA LCS Interactive Map"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Set the branch to `main` / `root`.
   - Click **Save**.
3. Your map will be live at `https://<your-username>.github.io/<repo-name>/`!

---

## 🏆 Credits

- **Video Walkthrough Source**: [GTA Series Videos](https://www.youtube.com/GTASeriesVideos)
- **Map Tiles & Tips Base**: [gtamap.net](https://gtamap.net)
- **Game Information & Unlock Requirements**: [GTA Wiki (Fandom)](https://gta.fandom.com)
