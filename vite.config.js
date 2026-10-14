import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // =====================================================
  // 开发环境接口代理（Apifox Mock）
  // =====================================================
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4523',
        changeOrigin: true,
        rewrite: (path) => `/m1/8921695-8722719-default${path}`,
      },
    },
  },
})
