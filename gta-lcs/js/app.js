/**
 * GTA Liberty City Stories - Interactive Map & Checklist
 * Pure Black Ocean Canvas, 4K High-Res Clean Map, Attached Popups,
 * Colorblind-Aware Palettes, Same-Spot Icon Clustering with Count Badges
 */

const STORAGE_KEY = "gta_lcs_collected_markers";
const SETTINGS_KEY = "gta_lcs_user_settings";

const SAFE_REWARDS = [
  { count: 10, reward: "Pistol at Safehouses" },
  { count: 20, reward: "Shotgun at Safehouses" },
  { count: 30, reward: "Body Armor at Safehouses" },
  { count: 40, reward: "MP5 at Safehouses" },
  { count: 50, reward: ".357 Python at Safehouses" },
  { count: 60, reward: "M4 Assault Rifle at Safehouses" },
  { count: 70, reward: "Laser-scoped Sniper at Safehouses" },
  { count: 80, reward: "Flamethrower at Safehouses" },
  { count: 90, reward: "Rocket Launcher at Safehouses" },
  { count: 100, reward: "$50,000 Bonus" }
];

// Colorblind-Friendly Palettes
const PALETTES = {
  standard: {
    name: "Default (Subdued)",
    hidden_packages: "#c88219",
    rampages: "#b83232",
    unique_stunt_jumps: "#b89628",
    vehicle_missions: "#c05621",
    odd_jobs: "#2b6cb0",
    races: "#466e9b",
    challenges: "#327f5b"
  },
  red_green: {
    name: "Protan / Deutan",
    hidden_packages: "#e69f00",   // Warm Orange
    rampages: "#d55e00",          // Vermilion
    unique_stunt_jumps: "#f0e442",// Golden Yellow
    vehicle_missions: "#d55e00",  // Vermilion
    odd_jobs: "#0072b2",          // Blue
    races: "#56b4e9",             // Sky Blue
    challenges: "#cc79a7"         // Magenta / Reddish Purple
  },
  blue_yellow: {
    name: "Tritanopia",
    hidden_packages: "#e66101",
    rampages: "#ca0020",
    unique_stunt_jumps: "#fdb863",
    vehicle_missions: "#e66101",
    odd_jobs: "#0571b0",
    races: "#0571b0",
    challenges: "#92c5de"
  },
  high_contrast: {
    name: "High Contrast",
    hidden_packages: "#ffb000",
    rampages: "#ff0055",
    unique_stunt_jumps: "#ffe600",
    vehicle_missions: "#ff7b00",
    odd_jobs: "#00f5d4",
    races: "#00b4d8",
    challenges: "#00f5d4"
  }
};

// Clean, minimalist vector paths (24px viewBox)
const CATEGORY_ICONS = {
  hidden_packages: `<path fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-linecap="round" d="M 18.80 2.40 c -0.28 -0.36 -0.68 -0.58 -1.13 -0.63 c -0.45 -0.05 -0.89 0.07 -1.25 0.35 c -0.36 0.28 -0.58 0.68 -0.63 1.13 l -0.63 4.52 v -0.18 c 0.00 -0.93 -0.76 -1.69 -1.69 -1.69 c -0.63 0.00 -1.17 0.34 -1.47 0.85 c -0.29 -0.51 -0.84 -0.85 -1.47 -0.85 c -0.93 0.00 -1.69 0.76 -1.69 1.69 v 0.94 L 8.21 3.24 c -0.05 -0.45 -0.28 -0.85 -0.63 -1.13 c -0.36 -0.28 -0.80 -0.40 -1.25 -0.35 c -0.45 0.05 -0.85 0.28 -1.13 0.63 c -0.28 0.36 -0.41 0.80 -0.35 1.25 l 1.16 9.32 c -0.61 1.18 -0.80 2.49 -0.64 3.65 c 0.25 1.78 1.25 3.10 2.69 3.66 V 22.02 c 0.00 0.13 0.10 0.23 0.23 0.23 h 8.24 c 0.13 0.00 0.23 -0.10 0.23 -0.23 V 20.15 c 0.70 -0.48 1.15 -1.32 1.15 -2.31 l 0.17 -5.07 L 19.15 3.64 C 19.20 3.20 19.08 2.75 18.80 2.40 z M 13.46 6.34 c 0.68 0.00 1.24 0.56 1.24 1.24 v 4.04 c 0.00 0.68 -0.56 1.24 -1.24 1.24 c -0.45 0.00 -0.85 -0.24 -1.07 -0.62 c 0.12 -0.48 0.09 -0.99 -0.09 -1.44 c -0.02 -0.05 -0.05 -0.11 -0.07 -0.16 v -3.06 C 12.22 6.89 12.78 6.34 13.46 6.34 z M 10.53 6.34 c 0.68 0.00 1.24 0.56 1.24 1.24 v 2.47 c -0.43 -0.37 -1.01 -0.49 -1.63 -0.31 c -0.30 0.08 -0.58 0.18 -0.84 0.29 V 7.58 C 9.29 6.89 9.85 6.34 10.53 6.34 z M 5.30 3.58 c -0.04 -0.33 0.05 -0.65 0.26 -0.91 c 0.20 -0.26 0.50 -0.42 0.83 -0.46 c 0.33 -0.04 0.65 0.05 0.91 0.26 c 0.26 0.20 0.42 0.50 0.46 0.83 l 0.83 7.06 c -0.95 0.52 -1.68 1.20 -2.21 1.97 L 5.30 3.58 z M 18.70 3.59 l -1.08 9.14 l -0.17 5.10 c 0.00 1.31 -0.91 2.30 -2.13 2.30 c -0.13 0.00 -0.23 0.10 -0.23 0.23 s 0.10 0.23 0.23 0.23 c 0.35 0.00 0.68 -0.07 0.98 -0.19 V 21.79 H 8.51 v -1.37 c 0.39 0.10 0.80 0.16 1.23 0.16 c 0.13 0.00 0.23 -0.10 0.23 -0.23 s -0.10 -0.23 -0.23 -0.23 c -2.08 0.00 -3.62 -1.41 -3.92 -3.58 c -0.15 -1.07 0.03 -2.27 0.58 -3.35 c 0.04 -0.03 0.06 -0.08 0.07 -0.13 c 0.51 -0.94 1.33 -1.79 2.48 -2.38 c 0.00 -0.00 0.01 -0.00 0.01 -0.01 c 0.06 -0.03 0.13 -0.06 0.20 -0.10 c 0.00 -0.00 0.00 -0.00 0.00 -0.00 c 0.34 -0.16 0.71 -0.30 1.10 -0.41 c 0.63 -0.17 1.17 0.03 1.50 0.56 c 0.01 0.02 0.03 0.05 0.04 0.08 c 0.02 0.04 0.04 0.09 0.06 0.13 c 0.00 0.01 0.01 0.02 0.01 0.02 c 0.02 0.04 0.03 0.09 0.05 0.13 c 0.01 0.04 0.02 0.08 0.03 0.12 c 0.00 0.01 0.00 0.01 0.01 0.02 c 0.04 0.18 0.06 0.37 0.04 0.56 c -0.00 0.00 -0.00 0.01 -0.00 0.01 c -0.00 0.03 -0.01 0.06 -0.01 0.09 c -0.00 0.03 -0.01 0.06 -0.01 0.09 c -0.00 0.02 -0.01 0.04 -0.01 0.06 c -0.01 0.04 -0.02 0.08 -0.03 0.13 c -0.08 0.27 -0.22 0.54 -0.44 0.78 c -0.68 0.69 -1.57 1.26 -2.80 1.78 c -0.12 0.05 -0.17 0.18 -0.12 0.30 c 0.05 0.12 0.18 0.17 0.30 0.12 c 0.33 -0.14 0.64 -0.29 0.93 -0.44 c 0.18 -0.09 0.34 -0.18 0.49 -0.27 c 0.60 -0.36 1.11 -0.74 1.53 -1.18 c 0.15 -0.17 0.28 -0.34 0.37 -0.53 c 0.32 0.36 0.77 0.57 1.27 0.57 c 0.93 0.00 1.69 -0.76 1.69 -1.69 v -0.57 L 16.24 3.30 c 0.04 -0.33 0.20 -0.62 0.46 -0.83 c 0.26 -0.20 0.58 -0.30 0.91 -0.26 c 0.33 0.04 0.62 0.20 0.83 0.46 C 18.64 2.94 18.73 3.26 18.70 3.59 z"/>`,
  rampages: `<path d="M12 4c4.418 0 8 3.358 8 7.5c0 1.901 -.755 3.637 -2 4.96l0 2.54a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-2.54c-1.245 -1.322 -2 -3.058 -2 -4.96c0 -4.142 3.582 -7.5 8 -7.5" /><path d="M10 17v3M14 17v3" /><circle cx="9" cy="11.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="15" cy="11.5" r="1.5" fill="currentColor" stroke="none" />`,
  unique_stunt_jumps: `<path d="M3 19h18v2H3v-2zm1.5-4L15 6.5V11h2V3h-8v2h4.5L5.5 13 4.5 15z"/>`,
  vehicle_missions: `<path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,2a8,8,0,0,1,7.38,4.92A29.93,29.93,0,0,0,12,8a29.63,29.63,0,0,0-7.4.94A8,8,0,0,1,12,4ZM4,12.67l1.11-.13A4.38,4.38,0,0,1,10,16.89v2.85A8,8,0,0,1,4,12.67Zm10,7.07V16.89a4.38,4.38,0,0,1,4.86-4.35l1.11.13A8,8,0,0,1,14,19.74Z"/>`,
  odd_jobs: `<path d="M20 6h-3V4c0-1.103-.897-2-2-2H9c-1.103 0-2 .897-2 2v2H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2m-5-2v2H9V4zM8 8h12v3H4V8zM4 19v-6h6v2h4v-2h6l.001 6z"/>`,
  races: `<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>`,
  challenges: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h6v-2h-4z"/>`
};

