import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import { ThemeProvider } from './theme/ThemeProvider'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
