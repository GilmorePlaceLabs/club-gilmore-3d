const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/Users/kevin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1600,height:1050},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/?level=6');await page.waitForFunction(()=>window.clubGilmore?.ready);
 assert.equal(await page.locator('.room-item').count(),16);
 // 2026-09-12 site measurements: a BBQ bay is 15 ft × 150 in. Its floor comes
 // straight from the trace polygon, so this pins the whole deck's scale.
 const bay=await page.evaluate(()=>{const f=clubGilmore.model.roomGroups.get('L6-bbq-1').floor;f.updateMatrixWorld(true);f.geometry.computeBoundingBox();const b=f.geometry.boundingBox.clone().applyMatrix4(f.matrixWorld);return [b.max.x-b.min.x,b.max.z-b.min.z];});
 assert(Math.abs(bay[0]-4.572)<.02&&Math.abs(bay[1]-3.81)<.02,`BBQ bay measures ${bay} m, expected 4.572 × 3.81`);
 // The pool deck's three routes, each of which has been blocked at some point on
 // 2026-09-12: the walk behind the north lounger row, the south pool-side walk,
 // and the aisle from the change rooms' entry court down to the pool edge.
 const walks=await page.evaluate(async()=>{
  clubGilmore.enterFirstPerson();await new Promise(r=>setTimeout(r,400));
  const nav=clubGilmore.firstPerson.navigationWorld,W=(x,z)=>({x:(x-910)*.06,z:(z-670)*.06});
  const row=z=>{const bad=[];for(let x=150;x<=558;x+=4)if(!nav.isSafe(W(x,z)))bad.push(x);return bad;};
  const column=x=>{const bad=[];for(let z=600;z<=712;z+=4)if(!nav.isSafe(W(x,z)))bad.push(z);return bad;};
  // The south garden's timber walk: two lines .36 m inside each edge of the
  // diagonal leg, which the shelter, its tables and two beds had all grown into.
  const P0=[697,882],D=[214,231],L=Math.hypot(...D),d=[D[0]/L,D[1]/L],nrm=[-d[1],d[0]];
  const diagonal=across=>{const bad=[];
   for(let t=0;t<=L;t+=5){const x=P0[0]+d[0]*t+nrm[0]*across,z=P0[1]+d[1]*t+nrm[1]*across;
    if(!nav.isSafe(W(x,z)))bad.push(Math.round(t));}
   return bad;};
  const out={northWalk:row(675),southWalk:row(831),changeRoomAisle:column(381),
             gardenWalkNE:diagonal(6),gardenWalkSW:diagonal(29)};
  clubGilmore.exitFirstPerson();return out;
 });
 for(const [name,blocked] of Object.entries(walks))assert.equal(blocked.length,0,`pool deck ${name} blocked at ${blocked}`);
 const ids=await page.evaluate(()=>clubGilmore.rooms.map(r=>r.id));
 for(const id of ids){await page.evaluate(id=>clubGilmore.selectRoom(id),id);await page.waitForFunction(()=>document.querySelector('#room-photo').complete&&document.querySelector('#room-photo').naturalWidth>0);assert((await page.locator('#detail-description').textContent()).length>60);assert.equal(await page.locator('.detail-location:not(#detail-fee-row) strong').textContent(),'Club Gilmore · Level 6');const photos=await page.evaluate(()=>clubGilmore.rooms.find(r=>r.id===clubGilmore.selectedRoomId).photos);for(const photo of photos)assert((await page.request.get('http://127.0.0.1:4173/photos/'+photo)).ok());}
 await page.locator('#show-whole').click();await page.locator('#search').fill('bocce lawn');assert.equal(await page.locator('.room-item').count(),1);await page.locator('#search').fill('no-such-space');assert(await page.locator('#empty').isVisible());await page.locator('#search').fill('');
 await page.locator('#view-plan').click();await page.waitForTimeout(800);
 const point=await page.evaluate(()=>{const c=clubGilmore,p=c.model.roomGroups.get('L6-pool').center.clone().project(c.camera),b=c.renderer.domElement.getBoundingClientRect();return{x:b.x+(p.x+1)*b.width/2,y:b.y+(1-p.y)*b.height/2};});await page.mouse.click(point.x,point.y);assert.equal(await page.evaluate(()=>clubGilmore.selectedRoomId),'L6-pool');
 await page.waitForTimeout(800);await page.screenshot({path:'evidence/level6-pool.png'});await page.locator('#show-whole').click();await page.waitForTimeout(800);await page.screenshot({path:'evidence/level6-plan.png'});await page.locator('#view-3d').click();await page.waitForTimeout(800);await page.screenshot({path:'evidence/level6-desktop.png'});
 const finite=await page.evaluate(()=>{let good=true;clubGilmore.model.root.traverse(o=>{if(o.isMesh)for(const n of o.geometry.attributes.position.array)if(!Number.isFinite(n))good=false;});return good;});assert(finite);
 const downloadPromise=page.waitForEvent('download');await page.locator('#download').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'Club-Gilmore-Level-6.glb');await download.saveAs('/tmp/Club-Gilmore-Level-6.glb');const glb=fs.readFileSync('/tmp/Club-Gilmore-Level-6.glb');assert.equal(glb.toString('ascii',0,4),'glTF');assert.equal(glb.readUInt32LE(8),glb.length);const json=JSON.parse(glb.toString('utf8',20,20+glb.readUInt32LE(12)));assert.equal(new Set(json.nodes.filter(n=>n.extras?.roomId).map(n=>n.extras.roomId)).size,16);
 await page.locator('#level-4').click();assert.equal(await page.evaluate(()=>clubGilmore.activeLevel),4);await page.getByRole('button',{name:'Bowling lanes',exact:true}).click();assert.equal(await page.locator('.detail-location:not(#detail-fee-row) strong').textContent(),'Club Gilmore · Level 4');await page.waitForFunction(()=>document.querySelector('#room-photo').complete&&document.querySelector('#room-photo').naturalWidth>0);await page.locator('#level-6').click();assert.equal(await page.locator('.room-item').count(),16);assert(await page.locator('#detail').isHidden());
 await page.goto('http://127.0.0.1:4173/#L6-play');await page.waitForFunction(()=>clubGilmore?.selectedRoomId==='L6-play');assert.equal(await page.locator('#detail-name').textContent(),'Children’s play area');
 await page.setViewportSize({width:390,height:844});await page.reload();await page.waitForFunction(()=>clubGilmore?.ready);await page.waitForTimeout(800);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'evidence/level6-mobile-detail.png'});await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'browser-toggle');await page.locator('#level-4').click();await page.locator('#level-6').click();await page.waitForTimeout(800);await page.screenshot({path:'evidence/level6-mobile.png'});assert.equal(errors.length,0,errors.join('\n'));
 fs.writeFileSync('evidence/level6-verification.json',JSON.stringify({passed:true,rooms:ids.length,photos:true,finite,exportBytes:glb.length,levelSwitch:true,deepLink:true,mobile:true,errors},null,2));console.log('PASS',glb.length);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
