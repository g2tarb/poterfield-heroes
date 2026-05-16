// Génère les icônes PWA placeholder (PNG) à partir d'un SVG.
// Usage : node scripts/generate-icons.mjs
// Requiert : npm i -D sharp (déjà dispo car @serwist/next la tire en sub-dep).

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "apps", "web", "public", "icons");

await mkdir(OUT_DIR, { recursive: true });

const SVG = (size, padding = 0) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0A0A0B"/>
  <g transform="translate(${size / 2}, ${size / 2})">
    <circle r="${size * 0.32 - padding}" fill="none" stroke="#D4A24C" stroke-width="${Math.max(2, size * 0.012)}" opacity="0.4"/>
    <circle r="${size * 0.22 - padding}" fill="none" stroke="#D4A24C" stroke-width="${Math.max(2, size * 0.012)}" opacity="0.7"/>
    <circle r="${size * 0.12 - padding}" fill="#D4A24C"/>
    <text x="0" y="${size * 0.42}" text-anchor="middle"
      font-family="Inter, system-ui, sans-serif"
      font-size="${size * 0.11}"
      font-weight="600"
      fill="#F5F5F7"
      letter-spacing="${size * 0.005}">
      PH
    </text>
  </g>
</svg>`;

async function generate(name, size, options = {}) {
  const padding = options.maskable ? size * 0.1 : 0;
  const svg = SVG(size, padding);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  const out = join(OUT_DIR, name);
  await writeFile(out, png);
  console.log(`✓ ${name} (${size}×${size})`);
}

await Promise.all([
  generate("icon-192.png", 192),
  generate("icon-512.png", 512),
  generate("icon-maskable-512.png", 512, { maskable: true }),
  generate("apple-touch-icon.png", 180),
]);

// Favicon: just rename one icon
const favicon = await sharp(Buffer.from(SVG(64))).png().toBuffer();
await writeFile(join(OUT_DIR, "..", "favicon.ico"), favicon);
console.log("✓ favicon.ico (64×64 PNG fallback)");

console.log("\nIcônes générées dans apps/web/public/icons/");
