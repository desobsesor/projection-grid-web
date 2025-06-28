import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      find: '@',
      replacement: '/src'
    },
  },
  worker: {
    format: 'es',
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    outDir: 'dist'
  },
  optimizeDeps: {
    exclude: ['comlink'],
  },
})
