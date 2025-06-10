import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  ssr: {
    // Исключаем проблемные модули из SSR
    noExternal: ['vuetify'],
    external: []
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Только для клиентской сборки
          if (typeof process !== 'undefined' && process.env.SSR) {
            return undefined;
          }
          
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue-vendor';
            }
            if (id.includes('vuetify')) {
              return 'ui-vendor';
            }
            if (id.includes('axios')) {
              return 'utils';
            }
          }
        }
      }
    },
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020'
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify']
  }
})