const ISLAND_BOUNDS = {
  all: [[-128, 0], [0, 128]],
  portland: [[-108, 76], [-52, 120]],
  staunton: [[-118, 44], [-52, 90]],
  shoreside: [[-110, 16], [-40, 60]]
};

const state = {
  markers: [],
  categories: {},
  islands: [],
  activeCategory: "all",
  searchQuery: "",
  hideCollected: false,
  clusterMarkers: true,
  palette: "standard",
  selectedPlatform: localStorage.getItem("gta_lcs_platform") || "psp_ps2",
  activeIsland: "all",
  currentMarker: null,
  currentMediaTab: "image",
  collected: new Set(),
  checklistTasks: new Set(),
  showOptionalTasks: false,
  collapsedCategories: new Set(),
  showPackageMilestones: false,
  activeChecklistIsland: "all",
  checklistSearchQuery: "",
  leafletMarkers: new Map(),
  map: null,
  markerLayer: null,
  vectorLayer: null,
  popup: null
};
window.state = state;
window.openMarkerPopup = openMarkerPopup;

// --- Storage Handlers ---
function loadCollected() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state.collected = new Set(JSON.parse(raw));
  } catch (e) {
    state.collected = new Set();
  }
}

function saveCollected() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.collected]));
  } catch (e) {}
  updateProgressUI();
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.hideCollected = !!parsed.hideCollected;
      if (typeof parsed.clusterMarkers === "boolean") {
        state.clusterMarkers = parsed.clusterMarkers;
      }
      if (typeof parsed.showOptionalTasks === "boolean") {
        state.showOptionalTasks = parsed.showOptionalTasks;
      }
      if (parsed.palette && PALETTES[parsed.palette]) {
        state.palette = parsed.palette;
      }
      if (parsed.selectedPlatform) {
        state.selectedPlatform = parsed.selectedPlatform;
      }
    }
  } catch (e) {}
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      hideCollected: state.hideCollected,
      clusterMarkers: state.clusterMarkers,
      palette: state.palette,
      showOptionalTasks: state.showOptionalTasks,
      selectedPlatform: state.selectedPlatform
    }));
  } catch (e) {}
}

// --- Apply Selected Colorblind Palette ---
function applyPalette(palKey) {
  const pal = PALETTES[palKey] || PALETTES.standard;
  state.palette = palKey;
  document.body.classList.toggle("colorblind-mode", palKey !== "standard");

  Object.keys(pal).forEach(catId => {
    if (state.categories[catId]) {
      state.categories[catId].color = pal[catId];
    }
  });

  // Update sidebar icon badges
  Object.keys(pal).forEach(catId => {
    const badge = document.querySelector(`.nav-item[data-cat="${catId}"] .cat-icon-badge`);
    if (badge) badge.style.backgroundColor = pal[catId];
  });

  // Update select input value (desktop sidebar & mobile settings modal)
  const selectEl = document.getElementById("selectPalette");
  if (selectEl) selectEl.value = palKey;
  const modalSelectEl = document.getElementById("modalSelectPalette");
  if (modalSelectEl) modalSelectEl.value = palKey;

  renderMarkers();
  initDrawerCategories();
  saveSettings();
}

// --- Dynamic Zoom Clamping (Fit full map strictly to viewport without excess void) ---
function calculateMinFitZoom() {
  const mapEl = document.getElementById("map");
  if (!mapEl) return 2.0;
  const w = mapEl.clientWidth || window.innerWidth;
  const h = mapEl.clientHeight || window.innerHeight;
  const isMobile = window.innerWidth <= 768;
  const availW = isMobile ? w : Math.max(320, w - 230);
  const availH = h;
  // In L.CRS.Simple, map coordinates span 128 x 128 units.
  // We want the entire map (128 units) to fit comfortably within the viewable screen.
  const fitZoom = Math.log2(Math.min(availW, availH) / 128);
  // Floor to 0.25 zoom snap so the entire map is completely visible, but CANNOT zoom out further!
  return Math.max(1.0, Math.floor(fitZoom * 4) / 4);
}

// --- Map Initialization ---
function initMap() {
  const minFitZoom = calculateMinFitZoom();

  state.map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: minFitZoom,
    maxZoom: 7.0,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 100,
    zoomControl: false,
    attributionControl: false,
    bounceAtZoomLimits: false,
    fadeAnimation: true,
    markerZoomAnimation: true,
    maxBounds: [[-128, 0], [0, 128]],
    maxBoundsViscosity: 1.0
  });

  window.addEventListener("resize", () => {
    if (state.map) {
      const z = calculateMinFitZoom();
      state.map.setMinZoom(z);
      if (state.map.getZoom() < z) {
        state.map.setZoom(z);
      }
    }
  });

  // 1. High-Resolution 4K Clean Map Layer (Smooth, anti-aliased, zero aliasing)
  state.vectorLayer = L.imageOverlay("assets/map/lcs_map_4096.webp?v=3.9", [[-128, 0], [0, 128]], {
    opacity: 1,
    interactive: false,
    zIndex: 1
  }).addTo(state.map);

  // 2. Single reusable attached Leaflet popup with pointer tip
  state.popup = L.popup({
    offset: [0, -34],
    className: "custom-leaflet-popup",
    closeButton: false,
    autoPan: true,
    autoPanPadding: [20, 20],
    maxWidth: 480,
    minWidth: 260
  });

  state.markerLayer = L.layerGroup().addTo(state.map);
  state.map.fitBounds(ISLAND_BOUNDS.all);

  // Zoom-dependent scaling listener
  function updateZoomScaleClass() {
    const z = state.map.getZoom();
    const mapEl = document.getElementById("map");
    if (!mapEl) return;
    mapEl.classList.remove("zoom-far", "zoom-mid", "zoom-near");
    if (z < 2.0) {
      mapEl.classList.add("zoom-far");
    } else if (z < 3.5) {
      mapEl.classList.add("zoom-mid");
    } else {
      mapEl.classList.add("zoom-near");
    }
  }

  state.map.on("zoom", updateZoomScaleClass);
  updateZoomScaleClass();

  // Re-cluster markers smoothly when zoom changes
  state.map.on("zoomend", () => {
    renderMarkers();
  });

  // Handle popup close to reset selection
  state.map.on("popupclose", () => {
    if (state.currentMarker) {
      const prevId = state.currentMarker.id;
      state.currentMarker = null;
      updateMarkerVisual(prevId);
    }
  });
}

// --- Marker Pin Generators ---
function renderPinIconSvg(category, isColorblind) {
  const iconPath = CATEGORY_ICONS[category] || CATEGORY_ICONS.hidden_packages;
  if (category === "hidden_packages") {
    if (isColorblind) {
      return `
        <g transform="translate(6, 6) scale(0.58)">
          <g fill="#000000" stroke="#000000" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">
            ${iconPath}
          </g>
          <g fill="#ffffff" stroke="#ffffff" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">
            ${iconPath}
          </g>
        </g>
      `;
    } else {
      return `
        <g transform="translate(6, 6) scale(0.58)" fill="#ffffff" stroke="#ffffff" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">
          ${iconPath}
        </g>
      `;
    }
  } else if (category === "rampages") {
    if (isColorblind) {
      return `
        <g transform="translate(6, 6) scale(0.58)">
          <g fill="none" stroke="#000000" color="#000000" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">
            ${iconPath}
          </g>
          <g fill="none" stroke="#ffffff" color="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${iconPath}
          </g>
        </g>
      `;
    } else {
      return `
        <g transform="translate(6, 6) scale(0.58)" fill="none" stroke="#ffffff" color="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${iconPath}
        </g>
      `;
    }
  } else {
    if (isColorblind) {
      return `
        <g transform="translate(6, 6) scale(0.58)" fill="#ffffff" stroke="#000000" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" style="paint-order: stroke fill;">
          ${iconPath}
        </g>
      `;
    } else {
      return `
        <g transform="translate(6, 6) scale(0.58)" fill="#ffffff">
          ${iconPath}
        </g>
      `;
    }
  }
}

