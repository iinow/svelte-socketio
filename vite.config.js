import { defineConfig } from 'vite'
import { resolve as rel } from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import yaml from '@rollup/plugin-yaml'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), yaml()],
  resolve: {
    alias: {
      '~': rel('./src'),
      '~env': rel('./env'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
