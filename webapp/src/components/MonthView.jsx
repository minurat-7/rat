import { useState } from 'react'
import { getScheduledTasks, todayStr } from '../data/schedule.js'
import { load } from '../lib/rollover.js'

function localDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
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
  // All dates as local YYYY-MM-DD strings — no toISOString() to avoid UTC offset bug
  const firstDow = new Date(year, month, 1).getDay() // 0=Sun
  const days = []

  // Fill from previous month
  for (let i = firstDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)  // day 0 = last day of prev month
    days.push({ dateStr: localDateStr(d.getFullYear(), d.getMonth(), d.getDate()), inMonth: false })
  }

  // Current month days
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ dateStr: localDateStr(year, month, i), inMonth: true })
  }

  // Fill trailing days to complete last row
  let fill = 1
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, fill++)
    days.push({ dateStr: localDateStr(d.getFullYear(), d.getMonth(), d.getDate()), inMonth: false })
  }

  return days
}

const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export default function MonthView({ onSelectDate, onBack }) {
  const today = todayStr()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())

  const data = load()
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
        <button className="view-toggle-btn" onClick={onBack} title="일별 보기">≡</button>
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
          const isPast = inMonth && dateStr < today
          const pct = total > 0 ? Math.round((done / total) * 100) : null

          return (
            <div
              key={dateStr}
              className={[
                'cal-cell',
                !inMonth ? 'out' : '',
                isToday ? 'today' : '',
                isPast ? 'past' : '',
                total === 0 ? 'no-task' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => inMonth && onSelectDate(dateStr)}
            >
              {rolloverCount > 0 && inMonth && (
                <span className="ro-badge">{rolloverCount}</span>
              )}
              <span className={`cal-day-num${dow === 0 ? ' sun' : dow === 6 ? ' sat' : ''}`}>
                {dayNum}
              </span>
              {inMonth && total > 0 && (
                <span className="cal-count">{done}/{total}</span>
              )}
              {inMonth && pct !== null && (
                <div className="cal-bar-wrap">
                  <div className="cal-bar-fill" style={{ width: `${pct}%`, opacity: pct === 0 ? 0.25 : 1 }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
