import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const buildDate = new Date();

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      treeshake: 'smallest'
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    "__LAST_UPDATE__": `"${buildDate.getUTCFullYear()}-${buildDate.getUTCMonth()+1}-${buildDate.getUTCDate()}"`
  },
  base: "/"
})
