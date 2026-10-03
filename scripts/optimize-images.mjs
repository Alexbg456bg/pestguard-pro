// Converts the source photos in photos-src/ to optimized WebP files in public/img/.
// Crops remove areas with unreadable signs. Run with: npm run images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'photos-src';
const OUT = 'public/img';

// crop is in original pixels (2816x1536 sources)
const photos = [
  { name: 'farm' },
  { name: 'office' },
  { name: 'bedroom', crop: { left: 0, top: 0, width: 2520, height: 1536 } },
  { name: 'warehouse', crop: { left: 1170, top: 0, width: 1646, height: 1536 } },
];

const sizes = [
  { suffix: '', width: 2400, quality: 72 },
  { suffix: '-md', width: 1200, quality: 74 },
];

await mkdir(OUT, { recursive: true });

for (const p of photos) {
  for (const s of sizes) {
    let img = sharp(`${SRC}/${p.name}.jpg`);
    if (p.crop) img = img.extract(p.crop);
    const file = `${OUT}/${p.name}${s.suffix}.webp`;
    const info = await img
      .resize({ width: s.width, withoutEnlargement: true })
      .webp({ quality: s.quality })
      .toFile(file);
    console.log(`${file}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}
