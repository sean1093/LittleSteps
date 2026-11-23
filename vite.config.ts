import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import {
  pagesToPrerender,
  renderPageHtml,
  renderRobotsTxt,
  renderSitemap,
} from './src/common/seo/staticHead'

/**
 * 建置後補上 SEO 需要的靜態檔案。
 *
 * Vite 用 esbuild 編譯自己的設定檔，所以這裡可以直接 import TypeScript 的
 * 路由表與 metadata——不必再寫一份 Node 版本，也就不會有第二份事實來源。
 *
 * Firebase Hosting 會先找真實檔案，找不到才套 `**` → /index.html 的 rewrite。
 * 因此 dist/littleexplorer/wiki/index.html 一存在，該網址就會拿到自己的
 * title 與 og 標籤，不需要先執行 JS。
 */
function seoStaticFiles(): Plugin {
  return {
    name: 'littlesteps-seo-static',
    apply: 'build',
    closeBundle() {
      const dist = join(process.cwd(), 'dist')
      const template = readFileSync(join(dist, 'index.html'), 'utf8')

      for (const { page, outDir } of pagesToPrerender()) {
        const target = join(dist, outDir, 'index.html')
        mkdirSync(dirname(target), { recursive: true })
        writeFileSync(target, renderPageHtml(template, page))
      }

      // 首頁本身也要換成自己的 head，否則它還是原始樣板。
      writeFileSync(join(dist, 'index.html'), renderPageHtml(template, 'home'))

      const today = new Date().toISOString().slice(0, 10)
      writeFileSync(join(dist, 'sitemap.xml'), renderSitemap(today))

      // robots.txt 也從路由表產生，而不是放在 public/ 手動維護：手寫的版本
      // 是 fail-open 的，新增一個需登入的頁面卻忘了補 Disallow，那一頁就會
      // 被爬進索引。
      writeFileSync(join(dist, 'robots.txt'), renderRobotsTxt())
    },
  }
}

/**
 * 把三組不常變動的函式庫從進入點拆出來，各自擁有獨立的內容雜湊。
 *
 * 沒拆之前，函式庫與應用程式碼共用同一個 chunk：改一行文案，檔名就變，
 * service worker 會讓每個已安裝的 PWA 重新下載約 595 kB 根本沒變的函式庫。
 *
 * 比對一定要錨定在 node_modules 的路徑區段上。兩種直覺的寫法都實際建置過，
 * 也都是壞的：
 *
 * - `id.includes('react')` 會連 `lucide-react`、`react-leaflet`、
 *   `react-leaflet-cluster` 一起吃進去，並把 `leaflet` 與它的 CSS 拖進每個
 *   路由都要載入的 chunk——地圖不再是只有 BabyOasis 才付的成本。
 * - `id.includes('firebase')` 會吃到 `@firebase/analytics` 與
 *   `@firebase/installations`，`src/lib/firebase.ts` 裡動態 import 的
 *   analytics 就此併入首屏 chunk，延遲載入形同作廢。
 *
 * 所以 analytics 與只有它才用到的 installations 明確排除在外，留給 Rollup
 * 照動態 import 自行切出延遲載入的 chunk。
 *
 * Realtime Database 是另一個 chunk，而且必須是：它是首屏最大的一塊，公開頁
 * 一個位元組都用不到，進入點的 import 路徑已經不再碰它（見 src/lib/database.ts）。
 * 留在 firebase 這個 chunk 裡的話，那個 chunk 是進入點靜態 import 的，前面
 * 那些 lazy 就全部白做——資料庫照樣跟著 Auth 一起在每一頁載入。
 */
const REACT_VENDOR = /[\\/]node_modules[\\/](?:react|react-dom|scheduler)[\\/]/
const MOTION_VENDOR = /[\\/]node_modules[\\/]framer-motion[\\/]/
const FIREBASE_VENDOR = /[\\/]node_modules[\\/](?:@firebase|firebase)[\\/]/
const DATABASE_VENDOR = /[\\/]node_modules[\\/](?:@firebase[\\/]database|firebase[\\/]database)[\\/]/
const FIREBASE_LAZY =
  /[\\/]node_modules[\\/](?:@firebase[\\/](?:analytics|installations)|firebase[\\/]analytics)[\\/]/

function vendorChunk(id: string): string | undefined {
  if (REACT_VENDOR.test(id)) return 'react'
  if (MOTION_VENDOR.test(id)) return 'framer-motion'
  if (DATABASE_VENDOR.test(id)) return 'firebase-database'
  if (FIREBASE_VENDOR.test(id) && !FIREBASE_LAZY.test(id)) return 'firebase'
  return undefined
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'LittleSteps｜懷孕到三歲的育兒工具',
        short_name: 'LittleSteps',
        description: '給台灣爸媽的育兒工具：產檢、疫苗與成長記錄，加上哺乳室地圖、親子館與兒童傳染病門診統計',
        lang: 'zh-TW',
        theme_color: '#FDFBF7',
        background_color: '#FDFBF7',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            // Separate art, not the same file tagged twice: a launcher crops
            // maskable icons to a circle, which ate the corners of the `any`
            // icon. This one keeps the mark inside the safe zone.
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        // 全國哺乳室資料約 1.1 MB，預先快取會讓每個使用者在安裝 PWA 時就下載，
        // 即使從未開啟 BabyOasis。改為首次進入地圖時才取得並快取。
        globIgnores: ['**/data/nursingRooms.json'],
        runtimeCaching: [
          {
            urlPattern: /\/data\/nursingRooms\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nursing-rooms-data',
              // 上游每半年更新一次，過期資料仍遠勝於空白地圖。
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      }
    }),
    // PWA 之後跑：它會產生 index.html 的最終樣貌，這裡才能拿到正確的樣板。
    seoStaticFiles()
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true
  }
})
