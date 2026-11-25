import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import { games } from './src/games/registry.ts'

/** Genera robots.txt y sitemap.xml en el build a partir del catálogo de juegos. */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: 'rompecoco-seo-files',
    apply: 'build',
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const urls = ['/', ...games.map((game) => `/juegos/${game.slug}`)]
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${siteUrl}${url}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')}
</urlset>
`
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '')

  return {
    plugins: [react(), tailwindcss(), seoFiles(siteUrl)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
