// Browser-level route audit. Start the normal Vite preview on :4173 first.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/Users/kevin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const URL = 'http://127.0.0.1:4173/?level=6';
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const trace = (x, z) => [(x - 910) * .065, (z - 670) * .065];
const zone = (name, x0, z0, x1, z1, expected = true) => ({ name, min: trace(x0, z0), max: trace(x1, z1), expected });

// Regions, rather than a single point, make this useful when a table or tree
// legitimately occupies the centre of an otherwise reachable terrace.
const zones = [
  zone('north terrace', 660, 110, 845, 238),
  zone('north bridge', 1082, 228, 1215, 273),
  zone('south bridge', 935, 640, 1035, 671),
  zone('east BBQ terrace', 1040, 280, 1160, 650),
  zone('play perimeter', 1170, 500, 1515, 775),
  zone('fire terrace', 1038, 675, 1295, 960),
  zone('diagonal garden walk', 1156, 440, 1725, 1025),
  zone('south garden', 640, 902, 910, 1245),
  zone('bocce lawn', 700, 770, 907, 900),
  zone('central lounge terrace', 700, 315, 907, 630),
  zone('west circulation', 661, 280, 698, 890),
  zone('pool deck', 45, 600, 635, 895),
  // Stops at z=594: z 596-611 is shared with the (open) pool sun deck slab.
  zone('change-room forecourt', 268, 455, 464, 594, false),
  zone('north pavilion interior', 847, 159, 930, 240, false),
];

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.clubGilmore?.ready);
  await page.locator('#first-person-button').click();
  await page.waitForFunction(() => clubGilmore.viewMode === 'first-person' && clubGilmore.firstPerson?.navigationWorld);

  const result = await page.evaluate(({ zones }) => {
    const navigation = clubGilmore.firstPerson.navigationWorld;
    const start = clubGilmore.firstPerson.position;
    const step = .4, minX = -58, maxX = 58, minZ = -43, maxZ = 43;
    const width = Math.floor((maxX - minX) / step) + 1;
    const key = (x, z) => `${x},${z}`;
    // THREE is not a page global; clone the Vector3 the controller already hands out.
    const at = (x, z) => start.clone().set(minX + x * step, navigation.config.floorHeight, minZ + z * step);
    const safe = new Map();
    const isSafe = (x, z) => {
      const id = key(x, z); if (!safe.has(id)) safe.set(id, navigation.isSafe(at(x, z)));
      return safe.get(id);
    };
    const nearest = [Math.round((start.x - minX) / step), Math.round((start.z - minZ) / step)];
    // Find the nearest safe grid point, so an off-grid spawn never invalidates
    // the audit. This local search is intentionally bounded to 3 grid cells.
    let origin = null;
    for (let radius = 0; radius <= 3 && !origin; radius++) for (let dx = -radius; dx <= radius && !origin; dx++) for (let dz = -radius; dz <= radius; dz++) {
      const x = nearest[0] + dx, z = nearest[1] + dz;
      if (x >= 0 && x < width && z >= 0 && z <= Math.floor((maxZ - minZ) / step) && isSafe(x, z)) origin = [x, z];
    }
    if (!origin) throw new Error('No safe BFS origin near first-person spawn');
    const queue = [origin], visited = new Set([key(...origin)]);
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const [x, z] = queue[cursor];
      for (const [dx, dz] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = x + dx, nz = z + dz, id = key(nx, nz);
        if (nx < 0 || nx >= width || nz < 0 || nz > Math.floor((maxZ - minZ) / step) || visited.has(id) || !isSafe(nx, nz)) continue;
        visited.add(id); queue.push([nx, nz]);
      }
    }
    const reached = zones.map(zone => {
      let hit = null;
      for (const [x, z] of queue) {
        const point = at(x, z);
        if (point.x >= zone.min[0] && point.x <= zone.max[0] && point.z >= zone.min[1] && point.z <= zone.max[1]) { hit = point.toArray(); break; }
      }
      return { name: zone.name, expected: zone.expected, reached: Boolean(hit), point: hit };
    });
    return { origin: at(...origin).toArray(), reachableCells: queue.length, safetyQueries: safe.size, reached };
  }, { zones });

  for (const entry of result.reached) console.log(`${entry.reached ? 'REACHED' : 'BLOCKED'} ${entry.name}${entry.expected ? '' : ' (closed expected)'}${entry.point ? ` ${entry.point.map(n => n.toFixed(2)).join(',')}` : ''}`);
  const unexpected = result.reached.filter(entry => entry.expected && !entry.reached);
  const unexpectedOpen = result.reached.filter(entry => !entry.expected && entry.reached);
  console.log(`BFS ${result.reachableCells} reachable cells / ${result.safetyQueries} cached safety checks; origin ${result.origin.map(n => n.toFixed(2)).join(',')}`);
  await browser.close();
  if (pageErrors.length) throw new Error(`Page errors: ${pageErrors.join('; ')}`);
  if (unexpected.length || unexpectedOpen.length) {
    const detail = [...unexpected.map(entry => `unreachable: ${entry.name}`), ...unexpectedOpen.map(entry => `unexpectedly open: ${entry.name}`)].join('; ');
    throw new Error(`Walk-route audit failed — ${detail}`);
  }
})().catch(error => { console.error(error); process.exit(1); });