function createMarkerIcon(marker) {
  const isCollected = state.collected.has(marker.id);
  const color = (state.categories[marker.category] && state.categories[marker.category].color) || marker.color || "#c88219";
  const isSelected = state.currentMarker && state.currentMarker.id === marker.id;
  const isColorblind = state.palette && state.palette !== "standard";

  const html = `
    <div class="map-pin ${isCollected ? 'collected' : ''} ${isSelected ? 'selected' : ''}">
      <svg viewBox="0 0 26 36" width="26" height="36" style="display: block;">
        <!-- Built-in Contact Shadow -->
        <ellipse cx="13" cy="34.5" rx="5" ry="1.5" fill="#000000" opacity="0.45"/>
        <!-- Pin Base with Crisp Outline -->
        <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21c0-7.18-5.82-13-13-13z" fill="${color}" stroke="#000000" stroke-width="1.4"/>
        <!-- Inner Head Tone -->
        <circle cx="13" cy="13" r="8.5" fill="#000000" opacity="0.2"/>
        <!-- Collectible Silhouette (High-Contrast Black Outline in Colorblind Modes) -->
        ${renderPinIconSvg(marker.category, isColorblind)}
      </svg>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: "pin-div-icon",
    iconSize: [26, 36],
    iconAnchor: [13, 34]
  });
}

function createClusterIcon(cluster) {
  const count = cluster.items.length;
  const color = cluster.color;
  const allCollected = cluster.items.every(m => state.collected.has(m.id));
  const isColorblind = state.palette && state.palette !== "standard";

  const html = `
    <div class="map-pin cluster-pin ${allCollected ? 'collected' : ''}">
      <svg viewBox="0 0 30 36" width="30" height="36" style="display: block; overflow: visible;">
        <!-- Built-in Contact Shadow -->
        <ellipse cx="13" cy="34.5" rx="5.5" ry="1.5" fill="#000000" opacity="0.45"/>
        <!-- Pin Base with Crisp Outline -->
        <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21c0-7.18-5.82-13-13-13z" fill="${color}" stroke="#000000" stroke-width="1.4"/>
        <!-- Inner Head Tone -->
        <circle cx="13" cy="13" r="8.5" fill="#000000" opacity="0.2"/>
        <!-- Collectible Silhouette (High-Contrast Black Outline in Colorblind Modes) -->
        ${renderPinIconSvg(cluster.category, isColorblind)}
        <!-- Integrated Cluster Count Badge on Pin Shoulder -->
        <circle cx="22" cy="6" r="6" fill="#0b0f19" stroke="#ffffff" stroke-width="1.4"/>
        <text x="22" y="6.5" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="7.5" font-weight="900" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${count}</text>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: "pin-div-icon cluster-div-icon",
    iconSize: [30, 36],
    iconAnchor: [13, 34]
  });
}

// --- Same-Spot Icon Grouping Algorithm ---
function getClusteredNodes(visibleMarkers, zoom) {
  if (!state.clusterMarkers || zoom >= 5.25) {
    return visibleMarkers.map(m => ({
      isCluster: false,
      lat: m.lat,
      lng: m.lng,
      category: m.category,
      color: (state.categories[m.category] && state.categories[m.category].color) || m.color,
      items: [m]
    }));
  }

  const threshold = 26; // pixel radius threshold
  const clusters = [];

  // Project marker locations to screen pixel space at current zoom
  const projected = visibleMarkers.map(m => {
    const pt = state.map.project([m.lat, m.lng], zoom);
    return { marker: m, x: pt.x, y: pt.y };
  });

  const visited = new Set();

  for (let i = 0; i < projected.length; i++) {
    if (visited.has(i)) continue;
    const p1 = projected[i];
    visited.add(i);

    const group = [p1.marker];
    let sumX = p1.x;
    let sumY = p1.y;

    for (let j = i + 1; j < projected.length; j++) {
      if (visited.has(j)) continue;
      const p2 = projected[j];

      // Group nearby markers of the same category
      if (p1.marker.category === p2.marker.category) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= threshold) {
          visited.add(j);
          group.push(p2.marker);
          sumX += p2.x;
          sumY += p2.y;
        }
      }
    }

    const cat = group[0].category;
    const color = (state.categories[cat] && state.categories[cat].color) || group[0].color;

    if (group.length > 1) {
      const avgPt = L.point(sumX / group.length, sumY / group.length);
      const latLng = state.map.unproject(avgPt, zoom);
      clusters.push({
        isCluster: true,
        lat: latLng.lat,
        lng: latLng.lng,
        category: cat,
        color: color,
        items: group
      });
    } else {
      clusters.push({
        isCluster: false,
        lat: p1.marker.lat,
        lng: p1.marker.lng,
        category: cat,
        color: color,
        items: [p1.marker]
      });
    }
  }

  return clusters;
}

function renderMarkers() {
  state.markerLayer.clearLayers();
  state.leafletMarkers.clear();

  const zoom = state.map ? state.map.getZoom() : 0;

  // 1. Filter visible markers
  const visible = state.markers.filter(marker => {
    if (state.activeCategory !== "all" && marker.category !== state.activeCategory) return false;

    // Strict island lock
    if (state.activeIsland === "portland" && marker.island !== "Portland") return false;
    if (state.activeIsland === "staunton" && marker.island !== "Staunton Island") return false;
    if (state.activeIsland === "shoreside" && marker.island !== "Shoreside Vale") return false;

    // Hide collected
    if (state.hideCollected && state.collected.has(marker.id)) return false;

    return true;
  });

  // 2. Perform same-spot clustering
  const nodes = getClusteredNodes(visible, zoom);

  // 3. Render markers
  nodes.forEach(node => {
    const latLng = [node.lat, node.lng];

    if (node.isCluster) {
      const lMarker = L.marker(latLng, { icon: createClusterIcon(node), keyboard: false });
      lMarker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        handleClusterClick(node);
      });
      lMarker.addTo(state.markerLayer);
      // Map all items in cluster for quick lookup
      node.items.forEach(m => state.leafletMarkers.set(m.id, lMarker));
    } else {
      const marker = node.items[0];
      const lMarker = L.marker(latLng, { icon: createMarkerIcon(marker), keyboard: false });
      lMarker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        openMarkerPopup(marker);
      });
      lMarker.addTo(state.markerLayer);
      state.leafletMarkers.set(marker.id, lMarker);
    }
  });
}

function handleClusterClick(cluster) {
  const currentZoom = state.map.getZoom();
  if (currentZoom < 4.75) {
    // Zoom in smoothly to disperse the clustered icons!
    state.map.flyTo([cluster.lat, cluster.lng], Math.min(state.map.getMaxZoom(), currentZoom + 1.25), {
      duration: 0.35
    });
  } else {
    // If already zoomed in or items are at identical spot, show cluster selection list popup
    openClusterListPopup(cluster);
  }
}

function openClusterListPopup(cluster) {
  const catMeta = state.categories[cluster.category] || { name: cluster.category, color: cluster.color };
  const itemsHtml = cluster.items.map(m => {
    const isFound = state.collected.has(m.id);
    return `
      <div class="cluster-popup-item" onclick="openMarkerFromCluster('${m.id}')">
        <div style="display: flex; align-items: center; gap: 6px; min-width: 0;">
          <span style="font-size: 13px;">${isFound ? '☑' : '☐'}</span>
          <div style="display: flex; flex-direction: column; min-width: 0;">
            <span style="font-weight: 600; font-size: 12px; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${m.title}">${m.title}</span>
            <span style="font-size: 10px; color: var(--text-muted);">${m.location ? m.location + ' • ' : ''}${m.island}</span>
          </div>
        </div>
        <button class="cluster-item-btn">View ➔</button>
      </div>
    `;
  }).join("");

  const popupHtml = `
    <div class="marker-popup-content">
      <div class="popup-header">
        <div class="popup-title-box">
          <div class="popup-title-row">
            <span class="popup-cat-badge" style="background-color: ${catMeta.color};"></span>
            <span class="popup-title">${cluster.items.length} ${catMeta.name} Here</span>
          </div>
          <span class="popup-subtitle">Select an item to view</span>
        </div>
        <button class="popup-close-btn" onclick="state.map.closePopup()">✕</button>
      </div>
      <div style="max-height: 200px; overflow-y: auto; padding: 6px; display: flex; flex-direction: column; gap: 4px;">
        ${itemsHtml}
      </div>
    </div>
  `;

  state.popup
    .setLatLng([cluster.lat, cluster.lng])
    .setContent(popupHtml)
    .openOn(state.map);

  setTimeout(() => {
    const popupEl = state.popup.getElement();
    if (popupEl) {
      popupEl.classList.remove("video-expanded");
      L.DomEvent.disableClickPropagation(popupEl);
      L.DomEvent.disableScrollPropagation(popupEl);
    }
  }, 10);
}

window.openMarkerFromCluster = function(markerId) {
  const target = state.markers.find(m => m.id === markerId);
  if (target) {
    setTimeout(() => {
      openMarkerPopup(target);
    }, 20);
  }
};

