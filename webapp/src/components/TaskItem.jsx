import { useState } from 'react'
import { SCOREABLE } from '../hooks/useScores.js'

const TYPE_DOT = {
  tball:   { color: '#16a34a' },
  lecture: { color: '#9333ea' },
  fe:      { color: '#ea580c' },
  event:   { color: '#dc2626' },
}

function ScoreInput({ score, onScoreChange }) {
  const [val, setVal] = useState(score != null ? String(score) : '')

  const commit = (raw) => {
    const n = Number(raw)
    if (raw === '' || isNaN(n)) onScoreChange('')
    else onScoreChange(String(Math.max(0, Math.min(100, n))))
  }

  return (
    <input
      type="number"
      min="0"
      max="100"
      value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={e => commit(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && commit(val)}
      placeholder="–"
      className="score-input"
    />
  )
}

export default function TaskItem({ task, checked, onToggle, score, onScoreChange }) {
  const key = task.isRollover ? task.rolloverKey : task.id
  const dot = TYPE_DOT[task.type]
  const isTball = task.type === 'tball' && !task.isRollover && !!task.range
  const isScoreable = !task.isRollover && SCOREABLE.has(task.id) && !!onScoreChange

  return (
    <li className={`task-item${checked ? ' done' : ''}${task.isRollover ? ' rollover' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={!!checked}
          onChange={() => onToggle(key, isTball ? task.id : null)}
        />
        {dot && (
          <span className="type-dot" style={{ background: checked ? '#ccc' : dot.color }} />
        )}
        <span className="task-col">
          <span className="task-text">{task.text}</span>
          {task.range && (
            <span className={`task-range${checked ? ' done' : ''}`}>{task.range}</span>
          )}
        </span>
        {task.isRollover && (
          <span className="rollover-badge">📌 {task.sourceDate.slice(5).replace('-', '/')}</span>
        )}
      </label>
      {isScoreable && (
        <div className="score-row">
          <span className="score-label">점수</span>
          <ScoreInput key={task.id} score={score} onScoreChange={onScoreChange} />
          <span className="score-unit">/ 100</span>
        </div>
      )}
    </li>
  )
}
