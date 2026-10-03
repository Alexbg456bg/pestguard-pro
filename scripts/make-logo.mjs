// Removes the flat navy background around the shield (flood fill from the edges,
// so the navy inside the shield stays) and exports transparent PNG/WebP logos.
// Run with: npm run logo
import sharp from 'sharp';

const SRC = 'photos-src/logo.jpg';
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const px = (x, y) => (y * W + x) * 4;

// Background color = average of the four corners
const corners = [px(2, 2), px(W - 3, 2), px(2, H - 3), px(W - 3, H - 3)];
const bg = [0, 1, 2].map((c) => corners.reduce((s, i) => s + data[i + c], 0) / 4);
const dist = (i) => Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);

const SOLID = 28;  // closer than this → fully transparent
const EDGE = 70;   // between SOLID and EDGE → soft edge
const seen = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) stack.push(x, 0, x, H - 1);
for (let y = 0; y < H; y++) stack.push(0, y, W - 1, y);

while (stack.length) {
  const y = stack.pop(), x = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H || seen[y * W + x]) continue;
  const i = px(x, y), d = dist(i);
  if (d >= EDGE) continue;
  seen[y * W + x] = 1;
  data[i + 3] = d <= SOLID ? 0 : Math.round(255 * (d - SOLID) / (EDGE - SOLID));
  if (d <= SOLID) stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
}

const clean = sharp(data, { raw: { width: W, height: H, channels: 4 } });
const trimmed = await clean.png().toBuffer().then((b) => sharp(b).trim().png().toBuffer());

const out = [
  ['public/logo.webp', 640, 'webp'],
  ['public/logo-sm.png', 160, 'png'],
  ['public/apple-touch-icon.png', 180, 'png', true],
  ['public/favicon-64.png', 64, 'png'],
];
for (const [file, size, fmt, onNavy] of out) {
  let img = sharp(trimmed).resize({ height: size, width: size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
  if (onNavy) img = img.flatten({ background: '#0B1B3A' });
  img = fmt === 'webp' ? img.webp({ quality: 88, alphaQuality: 90 }) : img.png({ compressionLevel: 9 });
  const r = await img.toFile(file);
  console.log(file, `${r.width}x${r.height}`, `${Math.round(r.size / 1024)} KB`);
}
