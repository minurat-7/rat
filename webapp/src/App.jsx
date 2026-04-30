import { useState } from 'react'
import { addDays, todayStr } from './data/schedule.js'
import DateNav from './components/DateNav.jsx'
import DayView from './components/DayView.jsx'

export default function App() {
  const [dateStr, setDateStr] = useState(todayStr)

  return (
    <div className="app">
      <DateNav
        dateStr={dateStr}
        onPrev={() => setDateStr(d => addDays(d, -1))}
        onNext={() => setDateStr(d => addDays(d, 1))}
      />
      <DayView dateStr={dateStr} />
    </div>
  )
}
