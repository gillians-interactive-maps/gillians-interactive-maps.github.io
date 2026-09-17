/**
 * GTA Liberty City Stories - Interactive Map & Checklist
 * Pure Black Ocean Canvas, Vector SVG Map, Compact Detail Card, Extended Desktop Sidebar
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

// Clean, minimalist vector paths (24px viewBox)
const CATEGORY_ICONS = {
  hidden_packages: `<path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 15H4V9h3v3h2V9h6v3h2V9h3v11z"/>`,

  rampages: `<path d="M12 2C7.58 2 4 5.58 4 10c0 2.7 1.34 5.08 3.4 6.53V19h2v2h2v-2h2v2h2v-2h2v-2.47c2.06-1.45 3.4-3.83 3.4-6.53 0-4.42-3.58-8-8-8zm-3 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>`,

  unique_stunt_jumps: `<path d="M3 19h18v2H3v-2zm1.5-4L15 6.5V11h2V3h-8v2h4.5L5.5 13 4.5 15z"/>`,

  races: `<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>`,

  challenges: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h6v-2h-4z"/>`
};

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
  searchQuery: "",
  hideCollected: false,
  useVectorMap: true,
  activeIsland: "all",
  currentMarker: null,
  currentMediaTab: "image",
  collected: new Set(),
  leafletMarkers: new Map(),
  map: null,
  markerLayer: null,
  vectorLayer: null,
  tileLayer: null
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
      if (typeof parsed.useVectorMap === "boolean") {
        state.useVectorMap = parsed.useVectorMap;
      }
    }
  } catch (e) {}
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      hideCollected: state.hideCollected,
      useVectorMap: state.useVectorMap
    }));
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

  // 1. High-Resolution Clean Master Map Layer (GPU-accelerated, seamless, zero-lag)
  state.vectorLayer = L.imageOverlay("assets/map/lcs_map_clean.png", [[-128, 0], [0, 128]], {
    opacity: 1,
    interactive: false,
    zIndex: 1
  });

  // 2. Raster Tile Layer (Authentic in-game radar map tiles)
  state.tileLayer = L.tileLayer("https://assets.gtamap.net/map-tiles/gtamap/lcs/lc/game/{z}/{x}/{y}.jpg", {
    tileSize: 256,
    minNativeZoom: 0,
    maxNativeZoom: 3,
    maxZoom: 6,
    bounds: [[-128, 0], [0, 128]],
    noWrap: true,
    tms: false,
    updateWhenIdle: false,
    updateWhenZooming: true,
    keepBuffer: 8,
    errorTileUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect width='256' height='256' fill='%23000000'/%3E%3C/svg%3E"
  });

  // Apply default layer based on settings
  if (state.useVectorMap) {
    state.vectorLayer.addTo(state.map);
  } else {
    state.tileLayer.addTo(state.map);
  }

  state.markerLayer = L.layerGroup().addTo(state.map);
  state.map.fitBounds(ISLAND_BOUNDS.all);

  state.map.on("click", (e) => {
    if (!e.originalEvent.target.closest(".map-pin")) {
      closeDetailCard();
    }
  });
}

function updateMapLayer() {
  if (state.useVectorMap) {
    if (state.map.hasLayer(state.tileLayer)) state.map.removeLayer(state.tileLayer);
    if (!state.map.hasLayer(state.vectorLayer)) state.vectorLayer.addTo(state.map);
  } else {
    if (state.map.hasLayer(state.vectorLayer)) state.map.removeLayer(state.vectorLayer);
    if (!state.map.hasLayer(state.tileLayer)) state.tileLayer.addTo(state.map);
  }
}

// --- Map Pin Generator (26px x 34px, High Visibility, Zero Aura) ---
function createMarkerIcon(marker) {
  const isCollected = state.collected.has(marker.id);
  const color = marker.color || "#3b82f6";
  const iconPath = CATEGORY_ICONS[marker.category] || CATEGORY_ICONS.hidden_packages;
  const isSelected = state.currentMarker && state.currentMarker.id === marker.id;

  const html = `
    <div class="map-pin ${isCollected ? 'collected' : ''} ${isSelected ? 'selected' : ''}">
      <svg viewBox="0 0 26 34" width="26" height="34" style="display: block; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.85));">
        <!-- Pin Base -->
        <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21c0-7.18-5.82-13-13-13z" fill="${color}" stroke="#000000" stroke-width="1.4"/>
        <!-- Inner Head Shadow -->
        <circle cx="13" cy="13" r="8.5" fill="#000000" opacity="0.25"/>
        <!-- White Collectible Silhouette -->
        <g transform="translate(6, 6) scale(0.58)" fill="#ffffff">
          ${iconPath}
        </g>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: "pin-div-icon",
    iconSize: [26, 34],
    iconAnchor: [13, 34]
  });
}

function renderMarkers() {
  state.markerLayer.clearLayers();
  state.leafletMarkers.clear();

  const query = state.searchQuery.toLowerCase().trim();

  state.markers.forEach(marker => {
    // Category filter
    if (state.activeCategory !== "all" && marker.category !== state.activeCategory) return;

    // Island filter
    if (state.activeIsland === "portland" && marker.island !== "Portland") return;
    if (state.activeIsland === "staunton" && marker.island !== "Staunton Island") return;
    if (state.activeIsland === "shoreside" && marker.island !== "Shoreside Vale") return;

    // Hide collected toggle
    const isCollected = state.collected.has(marker.id);
    if (state.hideCollected && isCollected) return;

    // Search query filter
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
    return `Next reward: <strong>${next.reward}</strong> (${hpCollected}/${next.count} found)`;
  }
  return `All safehouse rewards unlocked (100/100)!`;
}

// --- Detail Card Controller & Auto-Zoom on Selected Item ---
function openDetailCard(marker) {
  state.currentMarker = marker;
  state.currentMediaTab = "image"; // Photo tip first to save bandwidth

  // Center and smoothly zoom in on the selected item!
  const targetZoom = Math.max(state.map.getZoom(), 4.25);
  state.map.setView([marker.lat, marker.lng], targetZoom, { animate: true });

  // Update visual selection on markers
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
          ${marker.video ? '<span style="color: var(--color-blue); cursor: pointer; text-decoration: underline;" onclick="renderMediaView(&quot;video&quot;)">Watch video walkthrough</span>' : ''}
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
  if (!state.currentMarker || !btn) return;
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

  if (!btnPrev || !btnNext) return;
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
    openDetailCard(target);
  }
}

// --- Progress & UI Stats ---
function updateProgressUI() {
  const hpTotal = 100;
  const hpCollected = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
  const totalCollected = state.collected.size;
  const totalAll = state.markers.length || 166;

  const hpText = document.getElementById("hpProgressText");
  if (hpText) hpText.textContent = `${hpCollected} / ${hpTotal}`;
  const hpBar = document.getElementById("hpProgressBar");
  if (hpBar) hpBar.style.width = `${Math.round((hpCollected / hpTotal) * 100)}%`;

  const countAll = document.getElementById("count_all");
  if (countAll) countAll.textContent = `${totalCollected}/${totalAll}`;

  // Update Category checklist counts in Sidebar and Drawer
  Object.keys(state.categories).forEach(catId => {
    const el = document.getElementById(`count_${catId}`);
    if (el) {
      const catTotal = state.categories[catId].count || 0;
      const catDone = state.markers.filter(m => m.category === catId && state.collected.has(m.id)).length;
      el.textContent = `${catDone}/${catTotal}`;
    }
  });

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
}

// --- Island Navigation with Accurate Bounds ---
function setIsland(islandKey) {
  state.activeIsland = islandKey;
  document.querySelectorAll(".island-btn").forEach(b => {
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

  // Sidebar category filter items
  document.querySelectorAll(".nav-item[data-cat]").forEach(btn => {
    btn.addEventListener("click", () => setCategoryFilter(btn.dataset.cat));
  });

  // Drawer open/close
  const btnOpenDrawer = document.getElementById("btnOpenDrawer");
  if (btnOpenDrawer) btnOpenDrawer.addEventListener("click", () => toggleChecklistDrawer(true));

  const btnCloseDrawer = document.getElementById("btnCloseDrawer");
  if (btnCloseDrawer) btnCloseDrawer.addEventListener("click", () => toggleChecklistDrawer(false));

  const drawerBackdrop = document.getElementById("drawerBackdrop");
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", () => toggleChecklistDrawer(false));

  // Media tabs
  const tabImg = document.getElementById("tabImage");
  if (tabImg) tabImg.addEventListener("click", () => renderMediaView("image"));

  const tabVid = document.getElementById("tabVideo");
  if (tabVid) tabVid.addEventListener("click", () => renderMediaView("video"));

  // Detail card buttons
  const cardCloseBtn = document.getElementById("cardCloseBtn");
  if (cardCloseBtn) cardCloseBtn.addEventListener("click", closeDetailCard);

  const btnMarkFound = document.getElementById("btnMarkFound");
  if (btnMarkFound) btnMarkFound.addEventListener("click", toggleCurrentCollected);

  const btnPrev = document.getElementById("btnPrev");
  if (btnPrev) btnPrev.addEventListener("click", () => navigatePackage(-1));

  const btnNext = document.getElementById("btnNext");
  if (btnNext) btnNext.addEventListener("click", () => navigatePackage(1));

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

  // Map layer toggle (Vector SVG vs Game Radar Tiles)
  const toggleMap = document.getElementById("toggleMapLayer");
  if (toggleMap) {
    toggleMap.checked = state.useVectorMap;
    toggleMap.addEventListener("change", (e) => {
      state.useVectorMap = e.target.checked;
      saveSettings();
      updateMapLayer();
    });
  }

  // Search input
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderMarkers();
    });
  }

  // Progress widget click opens drawer
  const progressBox = document.getElementById("sidebarProgressBox");
  if (progressBox) progressBox.addEventListener("click", () => toggleChecklistDrawer(true));

  // Backup & Reset
  const btnReset = document.getElementById("btnResetProgress");
  if (btnReset) btnReset.addEventListener("click", resetProgress);

  const btnExport = document.getElementById("btnExportProgress");
  if (btnExport) btnExport.addEventListener("click", exportProgress);

  const btnImport = document.getElementById("btnImportProgress");
  if (btnImport) btnImport.addEventListener("click", importProgress);

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

function loadMarkerDataIntoState(data) {
  state.markers = data.markers;
  state.categories = data.categories;
  state.islands = data.islands;

  initDrawerCategories();
  renderMarkers();
  updateProgressUI();

  // Check URL query param ?id=
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get("id");
  if (targetId) {
    const target = state.markers.find(m => m.id === targetId || (m.category === "hidden_packages" && m.number.toString() === targetId));
    if (target) {
      openDetailCard(target);
    }
  }
}

async function init() {
  loadCollected();
  loadSettings();
  initMap();
  bindEvents();

  // Instant offline loading via bundled window.MARKER_DATA
  if (window.MARKER_DATA && window.MARKER_DATA.markers) {
    loadMarkerDataIntoState(window.MARKER_DATA);
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
