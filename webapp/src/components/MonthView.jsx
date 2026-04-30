import { useState } from 'react'
import { getScheduledTasks, todayStr } from '../data/schedule.js'

const LS_KEY = 'planner-2026'

function loadData() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || { checks: {}, rollovers: {} } }
  catch { return { checks: {}, rollovers: {} } }
}

function getDayStats(dateStr, data) {
  const scheduled = getScheduledTasks(dateStr)
  const rollovers = data.rollovers[dateStr] || []
  const checks = data.checks[dateStr] || {}
  const allKeys = [
    ...scheduled.map(t => t.id),
    ...rollovers.map(t => `ro_${t.sourceDate}_${t.id}`),
  ]
  const total = allKeys.length
  const done = allKeys.filter(k => checks[k]).length
  return { total, done, rolloverCount: rollovers.length }
}

function getCalendarDays(year, month) {
  const firstDow = new Date(year, month, 1).getDay()
  const days = []
  for (let i = firstDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ dateStr: d.toISOString().slice(0, 10), inMonth: false })
  }
  const last = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= last; i++) {
    const d = new Date(year, month, i)
    days.push({ dateStr: d.toISOString().slice(0, 10), inMonth: true })
  }
  while (days.length % 7 !== 0) {
    const prev = new Date(days[days.length - 1].dateStr + 'T00:00:00')
    prev.setDate(prev.getDate() + 1)
    days.push({ dateStr: prev.toISOString().slice(0, 10), inMonth: false })
  }
  return days
}

function dot(done, total) {
  if (total === 0) return null
  if (done === total) return '●'
  if (done > 0) return '◐'
  return '○'
}

const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export default function MonthView({ onSelectDate }) {
  const today = todayStr()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())

  const data = loadData()
  const days = getCalendarDays(year, month)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="month-view">
      <div className="month-nav">
        <button onClick={prevMonth}>‹</button>
        <span className="month-label">{year}년 {month + 1}월</span>
        <button onClick={nextMonth}>›</button>
      </div>

      <div className="cal-grid">
        {DOW_LABELS.map((d, i) => (
          <div key={d} className={`cal-dow${i === 0 ? ' sun' : i === 6 ? ' sat' : ''}`}>{d}</div>
        ))}
        {days.map(({ dateStr, inMonth }) => {
          const { total, done, rolloverCount } = getDayStats(dateStr, data)
          const dayNum = parseInt(dateStr.slice(8), 10)
          const dow = new Date(dateStr + 'T00:00:00').getDay()
          const isToday = dateStr === today
          const d = dot(done, total)

          return (
            <div
              key={dateStr}
              className={[
                'cal-cell',
                !inMonth ? 'out' : '',
                isToday ? 'today' : '',
                total === 0 ? 'no-task' : '',
              ].join(' ')}
              onClick={() => inMonth && onSelectDate(dateStr)}
            >
              {rolloverCount > 0 && inMonth && (
                <span className="ro-badge">{rolloverCount}</span>
              )}
              <span className={`cal-day-num${dow === 0 ? ' sun' : dow === 6 ? ' sat' : ''}`}>
                {dayNum}
              </span>
              {inMonth && d && (
                <span className={`cal-dot${done === total && total > 0 ? ' full' : ''}`}>{d}</span>
              )}
              {inMonth && total > 0 && (
                <span className="cal-count">{done}/{total}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
