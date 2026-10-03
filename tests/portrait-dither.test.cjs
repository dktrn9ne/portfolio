const test = require('node:test');
const assert = require('node:assert/strict');
const {lightPixel, coverCrop, paintDither} = require('../assets/portrait-dither.js');

test('ordered dithering preserves black, white, and half-tone coverage', () => {
  for (const [luminance, expected] of [[0, 0], [0.5, 32], [1, 64]]) {
    let light = 0;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) light += Number(lightPixel(luminance, x, y));
    assert.equal(light, expected);
  }
});
test('Bayer pattern repeats at an eight-cell interval', () => {
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
    assert.equal(lightPixel(0.4, x, y), lightPixel(0.4, x + 8, y + 8));
  }
});
test('cover crop matches a centered tall portrait without stretching', () => {
  const [x, y, width, height] = coverCrop(560, 552, 400, 800);
  assert.equal(y, 0);
  assert.equal(height, 552);
  assert.equal(width, 276);
  assert.equal(x, 142);
});
test('cover crop handles a wide container and identical aspect ratio', () => {
  assert.deepEqual(coverCrop(560, 552, 1120, 1104), [0, 0, 560, 552]);
  const [x, y, width, height] = coverCrop(560, 552, 800, 400);
  assert.equal(x, 0);
  assert.equal(width, 560);
  assert.equal(height, 280);
  assert.equal(y, 136);
});
test('removed background stays transparent and soft subject edges retain alpha', () => {
  const source = new Uint8ClampedArray([255,255,255,0, 255,255,255,128, 0,0,0,255]);
  const palette = [[11,11,12,255],[255,90,31,255]];
  for (const variant of [0,1]) {
    const result = paintDither(source, 3, 1, palette, variant);
    assert.deepEqual([...result.slice(0,4)], [0,0,0,0]);
    assert.deepEqual([...result.slice(4,8)], [255,90,31,128]);
    assert.deepEqual([...result.slice(8,12)], [11,11,12,255]);
  }
});
