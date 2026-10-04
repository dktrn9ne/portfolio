# Portrait dithering

The hero portrait uses an independent Canvas 2D implementation inspired by the public behavior described at [Annnimate's Dithering demo](https://annnimate.com/animations/dithering). No paid source was used. The public demo rendered a grayscale fallback in the review browser, so exact reference colors, radius, easing, and timing were not visually verified.

An 8x8 Bayer matrix maps image luminance to the portfolio's ink/orange colors (`--accent: #ff5a1f`) in roughly 3px cells. Moving the pointer reveals the existing color image through an irregular lens; circular phases make the edge wobble in place. A sparse change in dark-area thresholds occurs every 600ms. The implementation uses no WebGL, animation framework, or runtime package dependency.

The original `assets/maurice-thomas.jpg` remains unchanged. The hero uses the approved transparent `assets/maurice-thomas-cutout-v1.png`; its source alpha is retained so only the person receives dots and the removed background shows the site ink color. The source already contains both ears and the shoulder line. A square bust frame and matching full-image containment in CSS and Canvas preserve those details rather than cropping the square source into a tall column. Alt text and caption remain intact. The cutout was generated from the original portrait; its slightly resynthesized/sharpened details are not pixel-identical to the original. The decorative canvas is hidden from assistive technology. A native button lets keyboard and touch users show the original image without relying on the pointer lens. Touch scrolling is not intercepted; a touch lens clears on release/cancel.

Reduced motion keeps a static dither with an immediate, stationary lens. Animation pauses when the portrait is offscreen, the document is hidden, or the original photo is selected. Dither frames are precomputed at a 3px sampling resolution; interactive painting is capped at 15fps. Missing JavaScript/Canvas/observer support or pixel-read failures leave the original image visible. The toggle is only inserted after a successful render.

## Verification

The site remains static. Test packages are development-only:

```sh
npm ci
npm test
npx playwright install chromium
# In another terminal:
python -m http.server 8765 --bind 127.0.0.1
# Then:
npm run test:browser
```

Browser screenshots and results go to ignored `test-results/portrait/`. `PORTFOLIO_BASE_URL` can select another local server. `PORTRAIT_BROWSER_PATH` can select an installed Chromium executable. The workflow runs these checks on PRs and main and retains screenshots as an artifact. No deployment or domain configuration is changed by the test workflow.
