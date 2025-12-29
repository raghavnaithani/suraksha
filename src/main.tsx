import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// styles live in /styles — import the canonical files
import '../styles/index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@lib/auth-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service worker registered.', reg)
    }).catch(err => {
      console.warn('Service worker registration failed:', err)
    })
  })
}