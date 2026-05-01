import { useTasks } from '../hooks/useTasks.js'
import { todayStr } from '../data/schedule.js'
import TaskItem from './TaskItem.jsx'

export default function AllView() {
  const dateStr = todayStr()
  const { allTasks, checks, toggleCheck, doneCount, total } = useTasks(dateStr)

  const pending = allTasks.filter(t => !checks[t.isRollover ? t.rolloverKey : t.id])
  const done    = allTasks.filter(t =>  checks[t.isRollover ? t.rolloverKey : t.id])

  return (
    <div className="day-view">
      {pending.length > 0 && (
        <section className="section">
          <h2 className="section-title">남은 할 일 ({pending.length})</h2>
          <ul className="task-list">
            {pending.map(t => (
              <TaskItem
                key={t.isRollover ? t.rolloverKey : t.id}
                task={t}
                checked={false}
                onToggle={toggleCheck}
              />
            ))}
          </ul>
        </section>
      )}
      {done.length > 0 && (
        <section className="section">
          <h2 className="section-title">완료 ({done.length})</h2>
          <ul className="task-list">
            {done.map(t => (
              <TaskItem
                key={t.isRollover ? t.rolloverKey : t.id}
                task={t}
                checked={true}
                onToggle={toggleCheck}
              />
            ))}
          </ul>
        </section>
      )}
      {total === 0 && <p className="empty">오늘 할 일이 없습니다.</p>}
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }} />
      </div>
      <p className="progress-text">완료 {doneCount} / {total}</p>
    </div>
  )
}
