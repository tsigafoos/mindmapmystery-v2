import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '3d-force-graph', 'three-spritetext'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})
