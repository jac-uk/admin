import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import inject from '@rollup/plugin-inject';
const path = require('path');

// Vite does not automatically polyfill Node.js modules
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig({
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify',
      process: 'process/browser',
      buffer: 'buffer',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],  // Remove this eventually
  },
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/_shared.scss";
        `,
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        inject({ Buffer: ['buffer', 'Buffer'], process: 'process' }),
        rollupNodePolyFill(),
      ],
    },
  },
  server: {
    port: 8080,
  },
});
