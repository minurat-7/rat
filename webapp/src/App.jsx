import { useState } from 'react'
import { addDays, todayStr } from './data/schedule.js'
import DateNav from './components/DateNav.jsx'
import DayView from './components/DayView.jsx'
import MonthView from './components/MonthView.jsx'
import AllView from './components/AllView.jsx'

export default function App() {
  const [view, setView] = useState('day')
  const [dateStr, setDateStr] = useState(todayStr)

  if (view === 'month') {
    return (
      <div className="app">
        <MonthView
          onSelectDate={d => { setDateStr(d); setView('day') }}
          onBack={() => setView('day')}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <DateNav
        dateStr={dateStr}
        onPrev={() => setDateStr(d => addDays(d, -1))}
        onNext={() => setDateStr(d => addDays(d, 1))}
        onToday={() => setDateStr(todayStr())}
        onMonthView={() => setView('month')}
        view={view}
        onViewChange={setView}
      />
      {view === 'all'
        ? <AllView />
        : <DayView dateStr={dateStr} />
      }
    </div>
  )
}
