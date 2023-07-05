import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import inject from '@rollup/plugin-inject';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify',
      //os: 'os-browserify/browser',
      //util: 'util',
      process: 'process/browser',
      buffer: 'buffer',
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],  // Remove this eventually
  },
  plugins: [vue()],
  build: {
    rollupOptions: {
        plugins: [inject({ Buffer: ['Buffer', 'Buffer'], process: 'process' })],
    },
  },
  server: {
    port: 8080,
  },
});
