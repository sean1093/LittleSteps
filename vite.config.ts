import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'LittleSteps - 孕期到幼兒的育兒陪伴',
        short_name: 'LittleSteps',
        description: '從懷孕、新生兒到 1-3 歲幼兒，四個服務陪台灣爸媽走過每個階段',
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
    })
  ],
  base: '/',
  server: {
    port: 5173,
    strictPort: true
  }
})
