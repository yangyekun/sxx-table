import { defineConfig } from 'vite'
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue',],
    }),
    Components({
      resolvers: [
        PrimeVueResolver(),
        NaiveUiResolver()
      ]
    }),
    UnoCSS({
      configFile: './uno.config.js'
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 12300
  },
  base: './',
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': resolve(__dirname, 'src')
    }
  },
})
