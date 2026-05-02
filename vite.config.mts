import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Layouts from 'vite-plugin-vue-layouts-next'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Fonts from 'unplugin-fonts/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    Layouts(),
    AutoImport({
      imports: ['vue', { pinia: ['defineStore', 'storeToRefs'] }],
      dts: 'src/auto-imports.d.ts',
      eslintrc: { enabled: true },
      vueTemplate: true,
    }),
    Components({ dts: 'src/components.d.ts' }),
    Vue({ template: { transformAssetUrls } }),
    Vuetify({
      autoImport: true,
      styles: { configFile: 'src/styles/settings.scss' },
    }),
    Fonts({
      fontsource: {
        families: [{ name: 'Roboto', weights: [100, 300, 400, 500, 700, 900], styles: ['normal', 'italic'] }],
      },
    }),
  ],

  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },

  optimizeDeps: {
    include: ['vue-router'], // فقط Vue Router استاندارد
  },

  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  server: { port: 3001 },

  define: { 'process.env': {} },

  css: {
    preprocessorOptions: {
      sass: { api: 'modern-compiler' },
      scss: { api: 'modern-compiler' },
    },
  },
})
