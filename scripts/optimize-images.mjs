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

// Portrait photos used only on phones (photos-src/mobile/, 1536x2752 sources)
const mobilePhotos = [
  { name: 'm-farm' },
  { name: 'm-bedroom', crop: { left: 0, top: 990, width: 1536, height: 1762 } },
  { name: 'm-storage', crop: { left: 0, top: 700, width: 1536, height: 1920 } },
  { name: 'm-industrial', crop: { left: 0, top: 1000, width: 1536, height: 1752 } },
];

async function save(src, crop, file, width, quality) {
  let img = sharp(src);
  if (crop) img = img.extract(crop);
  const info = await img.resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(file);
  console.log(`${file}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

for (const p of photos) {
  for (const s of sizes) {
    await save(`${SRC}/${p.name}.jpg`, p.crop, `${OUT}/${p.name}${s.suffix}.webp`, s.width, s.quality);
  }
}
for (const p of mobilePhotos) {
  await save(`${SRC}/mobile/${p.name}.jpg`, p.crop, `${OUT}/${p.name}.webp`, 900, 72);
}
