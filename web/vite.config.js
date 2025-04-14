import { defineConfig } from 'vite'
import { resolve } from 'path'
import AlpineVitePlugin from './alpine-vite-plugin.js'

export default defineConfig({
    root: './src', // Set the root directory to src
    build: {
      outDir: './dist', // Output to the dist folder in the parent directory
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/index.html'),
        },
      },
    },

    // Make sure static assets are correctly served
    plugins: [
        AlpineVitePlugin()
    ]
})