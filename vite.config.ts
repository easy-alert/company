import react from '@vitejs/plugin-react';

import { defineConfig, splitVendorChunkPlugin } from 'vite';

import * as path from 'path';

import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  base: '/',
  publicDir: 'public',
  cacheDir: 'node_modules/.vite',

  server: {
    port: 3000,
  },

  define: {
    _APP_NAME: JSON.stringify(process.env.npm_package_name),
    _APP_VERSION: JSON.stringify(process.env.npm_package_version),
    _APP_BUILD_TIME: JSON.stringify(new Date().toISOString()),
  },

  build: {
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
  },

  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets/'),
      '@components': path.resolve(__dirname, './src/components/'),
      '@contexts': path.resolve(__dirname, './src/contexts/'),
      '@hooks': path.resolve(__dirname, './src/hooks/'),
      '@screens': path.resolve(__dirname, './src/screens/'),
      '@services': path.resolve(__dirname, './src/services/'),
      '@styles': path.resolve(__dirname, './src/styles/'),
      '@types': path.resolve(__dirname, './src/types/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
    },
  },

  plugins: [
    react(),
    tsconfigPaths(),
    splitVendorChunkPlugin(),
    svgr(),
    checker({
      typescript: {
        root: __dirname,
        tsconfigPath: './tsconfig.json',
      },
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
    createHtmlPlugin({
      inject: {
        data: {
          appName: process.env.npm_package_name,
          appVersion: process.env.npm_package_version,
          buildTime: new Date().toISOString(),
        },
      },
    }),
  ],
});