function updateMarkerVisual(markerId) {
  const lMarker = state.leafletMarkers.get(markerId);
  const marker = state.markers.find(m => m.id === markerId);
  if (lMarker && marker) {
    if (state.hideCollected && state.collected.has(markerId)) {
      renderMarkers();
    } else {
      lMarker.setIcon(createMarkerIcon(marker));
    }
  }
}

// --- Dynamic Safehouse Reward ---
function getDynamicRewardText() {
  const hpCollected = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
  const next = SAFE_REWARDS.find(r => r.count > hpCollected);
  if (next) {
    return `Next safehouse weapon: <strong>${next.reward}</strong> (${hpCollected}/${next.count})`;
  }
  return `All safehouse weapons unlocked (100/100)!`;
}

// --- Marker Sibling Navigation for Stepper Buttons ---
function getMarkerNavSiblings(marker) {
  if (!marker) return { prev: null, next: null, currentIdx: -1, total: 0 };
  const catMarkers = state.markers.filter(m => m.category === marker.category);
  const nums = catMarkers.map(m => m.number);
  const isDistinctNums = new Set(nums).size === catMarkers.length && nums.every(n => typeof n === "number");
  if (isDistinctNums) {
    catMarkers.sort((a, b) => a.number - b.number);
  }
  const idx = catMarkers.findIndex(m => m.id === marker.id);
  const prev = idx > 0 ? catMarkers[idx - 1] : null;
  const next = idx >= 0 && idx < catMarkers.length - 1 ? catMarkers[idx + 1] : null;
  return { prev, next, currentIdx: idx, total: catMarkers.length };
}

// --- Attached Marker Popup Controller & Auto-Zoom ---
function openMarkerPopup(marker) {
  const prevId = state.currentMarker ? state.currentMarker.id : null;
  state.currentMarker = marker;
  state.currentMediaTab = "image"; // Photo tip first

  // Smoothly center the map on the popup and pin with viewport-aware offsets
  const currentZoom = state.map.getZoom();
  const targetZoom = Math.max(currentZoom, 4.25);
  const isMobile = window.innerWidth <= 768;
  const sidebarWidth = isMobile ? 0 : 260;
  const offsetX = isMobile ? 0 : (sidebarWidth / 2);
  const offsetY = 135;
  const pt = state.map.project([marker.lat, marker.lng], targetZoom);
  const targetCenter = state.map.unproject([pt.x - offsetX, pt.y - offsetY], targetZoom);
  state.map.setView(targetCenter, targetZoom, { animate: false });

  if (prevId) updateMarkerVisual(prevId);
  updateMarkerVisual(marker.id);

  const catMeta = state.categories[marker.category] || { name: marker.category, color: marker.color };
  const isFound = state.collected.has(marker.id);
  const isPkg = marker.category === "hidden_packages";
  const nav = getMarkerNavSiblings(marker);
  const prevDisabled = !nav.prev ? 'disabled' : '';
  const nextDisabled = !nav.next ? 'disabled' : '';
  const prevTitle = nav.prev ? `Previous: ${nav.prev.title}` : 'No previous marker';
  const nextTitle = nav.next ? `Next: ${nav.next.title}` : 'No next marker';

  // Build attached popup HTML
  const popupHtml = `
    <div class="marker-popup-content">
      <!-- Popup Header -->
      <div class="popup-header">
        <div class="popup-title-box">
          <div class="popup-title-row">
            <span class="popup-cat-badge" style="background-color: ${catMeta.color};"></span>
            <span class="popup-title" title="${marker.title}">${marker.title}</span>
          </div>
          <span class="popup-subtitle">${marker.location ? marker.location + ' • ' : ''}${marker.island}</span>
        </div>
        <button class="popup-close-btn" id="popupCloseBtn" onclick="handlePopupAction(event, 'close')" aria-label="Close">✕</button>
      </div>

      <!-- Media Box (16:9) -->
      <div class="popup-media-box" id="popupMediaBox">
        ${marker.image ? `<img id="popupMediaImg" src="${marker.image}" alt="${marker.title}" loading="eager" />` : `<div class="popup-media-empty" id="popupMediaImg">No photo tip available.</div>`}
        ${marker.video ? `<video id="popupMediaVid" src="${marker.video}" controls playsinline muted loop preload="metadata" style="display: none;"></video>` : ''}
      </div>

      <!-- Media Switcher (Only if video walkthrough exists) -->
      ${marker.video ? `
        <div class="popup-media-tabs">
          <button class="popup-tab-btn active" id="popupTabImg" onclick="handlePopupAction(event, 'tab-img')">Photo Tip</button>
          <button class="popup-tab-btn" id="popupTabVid" onclick="handlePopupAction(event, 'tab-vid')">Walkthrough Video</button>
        </div>
      ` : ''}

      <!-- Collectible Info -->
      <div class="popup-info-box">
        ${marker.unlock ? `<div class="popup-unlock">🔒 ${marker.unlock}</div>` : ''}
        ${marker.objective ? `<div class="popup-objective">${marker.objective}</div>` : ''}
        ${isPkg ? `<div class="popup-reward" id="popupRewardText">🎁 ${getDynamicRewardText()}</div>` : (marker.reward ? `<div class="popup-reward">🎁 Reward: ${marker.reward}</div>` : '')}
      </div>

      <!-- Popup Action Toolbar: Found Button + Stepper -->
      <div class="popup-actions">
        <button class="popup-stepper-btn" id="popupBtnPrev" title="${prevTitle}" onclick="handlePopupAction(event, 'prev')" ${prevDisabled}>◀</button>
        <button class="btn-mark-found ${isFound ? 'collected' : ''}" id="popupBtnFound" onclick="handlePopupAction(event, 'found')">
          <span class="check-box-icon">${isFound ? '☑' : '☐'}</span> Found
        </button>
        <button class="popup-stepper-btn" id="popupBtnNext" title="${nextTitle}" onclick="handlePopupAction(event, 'next')" ${nextDisabled}>▶</button>
      </div>
    </div>
  `;

  state.popup
    .setLatLng([marker.lat, marker.lng])
    .setContent(popupHtml)
    .openOn(state.map);

  // Isolate popup clicks from bubbling to Leaflet map canvas & enable marquee on overflow
  setTimeout(() => {
    const popupEl = state.popup.getElement();
    if (popupEl) {
      popupEl.classList.remove("video-expanded");
      L.DomEvent.disableClickPropagation(popupEl);
      L.DomEvent.disableScrollPropagation(popupEl);

      const titleEl = popupEl.querySelector(".popup-title");
      if (titleEl && titleEl.scrollWidth > titleEl.clientWidth) {
        const overflowDist = titleEl.scrollWidth - titleEl.clientWidth;
        titleEl.style.setProperty("--marquee-dist", `-${overflowDist + 10}px`);
        titleEl.classList.add("marquee-scroll");
      }

      // Ensure popup is not cut off at top of screen
      const rect = popupEl.getBoundingClientRect();
      if (rect.top < 65) {
        state.map.panBy([0, rect.top - 75], { duration: 0.25 });
      }
    }
  }, 20);
}

// Global delegated handler for popup actions
window.handlePopupAction = function(event, action) {
  if (event) {
    if (typeof event.stopPropagation === "function") event.stopPropagation();
    if (typeof event.preventDefault === "function") event.preventDefault();
  }
  if (action === "close") {
    state.map.closePopup();
  } else if (action === "found") {
    toggleCurrentCollected();
  } else if (action === "prev") {
    navigateMarker(-1);
  } else if (action === "next") {
    navigateMarker(1);
  } else if (action === "tab-img") {
    switchPopupMedia("image");
  } else if (action === "tab-vid") {
    switchPopupMedia("video");
  }
};

function switchPopupMedia(tab) {
  state.currentMediaTab = tab;
  const marker = state.currentMarker;
  if (!marker) return;

  const tabImg = document.getElementById("popupTabImg");
  const tabVid = document.getElementById("popupTabVid");
  const imgEl = document.getElementById("popupMediaImg");
  const vidEl = document.getElementById("popupMediaVid");
  const popupEl = state.popup.getElement();

  if (!tabImg || !tabVid) return;

  if (tab === "video" && marker.video && vidEl) {
    tabVid.classList.add("active");
    tabImg.classList.remove("active");
    if (imgEl) imgEl.style.display = "none";
    vidEl.style.display = "block";
    if (popupEl) popupEl.classList.add("video-expanded");
    try {
      vidEl.currentTime = 0;
      vidEl.play();
    } catch (e) {}

    // Ensure expanded video popup stays comfortably inside the viewport
    setTimeout(() => {
      if (popupEl && state.map) {
        const rect = popupEl.getBoundingClientRect();
        if (rect.top < 65) {
          state.map.panBy([0, rect.top - 75], { duration: 0.25 });
        }
      }
    }, 40);
  } else {
    tabImg.classList.add("active");
    tabVid.classList.remove("active");
    if (vidEl) {
      vidEl.pause();
      vidEl.style.display = "none";
    }
    if (imgEl) imgEl.style.display = "block";
    if (popupEl) popupEl.classList.remove("video-expanded");
  }
}

