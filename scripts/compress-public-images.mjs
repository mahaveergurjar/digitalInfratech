/**
 * Compresses large JPG/PNG assets in public/ to WebP for faster loads.
 * Safe to run on every build — skips when only .webp already exists.
 */
import { existsSync } from 'node:fs';
import { readdir, stat, unlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_WIDTH = 800;
const WEBP_QUALITY = 76;

const TARGET_DIRS = [
  join(root, 'public/services'),
  join(root, 'public/hero'),
];

async function compressOne(inputPath) {
  const ext = inputPath.split('.').pop()?.toLowerCase();
  if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) return null;

  const base = inputPath.replace(/\.(jpe?g|png)$/i, '');
  const outputPath = `${base}.webp`;
  const before = (await stat(inputPath)).size;

  const buffer = await sharp(inputPath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  await writeFile(outputPath, buffer);

  if (outputPath !== inputPath) {
    await unlink(inputPath);
  }

  const saved = Math.round((1 - buffer.length / before) * 100);
  return { outputPath, before, after: buffer.length, saved };
}

async function processDirectory(dir) {
  if (!existsSync(dir)) return [];

  const entries = await readdir(dir);
  const results = [];

  for (const name of entries) {
    if (!/\.(jpe?g|png)$/i.test(name)) continue;
    const inputPath = join(dir, name);
    try {
      const result = await compressOne(inputPath);
      if (result) results.push(result);
    } catch (err) {
      console.warn(`Skip ${name}:`, err.message);
    }
  }

  return results;
}

let totalBefore = 0;
let totalAfter = 0;
const all = [];

for (const dir of TARGET_DIRS) {
  const results = await processDirectory(dir);
  all.push(...results);
}

for (const r of all) {
  totalBefore += r.before;
  totalAfter += r.after;
  console.log(`Compressed ${r.outputPath.split('/public/')[1]} (${r.saved}% smaller)`);
}

if (all.length === 0) {
  console.log('No JPG/PNG to compress (WebP already in place).');
} else {
  const pct = Math.round((1 - totalAfter / totalBefore) * 100);
  console.log(`Done: ${all.length} files, ~${pct}% total size reduction.`);
}
