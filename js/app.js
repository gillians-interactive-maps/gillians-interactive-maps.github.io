/**
 * GTA Liberty City Stories - Authentic In-Game Radar & Collectibles HUD
 * High-detail stylized vector blips, robust tile scaling (zero 404 gaps), lazy video loading.
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
  { count: 100, reward: "$50,000 Bonus & 100% Completion" }
];

// Rich, authentic GTA vector artwork for radar blips & UI
const CATEGORY_ICONS = {
  hidden_packages: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L28 8.5V23.5L16 30L4 23.5V8.5L16 2Z" fill="#111" stroke="#000" stroke-width="2"/>
    <path d="M16 2.5L27 8.5L16 14.5L5 8.5L16 2.5Z" fill="#FFC400"/>
    <path d="M4.5 9.5L15.5 15.5V28.5L4.5 22.5V9.5Z" fill="#D48800"/>
    <path d="M16.5 15.5L27.5 9.5V22.5L16.5 28.5V15.5Z" fill="#FFA000"/>
    <path d="M16 2.5L16 14.5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M10.5 5.5L21.5 11.5" stroke="#FFFFFF" stroke-width="2.5"/>
    <path d="M10 12.5V25.5" stroke="#FFFFFF" stroke-width="2"/>
    <path d="M22 12.5V25.5" stroke="#FFFFFF" stroke-width="2"/>
    <circle cx="16" cy="8.5" r="2.5" fill="#FFFFFF" stroke="#000" stroke-width="1"/>
  </svg>`,

  rampages: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2C9.5 2 5 6.5 5 13C5 17.5 7.5 20.5 10 22.5V26H22V22.5C24.5 20.5 27 17.5 27 13C27 6.5 22.5 2 16 2Z" fill="#E74C3C" stroke="#000" stroke-width="2"/>
    <path d="M8 12L13 14.5L13.5 17.5L8.5 16Z" fill="#000"/>
    <path d="M24 12L19 14.5L18.5 17.5L23.5 16Z" fill="#000"/>
    <path d="M16 17.5L14.5 21H17.5L16 17.5Z" fill="#000"/>
    <path d="M11 25H21V28H11V25Z" fill="#FFF" stroke="#000" stroke-width="1"/>
    <line x1="13.5" y1="25" x2="13.5" y2="28" stroke="#000" stroke-width="1.2"/>
    <line x1="16" y1="25" x2="16" y2="28" stroke="#000" stroke-width="1.2"/>
    <line x1="18.5" y1="25" x2="18.5" y2="28" stroke="#000" stroke-width="1.2"/>
  </svg>`,

  unique_stunt_jumps: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 27L16 16H20L5 27H3Z" fill="#F5A623" stroke="#000" stroke-width="1.5"/>
    <path d="M12 20L15 17" stroke="#000" stroke-width="1.5"/>
    <path d="M7 24L10 21" stroke="#000" stroke-width="1.5"/>
    <path d="M17 12L23 5L28 7L29 11L21 14L17 12Z" fill="#FFF" stroke="#000" stroke-width="1.5"/>
    <circle cx="20" cy="14" r="2" fill="#000"/>
    <circle cx="27" cy="10" r="2" fill="#000"/>
    <path d="M10 18Q18 8 26 4" stroke="#FFF" stroke-width="2" stroke-dasharray="2 2"/>
  </svg>`,

  car_races: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 6L14 12L5 18V6Z" fill="#FFF" stroke="#000" stroke-width="1.2"/>
    <path d="M27 6L18 12L27 18V6Z" fill="#FFF" stroke="#000" stroke-width="1.2"/>
    <path d="M5 6L8 8V12L5 10V6Z" fill="#000"/>
    <path d="M11 10L14 12V16L11 14V10Z" fill="#000"/>
    <path d="M27 6L24 8V12L27 10V6Z" fill="#000"/>
    <path d="M21 10L18 12V16L21 14V10Z" fill="#000"/>
    <line x1="5" y1="5" x2="21" y2="27" stroke="#000" stroke-width="2"/>
    <line x1="27" y1="5" x2="11" y2="27" stroke="#000" stroke-width="2"/>
    <rect x="9" y="19" width="14" height="8" rx="2" fill="#2ECC71" stroke="#000" stroke-width="1.5"/>
    <circle cx="11.5" cy="23" r="1.5" fill="#FFF"/>
    <circle cx="20.5" cy="23" r="1.5" fill="#FFF"/>
    <rect x="13.5" y="21" width="5" height="4" fill="#000"/>
  </svg>`,

  bike_races: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="22" r="4.5" fill="#161922" stroke="#1ABC9C" stroke-width="2"/>
    <circle cx="24" cy="22" r="4.5" fill="#161922" stroke="#1ABC9C" stroke-width="2"/>
    <path d="M8 22L15 15L24 22M15 15L20 12L22 15" stroke="#FFF" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="14" cy="8" r="2.5" fill="#1ABC9C" stroke="#000" stroke-width="1"/>
    <path d="M14 10.5L18 13.5L15 17L12 15Z" fill="#FFF" stroke="#000" stroke-width="1"/>
    <path d="M4 27L10 27M13 27L22 27" stroke="#1ABC9C" stroke-width="1.5"/>
  </svg>`,

  rc_races: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="11" width="20" height="11" fill="#95A5A6" stroke="#000" stroke-width="1.5"/>
    <path d="M17 11L22 15V22H17V11Z" fill="#7F8C8D" stroke="#000" stroke-width="1"/>
    <rect x="18" y="13" width="3" height="3" fill="#000"/>
    <line x1="7" y1="11" x2="11" y2="3" stroke="#FFF" stroke-width="2"/>
    <circle cx="12" cy="2" r="1.5" fill="#E74C3C"/>
    <path d="M14 2L16 4M10 1L8 3" stroke="#FFC400" stroke-width="1.5"/>
    <circle cx="9" cy="22" r="3" fill="#000" stroke="#FFF" stroke-width="1"/>
    <circle cx="19" cy="22" r="3" fill="#000" stroke="#FFF" stroke-width="1"/>
  </svg>`,

  checkpoint_challenges: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="18" r="11" fill="#1C1F26" stroke="#E67E22" stroke-width="2.5"/>
    <rect x="14" y="3" width="4" height="4" fill="#E67E22" stroke="#000" stroke-width="1"/>
    <path d="M16 10V18L21 21" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
    <circle cx="16" cy="18" r="2" fill="#E67E22"/>
    <circle cx="23" cy="11" r="1.5" fill="#E67E22"/>
  </svg>`,

  drive_by_challenges: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12" stroke="#9B59B6" stroke-width="2" fill="#151720"/>
    <circle cx="16" cy="16" r="6" stroke="#9B59B6" stroke-width="1.5"/>
    <line x1="16" y1="2" x2="16" y2="8" stroke="#FFF" stroke-width="2"/>
    <line x1="16" y1="24" x2="16" y2="30" stroke="#FFF" stroke-width="2"/>
    <line x1="2" y1="16" x2="8" y2="16" stroke="#FFF" stroke-width="2"/>
    <line x1="24" y1="16" x2="30" y2="16" stroke="#FFF" stroke-width="2"/>
    <circle cx="16" cy="16" r="2" fill="#E74C3C"/>
  </svg>`,

  bumps_and_grinds: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 28C6 28 10 24 14 20C18 16 22 22 30 28H2Z" fill="#1B2B1B" stroke="#27AE60" stroke-width="2"/>
    <circle cx="9" cy="18" r="3.5" fill="#000" stroke="#27AE60" stroke-width="1.5"/>
    <circle cx="21" cy="12" r="3.5" fill="#000" stroke="#27AE60" stroke-width="1.5"/>
    <path d="M9 18L15 13L21 12M15 13L17 9L20 10" stroke="#FFF" stroke-width="2" stroke-linecap="round"/>
    <circle cx="16" cy="7" r="1.8" fill="#27AE60"/>
  </svg>`,

  rc_triad_take_down: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="12" width="18" height="15" fill="#C0392B" stroke="#000" stroke-width="1.5"/>
    <rect x="11" y="10" width="10" height="2" fill="#F1C40F"/>
    <rect x="7" y="18" width="18" height="3" fill="#000"/>
    <path d="M16 10Q19 4 23 5" stroke="#FFF" stroke-width="2" fill="none"/>
    <circle cx="23" cy="5" r="2.5" fill="#FFC400"/>
    <path d="M23 2L24 4M26 5L24 6M23 8L22 6M20 5L22 4" stroke="#FF5722" stroke-width="1.5"/>
  </svg>`,

  see_the_sight_before_your_flight: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="9" width="24" height="17" rx="2" fill="#2980B9" stroke="#000" stroke-width="2"/>
    <circle cx="16" cy="17.5" r="5.5" fill="#0E1726" stroke="#FFF" stroke-width="2"/>
    <circle cx="16" cy="17.5" r="2.5" fill="#2980B9"/>
    <rect x="8" y="5" width="6" height="4" fill="#FFF" stroke="#000" stroke-width="1"/>
    <circle cx="23" cy="12.5" r="1.5" fill="#FFC400"/>
  </svg>`,

  slash_tv: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 22L16 12L20 14L10 24L6 22Z" fill="#962D3E" stroke="#000" stroke-width="1.5"/>
    <path d="M16 12L26 4L28 6L18 14" stroke="#FFF" stroke-width="2"/>
    <path d="M19 8L21 7M22 10L24 9M25 12L27 11" stroke="#E74C3C" stroke-width="2"/>
    <ellipse cx="21" cy="21" rx="6" ry="7" fill="#FFF" stroke="#000" stroke-width="1.5"/>
    <circle cx="19" cy="20" r="1" fill="#000"/>
    <circle cx="23" cy="20" r="1" fill="#000"/>
    <circle cx="21" cy="23" r="0.8" fill="#E74C3C"/>
  </svg>`,

  maria_latore: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 18C10 18 13 14 18 14H24V18L18 20L10 24H6V18Z" fill="#D4AC0D" stroke="#000" stroke-width="1.5"/>
    <path d="M23 18V28H20V20" fill="#E91E63" stroke="#000" stroke-width="1.2"/>
    <line x1="22" y1="18" x2="22" y2="28" stroke="#FFF" stroke-width="2"/>
    <circle cx="12" cy="10" r="2.5" fill="#E91E63"/>
    <path d="M9 10Q12 7 15 10Q12 13 9 10Z" fill="#E91E63"/>
  </svg>`
};

// Accurately calculated island bounds matching marker clusters with 5% margin
const ISLAND_BOUNDS = {
  all: [[-128, 0], [0, 128]],
  portland: [[-112, 75], [-52, 119]],
  staunton: [[-117, 44], [-52, 79]],
  shoreside: [[-108, 16], [-41, 46]]
};

const state = {
  markers: [],
  categories: {},
  islands: [],
  activeCategory: "all",
  activeSubCategories: new Set(),
  searchQuery: "",
  hideCollected: false,
  activeIsland: "all",
  currentMarker: null,
  currentMediaTab: "image", // "image" tip always first!
  collected: new Set(),
  leafletMarkers: new Map(),
  map: null,
  markerLayer: null
};

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
    }
  } catch (e) {}
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ hideCollected: state.hideCollected }));
  } catch (e) {}
}

// --- Map Initialization ---
function initMap() {
  state.map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: 0,
    maxZoom: 6,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 100,
    zoomControl: false,
    attributionControl: false,
    bounceAtZoomLimits: false,
    fadeAnimation: true,
    markerZoomAnimation: true,
    maxBounds: [[-136, -6], [6, 136]],
    maxBoundsViscosity: 0.85
  });

  // CRITICAL FIX FOR ZOOM:
  // Tile server only hosts tiles up to zoom 3.
  // Setting maxNativeZoom: 3 ensures Leaflet auto-scales Zoom 3 tiles smoothly at zooms 3.25 to 6,
  // completely eliminating 404 tile requests and map disappearing!
  L.tileLayer("https://assets.gtamap.net/map-tiles/gtamap/lcs/lc/game/{z}/{x}/{y}.jpg", {
    tileSize: 128,
    minNativeZoom: 0,
    maxNativeZoom: 3,
    maxZoom: 6,
    bounds: [[-128, 0], [0, 128]],
    noWrap: true,
    tms: false,
    updateWhenIdle: false,
    updateWhenZooming: true,
    keepBuffer: 8,
    errorTileUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect width='256' height='256' fill='%230b0e13'/%3E%3C/svg%3E"
  }).addTo(state.map);

  state.markerLayer = L.layerGroup().addTo(state.map);
  state.map.fitBounds(ISLAND_BOUNDS.all);

  state.map.on("click", (e) => {
    if (!e.originalEvent.target.closest(".custom-marker")) {
      closeBottomSheet();
    }
  });
}

// --- Stylized GTA Radar Blip Marker Generator ---
function createMarkerIcon(marker) {
  const isCollected = state.collected.has(marker.id);
  const color = marker.color || "#f5a623";
  const iconSvg = CATEGORY_ICONS[marker.category] || CATEGORY_ICONS.hidden_packages;
  const isSelected = state.currentMarker && state.currentMarker.id === marker.id;

  const html = `
    <div class="custom-marker ${isCollected ? 'collected' : ''} ${isSelected ? 'active-selected' : ''}" 
         data-cat="${marker.category}" 
         title="${marker.title}">
      <div class="marker-blip-bg" style="--blip-color: ${color};"></div>
      <div class="marker-icon-svg">
        ${iconSvg}
      </div>
      <div class="marker-check-badge">✓</div>
      <div class="marker-radar-ping"></div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: "marker-div-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
}

function renderMarkers() {
  state.markerLayer.clearLayers();
  state.leafletMarkers.clear();

  const query = state.searchQuery.toLowerCase().trim();

  state.markers.forEach(marker => {
    if (state.activeCategory === "hidden_packages" && marker.category !== "hidden_packages") return;
    if (state.activeCategory === "challenges" && !["checkpoint_challenges", "drive_by_challenges", "bumps_and_grinds", "rc_triad_take_down", "see_the_sight_before_your_flight", "slash_tv", "maria_latore"].includes(marker.category)) return;
    if (state.activeCategory === "races" && !["car_races", "bike_races", "rc_races"].includes(marker.category)) return;
    if (state.activeCategory === "rampages" && marker.category !== "rampages") return;
    if (state.activeCategory === "unique_stunt_jumps" && marker.category !== "unique_stunt_jumps") return;

    if (state.activeSubCategories.size > 0 && !state.activeSubCategories.has(marker.category)) return;

    if (state.activeIsland === "portland" && marker.island !== "Portland") return;
    if (state.activeIsland === "staunton" && marker.island !== "Staunton Island") return;
    if (state.activeIsland === "shoreside" && marker.island !== "Shoreside Vale") return;

    const isCollected = state.collected.has(marker.id);
    if (state.hideCollected && isCollected) return;

    if (query) {
      const match = marker.title.toLowerCase().includes(query) ||
                    (marker.location && marker.location.toLowerCase().includes(query)) ||
                    marker.island.toLowerCase().includes(query) ||
                    (marker.number && marker.number.toString() === query) ||
                    (marker.unlock && marker.unlock.toLowerCase().includes(query));
      if (!match) return;
    }

    const latLng = [marker.lat, marker.lng];
    const lMarker = L.marker(latLng, { icon: createMarkerIcon(marker), keyboard: false });

    lMarker.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      openBottomSheet(marker);
    });

    lMarker.addTo(state.markerLayer);
    state.leafletMarkers.set(marker.id, lMarker);
  });
}

function updateMarkerVisual(markerId) {
  const lMarker = state.leafletMarkers.get(markerId);
  const marker = state.markers.find(m => m.id === markerId);
  if (lMarker && marker) {
    if (state.hideCollected && state.collected.has(markerId)) {
      state.markerLayer.removeLayer(lMarker);
      state.leafletMarkers.delete(markerId);
    } else {
      lMarker.setIcon(createMarkerIcon(marker));
    }
  }
}

// --- Dynamic Safehouse Reward (GTA HUD Style) ---
function getDynamicRewardText() {
  const hpCollected = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
  const next = SAFE_REWARDS.find(r => r.count > hpCollected);
  if (next) {
    return `NEXT PICKUP: <strong>${next.reward.toUpperCase()}</strong> [ ${hpCollected} / ${next.count} ]`;
  }
  return `ALL SAFEHOUSE PICKUPS UNLOCKED [ 100 / 100 ]!`;
}

// --- Bottom Sheet & Media Controller ---
function openBottomSheet(marker) {
  state.currentMarker = marker;
  state.currentMediaTab = "image"; // ALWAYS start with image tip to save data!

  // Update map marker highlights
  state.leafletMarkers.forEach((lMarker, mId) => {
    const m = state.markers.find(item => item.id === mId);
    if (m) lMarker.setIcon(createMarkerIcon(m));
  });

  const catMeta = state.categories[marker.category] || { name: marker.category, color: marker.color };

  document.getElementById("sheetCategory").textContent = catMeta.name;
  document.getElementById("sheetCategory").style.color = marker.color || "var(--gta-gold)";
  document.getElementById("sheetTitle").textContent = marker.title;
  document.getElementById("sheetSubtitle").textContent = `${marker.location ? marker.location + ' • ' : ''}${marker.island}`;

  // Info Box: ONLY show unlock tag if there is a specific mission requirement
  const infoBox = document.getElementById("sheetInfoBox");
  let infoHtml = "";

  if (marker.unlock) {
    infoHtml += `<div class="info-row"><span class="info-tag">🔒 ${marker.unlock}</span></div>`;
  }
  if (marker.objective) {
    infoHtml += `<p class="info-desc">${marker.objective}</p>`;
  }

  // Dynamic reward for packages or static reward for others
  if (marker.category === "hidden_packages") {
    infoHtml += `<p class="info-reward">🎁 ${getDynamicRewardText()}</p>`;
  } else if (marker.reward) {
    infoHtml += `<p class="info-reward">🎁 REWARD: ${marker.reward.toUpperCase()}</p>`;
  }
  infoBox.innerHTML = infoHtml;

  // Media Switcher Setup
  const tabsContainer = document.getElementById("sheetMediaTabs");
  const tabVid = document.getElementById("tabVideo");

  if (marker.video) {
    tabsContainer.style.display = "flex";
    tabVid.style.display = "flex";
  } else {
    tabsContainer.style.display = "none";
  }

  // Render Image Tip First (Zero Video Bandwidth used!)
  renderMediaView("image");

  updateCollectedBtn();
  updateStepperBtns();

  document.getElementById("bottomSheet").classList.add("open");
  document.getElementById("sheetBackdrop").classList.add("active");
}

function renderMediaView(tab) {
  state.currentMediaTab = tab;
  const marker = state.currentMarker;
  if (!marker) return;

  const mediaBox = document.getElementById("sheetMediaBox");
  const tabImg = document.getElementById("tabImage");
  const tabVid = document.getElementById("tabVideo");

  // Destroy previous video if any
  const existingVideo = mediaBox.querySelector("video");
  if (existingVideo) {
    existingVideo.pause();
    existingVideo.removeAttribute("src");
    existingVideo.load();
  }

  if (tab === "video" && marker.video) {
    tabVid.classList.add("active");
    tabImg.classList.remove("active");

    // Only load video NOW because user explicitly tapped "Watch Video"
    mediaBox.innerHTML = `
      <video src="${marker.video}" controls playsinline autoplay muted loop preload="auto">
        Your browser does not support the video tag.
      </video>
    `;
  } else {
    tabImg.classList.add("active");
    tabVid.classList.remove("active");

    if (marker.image) {
      mediaBox.innerHTML = `<img src="${marker.image}" alt="${marker.title}" loading="eager" />`;
    } else {
      mediaBox.innerHTML = `
        <div style="color: var(--gta-text-dim); font-family: var(--font-gta-hud); font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; text-align: center; padding: 24px; line-height: 1.6;">
          [ NO PHOTO INTEL IN ARCHIVE ]<br>
          ${marker.video ? '<span style="color: var(--gta-gold);">SELECT "WATCH VIDEO" FOR SURVEILLANCE FEED</span>' : ''}
        </div>
      `;
    }
  }
}

function closeBottomSheet() {
  document.getElementById("bottomSheet").classList.remove("open");
  document.getElementById("sheetBackdrop").classList.remove("active");

  const mediaBox = document.getElementById("sheetMediaBox");
  const existingVideo = mediaBox.querySelector("video");
  if (existingVideo) {
    existingVideo.pause();
    existingVideo.removeAttribute("src");
    existingVideo.load();
    mediaBox.innerHTML = "";
  }

  if (state.currentMarker) {
    const prevId = state.currentMarker.id;
    state.currentMarker = null;
    updateMarkerVisual(prevId);
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

  saveCollected();
  updateCollectedBtn();
  updateMarkerVisual(mId);

  if (state.currentMarker.category === "hidden_packages") {
    const rewEl = document.querySelector("#sheetInfoBox .info-reward");
    if (rewEl) rewEl.innerHTML = `🎁 ${getDynamicRewardText()}`;
  }
}

function updateCollectedBtn() {
  const btn = document.getElementById("btnCollect");
  if (!state.currentMarker) return;
  const isFound = state.collected.has(state.currentMarker.id);

  if (isFound) {
    btn.classList.add("collected");
    btn.innerHTML = `<span class="check-icon">✓</span> COLLECTED`;
  } else {
    btn.classList.remove("collected");
    btn.innerHTML = `<span class="check-icon">○</span> MARK AS FOUND`;
  }
}

function updateStepperBtns() {
  const btnPrev = document.getElementById("btnPrev");
  const btnNext = document.getElementById("btnNext");
  const marker = state.currentMarker;

  if (!marker || marker.category !== "hidden_packages") {
    btnPrev.disabled = true;
    btnNext.disabled = true;
    return;
  }

  const num = marker.number;
  btnPrev.disabled = num <= 1;
  btnNext.disabled = num >= 100;
}

function navigatePackage(offset) {
  if (!state.currentMarker || state.currentMarker.category !== "hidden_packages") return;
  const nextNum = state.currentMarker.number + offset;
  const target = state.markers.find(m => m.category === "hidden_packages" && m.number === nextNum);

  if (target) {
    state.map.setView([target.lat, target.lng], 4, { animate: true });
    openBottomSheet(target);
  }
}

// --- Progress & UI Stats ---
function updateProgressUI() {
  const hpTotal = 100;
  const hpCollected = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
  const totalCollected = state.collected.size;
  const totalAll = state.markers.length;

  document.getElementById("hpProgressText").textContent = `${hpCollected} / ${hpTotal}`;
  document.getElementById("hpProgressBar").style.width = `${Math.round((hpCollected / hpTotal) * 100)}%`;

  const drawerStats = document.getElementById("drawerStats");
  if (drawerStats) {
    drawerStats.textContent = `${totalCollected} / ${totalAll}`;
  }
  const subStats = document.getElementById("drawerSubStats");
  if (subStats) {
    subStats.textContent = `${Math.round((totalCollected / totalAll) * 100)}% Complete`;
  }

  // Safehouse Weapon Milestone Tracker in Drawer
  const milestoneList = document.getElementById("safehouseMilestoneList");
  if (milestoneList) {
    milestoneList.innerHTML = SAFE_REWARDS.map(r => {
      const unlocked = hpCollected >= r.count;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 3px 0; color: ${unlocked ? 'var(--gta-green)' : 'var(--gta-text-dim)'}; font-family: var(--font-gta-hud); font-size: 11px;">
          <span>${unlocked ? '✓' : '○'} ${r.reward.toUpperCase()}</span>
          <span style="color: var(--gta-gold);">${r.count} PKGS</span>
        </div>
      `;
    }).join("");
  }

  // Update Category checklist counts
  Object.keys(state.categories).forEach(catId => {
    const el = document.getElementById(`count_${catId}`);
    if (el) {
      const catTotal = state.categories[catId].count || 0;
      const catDone = state.markers.filter(m => m.category === catId && state.collected.has(m.id)).length;
      el.textContent = `${catDone}/${catTotal}`;
    }
  });
}

// --- Island Navigation with Accurate Bounds ---
function setIsland(islandKey) {
  state.activeIsland = islandKey;
  document.querySelectorAll(".island-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.island === islandKey);
  });

  const bounds = ISLAND_BOUNDS[islandKey] || ISLAND_BOUNDS.all;
  state.map.fitBounds(bounds, { animate: true, padding: [15, 15], maxZoom: 4 });
  renderMarkers();
}

function setCategoryFilter(cat) {
  state.activeCategory = cat;
  document.querySelectorAll(".chip-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === cat);
  });
  renderMarkers();
}

function toggleFilterDrawer(open) {
  const drawer = document.getElementById("filterDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (open === undefined) {
    open = !drawer.classList.contains("open");
  }
  drawer.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
}

function initDrawerCategories() {
  const list = document.getElementById("drawerCategoryList");
  if (!list) return;

  list.innerHTML = "";
  Object.keys(state.categories).forEach(catId => {
    const cat = state.categories[catId];
    const item = document.createElement("div");
    item.className = "filter-item";
    item.innerHTML = `
      <div class="filter-item-left">
        <span class="dot" style="background-color: ${cat.color}"></span>
        <span class="filter-item-name">${cat.name}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="filter-item-count" id="count_${catId}">0/${cat.count}</span>
        <label class="toggle-switch">
          <input type="checkbox" checked data-subcat="${catId}" />
          <span class="toggle-slider"></span>
        </label>
      </div>
    `;

    item.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) {
        state.activeSubCategories.delete(catId);
      } else {
        if (state.activeSubCategories.size === 0) {
          Object.keys(state.categories).forEach(k => {
            if (k !== catId) state.activeSubCategories.add(k);
          });
        } else {
          state.activeSubCategories.delete(catId);
        }
      }
      renderMarkers();
    });

    list.appendChild(item);
  });
}

function resetProgress() {
  if (confirm("Reset all tracked progress?")) {
    state.collected.clear();
    saveCollected();
    renderMarkers();
    if (state.currentMarker) updateCollectedBtn();
  }
}

function exportProgress() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify([...state.collected]));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "gta_lcs_progress.json");
  dlAnchor.click();
}

function importProgress() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          state.collected = new Set(imported);
          saveCollected();
          renderMarkers();
          alert("Progress loaded!");
        }
      } catch (err) {
        alert("Invalid file.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function bindEvents() {
  document.querySelectorAll(".island-btn").forEach(btn => {
    btn.addEventListener("click", () => setIsland(btn.dataset.island));
  });

  document.querySelectorAll(".chip-btn").forEach(btn => {
    btn.addEventListener("click", () => setCategoryFilter(btn.dataset.cat));
  });

  document.getElementById("tabImage").addEventListener("click", () => renderMediaView("image"));
  document.getElementById("tabVideo").addEventListener("click", () => renderMediaView("video"));

  document.getElementById("sheetCloseBtn").addEventListener("click", closeBottomSheet);
  document.getElementById("sheetBackdrop").addEventListener("click", closeBottomSheet);
  document.getElementById("sheetHandle").addEventListener("click", closeBottomSheet);
  document.getElementById("btnCollect").addEventListener("click", toggleCurrentCollected);
  document.getElementById("btnPrev").addEventListener("click", () => navigatePackage(-1));
  document.getElementById("btnNext").addEventListener("click", () => navigatePackage(1));

  document.getElementById("btnOpenMenu").addEventListener("click", () => toggleFilterDrawer(true));
  document.getElementById("btnCloseDrawer").addEventListener("click", () => toggleFilterDrawer(false));
  document.getElementById("drawerBackdrop").addEventListener("click", () => toggleFilterDrawer(false));

  const hideToggle = document.getElementById("toggleHideCollected");
  hideToggle.checked = state.hideCollected;
  hideToggle.addEventListener("change", (e) => {
    state.hideCollected = e.target.checked;
    saveSettings();
    renderMarkers();
  });

  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderMarkers();
  });

  document.getElementById("btnResetProgress").addEventListener("click", resetProgress);
  document.getElementById("btnExportProgress").addEventListener("click", exportProgress);
  document.getElementById("btnImportProgress").addEventListener("click", importProgress);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeBottomSheet();
      toggleFilterDrawer(false);
    }
    if (state.currentMarker && state.currentMarker.category === "hidden_packages") {
      if (e.key === "ArrowLeft") navigatePackage(-1);
      if (e.key === "ArrowRight") navigatePackage(1);
      if (e.key === " ") {
        e.preventDefault();
        toggleCurrentCollected();
      }
    }
  });
}

async function init() {
  loadCollected();
  loadSettings();
  initMap();
  bindEvents();

  try {
    const res = await fetch("data/markers.json");
    const data = await res.json();
    state.markers = data.markers;
    state.categories = data.categories;
    state.islands = data.islands;

    initDrawerCategories();
    renderMarkers();
    updateProgressUI();
  } catch (e) {
    console.error("Failed to load markers:", e);
  }
}

document.addEventListener("DOMContentLoaded", init);
