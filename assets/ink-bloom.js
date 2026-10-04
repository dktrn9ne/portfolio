/* Original top-edge ink wash, inspired by the public Ink Bloom visual reference.
 * No third-party component source or runtime dependencies. */
(function () {
  'use strict';
  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const smooth = v => { v = clamp(v); return v * v * (3 - 2 * v); };
  function noise(x, y) {
    const hash = (a, b) => { const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };
    const ix = Math.floor(x), iy = Math.floor(y), u = smooth(x - ix), v = smooth(y - iy);
    return (hash(ix, iy) * (1 - u) + hash(ix + 1, iy) * u) * (1 - v)
      + (hash(ix, iy + 1) * (1 - u) + hash(ix + 1, iy + 1) * u) * v;
  }
  function density(x, y, field, pull = 0) {
    const edge = .18 + field * .20 + Math.sin(x * 9 + field * 3) * .035 + pull;
    const spread = Math.pow(Math.max(0, Math.sin(Math.PI * clamp(x))), .55);
    return smooth((edge - y) / .15) * Math.exp(-y * 1.3) * spread * (.5 + .5 * smooth((field - .2) / .55));
  }
  function spring(state, target, dt, frequency, damping) {
    const steps = Math.max(1, Math.ceil(dt / .012)), step = dt / steps;
    for (let i = 0; i < steps; i++) for (const key of ['x', 'y', 'strength']) {
      const velocity = 'v' + key;
      state[velocity] = (state[velocity] || 0) + ((target[key] - state[key]) * frequency * frequency - 2 * damping * frequency * (state[velocity] || 0)) * step;
      state[key] += state[velocity] * step;
    }
    return state;
  }
  function cursorField(x, y, near, trail) {
    const lag = smooth(y / .42), center = near.x * (1 - lag) + trail.x * lag;
    const width = .045 + .045 * (1 - lag), local = Math.exp(-Math.pow((x - center) / width, 2));
    const strength = clamp(near.strength * (1 - lag) + trail.strength * lag);
    return {local: local * strength, pull: local * strength * (.035 + clamp(near.y * (1 - lag) + trail.y * lag) * .62)};
  }
  const retraction = scroll => smooth(scroll / 260);
  if (typeof module === 'object' && module.exports) module.exports = {clamp, smooth, noise, density, spring, cursorField, retraction};
  if (typeof document === 'undefined') return;
  const host = document.querySelector('.hero');
  if (!host) return;
  const stage = document.querySelector('.hero-ink');
  if (!stage) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'ink-bloom'; canvas.setAttribute('aria-hidden', 'true');
  let ctx;
  try { ctx = canvas.getContext('2d', {alpha: true}); } catch (_) { return; }
  if (!ctx) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(pointer: fine)');
  const listeners = new AbortController();
  const passive = {passive: true, signal: listeners.signal};
  let visible = true, frame = 0, last = 0, time = 0, w = 0, h = 0, data, retreat = retraction(window.scrollY);
  let target = {x: .5, y: 0, strength: 0}, near = {...target}, trail = {...target};
  // Cached multiscale noise keeps the render loop small and predictable on mobile.
  const size = 128, texture = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    texture[y * size + x] = noise(x / 16, y / 16) * .58 + noise(x / 7, y / 7) * .28 + noise(x / 3, y / 3) * .14;
  }
  function sample(x, y) {
    x = ((x % size) + size) % size; y = ((y % size) + size) % size;
    const a = Math.floor(x), b = Math.floor(y), u = x - a, v = y - b;
    return (texture[b * size + a] * (1 - u) + texture[b * size + (a + 1) % size] * u) * (1 - v)
      + (texture[((b + 1) % size) * size + a] * (1 - u) + texture[((b + 1) % size) * size + (a + 1) % size] * u) * v;
  }
  const rgb = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const match = /^#([\da-f]{6})$/i.exec(rgb);
  const color = match ? [0, 2, 4].map(i => parseInt(match[1].slice(i, i + 2), 16)) : [255, 90, 31];
  function draw() {
    const pixels = data.data;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const nx = x / w, ny = y / h;
      const cursor = cursorField(nx, ny, near, trail);
      const swirl = sample(nx * 35 + time * .3, ny * 28 - time * .5) - .5;
      const warpedX = nx * 90 + swirl * 12 - cursor.local * (trail.vx || 0) * ny * 15;
      const field = sample(warpedX + time * 1.8, ny * 70 - time * 1.1 + swirl * 14 - cursor.local * ny * 18);
      const ink = density(nx, ny / Math.max(.06, 1 - retreat * .94), field, cursor.pull) * (1 - retreat);
      const i = (y * w + x) * 4;
      pixels[i] = color[0]; pixels[i + 1] = color[1]; pixels[i + 2] = color[2];
      pixels[i + 3] = Math.round(ink * 255);
    }
    ctx.putImageData(data, 0, 0);
  }
  function resize() {
    w = Math.min(420, Math.max(160, Math.round(stage.clientWidth / 4)));
    h = Math.round(w * stage.clientHeight / Math.max(stage.clientWidth, 1));
    h = Math.max(60, Math.min(120, h));
    canvas.width = w; canvas.height = h; data = ctx.createImageData(w, h); draw();
  }
  function active() { return !motion.matches && visible && !document.hidden && retreat < 1; }
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
  function tick(now) {
    frame = 0;
    if (!active()) return;
    if (!last || now - last >= (fine.matches ? 40 : 100)) {
      const dt = last ? Math.min((now - last) / 1000, .12) : .066; last = now; time += dt;
      spring(near, target, dt, 19, .9);
      spring(trail, near, dt, 8, .65);
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function update() {
    stop();
    if (motion.matches) { target.strength = near.strength = trail.strength = 0; time = 0; draw(); }
    else if (active()) frame = requestAnimationFrame(tick);
  }
  // No touch listeners: the decoration never captures a gesture or scroll.
  document.body.addEventListener('pointermove', event => {
    if (!fine.matches || motion.matches || event.pointerType === 'touch') return;
    const rect = stage.getBoundingClientRect();
    target.x = clamp((event.clientX - rect.left) / rect.width);
    target.y = clamp((event.clientY - rect.top) / rect.height);
    target.strength = 1 - smooth((event.clientY - rect.top - 65) / (rect.height * .58));
  }, passive);
  document.body.addEventListener('pointerleave', () => { target.strength = 0; }, passive);
  document.addEventListener('visibilitychange', update, passive);
  motion.addEventListener('change', update, passive);
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; update();
  }) : null;
  if (observer) observer.observe(stage);
  window.addEventListener('resize', resize, passive);
  const headerState = () => document.body.classList.toggle('ink-at-top', stage.classList.contains('is-enhanced') && window.scrollY < 24);
  window.addEventListener('scroll', () => {
    const wasActive = active(); retreat = retraction(window.scrollY); headerState();
    if (motion.matches || retreat === 1) draw();
    if (wasActive !== active()) update();
  }, passive);
  window.addEventListener('pagehide', event => {
    stop();
    if (!event.persisted) { listeners.abort(); if (observer) observer.disconnect(); document.body.classList.remove('ink-at-top'); }
  }, passive);
  window.addEventListener('pageshow', () => { headerState(); update(); }, passive);
  try { stage.append(canvas); resize(); stage.classList.add('is-enhanced'); headerState(); update(); }
  catch (_) { stop(); listeners.abort(); if (observer) observer.disconnect(); canvas.remove(); stage.classList.remove('is-enhanced'); document.body.classList.remove('ink-at-top'); }
})();
