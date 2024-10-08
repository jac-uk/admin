import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import inject from '@rollup/plugin-inject';
const path = require('path');

// Vite does not automatically polyfill Node.js modules
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

const nodeModuleDir = path.resolve(__dirname, './node_modules');

export default defineConfig({
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
    'import.meta.env.PACKAGE_NAME': JSON.stringify(process.env.npm_package_name),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: `${nodeModuleDir}/stream-browserify`,
      process: `${nodeModuleDir}/process/browser`,
      buffer: `${nodeModuleDir}/buffer`,
      events: `${nodeModuleDir}/rollup-plugin-node-polyfills/polyfills/events`,
      util: `${nodeModuleDir}/rollup-plugin-node-polyfills/polyfills/util`,
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],  // Remove this eventually
  },
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // api: 'modern-compiler',
        additionalData: `
          @import "@/styles/_shared.scss";
        `,
        quietDeps: true,
        silenceDeprecations: ['legacy-js-api'],
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
    port: 8084,
  },
});
