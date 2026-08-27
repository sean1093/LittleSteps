import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// 日期邏輯改用本地時區的日曆日（toLocalDateKey），行為因此隨時區而異。
// 這個 app 只服務台灣，把測試釘在 Asia/Taipei，才不會在 UTC 的 CI 上
// 得到與實際使用者不同的結果。必須在載入 defineConfig 之前設定。
process.env.TZ = 'Asia/Taipei';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'src/main.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
