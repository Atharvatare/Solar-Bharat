import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },

  // ============================================
  // Production Build Optimization
  // ============================================
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Output directory
    outDir: 'dist',

    // Disable source maps in production for security
    sourcemap: false,

    // Chunk size warning threshold (500KB)
    chunkSizeWarningLimit: 500,

    // Use esbuild for minification (built-in, fastest)
    minify: 'esbuild',

    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks — separate large dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'react-icons', 'react-hot-toast'],
          'chart-vendor': ['recharts'],
        },
      },
    },

    // CSS code splitting
    cssCodeSplit: true,

    // Asset inlining threshold (4KB)
    assetsInlineLimit: 4096,
  },

  // ============================================
  // Optimization — pre-bundle heavy deps
  // ============================================
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'axios'],
  },

  // ============================================
  // CSS Processing
  // ============================================
  css: {
    devSourcemap: true,
  },
});
