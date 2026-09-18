const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Gillian\\.gemini\\antigravity\\brain\\e2ba6ab5-273a-4ef1-97ed-a0085bdcb904';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const USER_DATA = path.join(ARTIFACTS_DIR, 'edge_temp_portal_test');

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
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result.value;
  }

  async screenshot(filePath) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`Saved screenshot: ${filePath}`);
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9223',
    `--user-data-dir=${USER_DATA}`,
    '--disable-gpu',
    '--no-first-run',
    '--window-size=1280,900',
    'about:blank'
  ]);

  try {
    let versionData;
    for (let i = 0; i < 20; i++) {
      try {
        versionData = await fetchJson('http://127.0.0.1:9223/json/version');
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch (e) {}
      await sleep(250);
    }

    const targets = await fetchJson('http://127.0.0.1:9223/json');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.ready;

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    console.log('Navigating to portal homepage: http://localhost:8080/');
    await client.send('Page.navigate', { url: 'http://localhost:8080/' });
    await sleep(1500);

    const title = await client.evaluate('document.title');
    console.log(`Page title: ${title}`);

    const cardCount = await client.evaluate('document.querySelectorAll(".map-card").length');
    console.log(`Total map cards found: ${cardCount}`);

    const imgNaturalWidth = await client.evaluate('document.querySelector(".map-card-banner img").naturalWidth');
    const imgSrc = await client.evaluate('document.querySelector(".map-card-banner img").src');
    console.log(`Map banner image src: ${imgSrc}, naturalWidth: ${imgNaturalWidth}px`);

    await client.screenshot(path.join(ARTIFACTS_DIR, 'portal_homepage_desktop.png'));

    // Test mobile responsive view
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(500);
    await client.screenshot(path.join(ARTIFACTS_DIR, 'portal_homepage_mobile.png'));

    // Reset emulation and navigate to LCS
    await client.send('Emulation.clearDeviceMetricsOverride');
    console.log('Navigating to LCS map via card link...');
    await client.evaluate('document.querySelector("#cardLcs").click()');
    await sleep(2000);

    const lcsUrl = await client.evaluate('window.location.href');
    const lcsTitle = await client.evaluate('document.title');
    console.log(`Navigated to: ${lcsUrl}`);
    console.log(`LCS Page Title: ${lcsTitle}`);

    client.close();
    console.log('TEST COMPLETED SUCCESSFULLY!');
  } finally {
    edgeProc.kill();
  }
}

run().catch(err => {
  console.error('Error running test:', err);
  process.exit(1);
});