function toggleCurrentCollected() {
  if (!state.currentMarker) return;
  const mId = state.currentMarker.id;

  if (state.collected.has(mId)) {
    state.collected.delete(mId);
  } else {
    state.collected.add(mId);
  }

  // Two-way sync: reflect on checklist task if mapped to this marker
  const checklist = window.CHECKLIST_DATA || (typeof CHECKLIST_DATA !== "undefined" ? CHECKLIST_DATA : null);
  if (checklist) {
    for (const cat of checklist.categories) {
      const it = cat.items.find(i => i.markerId === mId || i.id === mId);
      if (it) {
        if (state.collected.has(mId)) {
          state.checklistTasks.add(it.id);
        } else {
          state.checklistTasks.delete(it.id);
        }
        saveChecklistProgress();
        break;
      }
    }
  }

  saveCollected();
  renderMarkers();

  const isFound = state.collected.has(mId);
  const btn = document.getElementById("popupBtnFound");
  if (btn) {
    btn.classList.toggle("collected", isFound);
    btn.innerHTML = `<span class="check-box-icon">${isFound ? '☑' : '☐'}</span> Found`;
  }

  if (state.currentMarker.category === "hidden_packages") {
    const rewEl = document.getElementById("popupRewardText");
    if (rewEl) rewEl.innerHTML = `🎁 ${getDynamicRewardText()}`;
  }
}

function navigateMarker(offset) {
  if (!state.currentMarker) return;
  const nav = getMarkerNavSiblings(state.currentMarker);
  const target = offset > 0 ? nav.next : nav.prev;
  if (target) {
    setTimeout(() => {
      openMarkerPopup(target);
    }, 20);
  }
}

const CHECKLIST_STORAGE_KEY = "gta_lcs_checklist_progress";

function loadChecklistProgress() {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (raw) state.checklistTasks = new Set(JSON.parse(raw));
  } catch (e) {
    state.checklistTasks = new Set();
  }
}

function saveChecklistProgress() {
  try {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify([...state.checklistTasks]));
  } catch (e) {}
  updateProgressUI();
}

function toggleTaskCompleted(taskId) {
  const checklist = window.CHECKLIST_DATA || (typeof CHECKLIST_DATA !== "undefined" ? CHECKLIST_DATA : null);
  let linkedMarkerId = null;
  if (checklist) {
    for (const cat of checklist.categories) {
      const it = cat.items.find(i => i.id === taskId);
      if (it && it.markerId) {
        linkedMarkerId = it.markerId;
        break;
      }
    }
  }

  if (state.checklistTasks.has(taskId)) {
    state.checklistTasks.delete(taskId);
    if (linkedMarkerId) {
      state.collected.delete(linkedMarkerId);
      saveCollected();
      updateMarkerVisual(linkedMarkerId);
    }
  } else {
    state.checklistTasks.add(taskId);
    if (linkedMarkerId) {
      state.collected.add(linkedMarkerId);
      saveCollected();
      updateMarkerVisual(linkedMarkerId);
    }
  }
  saveChecklistProgress();

  if (state.currentMarker && state.currentMarker.id === linkedMarkerId) {
    const isFound = state.collected.has(linkedMarkerId);
    const btn = document.getElementById("popupBtnFound");
    if (btn) {
      btn.classList.toggle("collected", isFound);
      btn.innerHTML = `<span class="check-box-icon">${isFound ? '☑' : '☐'}</span> Found`;
    }
  }
}

window.toggleTaskCompleted = toggleTaskCompleted;

window.goToMarker = function(markerId) {
  toggleChecklistDrawer(false);
  const target = state.markers.find(m => m.id === markerId);
  if (target) {
    if (state.activeCategory !== "all" && state.activeCategory !== target.category) {
      setCategoryFilter(target.category);
    }
    state.map.flyTo([target.lat, target.lng], 4.75, { animate: true, duration: 0.8 });
    setTimeout(() => openMarkerPopup(target), 850);
  }
};

window.goToMapCoords = function(lat, lng, title, markerId) {
  if (markerId) {
    window.goToMarker(markerId);
    return;
  }
  toggleChecklistDrawer(false);
  state.map.flyTo([lat, lng], 4.75, { animate: true, duration: 0.8 });
  const existing = state.markers.find(m => Math.abs(m.lat - lat) < 0.5 && Math.abs(m.lng - lng) < 0.5);
  if (existing) {
    setTimeout(() => openMarkerPopup(existing), 850);
  } else {
    L.popup({ offset: [0, -10], className: "custom-leaflet-popup" })
      .setLatLng([lat, lng])
      .setContent(`<div style="padding: 8px 12px; font-weight: 700; color: #fbbf24; font-size: 12px;">📍 ${title}</div>`)
      .openOn(state.map);
  }
};

window.toggleAllCategoryCollectibles = function(catKey) {
  const catMarkers = state.markers.filter(m => m.category === catKey);
  if (catMarkers.length === 0) return;
  const allFound = catMarkers.every(m => state.collected.has(m.id));
  if (allFound) {
    catMarkers.forEach(m => state.collected.delete(m.id));
  } else {
    catMarkers.forEach(m => state.collected.add(m.id));
  }
  saveCollected();
  renderMarkers();
  updateProgressUI();
};

window.handleChecklistItemClick = function(event, taskId) {
  if (event.target.closest("button, a, .cl-map-btn, .cl-found-all-btn, .cl-cat-check-all-btn")) {
    return;
  }
  toggleTaskCompleted(taskId);
};

window.toggleCategoryCollapse = function(catId, headerEl) {
  if (!state.collapsedCategories) state.collapsedCategories = new Set();
  const group = headerEl.closest(".cl-group");
  const items = group ? group.querySelector(".cl-group-items") : null;
  const chevron = headerEl.querySelector(".cl-chevron");

  if (state.collapsedCategories.has(catId)) {
    state.collapsedCategories.delete(catId);
    if (items) items.classList.remove("collapsed");
    if (chevron) chevron.classList.remove("collapsed");
  } else {
    state.collapsedCategories.add(catId);
    if (items) items.classList.add("collapsed");
    if (chevron) chevron.classList.add("collapsed");
  }
};

window.togglePackageMilestones = function(event, btn) {
  if (event) event.stopPropagation();
  state.showPackageMilestones = !state.showPackageMilestones;
  const wrapper = btn.closest(".cl-milestones-wrapper");
  if (!wrapper) return;
  const list = wrapper.querySelector(".cl-milestones-list");
  const chevron = btn.querySelector(".cl-chevron");
  if (list) list.classList.toggle("collapsed", !state.showPackageMilestones);
  if (chevron) chevron.classList.toggle("collapsed", !state.showPackageMilestones);
};

window.toggleCategoryAll = function(catId, event) {
  if (event) event.stopPropagation();
  const checklist = window.CHECKLIST_DATA || (typeof CHECKLIST_DATA !== "undefined" ? CHECKLIST_DATA : null);
  if (!checklist) return;

  const cat = checklist.categories.find(c => c.id === catId);
  if (!cat) return;

  const island = state.activeChecklistIsland || "all";
  const query = (state.checklistSearchQuery || "").trim().toLowerCase();
  const showOpt = state.showOptionalTasks;

  const filteredItems = cat.items.filter(item => {
    if (item.platform && item.platform !== state.selectedPlatform) return false;
    if (island !== "all") {
      const itemIsland = (item.island || "").toLowerCase();
      if (itemIsland !== "all" && !itemIsland.includes(island)) return false;
    }
    if (!item.required && !showOpt) return false;
    if (query) {
      const matchTitle = (item.title || "").toLowerCase().includes(query);
      const matchGiver = (item.giver || "").toLowerCase().includes(query);
      const matchReward = (item.reward || "").toLowerCase().includes(query);
      const matchDesc = (item.desc || "").toLowerCase().includes(query);
      if (!matchTitle && !matchGiver && !matchReward && !matchDesc) return false;
    }
    return true;
  });

  if (filteredItems.length === 0) return;

  function isItemDone(item) {
    if (item.isCategoryLink === "hidden_packages") {
      const hpCount = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
      return hpCount >= 100 || state.checklistTasks.has(item.id);
    }
    if (item.isCategoryLink === "rampages") {
      const rCount = state.markers.filter(m => m.category === "rampages" && state.collected.has(m.id)).length;
      return rCount >= 20 || state.checklistTasks.has(item.id);
    }
    if (item.isCategoryLink === "unique_stunt_jumps") {
      const jCount = state.markers.filter(m => m.category === "unique_stunt_jumps" && state.collected.has(m.id)).length;
      return jCount >= 26 || state.checklistTasks.has(item.id);
    }
    if (item.markerId && state.collected.has(item.markerId)) return true;
    return state.checklistTasks.has(item.id);
  }

  const allDone = filteredItems.every(isItemDone);

  filteredItems.forEach(item => {
    if (allDone) {
      state.checklistTasks.delete(item.id);
      if (item.markerId) {
        state.collected.delete(item.markerId);
        updateMarkerVisual(item.markerId);
      }
      if (item.isCategoryLink) {
        state.markers
          .filter(m => m.category === item.isCategoryLink)
          .forEach(m => state.collected.delete(m.id));
      }
    } else {
      state.checklistTasks.add(item.id);
      if (item.markerId) {
        state.collected.add(item.markerId);
        updateMarkerVisual(item.markerId);
      }
      if (item.isCategoryLink) {
        state.markers
          .filter(m => m.category === item.isCategoryLink)
          .forEach(m => state.collected.add(m.id));
      }
    }
  });

  saveCollected();
  saveChecklistProgress();
  renderMarkers();
  updateProgressUI();
};

