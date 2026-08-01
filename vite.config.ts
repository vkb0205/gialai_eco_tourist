import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: {
          name: 'Gia Lai Eco Tourist',
          short_name: 'Gia Lai Eco',
          description: 'Slow, local eco tours through Gia Lai’s wild plateau.',
          lang: 'vi',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#f3f6ef',
          theme_color: '#203828',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icon-512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/(images\.unsplash\.com|i\.pravatar\.cc)\//i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'remote-images',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\//i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-font-stylesheets',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\//i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-font-files',
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
      }),
    ],
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
