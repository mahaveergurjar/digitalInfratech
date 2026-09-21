import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { buildSitemapXml } from './src/config/seo.js'

function sitemapPlugin() {
  return {
    name: 'generate-sitemap',
    writeBundle(options) {
      const outDir = options.dir || resolve('dist')
      writeFileSync(resolve(outDir, 'sitemap.xml'), buildSitemapXml(), 'utf8')
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemapPlugin(),
  ],
  server: {
    port: 3000,
    open: true
  }
})
