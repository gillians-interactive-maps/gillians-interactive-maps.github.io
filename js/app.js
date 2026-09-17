/**
 * GTA Liberty City Stories - Clean & Legible Interactive Map
 * Minimalist map pins, high legibility, robust tile scaling, lazy video loading.
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

// Clean, minimalist flat silhouettes
const CATEGORY_ICONS = {
  hidden_packages: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 15H4V9h3v3h2V9h6v3h2V9h3v11z"/>
  </svg>`,

  rampages: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 2C7.58 2 4 5.58 4 10c0 2.7 1.34 5.08 3.4 6.53V19h2v2h2v-2h2v2h2v-2h2v-2.47c2.06-1.45 3.4-3.83 3.4-6.53 0-4.42-3.58-8-8-8zm-3 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>`,

  unique_stunt_jumps: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M3 19h18v2H3v-2zm1.5-4L15 6.5V11h2V3h-8v2h4.5L5.5 13 4.5 15z"/>
  </svg>`,

  car_races: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
    <circle cx="7.5" cy="14.5" r="1.5"/>
    <circle cx="16.5" cy="14.5" r="1.5"/>
  </svg>`,

  bike_races: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5c0-1.66-.82-3.13-2.08-4.04L10 11h3.41l2 2H13v2h4.41l2.48 2.48c-.56.92-.89 2-.89 3.16 0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5c-.75 0-1.46.16-2.11.45l-2.45-2.45V9.03h-.01zM5 17c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm14 3c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
  </svg>`,

  rc_races: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 2a1 1 0 0 1 1 1v3.08A8 8 0 0 1 20 14v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1H9v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a8 8 0 0 1 7-7.92V3a1 1 0 0 1 1-1zm0 6a6 6 0 0 0-6 6v3h12v-3a6 6 0 0 0-6-6zm-3 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm6 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
  </svg>`,

  checkpoint_challenges: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M19.03 7.39l1.42-1.42c-.45-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-11h-2v5l4.25 2.52.77-1.28-3.02-1.79V9zM9 1h6v2H9z"/>
  </svg>`,

  drive_by_challenges: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 2v3.08A7.002 7.002 0 0 0 5.08 12H2v2h3.08A7.002 7.002 0 0 0 12 18.92V22h2v-3.08A7.002 7.002 0 0 0 18.92 14H22v-2h-3.08A7.002 7.002 0 0 0 14 5.08V2h-2zm0 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
  </svg>`,

  bumps_and_grinds: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M3 18c3-3 6-3 9 0s6 3 9 0v3H3v-3zm3.5-5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm11 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM9 10l3-3 3 3h-6z"/>
  </svg>`,

  rc_triad_take_down: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 8a7 7 0 1 0 7 7 7 7 0 0 0-7-7zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5zm6.5-13.5l1.41-1.41A9.97 9.97 0 0 0 17 3.58V5.6a8.03 8.03 0 0 1 1.5 1.4zM13 2h-2v4h2V2zm8 6h-2a8.03 8.03 0 0 1-1.4 1.5l1.41 1.41A9.97 9.97 0 0 0 21 8z"/>
  </svg>`,

  see_the_sight_before_your_flight: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M9.4 4l-1.4 2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3l-1.4-2H9.4zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"/>
  </svg>`,

  slash_tv: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M19.78 4.22a3 3 0 0 0-4.24 0L12 7.76l1.41 1.41 2.83-2.83.71.71-2.83 2.83 1.41 1.41 2.83-2.83.71.71-2.83 2.83L17.66 15.34l3.54-3.54a3 3 0 0 0 0-4.24l-1.42-3.34zM7.76 12L4.22 15.54a3 3 0 0 0 0 4.24l.18.18a3 3 0 0 0 4.24 0L12 16.42 7.76 12zm-1.42 7.07a1 1 0 0 1-1.41-1.41l2.12-2.12 1.41 1.41-2.12 2.12z"/>
  </svg>`,

  maria_latore: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>`
};

// Accurately calculated island bounds matching marker clusters
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
  currentMediaTab: "image", // photo tip always first
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

  // maxNativeZoom: 3 ensures Zoom 3 tiles are smoothly scaled at zooms 3.25 to 6,
  // preventing 404 tile requests and preventing map tiles from disappearing!
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
    errorTileUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect width='256' height='256' fill='%23243447'/%3E%3C/svg%3E"
  }).addTo(state.map);

  state.markerLayer = L.layerGroup().addTo(state.map);
  state.map.fitBounds(ISLAND_BOUNDS.all);

  state.map.on("click", (e) => {
    if (!e.originalEvent.target.closest(".map-pin")) {
      closeDetailCard();
    }
  });
}

// --- Clean Map Pin Generator (Teardrop pin, zero aura) ---
function createMarkerIcon(marker) {
  const isCollected = state.collected.has(marker.id);
  const color = marker.color || "#3b82f6";
  const iconSvg = CATEGORY_ICONS[marker.category] || CATEGORY_ICONS.hidden_packages;
  const isSelected = state.currentMarker && state.currentMarker.id === marker.id;

  const html = `
    <div class="map-pin ${isCollected ? 'collected' : ''} ${isSelected ? 'selected' : ''}" style="--pin-color: ${color};">
      <svg class="pin-base" viewBox="0 0 24 32" width="22" height="30">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="var(--pin-color)" stroke="#0f172a" stroke-width="1.2"/>
        <circle cx="12" cy="11" r="7.5" fill="#000000" opacity="0.2"/>
      </svg>
      <div class="pin-icon">
        ${iconSvg}
      </div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: "pin-div-icon",
    iconSize: [22, 30],
    iconAnchor: [11, 30]
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
      openDetailCard(marker);
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

// --- Dynamic Safehouse Reward ---
function getDynamicRewardText() {
  const hpCollected = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
  const next = SAFE_REWARDS.find(r => r.count > hpCollected);
  if (next) {
    return `Next safehouse reward: <strong>${next.reward}</strong> (${hpCollected}/${next.count} found)`;
  }
  return `All safehouse rewards unlocked (100/100)!`;
}

// --- Detail Card Controller (Clean popup) ---
function openDetailCard(marker) {
  state.currentMarker = marker;
  state.currentMediaTab = "image"; // Photo tip first to save bandwidth

  // Highlight marker
  state.leafletMarkers.forEach((lMarker, mId) => {
    const m = state.markers.find(item => item.id === mId);
    if (m) lMarker.setIcon(createMarkerIcon(m));
  });

  const catMeta = state.categories[marker.category] || { name: marker.category, color: marker.color };

  document.getElementById("cardTitle").textContent = marker.title;
  document.getElementById("cardSubtitle").textContent = `${marker.location ? marker.location + ' • ' : ''}${marker.island} (${catMeta.name})`;

  // Info Box
  const infoEl = document.getElementById("cardInfo");
  let infoHtml = "";

  if (marker.unlock) {
    infoHtml += `<div class="card-unlock">🔒 ${marker.unlock}</div>`;
  }
  if (marker.objective) {
    infoHtml += `<div class="card-objective">${marker.objective}</div>`;
  }
  if (marker.category === "hidden_packages") {
    infoHtml += `<div class="card-reward">🎁 ${getDynamicRewardText()}</div>`;
  } else if (marker.reward) {
    infoHtml += `<div class="card-reward">🎁 Reward: ${marker.reward}</div>`;
  }
  infoEl.innerHTML = infoHtml;

  // Media tabs
  const tabsContainer = document.getElementById("cardMediaTabs");
  const tabVid = document.getElementById("tabVideo");

  if (marker.video) {
    tabsContainer.style.display = "flex";
    tabVid.style.display = "flex";
  } else {
    tabsContainer.style.display = "none";
  }

  // Render photo tip
  renderMediaView("image");

  updateMarkFoundBtn();
  updateStepperBtns();

  document.getElementById("detailCard").classList.add("active");
}

function renderMediaView(tab) {
  state.currentMediaTab = tab;
  const marker = state.currentMarker;
  if (!marker) return;

  const mediaBox = document.getElementById("cardMediaBox");
  const tabImg = document.getElementById("tabImage");
  const tabVid = document.getElementById("tabVideo");

  const existingVideo = mediaBox.querySelector("video");
  if (existingVideo) {
    existingVideo.pause();
    existingVideo.removeAttribute("src");
    existingVideo.load();
  }

  if (tab === "video" && marker.video) {
    tabVid.classList.add("active");
    tabImg.classList.remove("active");

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
        <div class="media-empty">
          No photo tip available.<br>
          ${marker.video ? '<span style="color: var(--color-blue); cursor: pointer;" onclick="renderMediaView(&quot;video&quot;)">Watch video walkthrough</span>' : ''}
        </div>
      `;
    }
  }
}

function closeDetailCard() {
  document.getElementById("detailCard").classList.remove("active");

  const mediaBox = document.getElementById("cardMediaBox");
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
  updateMarkFoundBtn();
  updateMarkerVisual(mId);

  if (state.currentMarker.category === "hidden_packages") {
    const rewEl = document.querySelector("#cardInfo .card-reward");
    if (rewEl) rewEl.innerHTML = `🎁 ${getDynamicRewardText()}`;
  }
}

function updateMarkFoundBtn() {
  const btn = document.getElementById("btnMarkFound");
  if (!state.currentMarker) return;
  const isFound = state.collected.has(state.currentMarker.id);

  if (isFound) {
    btn.classList.add("collected");
    btn.innerHTML = `<span class="check-box-icon">☑</span> Found (hidden)`;
  } else {
    btn.classList.remove("collected");
    btn.innerHTML = `<span class="check-box-icon">☐</span> Hide this marker`;
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
    openDetailCard(target);
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
    subStats.textContent = `${Math.round((totalCollected / totalAll) * 100)}% collected`;
  }

  // Safehouse Weapon Milestone Tracker in Drawer
  const milestoneList = document.getElementById("safehouseMilestoneList");
  if (milestoneList) {
    milestoneList.innerHTML = SAFE_REWARDS.map(r => {
      const unlocked = hpCollected >= r.count;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 3px 0; color: ${unlocked ? 'var(--color-green)' : 'var(--text-dim)'}; font-size: 11px;">
          <span>${unlocked ? '✓' : '○'} ${r.reward}</span>
          <span style="color: var(--color-amber);">${r.count} pkgs</span>
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
  document.querySelectorAll(".sidebar-btn[data-cat]").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === cat);
  });
  renderMarkers();
}

function toggleChecklistDrawer(open) {
  const drawer = document.getElementById("checklistDrawer");
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
    item.className = "drawer-item";
    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${cat.color};"></span>
        <span style="font-weight: 500;">${cat.name}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 11px; color: var(--text-dim);" id="count_${catId}">0/${cat.count}</span>
        <div class="toggle-switch">
          <input type="checkbox" checked data-subcat="${catId}" id="subcat_${catId}" />
          <span class="toggle-slider"></span>
        </div>
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
    if (state.currentMarker) updateMarkFoundBtn();
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
  // Island navigation
  document.querySelectorAll(".island-btn").forEach(btn => {
    btn.addEventListener("click", () => setIsland(btn.dataset.island));
  });

  // Sidebar category filter buttons
  document.querySelectorAll(".sidebar-btn[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => setCategoryFilter(btn.dataset.cat));
  });

  // Hide completed button in sidebar
  const btnToggleHide = document.getElementById("btnToggleHide");
  if (btnToggleHide) {
    btnToggleHide.classList.toggle("active", state.hideCollected);
    btnToggleHide.addEventListener("click", () => {
      state.hideCollected = !state.hideCollected;
      btnToggleHide.classList.toggle("active", state.hideCollected);
      const toggleEl = document.getElementById("toggleHideCollected");
      if (toggleEl) toggleEl.checked = state.hideCollected;
      saveSettings();
      renderMarkers();
    });
  }

  // Drawer open/close
  document.getElementById("btnOpenDrawer").addEventListener("click", () => toggleChecklistDrawer(true));
  document.getElementById("btnCloseDrawer").addEventListener("click", () => toggleChecklistDrawer(false));
  document.getElementById("drawerBackdrop").addEventListener("click", () => toggleChecklistDrawer(false));

  // Media tabs
  document.getElementById("tabImage").addEventListener("click", () => renderMediaView("image"));
  document.getElementById("tabVideo").addEventListener("click", () => renderMediaView("video"));

  // Detail card buttons
  document.getElementById("cardCloseBtn").addEventListener("click", closeDetailCard);
  document.getElementById("btnMarkFound").addEventListener("click", toggleCurrentCollected);
  document.getElementById("btnPrev").addEventListener("click", () => navigatePackage(-1));
  document.getElementById("btnNext").addEventListener("click", () => navigatePackage(1));

  // Drawer hide toggle
  const hideToggle = document.getElementById("toggleHideCollected");
  if (hideToggle) {
    hideToggle.checked = state.hideCollected;
    hideToggle.addEventListener("change", (e) => {
      state.hideCollected = e.target.checked;
      if (btnToggleHide) btnToggleHide.classList.toggle("active", state.hideCollected);
      saveSettings();
      renderMarkers();
    });
  }

  // Search input
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderMarkers();
  });

  // Progress widget click opens drawer
  document.getElementById("progressWidget").addEventListener("click", () => toggleChecklistDrawer(true));

  // Backup & Reset
  document.getElementById("btnResetProgress").addEventListener("click", resetProgress);
  document.getElementById("btnExportProgress").addEventListener("click", exportProgress);
  document.getElementById("btnImportProgress").addEventListener("click", importProgress);

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDetailCard();
      toggleChecklistDrawer(false);
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
