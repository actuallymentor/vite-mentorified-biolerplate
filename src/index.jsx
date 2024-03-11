import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// PWA service worker
// import { registerSW } from 'virtual:pwa-register'
// registerSW( { immediate: true } )

const root = ReactDOM.createRoot( document.getElementById( 'root' ) )
root.render( <App /> )