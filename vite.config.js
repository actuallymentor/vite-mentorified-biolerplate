import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

// PWA Config
// requirements: https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
const pwa = env => VitePWA( {

    // https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors.html
    // remember to (in index.jsx) add import { registerSW } from 'virtual:pwa-register' \n registerSW({ immediate: true })
    registerType: 'autoUpdate',

    // https://vite-pwa-org.netlify.app/guide/service-worker-precache.html#precache-manifest
    workbox: {
        globPatterns: [ '**/*.{js,css,html,ico,png,svg,jsx}' ],
        sourcemap: true,
        skipWaiting: true,
    },

    // https://vite-pwa-org.netlify.app/guide/#configuring-vite-plugin-pwa
    devOptions: {
        enabled: true,
        type: 'module'
    },

    // Assets to include (that are not under `manifest`) https://vite-pwa-org.netlify.app/guide/static-assets.html#static-assets-handling
    // for favicon: https://realfavicongenerator.net/
    includeAssets: [ 'favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg' ],

    // PWA Manifest
    manifest: {
        name: env.VITE_app_name,
        short_name: env.VITE_short_app_name,
        description: env.VITE_app_description,
        theme_color: env.VITE_theme_base_color,
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
        server: { https: true },
        plugins: [ mkcert(), react(), svgr(), /* pwa( loadEnv( mode, process.cwd(), '' ) ) */ ],
    }
} )