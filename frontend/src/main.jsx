import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LeadModalProvider } from '@/context/LeadModalContext'
import { CityProvider } from '@/context/CityContext'
import { LanguageProvider } from '@/context/LanguageContext'
import App from './App.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LeadModalProvider>
          <CityProvider>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </CityProvider>
        </LeadModalProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
