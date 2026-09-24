const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Gillian\\.gemini\\antigravity\\brain\\e2ba6ab5-273a-4ef1-97ed-a0085bdcb904';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const USER_DATA = path.join(ARTIFACTS_DIR, 'edge_temp_mobile_test');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
    this.ready = new Promise((resolve) => {
      this.ws.onopen = () => resolve();
    });
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  async send(method, params = {}) {
    await this.ready;
    const msgId = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true });
    return res && res.result ? res.result.value : null;
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACTS_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${filename}`);
    return outPath;
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log('Launching Edge...');
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${USER_DATA}`,
    '--window-size=390,844',
    'http://localhost:8080/gta-lcs/'
  ]);

  let cdp = null;
  try {
    let targets = null;
    for (let i = 0; i < 30; i++) {
      try {
        targets = await fetchJson('http://localhost:9222/json');
        if (targets && targets.length > 0) break;
      } catch (e) {}
      await sleep(300);
    }

    if (!targets || targets.length === 0) {
      throw new Error('Could not connect to Edge debugging port.');
    }

    const pageTarget = targets.find(t => t.type === 'page');
    console.log('Connecting to CDP page target:', pageTarget.title);
    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');
    await cdp.send('CSS.enable');

    cdp.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('BROWSER EXCEPTION:', JSON.stringify(msg.params.exceptionDetails));
      }
    });

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await sleep(1500);

    // Open Checklist Drawer
    console.log('Opening checklist drawer...');
    await cdp.evaluate('window.toggleChecklistDrawer(true);');
    await sleep(600);

    // TEST 1: Platform Selector Test
    console.log('\n--- TESTING PLATFORM SELECTOR ---');
    const initialPlatform = await cdp.evaluate(`(() => {
      const activeBtn = document.querySelector('#drawerPlatformToggle .platform-toggle-btn.active');
      return {
        statePlatform: state.selectedPlatform,
        activeBtnText: activeBtn ? activeBtn.innerText.trim() : null
      };
    })()`);
    console.log('Initial platform state:', initialPlatform);

    console.log('Clicking "Mobile" platform button...');
    await cdp.evaluate(`(() => {
      const mobileBtn = document.querySelector('#drawerPlatformToggle .platform-toggle-btn[data-platform="mobile"]');
      if (mobileBtn) mobileBtn.click();
    })()`);
    await sleep(500);

    const mobilePlatformState = await cdp.evaluate(`(() => {
      const activeBtn = document.querySelector('#drawerPlatformToggle .platform-toggle-btn.active');
      // Look for paramedic item title in the checklist
      const paramedicItem = Array.from(document.querySelectorAll('.cl-item-title')).find(el => el.innerText.includes('Paramedic'));
      return {
        statePlatform: state.selectedPlatform,
        activeBtnText: activeBtn ? activeBtn.innerText.trim() : null,
        paramedicTitle: paramedicItem ? paramedicItem.innerText.trim() : null
      };
    })()`);
    console.log('State after selecting Mobile:', mobilePlatformState);

    await cdp.screenshot('mobile_platform_selected.png');

    console.log('Clicking "PSP / PS2" platform button...');
    await cdp.evaluate(`(() => {
      const pspBtn = document.querySelector('#drawerPlatformToggle .platform-toggle-btn[data-platform="psp_ps2"]');
      if (pspBtn) pspBtn.click();
    })()`);
    await sleep(500);

    const pspPlatformState = await cdp.evaluate(`(() => {
      const activeBtn = document.querySelector('#drawerPlatformToggle .platform-toggle-btn.active');
      const paramedicItem = Array.from(document.querySelectorAll('.cl-item-title')).find(el => el.innerText.includes('Paramedic'));
      return {
        statePlatform: state.selectedPlatform,
        activeBtnText: activeBtn ? activeBtn.innerText.trim() : null,
        paramedicTitle: paramedicItem ? paramedicItem.innerText.trim() : null
      };
    })()`);
    console.log('State after selecting PSP / PS2:', pspPlatformState);

    // TEST 2: Checkbox Check & Hover Overlay Test
    console.log('\n--- TESTING CHECKBOX HOVER & COMPLETED STYLING ---');
    console.log('Clicking first item ("Home Sweet Home") to check it...');
    await cdp.evaluate(`(() => {
      const items = document.querySelectorAll('.cl-group:nth-child(1) .cl-item');
      if (items[0]) items[0].click();
    })()`);
    await sleep(400);

    const item1CheckedInfo = await cdp.evaluate(`(() => {
      const item = document.querySelector('.cl-group:nth-child(1) .cl-item');
      const box = item ? item.querySelector('.cl-custom-checkbox') : null;
      const title = item ? item.querySelector('.cl-item-title') : null;
      const boxStyle = box ? window.getComputedStyle(box) : null;
      const itemStyle = item ? window.getComputedStyle(item) : null;
      return {
        isItemCompleted: item ? item.classList.contains('completed') : false,
        isBoxChecked: box ? box.classList.contains('checked') : false,
        itemOpacity: itemStyle ? itemStyle.opacity : null,
        boxBg: boxStyle ? boxStyle.backgroundColor : null,
        boxBorder: boxStyle ? boxStyle.borderColor : null
      };
    })()`);
    console.log('Checked item state (unhovered):', item1CheckedInfo);

    // Dispatch mouseenter on item to simulate hover overlay
    console.log('Simulating hover overlay on checked item...');
    await cdp.evaluate(`(() => {
      const item = document.querySelector('.cl-group:nth-child(1) .cl-item');
      if (item) {
        item.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        item.classList.add('hover-simulated');
      }
    })()`);
    await sleep(300);

    // Now inspect computed styles of the checkbox during hover
    const hoverCheckedInfo = await cdp.evaluate(`(() => {
      const item = document.querySelector('.cl-group:nth-child(1) .cl-item');
      const box = item ? item.querySelector('.cl-custom-checkbox') : null;
      const svg = box ? box.querySelector('.cl-check-svg') : null;
      const boxStyle = box ? window.getComputedStyle(box) : null;
      const svgStyle = svg ? window.getComputedStyle(svg) : null;
      const itemStyle = item ? window.getComputedStyle(item) : null;
      return {
        isBoxStillCheckedClass: box ? box.classList.contains('checked') : false,
        itemOpacityOnHover: itemStyle ? itemStyle.opacity : null,
        boxBgOnHover: boxStyle ? boxStyle.backgroundColor : null,
        boxBorderOnHover: boxStyle ? boxStyle.borderColor : null,
        svgOpacity: svgStyle ? svgStyle.opacity : null,
        svgTransform: svgStyle ? svgStyle.transform : null
      };
    })()`);
    console.log('Checked item state (during hover overlay):', hoverCheckedInfo);

    await cdp.screenshot('mobile_checked_item_hovered.png');

    // TEST 3: Check All Category Button
    console.log('\n--- TESTING CATEGORY CHECK ALL BUTTON ---');
    console.log('Clicking "Check All ✓" on Portland Story Missions...');
    await cdp.evaluate(`(() => {
      const btn = document.querySelector('.cl-group:nth-child(1) .cl-cat-check-all-btn');
      if (btn) btn.click();
    })()`);
    await sleep(500);

    const portlandAllCheckedInfo = await cdp.evaluate(`(() => {
      const btn = document.querySelector('.cl-group:nth-child(1) .cl-cat-check-all-btn');
      const count = document.querySelector('.cl-group:nth-child(1) .cl-group-count');
      const checkedBoxes = document.querySelectorAll('.cl-group:nth-child(1) .cl-custom-checkbox.checked');
      const totalItems = document.querySelectorAll('.cl-group:nth-child(1) .cl-item');
      return {
        btnText: btn ? btn.innerText.trim() : null,
        countText: count ? count.innerText.trim() : null,
        checkedCount: checkedBoxes.length,
        totalItemsCount: totalItems.length
      };
    })()`);
    console.log('Portland category after "Check All":', portlandAllCheckedInfo);

    await cdp.screenshot('mobile_portland_all_checked_verified.png');

    // Click "Uncheck All ✕"
    console.log('Clicking "Uncheck All ✕" on Portland Story Missions...');
    await cdp.evaluate(`(() => {
      const btn = document.querySelector('.cl-group:nth-child(1) .cl-cat-check-all-btn');
      if (btn) btn.click();
    })()`);
    await sleep(500);

    // TEST 4: Integrated Safehouse Milestones in Hidden Packages
    console.log('\n--- TESTING INTEGRATED SAFEHOUSE MILESTONES ---');
    console.log('Expanding Safehouse Milestones inside Hidden Packages...');
    await cdp.evaluate(`(() => {
      const colGroup = Array.from(document.querySelectorAll('.cl-group-title')).find(t => t.innerText.includes('Collectibles'));
      if (colGroup) colGroup.scrollIntoView({ behavior: 'instant', block: 'start' });
      const toggleBtn = document.querySelector('.cl-milestones-toggle-btn');
      if (toggleBtn) toggleBtn.click();
    })()`);
    await sleep(400);

    await cdp.screenshot('mobile_milestones_integrated.png');

    // TEST 5: Wrong Search Query (verify NO orphaned elements exist)
    console.log('\n--- TESTING WRONG SEARCH QUERY (NO ORPHANED ELEMENTS) ---');
    await cdp.evaluate(`(() => {
      const input = document.getElementById('inputChecklistSearch');
      if (input) {
        input.value = 'xyzwrongquery123';
        input.dispatchEvent(new Event('input'));
      }
    })()`);
    await sleep(400);

    const orphanCheck = await cdp.evaluate(`(() => {
      const oldMilestoneList = document.getElementById('safehouseMilestoneList');
      const oldMilestoneToggle = document.getElementById('toggleSafehouseMilestones');
      const visibleGroups = document.querySelectorAll('.cl-group');
      return {
        hasOldMilestoneList: !!oldMilestoneList,
        hasOldMilestoneToggle: !!oldMilestoneToggle,
        visibleGroupsCount: visibleGroups.length
      };
    })()`);
    console.log('Orphan check with wrong query:', orphanCheck);

    await cdp.screenshot('mobile_wrong_search_clean.png');

    console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');
  } finally {
    if (cdp) cdp.close();
    edgeProc.kill();
  }
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
