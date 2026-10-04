/* Independent interpretation of Annnimate's publicly described dithering effect.
 * No paid source or third-party animation dependencies. The image remains the fallback.
 */
(function () {
  'use strict';

  const BAYER = [
    [0, 48, 12, 60, 3, 51, 15, 63], [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55], [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61], [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53], [42, 26, 38, 22, 41, 25, 37, 21],
  ];
  function lightPixel(luminance, x, y) {
    return luminance > (BAYER[y % 8][x % 8] + 0.5) / 64;
  }
  function coverCrop(imageWidth, imageHeight, width, height) {
    const scale = Math.max(width / imageWidth, height / imageHeight);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    return [(imageWidth - sourceWidth) / 2, (imageHeight - sourceHeight) / 2, sourceWidth, sourceHeight];
  }
  function containFrame(imageWidth, imageHeight, width, height) {
    const scale = Math.min(width / imageWidth, height / imageHeight);
    const drawnWidth = imageWidth * scale;
    const drawnHeight = imageHeight * scale;
    return [(width - drawnWidth) / 2, (height - drawnHeight) / 2, drawnWidth, drawnHeight];
  }
  function paintDither(pixels, width, height, palette, variant) {
    const output = new Uint8ClampedArray(pixels.length);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (pixels[index + 3] === 0) continue;
      const luminance = (pixels[index] * 0.2126 + pixels[index + 1] * 0.7152 + pixels[index + 2] * 0.0722) / 255;
      const shift = variant && luminance < 0.35 && (x * 13 + y * 7) % 23 === 0 ? 0.025 : 0;
      output.set(palette[lightPixel(luminance + shift, x, y) ? 1 : 0], index);
      // Keep source alpha: removed background never becomes an opaque dither field.
      output[index + 3] = pixels[index + 3];
    }
    return output;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { lightPixel, coverCrop, containFrame, paintDither };
  if (typeof document === 'undefined') return;

  const portrait = document.querySelector('.portrait');
  const image = portrait && portrait.querySelector('img');
  if (!image || !window.ResizeObserver || !window.IntersectionObserver) return;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.className = 'portrait-dither';
  canvas.setAttribute('aria-hidden', 'true');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'portrait-toggle';
  toggle.textContent = 'Show original photo';
  toggle.setAttribute('aria-pressed', 'false');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frames = [], width = 0, height = 0, frameRequest = 0, resizeRequest = 0;
  let ready = false, visible = false, original = false, lastPaint = 0;
  let target = null, lens = null;

  function stop() {
    cancelAnimationFrame(frameRequest);
    frameRequest = 0;
  }
  function fail() {
    ready = false;
    stop();
    canvas.remove();
    toggle.remove();
    portrait.classList.remove('has-dither');
  }
  function render(time) {
    if (!ready || original) return;
    const phase = motion.matches ? 0 : time / 1000;
    context.globalCompositeOperation = 'source-over';
    context.clearRect(0, 0, width, height);
    context.drawImage(frames[motion.matches ? 0 : Math.floor(time / 600) % 2], 0, 0, width, height);
    if (target) {
      if (!lens || motion.matches) lens = { ...target };
      else {
        lens.x += (target.x - lens.x) * 0.4;
        lens.y += (target.y - lens.y) * 0.4;
      }
      const radius = Math.min(width, height) * 0.23;
      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      for (let i = 0; i <= 96; i++) {
        const angle = i / 96 * Math.PI * 2;
        // Circular phases keep the irregular edge shifting in place, without drift.
        const wobble = motion.matches ? 0 : Math.sin(angle * 5 + Math.sin(phase) * 1.4) * 4
          + Math.cos(angle * 7 + Math.cos(phase) * 1.1) * 3;
        const x = lens.x + Math.cos(angle) * (radius + wobble);
        const y = lens.y + Math.sin(angle) * (radius + wobble);
        if (i) context.lineTo(x, y); else context.moveTo(x, y);
      }
      context.closePath();
      context.fill();
      context.restore();
    }
  }
  function tick(time) {
    frameRequest = 0;
    if (!ready || !visible || original || document.hidden || motion.matches) return;
    // Limit painting to 15fps. Idle dark-area changes happen only every 600ms.
    if (time - lastPaint >= (target ? 1000 / 15 : 600)) {
      render(time);
      lastPaint = time;
    }
    frameRequest = requestAnimationFrame(tick);
  }
  function resume() {
    stop();
    render(performance.now());
    if (ready && visible && !original && !document.hidden && !motion.matches) {
      frameRequest = requestAnimationFrame(tick);
    }
  }
  function build() {
    if (!image.complete || !image.naturalWidth) return;
    const rect = portrait.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    width = Math.ceil(rect.width);
    height = Math.ceil(rect.height);
    canvas.width = width;
    canvas.height = height;
    const sample = document.createElement('canvas');
    sample.width = Math.ceil(width / 3);
    sample.height = Math.ceil(height / 3);
    const sampleContext = sample.getContext('2d', { willReadFrequently: true });
    if (!sampleContext) return fail();
    try {
      sampleContext.filter = getComputedStyle(image).filter;
      // Keep the entire existing bust visible; mirror CSS object-fit: contain.
      sampleContext.drawImage(image, ...containFrame(image.naturalWidth, image.naturalHeight, sample.width, sample.height));
      const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
      const styles = getComputedStyle(portrait);
      const colors = [styles.getPropertyValue('--dither-dark').trim() || '#0b0b0c',
        styles.getPropertyValue('--dither-light').trim() || '#ff5a1f'];
      frames = [0, 1].map(variant => {
        const frame = document.createElement('canvas');
        frame.width = sample.width;
        frame.height = sample.height;
        const ctx = frame.getContext('2d');
        const output = ctx.createImageData(frame.width, frame.height);
        const palette = colors.map(color => {
          ctx.fillStyle = color;
          ctx.fillRect(0, 0, 1, 1);
          return ctx.getImageData(0, 0, 1, 1).data;
        });
        output.data.set(paintDither(pixels, frame.width, frame.height, palette, variant));
        ctx.putImageData(output, 0, 0);
        return frame;
      });
      context.imageSmoothingEnabled = false;
      ready = true;
      if (!canvas.isConnected) portrait.append(canvas, toggle);
      portrait.classList.add('has-dither');
      resume();
    } catch (_) { fail(); }
  }
  function position(event) {
    if (!ready || original) return;
    const rect = portrait.getBoundingClientRect();
    target = { x: (event.clientX - rect.left) * width / rect.width,
      y: (event.clientY - rect.top) * height / rect.height };
    if (motion.matches) render(0);
  }
  function clearLens() {
    target = lens = null;
    render(performance.now());
  }
  portrait.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch') position(event);
  });
  portrait.addEventListener('pointerdown', position);
  portrait.addEventListener('pointerleave', clearLens);
  portrait.addEventListener('pointercancel', clearLens);
  portrait.addEventListener('pointerup', event => {
    if (event.pointerType === 'touch') clearLens();
  });
  toggle.addEventListener('click', () => {
    original = !original;
    canvas.hidden = original;
    toggle.setAttribute('aria-pressed', String(original));
    toggle.textContent = original ? 'Show dithered photo' : 'Show original photo';
    target = lens = null;
    resume();
  });
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeRequest);
    resizeRequest = requestAnimationFrame(build);
  }).observe(portrait);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    resume();
  }).observe(portrait);
  document.addEventListener('visibilitychange', resume);
  motion.addEventListener('change', resume);
  image.addEventListener('load', build);
  image.addEventListener('error', fail);
  build();
})();
