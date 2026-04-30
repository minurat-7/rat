import { formatDate, todayStr } from '../data/schedule.js'

export default function DateNav({ dateStr, onPrev, onNext, onToday, onMonthView }) {
  const isToday = dateStr === todayStr()

  return (
    <div className="date-nav">
      <button onClick={onPrev} aria-label="이전 날">‹</button>
      <div className="date-center">
        <span className="date-label">{formatDate(dateStr)}</span>
        {isToday
          ? <span className="today-badge">오늘</span>
          : <button className="today-btn" onClick={onToday}>오늘</button>
        }
      </div>
      <button onClick={onNext} aria-label="다음 날">›</button>
      <button className="view-toggle-btn" onClick={onMonthView} title="월별 보기">⊞</button>
    </div>
  )
}
