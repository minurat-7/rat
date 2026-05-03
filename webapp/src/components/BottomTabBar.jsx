const TABS = [
  { key: 'day',      label: '일별' },
  { key: 'all',      label: '전체' },
  { key: 'progress', label: '진도' },
  { key: 'month',    label: '달력' },
]

export default function BottomTabBar({ view, onViewChange }) {
  return (
    <nav className="bottom-tab-bar">
      {TABS.map(t => (
        <button
          key={t.key}
          className={`tab-btn${view === t.key ? ' active' : ''}`}
          onClick={() => onViewChange(t.key)}
        >{t.label}</button>
      ))}
    </nav>
  )
}
