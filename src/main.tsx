import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SettingsProvider>
    </AuthProvider>
  </React.StrictMode>,
)