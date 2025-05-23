import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Прокси для API запросов
      '/api': {
        target: 'https://burspb.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
