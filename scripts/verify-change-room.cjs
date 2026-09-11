// Verify connected walking space from the pool through each room/cubicle.
const {chromium}=require(process.env.PLAYWRIGHT_PATH || '/Users/kevin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 try {
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:4173/?level=6');
  await page.waitForFunction(()=>window.clubGilmore?.ready);
  await page.locator('#first-person-button').click();
  const results=await page.evaluate(()=>{
   const nav=clubGilmore.firstPerson.navigationWorld,base=clubGilmore.firstPerson.position;
   const step=.1,originX=(267-910)*.065,originZ=(427-670)*.065;
   const width=130,height=128,point=(x,z)=>base.clone().set(originX+x*step,nav.config.floorHeight,originZ+z*step);
   const safe=new Map(),seen=new Set(),queue=[];
   const key=(x,z)=>z*width+x;
   const isSafe=(x,z)=>{const k=key(x,z);if(!safe.has(k))safe.set(k,nav.isSafe(point(x,z)));return safe.get(k);};
   const start=[Math.round((381-267)*.065/step),Math.round((619-427)*.065/step)];
   if(!isSafe(...start))throw Error('Pool approach is blocked');
   queue.push(start);seen.add(key(...start));
   for(let i=0;i<queue.length;i++){
    const [x,z]=queue[i];
    for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
     const nx=x+dx,nz=z+dz,k=key(nx,nz);
     if(nx<0||nx>=width||nz<0||nz>=height||seen.has(k)||!isSafe(nx,nz))continue;
     queue.push([nx,nz]);seen.add(k);
    }
   }
   const targets=[['storage',290,590],['main aisle',325,565],['steam room',422,580],['accessible wet room',311,450],['standing shower',351,535],['east vanity aisle',443,514]];
   [472,488,503,519,535].forEach((z,i)=>targets.push([`changing bay ${i+1}`,292,z]));
   [352.3,368.9,385.5,402.1,418.7].forEach((x,i)=>targets.push([`north WC ${i+1}`,x,450]));
   [346.9,370.6,394.4,418.1].forEach((x,i)=>targets.push([`shower ${i+1}`,x,503]));
   [369.6,382.8,396,409.2,422.4].forEach((x,i)=>targets.push([`south WC ${i+1}`,x,536]));
   return targets.map(([name,tx,tz])=>({name,reached:queue.some(([x,z])=>Math.hypot(point(x,z).x-(tx-910)*.065,point(x,z).z-(tz-670)*.065)<.25)}));
  });
  console.table(results);
  if(results.some(r=>!r.reached))throw Error('Some change-room destinations are unreachable');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
