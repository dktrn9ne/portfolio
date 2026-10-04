// Start a static server, then run: npm run test:browser
const {chromium} = require(process.env.PORTRAIT_PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:8765';
const output = process.env.PORTRAIT_QA_OUTPUT || 'test-results/portrait';
const executablePath = process.env.PORTRAIT_BROWSER_PATH;

(async () => {
  fs.mkdirSync(output, {recursive: true});
  const browser = await chromium.launch({headless: true, ...(executablePath ? {executablePath} : {})});
  const results = [], errors = [];
  async function page(options = {}, setup) {
    const p = await browser.newPage(options);
    p.on('pageerror', error => errors.push(String(error)));
    p.on('console', message => { if (message.type() === 'error' && !message.text().includes('ERR_FAILED')) errors.push(message.text()); });
    await p.addInitScript(() => {
      window.portraitPaints = 0;
      const draw = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function (...args) {
        if (this.canvas.className === 'portrait-dither') window.portraitPaints++;
        return draw.apply(this, args);
      };
    });
    if (setup) await setup(p);
    await p.goto(base + '/', {waitUntil: 'networkidle'});
    return p;
  }
  const sample = p => p.locator('.portrait-dither').evaluate(c => [...c.getContext('2d').getImageData(0, 0, c.width, c.height).data]);
  async function check(name, fn) { await fn(); results.push({name, passed: true}); }
  try {
    for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
      await check(`${label}: dither, crop, lens, original toggle and no overflow`, async () => {
        const p = await page({viewport: {width, height}, reducedMotion: 'reduce'});
        await p.locator('.portrait-dither').waitFor();
        await p.locator('.portrait').scrollIntoViewIfNeeded();
        assert.equal(await p.locator('.portrait img').getAttribute('alt'), 'Maurice Thomas');
        assert.equal(await p.locator('.portrait img').getAttribute('src'), 'assets/maurice-thomas-cutout-v1.png');
        assert.equal(await p.locator('.portrait').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(11, 11, 12)');
        assert.equal(await p.locator('.portrait-dither').getAttribute('aria-hidden'), 'true');
        const info = await p.locator('.portrait').evaluate(el => ({
          rect: el.getBoundingClientRect().toJSON(), canvas: el.querySelector('canvas').getBoundingClientRect().toJSON(),
          image: el.querySelector('img').getBoundingClientRect().toJSON(), overflow: document.documentElement.scrollWidth > innerWidth,
        }));
        assert.equal(info.overflow, false);
        assert.equal(info.canvas.width, info.image.width);
        assert.equal(info.canvas.height, info.image.height);
        const before = await sample(p);
        const colors = new Set();
        let transparent = 0;
        let opaque = 0;
        for (let i = 0; i < before.length; i += 4) {
          if (before[i + 3] === 0) transparent++;
          if (before[i + 3] >= 250) {
            opaque++;
            const rgb = before.slice(i, i + 3);
            const dark = rgb.every((value, channel) => Math.abs(value - [11,11,12][channel]) <= 1);
            const orange = rgb.every((value, channel) => Math.abs(value - [255,90,31][channel]) <= 1);
            assert.ok(dark || orange, `unexpected subject dither color: ${rgb}`);
            colors.add(dark ? 'dark' : 'orange');
          }
        }
        assert.ok(transparent > 0 && opaque > 0, 'subject-only dither retains both removed background and opaque person');
        assert.deepEqual([...colors].sort(), ['dark', 'orange']);
        assert.equal(await p.locator('.portrait').evaluate(el => getComputedStyle(el).getPropertyValue('--dither-light').trim()), '#ff5a1f');
        await p.locator('.portrait').screenshot({path: `${output}/after-${label}.png`});
        await p.locator('.portrait').dispatchEvent('pointermove', {clientX: info.rect.x + info.rect.width / 2,
          clientY: info.rect.y + info.rect.height / 2, pointerType: 'mouse'});
        const lens = await sample(p);
        assert.ok(lens.some((value, index) => index % 4 === 3 && value < before[index]), 'lens reveals underlying color subject');
        await p.locator('.portrait').screenshot({path: `${output}/after-${label}-lens.png`});
        await p.locator('.portrait').dispatchEvent('pointerleave');
        assert.deepEqual(await sample(p), before, 'leaving restores static subject-only dither');
        const toggle = p.locator('.portrait-toggle');
        await toggle.focus();
        await p.keyboard.press('Enter');
        assert.equal(await toggle.getAttribute('aria-pressed'), 'true');
        assert.equal(await p.locator('.portrait-dither').isVisible(), false);
        assert.equal(await p.getByRole('button', {name: 'Show dithered photo'}).count(), 1);
        await p.locator('.portrait').screenshot({path: `${output}/original-toggle-${label}.png`});
        await p.keyboard.press('Space');
        assert.equal(await p.locator('.portrait-dither').isVisible(), true);
        await p.close();
      });
    }
    await check('reduced motion: no idle repaint or moving lens edge', async () => {
      const p = await page({viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce'});
      const count = await p.evaluate(() => window.portraitPaints);
      const first = await sample(p);
      await p.waitForTimeout(900);
      assert.equal(await p.evaluate(() => window.portraitPaints), count);
      assert.deepEqual(await sample(p), first);
      await p.close();
    });
    await check('animation pauses offscreen, in hidden tabs, and when original is shown', async () => {
      const p = await page({viewport: {width: 1440, height: 1000}});
      const first = await p.evaluate(() => window.portraitPaints);
      await p.waitForTimeout(900);
      assert.ok(await p.evaluate(() => window.portraitPaints) > first);
      await p.getByRole('button', {name: 'Show original photo', exact: true}).click();
      let count = await p.evaluate(() => window.portraitPaints);
      await p.waitForTimeout(700);
      assert.equal(await p.evaluate(() => window.portraitPaints), count);
      await p.getByRole('button', {name: 'Show dithered photo'}).click();
      await p.evaluate(() => { Object.defineProperty(document, 'hidden', {configurable: true, value: true}); document.dispatchEvent(new Event('visibilitychange')); });
      count = await p.evaluate(() => window.portraitPaints);
      await p.waitForTimeout(700);
      assert.equal(await p.evaluate(() => window.portraitPaints), count);
      await p.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, document.body.scrollHeight); });
      await p.waitForTimeout(250);
      count = await p.evaluate(() => window.portraitPaints);
      await p.waitForTimeout(700);
      assert.equal(await p.evaluate(() => window.portraitPaints), count);
      await p.close();
    });
    await check('touch reveal does not prevent scroll and clears after release', async () => {
      const p = await page({viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true, reducedMotion: 'reduce'});
      await p.locator('.portrait').scrollIntoViewIfNeeded();
      const box = await p.locator('.portrait').boundingBox();
      const before = await sample(p);
      assert.equal(await p.locator('.portrait').dispatchEvent('pointerdown', {pointerType: 'touch', clientX: box.x + 180, clientY: box.y + 150}), undefined);
      assert.ok((await sample(p)).some((v, i) => i % 4 === 3 && v < before[i]));
      await p.locator('.portrait').dispatchEvent('pointerup', {pointerType: 'touch'});
      assert.deepEqual(await sample(p), before);
      assert.equal(await p.locator('.portrait').evaluate(el => getComputedStyle(el).touchAction), 'auto');
      await p.close();
    });
    await check('no JavaScript preserves original image and has no dead toggle', async () => {
      const p = await browser.newPage({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
      await p.goto(base + '/', {waitUntil: 'networkidle'});
      assert.equal(await p.locator('.portrait canvas').count(), 0);
      assert.equal(await p.locator('.portrait button').count(), 0);
      assert.equal(await p.locator('.portrait img').isVisible(), true);
      await p.locator('.portrait').screenshot({path: `${output}/fallback-no-js.png`});
      await p.close();
    });
    for (const [name, install] of [
      ['unavailable Canvas 2D', () => { HTMLCanvasElement.prototype.getContext = () => null; }],
      ['pixel read failure', () => { CanvasRenderingContext2D.prototype.getImageData = () => { throw new Error('Pixel read unavailable'); }; }],
    ]) await check(`${name}: original image stays accessible`, async () => {
      const p = await page({}, p => p.addInitScript(install));
      assert.equal(await p.locator('.portrait canvas').count(), 0);
      assert.equal(await p.locator('.portrait button').count(), 0);
      assert.equal(await p.locator('.portrait img').isVisible(), true);
      await p.close();
    });
    await check('image load failure preserves alt text and creates no canvas/toggle', async () => {
      const p = await page({}, p => p.route('**/maurice-thomas-cutout-v1.png', route => route.abort()));
      assert.equal(await p.locator('.portrait canvas').count(), 0);
      assert.equal(await p.locator('.portrait button').count(), 0);
      assert.equal(await p.locator('.portrait img').getAttribute('alt'), 'Maurice Thomas');
      await p.close();
    });
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    fs.writeFileSync(`${output}/browser-checks.json`, JSON.stringify({base, results, errors}, null, 2));
  }
  console.log(`${results.length} portrait browser checks passed; no unexpected page/console errors.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
