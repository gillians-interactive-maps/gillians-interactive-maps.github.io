/**
 * GTA Liberty City Stories - Interactive Map & Checklist
 * Minimal GTA HUD styling, smooth zoom, lazy video loading, LocalStorage tracking.
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

// Clean, neutral GTA radar blip icons
const CATEGORY_ICONS = {
  hidden_packages: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2l7.5 4.2v11.6L12 22l-7.5-4.2V6.2L12 2zm0 2.2L6.8 7.1 12 10l5.2-2.9L12 4.2zM6 8.7v7.5l6 3.4v-7.6L6 8.7zm12 0l-6 3.3v7.6l6-3.4V8.7z"/></svg>`,
  rampages: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2C7.6 2 4 5.6 4 10c0 2.6 1.3 5 3.3 6.4V19h2v2h2v-2h2v2h2v-2h2v-2.6c2-1.4 3.3-3.8 3.3-6.4 0-4.4-3.6-8-8-8zm-3 8.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm6 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/></svg>`,
  unique_stunt_jumps: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M4 20h16v-2H4v2zm2-10l4 4 6-6V11h2V4h-7v2h3.6L9.6 13 6 9.4V10z"/></svg>`,
  car_races: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M18.9 6c-.2-.6-.8-1-1.4-1h-11c-.6 0-1.2.4-1.4 1L3 12v8c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-8l-2.1-6zM6.9 7h10.2l1 3H5.8l1.1-3zM19 17H5v-5h14v5z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>`,
  bike_races: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm14-8.5c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm-8.2-7l1.7-2.6 1.8 1.8c.8.8 1.9 1.3 3.2 1.3v-2c-.8 0-1.5-.3-2.1-.9l-1.9-1.9c-.4-.4-.9-.7-1.5-.7-.7 0-1.3.3-1.7.8l-2.4 3.7c-.5.8-.8 1.6-.8 2.5 0 1.7 1.3 3 3 3h3v-2h-3c-.6 0-1-.4-1-1 0-.4.1-.7.4-1.1l.3-.5z"/></svg>`,
  rc_races: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M4 6h16v12H4z M2 4h20v16H2z M10 8h4v8h-4z"/></svg>`,
  checkpoint_challenges: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>`,
  drive_by_challenges: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
  bumps_and_grinds: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5H5.5L12 6.5z"/></svg>`,
  rc_triad_take_down: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><circle cx="12" cy="13" r="7"/><path d="M12 6V2M9 3l6 0"/></svg>`,
  see_the_sight_before_your_flight: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M9 2L7.2 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.2L15 2H9zm3 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/></svg>`,
  slash_tv: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>`,
  maria_latore: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><circle cx="12" cy="7" r="4"/><path d="M4 21v-2c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v2H4z"/></svg>`
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
    maxBounds: [[-140, -10], [10, 140]],
    maxBoundsViscosity: 0.8
  });

  L.tileLayer("https://assets.gtamap.net/map-tiles/gtamap/lcs/lc/game/{z}/{x}/{y}.jpg", {
    tileSize: 128,
    minNativeZoom: 0,
    maxNativeZoom: 5,
    noWrap: true,
    tms: false,
    updateWhenIdle: false,
    updateWhenZooming: true,
    keepBuffer: 6
  }).addTo(state.map);

  state.markerLayer = L.layerGroup().addTo(state.map);
  state.map.fitBounds(ISLAND_BOUNDS.all);

  state.map.on("click", (e) => {
    if (!e.originalEvent.target.closest(".custom-marker")) {
      closeBottomSheet();
    }
  });
}

// --- Marker Rendering ---
function createMarkerIcon(marker) {
  const isCollected = state.collected.has(marker.id);
  const color = marker.color || "#e59400";
  const iconSvg = CATEGORY_ICONS[marker.category] || CATEGORY_ICONS.hidden_packages;
  const isSelected = state.currentMarker && state.currentMarker.id === marker.id;

  const html = `
    <div class="custom-marker ${isCollected ? 'collected' : ''} ${isSelected ? 'active-selected' : ''}" 
         style="background-color: ${color}; width: 22px; height: 22px;">
      <div style="color: #fff; display: flex; align-items: center; justify-content: center;">
        ${iconSvg}
      </div>
    </div>
  `;

  return L.divIcon({
    html: html,
    className: "marker-div-icon",
    iconSize: [22, 22],
    iconAnchor: [11, 11]
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

// --- Dynamic Safehouse Reward ---
function getDynamicRewardText() {
  const hpCollected = state.markers.filter(m => m.category === "hidden_packages" && state.collected.has(m.id)).length;
  const next = SAFE_REWARDS.find(r => r.count > hpCollected);
  if (next) {
    return `Next Safehouse Pickup: <strong>${next.reward}</strong> (${hpCollected}/${next.count} found)`;
  }
  return `All Safehouse Pickups Unlocked (100/100)!`;
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
  document.getElementById("sheetCategory").style.color = marker.color;
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
    infoHtml += `<p class="info-reward">🎁 Reward: ${marker.reward}</p>`;
  }
  infoBox.innerHTML = infoHtml;

  // Media Switcher Setup
  const tabsContainer = document.getElementById("sheetMediaTabs");
  const tabImg = document.getElementById("tabImage");
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
      // User requested: "remove the pictures that say picture needed, just mention that there's no image"
      mediaBox.innerHTML = `
        <div style="color: var(--gta-text-dim); font-size: 11px; text-transform: uppercase; font-weight: 700; text-align: center; padding: 20px;">
          No photo tip available.<br>
          ${marker.video ? 'Select "Watch Video" to view walkthrough clip.' : ''}
        </div>
      `;
    }
  }
}

function closeBottomSheet() {
  document.getElementById("bottomSheet").classList.remove("open");
  document.getElementById("sheetBackdrop").classList.remove("active");

  // Destroy video
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

  // Update package dynamic reward line in open sheet
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
    btn.innerHTML = `<span class="check-icon">✓</span> Found / Collected`;
  } else {
    btn.classList.remove("collected");
    btn.innerHTML = `<span class="check-icon">○</span> Mark as Found`;
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
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 2px 0; color: ${unlocked ? 'var(--gta-green)' : 'var(--gta-text-dim)'};">
          <span>${unlocked ? '✓' : '○'} ${r.reward}</span>
          <span style="font-size: 10px; font-weight: 800;">${r.count} pkgs</span>
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

// --- Island Navigation with Accurate Calculated Bounds ---
function setIsland(islandKey) {
  state.activeIsland = islandKey;
  document.querySelectorAll(".island-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.island === islandKey);
  });

  const bounds = ISLAND_BOUNDS[islandKey] || ISLAND_BOUNDS.all;
  state.map.fitBounds(bounds, { animate: true, padding: [15, 15] });
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

  // Media tabs: Image Tip first, Video on click
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
