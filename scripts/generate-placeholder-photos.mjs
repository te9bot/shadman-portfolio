/**
 * Generates the placeholder photography assets in public/images/photography/.
 *
 * Zero dependencies — writes PNGs directly with Node's zlib. Every image is a
 * deterministic dark, cinematic gradient so the gallery, lightbox and parallax
 * can be exercised for real before actual photographs exist.
 *
 * Replace the generated files with real photographs (keeping the file names, or
 * updating `src` in src/data/photographs.ts) whenever you are ready.
 *
 *   npm run photos
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'photography');

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

function encodePng(width, height, rgb) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  const raw = Buffer.alloc(height * (width * 3 + 1));
  let p = 0;
  for (let y = 0; y < height; y += 1) {
    raw[p] = 1; // Sub filter — cheap and compresses gradients well
    p += 1;
    const rowStart = y * width * 3;
    for (let x = 0; x < width * 3; x += 1) {
      const current = rgb[rowStart + x];
      const left = x >= 3 ? rgb[rowStart + x - 3] : 0;
      raw[p] = (current - left) & 0xff;
      p += 1;
    }
  }
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Dark, restrained palettes — near-black bases with one quiet accent each. */
const palettes = [
  { base: [12, 15, 18], accent: [62, 124, 102], light: [176, 194, 196] },
  { base: [14, 15, 19], accent: [86, 96, 124], light: [188, 192, 204] },
  { base: [13, 16, 16], accent: [52, 114, 90], light: [166, 188, 180] },
  { base: [18, 16, 14], accent: [132, 100, 64], light: [212, 188, 158] },
  { base: [12, 14, 18], accent: [56, 92, 132], light: [168, 188, 210] },
  { base: [16, 14, 17], accent: [106, 84, 114], light: [196, 180, 200] },
  { base: [14, 17, 17], accent: [70, 130, 114], light: [176, 200, 192] },
];

function render(width, height, seed) {
  const rgb = Buffer.alloc(width * height * 3);
  const random = mulberry32(seed);
  const palette = palettes[seed % palettes.length];
  const cx = 0.18 + random() * 0.64;
  const cy = 0.14 + random() * 0.5;
  const angle = random() * Math.PI;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const bandFreq = 2 + random() * 4;
  const bandAmp = 0.05 + random() * 0.07;
  const glowRadius = 0.35 + random() * 0.35;

  for (let y = 0; y < height; y += 1) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);

      // Linear sweep + soft radial glow + a faint horizontal band structure.
      const sweep = Math.min(1, Math.max(0, (u * dx + v * dy + 1) / 2));
      const dist = Math.hypot((u - cx) * 1.35, v - cy);
      const glow = Math.max(0, 1 - dist / glowRadius) ** 2.2;
      const band = Math.sin(v * Math.PI * bandFreq + u * 0.9) * bandAmp;
      const vignette = 1 - 0.42 * Math.hypot(u - 0.5, v - 0.5) ** 1.5;

      // Low-amplitude ordered dither keeps files small while killing banding.
      const dither = (((x & 3) * 5 + (y & 3) * 3) % 7) / 7 - 0.5;

      let out = 0;
      for (let c = 0; c < 3; c += 1) {
        const value =
          palette.base[c] +
          (palette.accent[c] - palette.base[c]) * (glow * 1.15 + band + 0.14) +
          (palette.light[c] - palette.base[c]) * (sweep ** 1.7) * 0.6;
        out = Math.round(Math.min(255, Math.max(0, value * vignette + dither * 2)));
        rgb[(y * width + x) * 3 + c] = out;
      }
    }
  }
  return rgb;
}

const plan = [
  [1600, 1000],
  [1000, 1400],
  [1400, 1050],
  [1600, 900],
  [1200, 1200],
  [1000, 1400],
  [1400, 1050],
  [1600, 900],
  [1200, 1200],
  [1000, 1400],
  [1400, 1050],
  [1600, 900],
  [1200, 1200],
  [1600, 1000],
];

mkdirSync(outDir, { recursive: true });

let total = 0;
plan.forEach(([width, height], i) => {
  const name = `photo-${String(i + 1).padStart(2, '0')}.png`;
  const png = encodePng(width, height, render(width, height, i + 1));
  writeFileSync(join(outDir, name), png);
  total += png.length;
  process.stdout.write(`${name}  ${width}x${height}  ${(png.length / 1024).toFixed(0)} KB\n`);
});
process.stdout.write(`\n${plan.length} placeholder photographs · ${(total / 1024 / 1024).toFixed(2)} MB total\n`);
