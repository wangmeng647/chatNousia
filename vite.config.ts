import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3030,
    proxy: {
      // '/test': 'http://127.0.0.1:6060'
      '/api': {
        target: 'http://127.0.0.1:6060/',
        changeOrigin: false,
        rewrite: path => path.replace('/api/', '/'),
      },
    },
  },
})
