/**
 * Service card images are custom assets in public/services/*.jpg
 * (generated for Digital InfraTech — one image per service ID).
 *
 * This script only verifies all mapped files exist.
 */
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICE_STOCK_IMAGES } from '../src/data/serviceStockImages.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/services');

const missing = Object.entries(SERVICE_STOCK_IMAGES).filter(([, path]) => {
  const file = resolve(root, 'public', path.replace(/^\//, ''));
  return !existsSync(file);
});

if (missing.length) {
  console.error('Missing service images:');
  missing.forEach(([id, path]) => console.error(`  ${id} -> ${path}`));
  process.exit(1);
}

console.log(`All ${Object.keys(SERVICE_STOCK_IMAGES).length} service images present in public/services/`);
