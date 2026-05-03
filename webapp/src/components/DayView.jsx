import { useState } from 'react'
import { useTasks } from '../hooks/useTasks.js'
import { useScores, SCOREABLE } from '../hooks/useScores.js'
import TaskItem from './TaskItem.jsx'

const TODAY_GROUPS = [
  { key: 'tball',   label: 'T.BALL' },
  { key: 'lecture', label: '인강' },
  { key: 'fe',      label: 'F&E' },
  { key: 'event',   label: '모의고사' },
]

function daysAgo(sourceDate) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Math.floor((today - new Date(sourceDate + 'T00:00:00')) / 86400000)
}

function rolloverUrgencyClass(sourceDate) {
  const age = daysAgo(sourceDate)
  if (age >= 6) return ' rollover-critical'
  if (age >= 3) return ' rollover-urgent'
  return ''
}

function groupByDate(rollovers) {
  const map = {}
  for (const t of rollovers) {
    const d = t.sourceDate
    if (!map[d]) map[d] = []
    map[d].push(t)
  }
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
}

function fmtSource(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function RolloverGroup({ dateStr, tasks, checks, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const done = tasks.filter(t => checks[t.rolloverKey]).length
  const age = daysAgo(dateStr)
  const ageLabel = age === 1 ? '1일 전' : `${age}일 전`

  return (
    <div className={`ro-group${rolloverUrgencyClass(dateStr)}`}>
      <button className="ro-group-header" onClick={() => setOpen(o => !o)}>
        <span className="ro-group-date">{fmtSource(dateStr)}</span>
        <span className="ro-group-age">{ageLabel}</span>
        <span className="ro-group-count">{done}/{tasks.length}</span>
        <span className="ro-group-arrow">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <ul className="task-list ro-group-list">
          {tasks.map(t => (
            <TaskItem key={t.rolloverKey} task={t} checked={checks[t.rolloverKey]} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default function DayView({ dateStr }) {
  const { todayTasks, rollovers, checks, toggleCheck, doneCount, total } = useTasks(dateStr)
  const { scores, setScore } = useScores()
  const [roOpen, setRoOpen] = useState(true)

  const dayScores = scores[dateStr] || {}
  const roGroups = groupByDate(rollovers)
  const roDone = rollovers.filter(t => checks[t.rolloverKey]).length

  if (total === 0) return <p className="empty">이 날은 일정이 없습니다.</p>

  const tasksByType = {}
  for (const t of todayTasks) {
    if (!tasksByType[t.type]) tasksByType[t.type] = []
    tasksByType[t.type].push(t)
  }

  const activeGroups = TODAY_GROUPS.filter(g => tasksByType[g.key]?.length)

  return (
    <div className="day-view">
      {activeGroups.map(g => {
        const tasks = tasksByType[g.key]
        const groupDone = tasks.filter(t => checks[t.id]).length
        return (
          <section key={g.key} className="section">
            <h2 className="section-title">
              {g.label}
              <span className="section-count"> {groupDone}/{tasks.length}</span>
            </h2>
            <ul className="task-list">
              {tasks.map(t => (
                <TaskItem
                  key={t.id}
                  task={t}
                  checked={checks[t.id]}
                  onToggle={toggleCheck}
                  dayScores={SCOREABLE.has(t.id) ? dayScores : undefined}
                  onScoreChange={SCOREABLE.has(t.id) ? (scoreKey, v) => setScore(dateStr, scoreKey, v) : undefined}
                />
              ))}
            </ul>
          </section>
        )
      })}

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
