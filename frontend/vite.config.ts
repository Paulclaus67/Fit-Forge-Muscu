import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Build optimizations
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Lazy-load @heroicons into separate chunk (not bundled with main)
          if (id.includes('@heroicons')) {
            return 'icons';
          }
          // Keep React ecosystem in vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Keep ChartJS in separate chunk for lazy loading
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'chart-vendor';
          }
        },
      },
    },
    // Augmenter la limite de warning à 600kb
    chunkSizeWarningLimit: 600,
    // Source maps pour le debugging en production (optionnel)
    sourcemap: false,
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['fitforge-muscu.fr', 'www.fitforge-muscu.fr'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'icons/*'],
      manifest: {
        name: 'FitForge - Forjador de Cuerpos',
        short_name: 'FitForge',
        description: 'Gère tes séances de musculation et ton planning, même sans connexion. La meilleure PWA fitness du monde.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#020617',
        theme_color: '#10b981',
        categories: ['fitness', 'health', 'productivity'],
        screenshots: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            form_factor: 'narrow'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide'
          }
        ],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Cache strategy for static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        // Cache runtime data
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300 // 5 minutes for API calls
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true
      }
    }),
  ],
});