window.toggleCreditsModal = function(open) {
  const modal = document.getElementById("creditsModal");
  const backdrop = document.getElementById("creditsModalBackdrop");
  if (!modal || !backdrop) return;
  if (open === undefined) open = !modal.classList.contains("active");
  modal.classList.toggle("active", open);
  backdrop.classList.toggle("active", open);
};

// --- Render Complete 100% and Optional Checklist ---
function renderFullChecklist() {
  const container = document.getElementById("fullChecklistContainer");
  const checklist = window.CHECKLIST_DATA || (typeof CHECKLIST_DATA !== "undefined" ? CHECKLIST_DATA : null);
  if (!container || !checklist) return;

  const island = state.activeChecklistIsland || "all";
  const query = (state.checklistSearchQuery || "").trim().toLowerCase();
  const showOpt = state.showOptionalTasks;

  let totalMandatory = 0;
  let completedMandatory = 0;
  let totalOptional = 0;
  let completedOptional = 0;

  // Calculate live completion counts across all categories
  checklist.categories.forEach(cat => {
    cat.items.forEach(item => {
      if (item.platform && item.platform !== state.selectedPlatform) return;
      let isDone = false;
      if (item.isCategoryLink === "hidden_packages") {
        const hpCount = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
        isDone = hpCount >= 100;
      } else if (item.isCategoryLink === "rampages") {
        const rCount = state.markers.filter(m => m.category === "rampages" && state.collected.has(m.id)).length;
        isDone = rCount >= 20;
      } else if (item.isCategoryLink === "unique_stunt_jumps") {
        const jCount = state.markers.filter(m => m.category === "unique_stunt_jumps" && state.collected.has(m.id)).length;
        isDone = jCount >= 26;
      } else if (item.markerId && state.collected.has(item.markerId)) {
        isDone = true;
      } else {
        isDone = state.checklistTasks.has(item.id);
      }

      if (item.required) {
        totalMandatory++;
        if (isDone) completedMandatory++;
      } else {
        totalOptional++;
        if (isDone) completedOptional++;
      }
    });
  });

  const mandatoryPct = totalMandatory > 0 ? ((completedMandatory / totalMandatory) * 100).toFixed(1) : "0.0";

  // Update Top Sidebar 100% Completion Box
  const totalText = document.getElementById("totalProgressText");
  if (totalText) totalText.textContent = `${completedMandatory} / ${totalMandatory} (${mandatoryPct}%)`;

  const totalBar = document.getElementById("totalProgressBar");
  if (totalBar) totalBar.style.width = `${mandatoryPct}%`;

  // Update Drawer Stats & Progress Bar
  const drawerStats = document.getElementById("drawerStats");
  if (drawerStats) drawerStats.textContent = `${completedMandatory} / ${totalMandatory}`;

  const drawerBadge = document.getElementById("drawerPercentBadge");
  if (drawerBadge) drawerBadge.textContent = `${mandatoryPct}%`;

  const progressBar = document.getElementById("checklistProgressBar");
  if (progressBar) progressBar.style.width = `${mandatoryPct}%`;

  const drawerSub = document.getElementById("drawerSubStats");
  if (drawerSub) {
    drawerSub.textContent = showOpt
      ? `100%: ${completedMandatory}/${totalMandatory} | Optional: ${completedOptional}/${totalOptional}`
      : `Mandatory 100% Tasks (${mandatoryPct}%)`;
  }

  const mobileProg = document.getElementById("mobileProgressText");
  if (mobileProg) mobileProg.textContent = `${Math.round(mandatoryPct)}%`;

  // Render Category Groups
  let html = "";
  checklist.categories.forEach(cat => {
    // Skip optional category if toggle is off
    if (!cat.requiredFor100 && !showOpt) return;

    // Filter category items by island, search query, and platform
    const filteredItems = cat.items.filter(item => {
      // Platform filter: hide tasks exclusive to another platform
      if (item.platform && item.platform !== state.selectedPlatform) return false;
      // Island filter
      if (island !== "all") {
        const itemIsland = (item.island || "").toLowerCase();
        if (itemIsland !== "all" && !itemIsland.includes(island)) return false;
      }
      // Optional toggle check
      if (!item.required && !showOpt) return false;
      // Search query filter
      if (query) {
        const matchTitle = (item.title || "").toLowerCase().includes(query);
        const matchGiver = (item.giver || "").toLowerCase().includes(query);
        const matchReward = (item.reward || "").toLowerCase().includes(query);
        const matchDesc = (item.desc || "").toLowerCase().includes(query);
        if (!matchTitle && !matchGiver && !matchReward && !matchDesc) return false;
      }
      return true;
    });

    if (filteredItems.length === 0) return;

    // Count done in this category
    const catDone = filteredItems.filter(item => {
      if (item.isCategoryLink === "hidden_packages") {
        const hpCount = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
        return hpCount >= 100 || state.checklistTasks.has(item.id);
      }
      if (item.isCategoryLink === "rampages") {
        const rCount = state.markers.filter(m => m.category === "rampages" && state.collected.has(m.id)).length;
        return rCount >= 20 || state.checklistTasks.has(item.id);
      }
      if (item.isCategoryLink === "unique_stunt_jumps") {
        const jCount = state.markers.filter(m => m.category === "unique_stunt_jumps" && state.collected.has(m.id)).length;
        return jCount >= 26 || state.checklistTasks.has(item.id);
      }
      if (item.markerId && state.collected.has(item.markerId)) {
        return true;
      }
      return state.checklistTasks.has(item.id);
    }).length;

    const isCatDone = catDone === filteredItems.length;
    const isCatCollapsed = state.collapsedCategories && state.collapsedCategories.has(cat.id);

    html += `
      <div class="cl-group">
        <div class="cl-group-header" onclick="toggleCategoryCollapse('${cat.id}', this)">
          <div class="cl-group-title-row">
            <span class="cl-group-title">${cat.name}</span>
          </div>
          <div class="cl-group-actions">
            <button class="cl-cat-check-all-btn ${isCatDone ? 'all-done' : ''}" 
                    type="button" 
                    onclick="toggleCategoryAll('${cat.id}', event)" 
                    title="${isCatDone ? 'Uncheck all in ' + cat.name : 'Check all in ' + cat.name}">
              ${isCatDone ? 'Uncheck All ✕' : 'Check All ✓'}
            </button>
            <span class="cl-group-count">${catDone}/${filteredItems.length}</span>
            <span class="cl-chevron ${isCatCollapsed ? 'collapsed' : ''}">▼</span>
          </div>
        </div>
        <div class="cl-group-items ${isCatCollapsed ? 'collapsed' : ''}">
          ${filteredItems.map((item, idx, arr) => {
            if (item.isCategoryLink) {
              let current = 0;
              let total = item.count || 100;
              let actionWord = "Collected";
              if (item.isCategoryLink === "hidden_packages") {
                current = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
                total = 100;
                actionWord = "Found";
              } else if (item.isCategoryLink === "rampages") {
                current = state.markers.filter(m => m.category === "rampages" && state.collected.has(m.id)).length;
                total = 20;
                actionWord = "Beaten";
              } else if (item.isCategoryLink === "unique_stunt_jumps") {
                current = state.markers.filter(m => m.category === "unique_stunt_jumps" && state.collected.has(m.id)).length;
                total = 26;
                actionWord = "Landed";
              }
              const isDone = current >= total;
              const pct = Math.min(100, Math.round((current / total) * 100));
              const rewardTag = item.reward ? `<span class="cl-item-tag" title="Reward">🏆 ${item.reward}</span>` : "";
              const showMilestones = !!state.showPackageMilestones;
              const unlockedMilestones = SAFE_REWARDS.filter(r => current >= r.count).length;
              const milestonesHtml = item.isCategoryLink === "hidden_packages" ? `
                <div class="cl-milestones-wrapper">
                  <button class="cl-milestones-toggle-btn" type="button" onclick="togglePackageMilestones(event, this)">
                    <span>Safehouse Weapon Milestones (${unlockedMilestones}/10)</span>
                    <span class="cl-chevron ${showMilestones ? '' : 'collapsed'}">▼</span>
                  </button>
                  <div class="cl-milestones-list ${showMilestones ? '' : 'collapsed'}">
                    ${SAFE_REWARDS.map(r => {
                      const unlocked = current >= r.count;
                      return `
                        <div class="cl-milestone-row ${unlocked ? 'unlocked' : ''}">
                          <span class="cl-milestone-name">${unlocked ? '✓' : '○'} ${r.reward}</span>
                          <span class="cl-milestone-req">${r.count} pkgs</span>
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>
              ` : "";

              return `
                <div class="cl-item cl-counter-item ${isDone ? 'completed' : ''}">
                  <div class="cl-counter-icon ${isDone ? 'completed' : ''}" title="${isDone ? 'Completed' : 'Tracked via map pins'}">
                    ${isDone ? '✓' : '●'}
                  </div>
                  <div class="cl-item-body">
                    <div class="cl-item-title-row">
                      <span class="cl-item-title">${item.title}</span>
                      <div class="cl-item-actions">
                        <button class="cl-found-all-btn ${isDone ? 'all-found' : ''}" onclick="toggleAllCategoryCollectibles('${item.isCategoryLink}')" title="${isDone ? 'Reset ' + item.title : 'Mark all ' + item.title + ' as found'}">
                          ${isDone ? 'Reset All ✕' : 'Found All ✓'}
                        </button>
                        <button class="cl-map-btn" onclick="setCategoryFilter('${item.isCategoryLink}'); toggleChecklistDrawer(false);">Show on Map</button>
                      </div>
                    </div>
                    <div class="cl-item-meta">
                      <span class="cl-item-tag" style="color: ${isDone ? 'var(--color-green)' : '#fbbf24'}; font-weight: 600;">
                        ${current}/${total} ${actionWord} (${pct}%)
                      </span>
                      ${rewardTag}
                    </div>
                    <div class="cl-mini-prog-track">
                      <div class="cl-mini-prog-fill" style="width: ${pct}%"></div>
                    </div>
                    ${milestonesHtml}
                  </div>
                </div>
              `;
            }

            let subGroupHtml = "";
            if (item.subGroup && (idx === 0 || arr[idx - 1].subGroup !== item.subGroup)) {
              subGroupHtml = `<div class="cl-subgroup-header">${item.subGroup}</div>`;
            }

            const isDone = (item.markerId && state.collected.has(item.markerId)) || state.checklistTasks.has(item.id);
            const mapBtn = item.markerId
              ? `<button class="cl-map-btn" onclick="goToMarker('${item.markerId}')">📍 Map</button>`
              : (item.coords
                ? `<button class="cl-map-btn" onclick="goToMapCoords(${item.coords[0]}, ${item.coords[1]}, '${item.title.replace(/'/g, "\\'")}')">📍 Map</button>`
                : "");

            const isMobilePlatform = state.selectedPlatform === "mobile";
            const itemTitle = (isMobilePlatform && item.mobileTitle) ? item.mobileTitle : item.title;
            const itemDesc = (isMobilePlatform && item.mobileDesc) ? item.mobileDesc : item.desc;
            const optTag = !item.required ? `<span class="cl-item-tag cl-optional-tag">Optional</span>` : "";
            const rewardTag = item.reward ? `<span class="cl-item-tag" title="Reward">🏆 ${item.reward}</span>` : "";
            const giverTag = item.giver ? `<span class="cl-item-tag">${item.giver}</span>` : "";

            return `
              ${subGroupHtml}
              <div class="cl-item ${isDone ? 'completed' : ''}" 
                   onclick="handleChecklistItemClick(event, '${item.id}')" 
                   role="button" 
                   tabindex="0" 
                   aria-pressed="${isDone}" 
                   onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();handleChecklistItemClick(event, '${item.id}');}">
                <div class="cl-custom-checkbox ${isDone ? 'checked' : ''}" aria-checked="${isDone}" role="checkbox" aria-label="Mark ${itemTitle.replace(/"/g, '&quot;')} completed">
                  <svg class="cl-check-svg" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7.2L5.5 10.2L11.5 3.8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div class="cl-item-body">
                  <div class="cl-item-title-row">
                    <span class="cl-item-title">${itemTitle}</span>
                    ${mapBtn}
                  </div>
                  <div class="cl-item-meta">
                    ${optTag}
                    ${giverTag}
                    ${rewardTag}
                  </div>
                  ${itemDesc ? `<div class="cl-item-desc">${itemDesc}</div>` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// --- Progress & UI Stats (100% Completion Tracker) ---
function updateProgressUI() {
  const totalPins = state.markers.length || 176;
  const countAll = document.getElementById("count_all");
  if (countAll) countAll.textContent = `${state.collected.size}/${totalPins}`;

  // Update Category checklist counts in Sidebar
  Object.keys(state.categories).forEach(catId => {
    const el = document.getElementById(`count_${catId}`);
    if (el) {
      const catTotal = state.categories[catId].count || 0;
      const catDone = state.markers.filter(m => m.category === catId && state.collected.has(m.id)).length;
      el.textContent = `${catDone}/${catTotal}`;
    }
  });

  // Render Full 100% Checklist (also updates 100% completion percentages and integrated package milestones)
  renderFullChecklist();
}

// --- Island Navigation with Accurate Bounds ---
function setIsland(islandKey) {
  state.activeIsland = islandKey;
  document.querySelectorAll(".island-btn[data-island]").forEach(b => {
    b.classList.toggle("active", b.dataset.island === islandKey);
  });

  const bounds = ISLAND_BOUNDS[islandKey] || ISLAND_BOUNDS.all;
  state.map.fitBounds(bounds, { animate: true, padding: [15, 15], maxZoom: 4.5 });
  renderMarkers();
}

function setCategoryFilter(cat) {
  state.activeCategory = cat;
  document.querySelectorAll(".nav-item[data-cat]").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === cat);
  });
  renderMarkers();
}

function toggleChecklistDrawer(open) {
  const drawer = document.getElementById("checklistDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (!drawer || !backdrop) return;
  if (open === undefined) {
    open = !drawer.classList.contains("open");
  }
  drawer.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
  if (open) {
    renderFullChecklist();
  }
}

function initDrawerCategories() {
  const list = document.getElementById("drawerCategoryList");
  if (!list) return;

  list.innerHTML = "";
  Object.keys(state.categories).forEach(catId => {
    const cat = state.categories[catId];
    const item = document.createElement("div");
    item.className = "drawer-item";
    item.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #06090e; border: 1px solid var(--panel-border); border-radius: 6px; font-size: 11px;";
    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${cat.color};"></span>
        <span style="font-weight: 500; color: var(--text-main);">${cat.name}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 11px; color: var(--text-dim);" id="drawer_count_${catId}">0/${cat.count}</span>
      </div>
    `;
    list.appendChild(item);
  });
}

function resetProgress() {
  if (confirm("Reset all tracked progress (markers & 100% checklist tasks)?")) {
    state.collected.clear();
    state.checklistTasks.clear();
    saveCollected();
    saveChecklistProgress();
    renderMarkers();
    if (state.currentMarker) {
      updateMarkerVisual(state.currentMarker.id);
      const btn = document.getElementById("popupBtnFound");
      if (btn) {
        btn.classList.remove("collected");
        btn.innerHTML = `<span class="check-box-icon">☐</span> Found`;
      }
    }
  }
}

function exportProgress() {
  const exportDoc = {
    collected: [...state.collected],
    checklistTasks: [...state.checklistTasks],
    timestamp: new Date().toISOString()
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportDoc, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "gta_lcs_100_progress.json");
  dlAnchor.click();
}

function importProgress(customFileInput) {
  const input = customFileInput || document.createElement("input");
  if (!customFileInput) {
    input.type = "file";
    input.accept = ".json";
  }
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          state.collected = new Set(imported);
        } else if (imported && typeof imported === "object") {
          if (Array.isArray(imported.collected)) state.collected = new Set(imported.collected);
          if (Array.isArray(imported.checklistTasks)) state.checklistTasks = new Set(imported.checklistTasks);
        }
        saveCollected();
        saveChecklistProgress();
        renderMarkers();
        alert("Progress loaded successfully!");
      } catch (err) {
        alert("Invalid file format.");
      }
    };
    reader.readAsText(file);
  };
  if (!customFileInput) input.click();
}

