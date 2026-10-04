const {chromium}=require(process.env.PORTRAIT_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const output=process.env.INK_QA_OUTPUT||'test-results/ink-bloom';
const base=process.env.PORTFOLIO_BASE_URL||'http://127.0.0.1:8765';
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({headless:true,...(process.env.PORTRAIT_BROWSER_PATH?{executablePath:process.env.PORTRAIT_BROWSER_PATH}:{})});
  const results=[],errors=[];
  async function page(options={},setup){const p=await browser.newPage(options);p.on('pageerror',e=>errors.push(String(e)));await p.addInitScript(()=>{window.inkPaints=0;const draw=CanvasRenderingContext2D.prototype.putImageData;CanvasRenderingContext2D.prototype.putImageData=function(...a){if(this.canvas.className==='ink-bloom')window.inkPaints++;return draw.apply(this,a)}});if(setup)await setup(p);await p.goto(base,{waitUntil:'networkidle'});return p;}
  const sample=p=>p.locator('.ink-bloom').evaluate(c=>[...c.getContext('2d').getImageData(0,0,c.width,c.height).data]);
  async function check(name,fn){await fn();results.push({name,passed:true});}
  try{
    for(const [label,width,height]of[['desktop',1440,1000],['mobile',390,844]])await check(`${label}: shallow accent cloud, readable hero, navigation and portrait`,async()=>{
      const p=await page({viewport:{width,height},reducedMotion:'reduce',...(label==='mobile'?{isMobile:true,hasTouch:true}:{})});
      const info=await p.locator('.ink-bloom').evaluate(c=>({w:c.width,h:c.height,rect:c.getBoundingClientRect().toJSON(),hidden:c.parentNode.getAttribute('aria-hidden'),pointer:getComputedStyle(c).pointerEvents,overflow:document.documentElement.scrollWidth>innerWidth}));
      assert.ok(info.w<=420&&info.h<=120);assert.ok(info.rect.height<=346);assert.equal(info.hidden,'true');assert.equal(info.pointer,'none');assert.equal(info.overflow,false);
      const pixels=await sample(p);let colored=0;for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]>0){colored++;if(pixels[i+3]>=100)assert.ok(pixels.slice(i,i+3).every((v,j)=>Math.abs(v-[255,90,31][j])<=2));}}
      assert.ok(colored>0);assert.ok(pixels.slice(-info.w*4).every((v,i)=>i%4!==3||v===0));
      assert.ok(await p.locator('h1').isVisible());assert.ok(await p.locator('.nav .pill').isVisible());assert.ok(await p.locator('.portrait-dither').count());
      await p.screenshot({path:`${output}/Maurice-orange-ink-bloom-${label}.png`});
      if(label==='mobile'){await p.setViewportSize({width,height:1400});await p.screenshot({path:`${output}/Maurice-orange-ink-bloom-mobile-hero.png`});}
      await p.close();
    });
    await check('reduced motion is static and ignores cursor, including preference changes',async()=>{
      const p=await page({reducedMotion:'reduce'});const before=await sample(p);await p.mouse.move(500,120);await p.waitForTimeout(850);assert.deepEqual(await sample(p),before);const n=await p.evaluate(()=>inkPaints);await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>inkPaints),n);await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(300);assert.ok(await p.evaluate(()=>inkPaints)>n);await p.emulateMedia({reducedMotion:'reduce'});await p.close();
    });
    await check('idle drift, localized pointer response and offscreen pause',async()=>{
      const p=await page({viewport:{width:1440,height:1000}});const before=await sample(p);await p.mouse.move(500,145);const cadence=await p.evaluate(async()=>{const n=inkPaints,t=performance.now();await new Promise(r=>setTimeout(r,1000));return {paints:inkPaints-n,elapsed:performance.now()-t}});assert.notDeepEqual(await sample(p),before);assert.ok(cadence.paints>=1&&cadence.paints<=Math.ceil(cadence.elapsed/66)+2,JSON.stringify(cadence));await p.screenshot({path:`${output}/Maurice-orange-ink-bloom-desktop-pointer.png`});await p.locator('#work').scrollIntoViewIfNeeded();await p.waitForTimeout(250);const stopped=await p.evaluate(()=>inkPaints);await p.waitForTimeout(500);assert.equal(await p.evaluate(()=>inkPaints),stopped);await p.close();
    });
    await check('hidden document pauses painting and page exit cleans up listeners',async()=>{
      const p=await page();await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});const stopped=await p.evaluate(()=>inkPaints);await p.waitForTimeout(350);assert.equal(await p.evaluate(()=>inkPaints),stopped);await p.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});await p.waitForTimeout(200);assert.ok(await p.evaluate(()=>inkPaints)>stopped);await p.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));const exited=await p.evaluate(()=>inkPaints);await p.evaluate(()=>window.dispatchEvent(new Event('resize')));await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>inkPaints),exited);await p.close();
    });
    await check('Canvas failure retains static CSS wash and accessible original portrait',async()=>{
      const p=await page({},p=>p.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null}));assert.equal(await p.locator('.ink-bloom').count(),0);assert.notEqual(await p.locator('.hero-ink').evaluate(e=>getComputedStyle(e).backgroundImage),'none');assert.ok(await p.locator('.portrait img').isVisible());assert.equal(await p.locator('.portrait-toggle').count(),0);await p.close();
    });
    await check('no-JavaScript fallback keeps hero, static wash and usable links',async()=>{
      const p=await page({javaScriptEnabled:false});assert.equal(await p.locator('.ink-bloom').count(),0);assert.ok(await p.locator('.hero-ink').count());assert.ok(await p.locator('.portrait img').isVisible());assert.equal(await p.locator('.nav .pill').getAttribute('href'),'mailto:mrthomaslmg@gmail.com');await p.close();
    });
    assert.deepEqual(errors,[]);fs.writeFileSync(`${output}/browser-checks.json`,JSON.stringify({results,errors},null,2));console.log(`${results.length} ink-bloom browser checks passed`);
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
