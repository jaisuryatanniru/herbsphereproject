import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'global': 'window', // This is required to define `global` as `window` for the browser environment
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'window', // Define global as window for esbuild to handle this properly
      },
    },
  },
})
