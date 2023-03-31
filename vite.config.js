import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// PWA Config
// requirements: https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
const pwa = env => VitePWA( {
    // https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors.html
    registerType: 'autoUpdate',

    // https://vite-pwa-org.netlify.app/guide/service-worker-precache.html#precache-manifest
    workbox: {
        globPatterns: [ '**/*.{js,css,html,ico,png,svg}' ]
    },

    // https://vite-pwa-org.netlify.app/guide/#configuring-vite-plugin-pwa
    devOptions: {
        enabled: true
    },

    // Assets to include https://vite-pwa-org.netlify.app/guide/static-assets.html#static-assets-handling
    includeAssets: [ 'favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg' ],

    // PWA Manifest
    manifest: {
        name: env.VITE_app_name,
        short_name: env.VITE_short_app_name,
        description: env.VITE_app_description,
        theme_color: '#ffffff',
        icons: [
            {
                src: 'logo192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'logo512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    }

} )

export default defineConfig( ( { command, mode } ) => {
    return {
        build: {
            outDir: 'build'
        },
        plugins: [ react(), pwa( loadEnv( mode, process.cwd(), '' ) ) ],
    }
} )