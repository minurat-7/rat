import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { runRollover } from './lib/rollover.js'
import './App.css'
import App from './App.jsx'

// Run before first render so both DayView and MonthView see rolled-over data
runRollover()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
