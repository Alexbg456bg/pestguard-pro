// Downloads the real municipality borders (OpenStreetMap / Nominatim, simplified)
// and saves them to public/areas.geojson. Run once with: node scripts/fetch-areas.mjs
import { writeFile } from 'node:fs/promises';

const municipalities = [
  { id: 'velingrad', q: 'Velingrad' },
  { id: 'sarnitsa', q: 'Sarnitsa' },
  { id: 'dospat', q: 'Dospat' },
  { id: 'gotsedelchev', q: 'Gotse Delchev' },
];
const UA = { 'User-Agent': 'PestGuardPro-site/1.0 (municipality borders for service map)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const round = (c) => (typeof c[0] === 'number' ? [+c[0].toFixed(4), +c[1].toFixed(4)] : c.map(round));

const features = [];
for (const m of municipalities) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.search = new URLSearchParams({ q: `${m.q}, Bulgaria`, format: 'json', limit: '5', polygon_geojson: '1', polygon_threshold: '0.002' });
  const res = await fetch(url, { headers: UA });
  const list = await res.json();
  const hit = list.find((x) => x.addresstype === 'state_district' && /Polygon/.test(x.geojson?.type));
  if (!hit) throw new Error(`no municipality polygon for ${m.q}`);
  features.push({ type: 'Feature', properties: { id: m.id, name: hit.name }, geometry: { type: hit.geojson.type, coordinates: round(hit.geojson.coordinates) } });
  console.log(m.id, hit.name, hit.geojson.type, JSON.stringify(hit.geojson.coordinates).length, 'chars');
  await sleep(1200); // Nominatim usage policy: max 1 request per second
}
await writeFile('public/areas.geojson', JSON.stringify({ type: 'FeatureCollection', attribution: '© OpenStreetMap contributors', features }));
console.log('saved public/areas.geojson');