window.resetProgress = resetProgress;
window.exportProgress = exportProgress;
window.importProgress = importProgress;

function setPlatform(platform) {
  state.selectedPlatform = platform || "psp_ps2";
  localStorage.setItem("gta_lcs_platform", state.selectedPlatform);
  saveSettings();

  document.querySelectorAll(".platform-toggle-btn[data-platform], .cl-platform-btn[data-platform]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.platform === state.selectedPlatform);
  });

  renderFullChecklist();
}
window.setPlatform = setPlatform;

function toggleSettingsModal(open) {
  const modal = document.getElementById("settingsModal");
  const backdrop = document.getElementById("settingsModalBackdrop");
  if (!modal || !backdrop) return;
  const willOpen = typeof open === "boolean" ? open : !modal.classList.contains("active");
  modal.classList.toggle("active", willOpen);
  backdrop.classList.toggle("active", willOpen);

  if (willOpen) {
    const toggleHide = document.getElementById("modalToggleHideCollected");
    if (toggleHide) toggleHide.checked = state.hideCollected;

    const toggleCluster = document.getElementById("modalToggleClusterMarkers");
    if (toggleCluster) toggleCluster.checked = state.clusterMarkers;

    const selectPal = document.getElementById("modalSelectPalette");
    if (selectPal) selectPal.value = state.palette;

    document.querySelectorAll(".platform-toggle-btn[data-platform], .cl-platform-btn[data-platform]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.platform === state.selectedPlatform);
    });
  }
}
window.toggleSettingsModal = toggleSettingsModal;

