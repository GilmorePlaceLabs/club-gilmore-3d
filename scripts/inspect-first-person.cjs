const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/Users/kevin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 page.on('pageerror',e=>console.log('PAGE ERROR',e.message));
 await page.goto('http://127.0.0.1:4173/?level=6');await page.waitForFunction(()=>window.clubGilmore?.ready);
 await page.locator('#first-person-button').click();await page.waitForTimeout(700);
 console.log(await page.evaluate(()=>({mode:clubGilmore.viewMode,position:clubGilmore.firstPerson.position.toArray(),safe:clubGilmore.firstPerson.navigationWorld.isSafe(clubGilmore.firstPerson.position),paused:clubGilmore.firstPerson.paused,yaw:clubGilmore.firstPerson.yaw})));
 await page.screenshot({path:'evidence/first-person-spawn.png'});
 await page.evaluate(()=>{const f=clubGilmore.firstPerson;f.pitch=-1.4;f.syncCamera();clubGilmore.requestRender();});
 await page.waitForTimeout(200);await page.screenshot({path:'evidence/first-person-body.png'});
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
