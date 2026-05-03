import { useState } from 'react'
import { addDays, todayStr } from './data/schedule.js'
import DateNav from './components/DateNav.jsx'
import DayView from './components/DayView.jsx'
import MonthView from './components/MonthView.jsx'
import AllView from './components/AllView.jsx'
import ProgressView from './components/ProgressView.jsx'
import BottomTabBar from './components/BottomTabBar.jsx'

export default function App() {
  const [view, setView] = useState('day')
  const [dateStr, setDateStr] = useState(todayStr)

  return (
    <div className="app">
      <DateNav
        dateStr={dateStr}
        onPrev={() => setDateStr(d => addDays(d, -1))}
        onNext={() => setDateStr(d => addDays(d, 1))}
        onToday={() => setDateStr(todayStr())}
      />
      {view === 'all' ? <AllView />
        : view === 'progress' ? <ProgressView />
        : view === 'month' ? <MonthView onSelectDate={d => { setDateStr(d); setView('day') }} />
        : <DayView dateStr={dateStr} />
      }
      <BottomTabBar view={view} onViewChange={setView} />
    </div>
  )
}
