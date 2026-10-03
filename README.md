# PestGuard Pro – сайт (React + Vite)

## Стартиране
```bash
npm install
npm run dev
```
Отворете http://localhost:5173

## Готов за качване сайт
```bash
npm run build
```
Готовият сайт е в папка `dist/`. Може да се качи в Netlify, Cloudflare Pages или при всеки хостинг.

## Къде какво се променя
- **Всички текстове** (услуги, вредители, въпроси, райони, телефон, ЕИК): `src/data/content.js`
- **Цветове и дизайн**: `src/styles/global.css` (най-отгоре са цветовете)
- **Секции**: `src/components/`

## Снимки
1. Сложете оригиналната снимка в `photos-src/` (напр. `farm.jpg`).
2. Пуснете `npm run images` – създава оптимизирани `.webp` в `public/img/`.
Изрязването на снимките се настройва в `scripts/optimize-images.mjs`.

## Форма за запитване
1. Отидете на https://web3forms.com, въведете имейла на фирмата и копирайте ключа.
2. Копирайте `.env.example` като `.env` и попълнете `VITE_WEB3FORMS_KEY=...`
3. Пуснете отново `npm run build`.
Без ключ формата отваря имейл програмата на посетителя.
