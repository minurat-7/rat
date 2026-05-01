import { useState } from 'react'
import { useTasks } from '../hooks/useTasks.js'
import TaskItem from './TaskItem.jsx'

function groupByDate(rollovers) {
  const map = {}
  for (const t of rollovers) {
    const d = t.sourceDate
    if (!map[d]) map[d] = []
    map[d].push(t)
  }
  // Sorted recent first
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
}

function fmtSource(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function RolloverGroup({ dateStr, tasks, checks, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const done = tasks.filter(t => checks[t.rolloverKey]).length

  return (
    <div className="ro-group">
      <button className="ro-group-header" onClick={() => setOpen(o => !o)}>
        <span className="ro-group-date">{fmtSource(dateStr)}</span>
        <span className="ro-group-count">{done}/{tasks.length}</span>
        <span className="ro-group-arrow">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <ul className="task-list ro-group-list">
          {tasks.map(t => (
            <TaskItem
              key={t.rolloverKey}
              task={t}
              checked={checks[t.rolloverKey]}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default function DayView({ dateStr }) {
  const { allTasks, checks, toggleCheck, doneCount, total } = useTasks(dateStr)
  const [roOpen, setRoOpen] = useState(true)

  const rollovers = allTasks.filter(t => t.isRollover)
  const todayTasks = allTasks.filter(t => !t.isRollover)
  const roGroups = groupByDate(rollovers)
  const roDone = rollovers.filter(t => checks[t.rolloverKey]).length

  if (total === 0) {
    return <p className="empty">이 날은 일정이 없습니다.</p>
  }

  return (
    <div className="day-view">
      {/* 오늘 할 일 — 항상 맨 위 */}
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

      {/* 이월 — 날짜별 그룹, 전체 접기/펼치기 */}
      {rollovers.length > 0 && (
        <section className="section rollover-section">
          <button className="ro-master-header" onClick={() => setRoOpen(o => !o)}>
            <h2 className="section-title" style={{ margin: 0 }}>
              이월 ({roDone}/{rollovers.length})
            </h2>
            <span className="ro-group-arrow">{roOpen ? '▾' : '▸'}</span>
          </button>
          {roOpen && (
            <div className="ro-groups">
              {roGroups.map(([date, tasks], i) => (
                <RolloverGroup
                  key={date}
                  dateStr={date}
                  tasks={tasks}
                  checks={checks}
                  onToggle={toggleCheck}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          )}
        </section>
      )}

      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${(doneCount / total) * 100}%` }} />
      </div>
      <p className="progress-text">완료 {doneCount} / {total}</p>
    </div>
  )
}
