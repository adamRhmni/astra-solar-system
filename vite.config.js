import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icon.png',
        'favicon.ico',
        'apple-touch-icon.png',
        'textures/**/*' // covers all images
      ],
      manifest: {
        name: 'Astra - Solar System',
        short_name: 'Astra',
        description: 'Explore the Solar System in 3D with Astra by Adam Rhmni',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#9370db',
        lang: 'en',
        orientation: 'portrait',
        categories: ['education', 'science', 'space'],
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50MB
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          }
        ]
      }
    })
  ]
});