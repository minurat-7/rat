import { useTasks } from '../hooks/useTasks.js'
import TaskItem from './TaskItem.jsx'

export default function DayView({ dateStr }) {
  const { allTasks, checks, toggleCheck, doneCount, total } = useTasks(dateStr)

  const rollovers = allTasks.filter(t => t.isRollover)
  const todayTasks = allTasks.filter(t => !t.isRollover)

  if (total === 0) {
    return <p className="empty">이 날은 일정이 없습니다.</p>
  }

  return (
    <div className="day-view">
      {rollovers.length > 0 && (
        <section className="section rollover-section">
          <h2 className="section-title">이월 ({rollovers.length})</h2>
          <ul className="task-list">
            {rollovers.map(t => (
              <TaskItem
                key={t.rolloverKey}
                task={t}
                checked={checks[t.rolloverKey]}
                onToggle={toggleCheck}
              />
            ))}
          </ul>
        </section>
      )}

      {todayTasks.length > 0 && (
        <section className="section">
          <h2 className="section-title">오늘 할 일</h2>
          <ul className="task-list">
            {todayTasks.map(t => (
              <TaskItem
                key={t.id}
                task={t}
                checked={checks[t.id]}
                onToggle={toggleCheck}
              />
            ))}
          </ul>
        </section>
      )}

      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: total > 0 ? `${(doneCount / total) * 100}%` : '0%' }}
        />
      </div>
      <p className="progress-text">완료 {doneCount} / {total}</p>
    </div>
  )
}
