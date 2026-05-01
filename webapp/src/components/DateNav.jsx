import { formatDate, todayStr } from '../data/schedule.js'

export default function DateNav({ dateStr, onPrev, onNext, onToday, onMonthView, view, onViewChange }) {
  const isToday = dateStr === todayStr()
  const inAll = view === 'all'
  const inProgress = view === 'progress'
  const noNav = inAll || inProgress

  const centerLabel = inAll ? '전체 할 일' : inProgress ? '진도 요약' : formatDate(dateStr)

  return (
    <div className="date-nav">
      <button onClick={onPrev} aria-label="이전 날" disabled={noNav}>‹</button>
      <div className="date-center">
        <span className="date-label">{centerLabel}</span>
        {!noNav && (isToday
          ? <span className="today-badge">오늘</span>
          : <button className="today-btn" onClick={onToday}>오늘</button>
        )}
      </div>
      <button onClick={onNext} aria-label="다음 날" disabled={noNav}>›</button>
      <button
        className={`view-toggle-btn${inAll ? ' active' : ''}`}
        onClick={() => onViewChange(inAll ? 'day' : 'all')}
        title="전체 할 일"
      >☰</button>
      <button
        className={`view-toggle-btn${inProgress ? ' active' : ''}`}
        onClick={() => onViewChange(inProgress ? 'day' : 'progress')}
        title="진도 요약"
      >%</button>
      <button className="view-toggle-btn" onClick={onMonthView} title="월별 보기">⊞</button>
    </div>
  )
}
