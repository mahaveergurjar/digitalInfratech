import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSitemapXml } from '../src/config/seo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(resolve(root, 'public/sitemap.xml'), buildSitemapXml(), 'utf8');
console.log('Wrote public/sitemap.xml');
