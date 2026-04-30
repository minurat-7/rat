import { useState } from 'react'
import { addDays, todayStr } from './data/schedule.js'
import DateNav from './components/DateNav.jsx'
import DayView from './components/DayView.jsx'
import MonthView from './components/MonthView.jsx'

export default function App() {
  const [view, setView] = useState('day')
  const [dateStr, setDateStr] = useState(todayStr)

  function jumpToDay(d) {
    setDateStr(d)
    setView('day')
  }

  return (
    <div className="app">
      <div className="tabs">
        <button
          className={`tab${view === 'day' ? ' active' : ''}`}
          onClick={() => setView('day')}
        >일별</button>
        <button
          className={`tab${view === 'month' ? ' active' : ''}`}
          onClick={() => setView('month')}
        >월별</button>
      </div>

      {view === 'day' ? (
        <>
          <DateNav
            dateStr={dateStr}
            onPrev={() => setDateStr(d => addDays(d, -1))}
            onNext={() => setDateStr(d => addDays(d, 1))}
          />
          <DayView dateStr={dateStr} />
        </>
      ) : (
        <MonthView onSelectDate={jumpToDay} />
      )}
    </div>
  )
}
