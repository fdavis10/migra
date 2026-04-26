import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LeadModalProvider } from '@/context/LeadModalContext'
import App from './App.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LeadModalProvider>
          <App />
        </LeadModalProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
