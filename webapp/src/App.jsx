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

  const dayPanel = (
    <div className="day-panel">
      <DateNav
        dateStr={dateStr}
        onPrev={() => setDateStr(d => addDays(d, -1))}
        onNext={() => setDateStr(d => addDays(d, 1))}
        onToday={() => setDateStr(todayStr())}
      />
      <DayView dateStr={dateStr} />
    </div>
  )

  const monthPanel = (
    <div className="month-panel">
      <MonthView onSelectDate={jumpToDay} />
    </div>
  )

  return (
    <div className="app">
      {/* Mobile: tab switcher */}
      <div className="tabs">
        <button className={`tab${view === 'day' ? ' active' : ''}`} onClick={() => setView('day')}>일별</button>
        <button className={`tab${view === 'month' ? ' active' : ''}`} onClick={() => setView('month')}>월별</button>
      </div>

      {/* Mobile: show active panel only; iPad: show both side by side */}
      <div className="main-layout">
        <div className={`panel-wrap day-wrap${view === 'day' ? ' active' : ''}`}>
          {dayPanel}
        </div>
        <div className={`panel-wrap month-wrap${view === 'month' ? ' active' : ''}`}>
          {monthPanel}
        </div>
      </div>
    </div>
  )
}
