import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'BoursoView',
        short_name: 'BoursoView',
        description: 'Application de suivi de portefeuille et de transactions.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        sourcemap: false
      }
    })
  ],
  base: '/BoursoView/',
  resolve: {
    alias: {
      'MypkgReact': path.resolve(__dirname, '../mypkg_packages_react'),
      'MypkgTypescript': path.resolve(__dirname, '../mypkg_packages_typescript'),
      'Shared': path.resolve(__dirname, '../shared'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname),
        path.resolve(__dirname, '..'),
      ],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react-router-dom'],
  },

  // Permt de chunk les librairie pour eviter le rechargement inutile
  build: {
    chunkSizeWarningLimit: 500, // Augmente légèrement la limite d'avertissement
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 1. Recharts et ses sous-dépendances (D3, lodash)
            if (id.includes('recharts') || id.includes('d3-') || id.includes('lodash')) {
              return 'vendor-recharts';
            }

            // 2. React Query
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }

            // 3. Le routeur ET son moteur sous-jacent (Remix)
            if (id.includes('react-router') || id.includes('@remix-run')) {
              return 'vendor-router';
            }

            // 4. React, React-DOM, et leurs utilitaires critiques (scheduler, use-sync-external-store)
            if (
                id.includes('/node_modules/react/') ||
                id.includes('/node_modules/react-dom/') ||
                id.includes('/node_modules/scheduler/') ||
                id.includes('/node_modules/use-sync-external-store/')
            ) {
              return 'vendor-react';
            }

            // 5. Le reste (Zustand, Tailwind, etc.)
            return 'vendor-core';
          }
        }
      }
    }
  }
})
