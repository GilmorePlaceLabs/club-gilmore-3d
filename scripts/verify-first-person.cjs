const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/Users/kevin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const URL = 'http://127.0.0.1:4173/';
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const launch = () => chromium.launch({ executablePath: chrome, headless: true, args: ['--enable-webgl', '--ignore-gpu-blocklist'] });
const waitReady = page => page.waitForFunction(() => window.clubGilmore?.ready);
const state = page => page.evaluate(() => ({
  mode: clubGilmore.viewMode,
  activeLevel: clubGilmore.activeLevel,
  camera: clubGilmore.camera?.type,
  position: clubGilmore.firstPerson?.position?.toArray?.() || null,
  paused: clubGilmore.firstPerson?.paused ?? false,
}));

(async () => {
  fs.mkdirSync('evidence', { recursive: true });
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 1050 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${URL}?level=6`);
  await waitReady(page);

  const order = await page.evaluate(() => [...document.querySelector('.top-actions').children].map(node => node.id));
  assert.deepEqual(order.slice(0, 2), ['first-person-button', 'about-button']);
  assert.equal(await page.locator('#first-person-button').isVisible(), true);
  assert.equal(await page.evaluate(() => clubGilmore.activeLevel), 6);
  await page.waitForTimeout(800);
  const orbit=await page.evaluate(()=>({position:clubGilmore.camera.position.toArray(),zoom:clubGilmore.camera.zoom,target:clubGilmore.controls.target.toArray()}));

  await page.locator('#first-person-button').click();
  await page.waitForFunction(() => clubGilmore.viewMode === 'first-person' && clubGilmore.firstPerson?.active);
  const entered = await state(page);
  assert.equal(entered.camera, 'PerspectiveCamera');
  assert.equal(entered.activeLevel, 6);
  assert.deepEqual(entered.position,[18.655,.08,-27.3]);
  assert(await page.evaluate(()=>clubGilmore.firstPerson.navigationWorld.isSafe(clubGilmore.firstPerson.position)));
  assert.equal(await page.locator('#room-browser').evaluate(el => getComputedStyle(el).display), 'none');
  await page.screenshot({ path: 'evidence/first-person-desktop.png' });

  const beforeWalk = await page.evaluate(() => clubGilmore.firstPerson.position.toArray());
  await page.keyboard.down('w');
  await page.waitForTimeout(450);
  await page.keyboard.up('w');
  const afterWalk = await page.evaluate(() => clubGilmore.firstPerson.position.toArray());
  assert.notDeepEqual(afterWalk, beforeWalk, 'WASD movement should update the controller position');

  const boundary = await page.evaluate(() => {
    const c = clubGilmore.firstPerson, p = c.position, far = p.clone();
    far.x += 100;
    return c.navigationWorld ? { available: true, safe: c.navigationWorld.isSafe(far) } : { available: false };
  });
  if (boundary.available) assert.equal(boundary.safe, false, 'far outside position must be unsafe');

  await page.evaluate(() => clubGilmore.firstPerson.look(0, 1.4));
  await page.waitForTimeout(100);
  await page.screenshot({ path: 'evidence/first-person-look-down.png' });
  const doorsOpen=()=>page.evaluate(()=>clubGilmore.model.walkModeGates.filter(g=>g.userData.openYaw!=null).map(g=>Math.abs(g.rotation.y-g.userData.closedYaw-g.userData.openYaw)<1e-6));
  assert.deepEqual(await doorsOpen(),[true,true],'both change-room doors swing open for the walk');
  await page.keyboard.press('Space');
  const jump=await page.evaluate(()=>new Promise(r=>{const fp=clubGilmore.firstPerson,t0=performance.now();let max=0;(function s(){max=Math.max(max,fp.jumpY);performance.now()-t0<2500?requestAnimationFrame(s):r({max,end:fp.jumpY})})()}));
  assert(jump.max>.5&&jump.max<=.915&&jump.end===0,'jump peaks under 3 ft and lands: '+JSON.stringify(jump));
  assert(!await page.locator('#fp-speed').isVisible()&&await page.locator('.fp-esc-note').isVisible(),'desktop walking: only the Esc note');
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>clubGilmore.firstPerson.paused);
  assert(await page.locator('#fp-pause-overlay').isVisible());
  assert(!await page.locator('#fp-pause').isVisible()&&!await page.locator('.fp-esc-note').isVisible(),'desktop paused: buttons replace the note, no Pause');
  // toolbar must stay clickable above the pause overlay (pointer lock blocks it while walking)
  await page.locator('#fp-speed').click({timeout:2000});assert.equal(await page.locator('#fp-speed').textContent(),'Fast');
  await page.locator('#fp-speed').click();await page.locator('#fp-speed').click();
  const pausedPosition=await page.evaluate(()=>clubGilmore.firstPerson.position.toArray());
  await page.keyboard.press('ArrowUp');
  assert.deepEqual(await page.evaluate(()=>clubGilmore.firstPerson.position.toArray()),pausedPosition);

  await page.locator('#fp-exit-paused').click();
  assert.deepEqual(await page.evaluate(()=>clubGilmore.model.walkModeGates.map(g=>g.rotation.y===g.userData.closedYaw)),[true,true,true,true],'gates and doors restored on exit');
  await page.waitForFunction(() => clubGilmore.viewMode === 'orbit');
  assert.equal((await state(page)).camera, 'OrthographicCamera');
  assert.equal(await page.locator('#first-person-button').getAttribute('aria-pressed'), 'false');
  assert.deepEqual(await page.evaluate(()=>({position:clubGilmore.camera.position.toArray(),zoom:clubGilmore.camera.zoom,target:clubGilmore.controls.target.toArray()})),orbit);

  // Exercise drag-look fallback explicitly without relying on headless pointer lock.
  await page.evaluate(()=>{HTMLCanvasElement.prototype.requestPointerLock=()=>Promise.reject(new Error('Simulated denied pointer lock'));});
  await page.locator('#first-person-button').click();
  await page.waitForTimeout(100);
  const yawBefore=await page.evaluate(()=>clubGilmore.firstPerson.yaw);
  await page.mouse.move(700,430);await page.mouse.down();await page.mouse.move(800,450,{steps:6});await page.mouse.up();
  assert.notEqual(await page.evaluate(()=>clubGilmore.firstPerson.yaw),yawBefore);
  const arrowBefore=await page.evaluate(()=>clubGilmore.firstPerson.position.toArray());
  await page.keyboard.down('ArrowUp');await page.waitForTimeout(300);await page.keyboard.up('ArrowUp');
  assert.notDeepEqual(await page.evaluate(()=>clubGilmore.firstPerson.position.toArray()),arrowBefore);
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
  assert(await page.evaluate(()=>clubGilmore.firstPerson.paused&&clubGilmore.firstPerson.input.keys.size===0));
  await page.evaluate(()=>clubGilmore.exitFirstPerson());

  await page.evaluate(() => clubGilmore.switchLevel(4));
  await page.waitForFunction(() => clubGilmore.activeLevel === 4);
  assert.equal(await page.locator('#first-person-button').isHidden(), true);
  await page.evaluate(() => clubGilmore.switchLevel(6));
  await page.waitForFunction(() => clubGilmore.activeLevel === 6 && !document.querySelector('#first-person-button').hidden);

  const mobile = await browser.newPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  const mobileErrors = [];
  mobile.on('pageerror', error => mobileErrors.push(error.message));
  await mobile.goto(`${URL}?level=6`);
  await waitReady(mobile);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await mobile.locator('#first-person-button').click();
  await mobile.waitForFunction(() => clubGilmore.viewMode === 'first-person');
  assert(!await mobile.evaluate(()=>clubGilmore.firstPerson.paused));
  const moveBox=await mobile.locator('#fp-move-stick').boundingBox(),lookBox=await mobile.locator('#fp-look-stick').boundingBox();
  const moveTouch={x:moveBox.x+moveBox.width/2,y:moveBox.y+moveBox.height/2-32,id:1};
  const lookTouch={x:lookBox.x+lookBox.width/2+26,y:lookBox.y+lookBox.height/2,id:2};
  const mobileBefore=await mobile.evaluate(()=>({position:clubGilmore.firstPerson.position.toArray(),yaw:clubGilmore.firstPerson.yaw}));
  const cdp=await mobile.context().newCDPSession(mobile);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[moveTouch,lookTouch]});
  await mobile.waitForTimeout(450);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const mobileAfter=await mobile.evaluate(()=>({position:clubGilmore.firstPerson.position.toArray(),yaw:clubGilmore.firstPerson.yaw,move:clubGilmore.firstPerson.input.movement}));
  assert.notDeepEqual(mobileAfter.position,mobileBefore.position);assert.notEqual(mobileAfter.yaw,mobileBefore.yaw);
  assert.deepEqual(mobileAfter.move,{x:0,z:0});
  await mobile.screenshot({ path: 'evidence/first-person-mobile-landscape.png' });
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.waitForTimeout(150);
  assert(!await mobile.evaluate(()=>clubGilmore.firstPerson.paused));
  assert.equal(await mobile.evaluate(()=>clubGilmore.firstPerson.config.walkSpeed),3.6,'medium default');
  await mobile.locator('#fp-speed').click();assert.equal(await mobile.evaluate(()=>clubGilmore.firstPerson.config.walkSpeed),5.4);
  await mobile.locator('#fp-speed').click();assert.equal(await mobile.locator('#fp-speed').textContent(),'Slow');
  await mobile.locator('#fp-speed').click();
  assert.equal(await mobile.locator('#fp-move-stick').isVisible(), true);
  assert(await mobile.locator('#fp-pause').isVisible()&&!await mobile.locator('.fp-esc-note').isVisible(),'touch: Pause kept, no Esc note');
  await mobile.locator('#fp-jump').click();await mobile.waitForTimeout(150);assert(await mobile.evaluate(()=>clubGilmore.firstPerson.jumpY>0),'touch jump');
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const portraitBox=await mobile.locator('#fp-move-stick').boundingBox(),portraitBefore=await mobile.evaluate(()=>clubGilmore.firstPerson.position.toArray());
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:portraitBox.x+portraitBox.width/2,y:portraitBox.y+portraitBox.height/2-32,id:1}]});
  await mobile.waitForTimeout(450);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.notDeepEqual(await mobile.evaluate(()=>clubGilmore.firstPerson.position.toArray()),portraitBefore,'portrait walking');
  await mobile.screenshot({ path: 'evidence/first-person-mobile-portrait.png' });
  await mobile.setViewportSize({width:844,height:390});await mobile.waitForTimeout(150);
  assert(!await mobile.evaluate(()=>clubGilmore.firstPerson.paused));
  await mobile.evaluate(()=>clubGilmore.switchLevel(4));assert.equal((await state(mobile)).mode,'orbit');
  await mobile.evaluate(()=>clubGilmore.switchLevel(6));await mobile.setViewportSize({width:390,height:844});
  await mobile.locator('#first-person-button').click();assert(!await mobile.evaluate(()=>clubGilmore.firstPerson.paused));

  assert.deepEqual(errors.concat(mobileErrors), [], 'browser page errors');
  console.log('PASS first-person', JSON.stringify({ walked: beforeWalk.join(',') !== afterWalk.join(','), boundary, screenshots: 4 }));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
