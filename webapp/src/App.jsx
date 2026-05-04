import { useState, useRef } from 'react'
import { addDays, todayStr } from './data/schedule.js'
import DateNav from './components/DateNav.jsx'
import DayView from './components/DayView.jsx'
import MonthView from './components/MonthView.jsx'
import AllView from './components/AllView.jsx'
import ProgressView from './components/ProgressView.jsx'
import BottomTabBar from './components/BottomTabBar.jsx'

const TAB_ORDER = ['day', 'all', 'progress', 'month']

export default function App() {
  const [view, setView] = useState('day')
  const [dateStr, setDateStr] = useState(todayStr)
  const touchStart = useRef(null)
  const isScrolling = useRef(false)

  function handleTouchStart(e) {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    isScrolling.current = false
  }

  function handleTouchMove(e) {
    if (!touchStart.current) return
    const dy = Math.abs(e.touches[0].clientY - touchStart.current.y)
    if (dy > 8) isScrolling.current = true
  }

  function handleTouchEnd(e) {
    if (!touchStart.current || isScrolling.current) {
      touchStart.current = null
      return
    }
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    const idx = TAB_ORDER.indexOf(view)
    if (dx < 0 && idx < TAB_ORDER.length - 1) setView(TAB_ORDER[idx + 1])
    if (dx > 0 && idx > 0) setView(TAB_ORDER[idx - 1])
  }

  return (
    <div className="app">
      <DateNav
        dateStr={dateStr}
        onPrev={() => setDateStr(d => addDays(d, -1))}
        onNext={() => setDateStr(d => addDays(d, 1))}
        onToday={() => setDateStr(todayStr())}
      />
      <div
        className="view-body"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {view === 'all' ? <AllView />
          : view === 'progress' ? <ProgressView />
          : view === 'month' ? <MonthView onSelectDate={d => { setDateStr(d); setView('day') }} />
          : <DayView dateStr={dateStr} />
        }
      </div>
      <BottomTabBar view={view} onViewChange={setView} />
    </div>
  )
}
