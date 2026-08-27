import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'LittleSteps - 育兒里程碑追蹤',
        short_name: 'LittleSteps',
        description: '協助新手父母輕鬆掌握小孩各階段的發展重點',
        theme_color: '#F472B6',
        background_color: '#FAFAF9',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
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