function bindEvents() {
  // Island navigation
  document.querySelectorAll(".island-btn[data-island]").forEach(btn => {
    btn.addEventListener("click", () => setIsland(btn.dataset.island));
  });

  // Sidebar category filter items
  document.querySelectorAll(".nav-item[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => setCategoryFilter(btn.dataset.cat));
  });

  // Checklist Drawer triggers
  const progressBox = document.getElementById("sidebarProgressBox");
  if (progressBox) progressBox.addEventListener("click", () => toggleChecklistDrawer(true));

  const mobileChecklistBtn = document.getElementById("mobileBtnChecklist");
  if (mobileChecklistBtn) mobileChecklistBtn.addEventListener("click", () => toggleChecklistDrawer(true));

  const btnCloseDrawer = document.getElementById("btnCloseDrawer");
  if (btnCloseDrawer) btnCloseDrawer.addEventListener("click", () => toggleChecklistDrawer(false));

  const drawerBackdrop = document.getElementById("drawerBackdrop");
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", () => toggleChecklistDrawer(false));

  // Credits Modal triggers
  const btnOpenCredits = document.getElementById("btnOpenCredits");
  if (btnOpenCredits) btnOpenCredits.addEventListener("click", () => toggleCreditsModal(true));

  const btnCloseCredits = document.getElementById("btnCloseCredits");
  if (btnCloseCredits) btnCloseCredits.addEventListener("click", () => toggleCreditsModal(false));

  const creditsBackdrop = document.getElementById("creditsModalBackdrop");
  if (creditsBackdrop) creditsBackdrop.addEventListener("click", () => toggleCreditsModal(false));

  // Checklist island filter buttons
  document.querySelectorAll(".cl-island-btn[data-cl-island]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeChecklistIsland = btn.dataset.clIsland;
      document.querySelectorAll(".cl-island-btn[data-cl-island]").forEach(b => b.classList.toggle("active", b === btn));
      renderFullChecklist();
    });
  });

  // Optional tasks toggle
  const toggleOpt = document.getElementById("toggleShowOptional");
  if (toggleOpt) {
    toggleOpt.checked = state.showOptionalTasks;
    toggleOpt.addEventListener("change", (e) => {
      state.showOptionalTasks = e.target.checked;
      saveSettings();
      renderFullChecklist();
    });
  }

  // Checklist search input
  const searchInput = document.getElementById("inputChecklistSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.checklistSearchQuery = e.target.value;
      renderFullChecklist();
    });
  }

  // Hide collected toggle
  const toggleHide = document.getElementById("toggleHideCollected");
  if (toggleHide) {
    toggleHide.checked = state.hideCollected;
    toggleHide.addEventListener("change", (e) => {
      state.hideCollected = e.target.checked;
      saveSettings();
      renderMarkers();
    });
  }

  // Cluster nearby markers toggle
  const toggleCluster = document.getElementById("toggleClusterMarkers");
  if (toggleCluster) {
    toggleCluster.checked = state.clusterMarkers;
    toggleCluster.addEventListener("change", (e) => {
      state.clusterMarkers = e.target.checked;
      saveSettings();
      renderMarkers();
    });
  }

  // Colorblind Palette select
  const selectPalette = document.getElementById("selectPalette");
  if (selectPalette) {
    selectPalette.value = state.palette;
    selectPalette.addEventListener("change", (e) => {
      applyPalette(e.target.value);
    });
  }

  // Backup & Reset
  const btnReset = document.getElementById("btnResetProgress");
  if (btnReset) btnReset.addEventListener("click", resetProgress);

  const btnExport = document.getElementById("btnExportProgress");
  if (btnExport) btnExport.addEventListener("click", exportProgress);

  const btnImport = document.getElementById("btnImportProgress");
  if (btnImport) btnImport.addEventListener("click", () => importProgress());

  // Platform Selector Toggles (Checklist Drawer, Settings Modal, Sidebar)
  document.querySelectorAll(".platform-toggle-btn[data-platform], .cl-platform-btn[data-platform]").forEach(btn => {
    btn.addEventListener("click", () => setPlatform(btn.dataset.platform));
  });

  // Settings Modal Controls
  const modalToggleHide = document.getElementById("modalToggleHideCollected");
  if (modalToggleHide) {
    modalToggleHide.checked = state.hideCollected;
    modalToggleHide.addEventListener("change", (e) => {
      state.hideCollected = e.target.checked;
      if (toggleHide) toggleHide.checked = state.hideCollected;
      saveSettings();
      renderMarkers();
    });
  }

  const modalToggleCluster = document.getElementById("modalToggleClusterMarkers");
  if (modalToggleCluster) {
    modalToggleCluster.checked = state.clusterMarkers;
    modalToggleCluster.addEventListener("change", (e) => {
      state.clusterMarkers = e.target.checked;
      if (toggleCluster) toggleCluster.checked = state.clusterMarkers;
      saveSettings();
      renderMarkers();
    });
  }

  const modalSelectPal = document.getElementById("modalSelectPalette");
  if (modalSelectPal) {
    modalSelectPal.value = state.palette;
    modalSelectPal.addEventListener("change", (e) => {
      applyPalette(e.target.value);
    });
  }

  const btnModalReset = document.getElementById("btnModalReset");
  if (btnModalReset) {
    btnModalReset.addEventListener("click", () => {
      toggleSettingsModal(false);
      resetProgress();
    });
  }

  const btnModalExport = document.getElementById("btnModalExport");
  if (btnModalExport) btnModalExport.addEventListener("click", exportProgress);

  const btnModalImport = document.getElementById("btnModalImport");
  const modalFileInput = document.getElementById("modalFileInput");
  if (btnModalImport && modalFileInput) {
    btnModalImport.addEventListener("click", () => modalFileInput.click());
    importProgress(modalFileInput);
  }

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      state.map.closePopup();
      toggleChecklistDrawer(false);
      toggleCreditsModal(false);
      toggleSettingsModal(false);
    }
    if (state.currentMarker) {
      if (e.key === "ArrowLeft") navigateMarker(-1);
      if (e.key === "ArrowRight") navigateMarker(1);
      if (e.key === " ") {
        e.preventDefault();
        toggleCurrentCollected();
      }
    }
  });
}

function syncChecklistAndMarkers() {
  const checklist = window.CHECKLIST_DATA || (typeof CHECKLIST_DATA !== "undefined" ? CHECKLIST_DATA : null);
  if (!checklist) return;
  checklist.categories.forEach(cat => {
    cat.items.forEach(item => {
      if (!item.markerId) return;
      if (state.checklistTasks.has(item.id)) {
        state.collected.add(item.markerId);
      } else if (state.collected.has(item.markerId)) {
        state.checklistTasks.add(item.id);
      }
    });
  });
}

function loadMarkerDataIntoState(data) {
  state.markers = data.markers;
  state.categories = data.categories;
  state.islands = data.islands;

  if (state.palette && PALETTES[state.palette]) {
    applyPalette(state.palette);
  } else {
    initDrawerCategories();
    renderMarkers();
  }

  updateProgressUI();

  // Check URL query param ?id=
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get("id");
  if (targetId) {
    const target = state.markers.find(m => m.id === targetId || (m.category === "hidden_packages" && m.number.toString() === targetId));
    if (target) {
      openMarkerPopup(target);
    }
  }
}

async function init() {
  loadCollected();
  loadChecklistProgress();
  syncChecklistAndMarkers();
  loadSettings();
  setPlatform(state.selectedPlatform);
  document.body.classList.toggle("colorblind-mode", state.palette && state.palette !== "standard");
  initMap();
  bindEvents();

  // Instant offline loading via bundled window.MARKERS_DATA or window.LCS_MARKERS_DATA
  const bundledData = window.MARKERS_DATA || window.LCS_MARKERS_DATA || window.MARKER_DATA;
  if (bundledData && bundledData.markers) {
    loadMarkerDataIntoState(bundledData);
    return;
  }

  // Fallback to fetch
  try {
    const res = await fetch("data/markers.json");
    const data = await res.json();
    loadMarkerDataIntoState(data);
  } catch (e) {
    console.error("Failed to load markers:", e);
  }
}

document.addEventListener("DOMContentLoaded", init);
