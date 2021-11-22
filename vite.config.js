import { defineConfig } from 'vite'
import { resolve as rel } from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '~': rel('./src'),
    },
  },
})
