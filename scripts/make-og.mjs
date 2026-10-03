// Builds the 1200x630 preview image shown when the site link is shared
// (Facebook, Viber, Messenger, Google). Run with: npm run og
import sharp from 'sharp';

const W = 1200, H = 630;

const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#060F22" stop-opacity=".96"/>
      <stop offset=".6" stop-color="#060F22" stop-opacity=".82"/>
      <stop offset="1" stop-color="#060F22" stop-opacity=".35"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="80" y="330" width="60" height="3" fill="#DDBD72"/>
  <text x="80" y="300" font-family="Arial, sans-serif" font-size="74" font-weight="800" fill="#ffffff">PestGuard Pro</text>
  <text x="80" y="390" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#DDBD72">Дезинфекция · Дезинсекция · Дератизация</text>
  <text x="80" y="445" font-family="Arial, sans-serif" font-size="30" fill="#E6EAF2">Велинград · Сърница · Доспат</text>
  <text x="80" y="540" font-family="Arial, sans-serif" font-size="40" font-weight="800" fill="#ffffff">0895 493 333</text>
</svg>`);

const logo = await sharp('public/logo.webp').resize({ height: 170 }).png().toBuffer();

const info = await sharp('public/img/farm.webp')
  .resize(W, H, { fit: 'cover', position: 'right' })
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 60, left: W - 250 },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg');

console.log('public/og-image.jpg', `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
