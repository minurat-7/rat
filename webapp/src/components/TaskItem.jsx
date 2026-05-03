import { useState } from 'react'
import { SCOREABLE, SCORE_SUBJECTS } from '../hooks/useScores.js'

const TYPE_DOT = {
  tball:   { color: '#16a34a' },
  lecture: { color: '#9333ea' },
  fe:      { color: '#ea580c' },
  event:   { color: '#dc2626' },
}

function ScoreInput({ scoreKey, score, onScoreChange }) {
  const [val, setVal] = useState(score != null ? String(score) : '')

  const commit = (raw) => {
    const n = Number(raw)
    if (raw === '' || isNaN(n)) onScoreChange(scoreKey, '')
    else onScoreChange(scoreKey, String(Math.max(0, Math.min(100, n))))
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
      className="score-input-sm"
    />
  )
}

export default function TaskItem({ task, checked, onToggle, dayScores, onScoreChange }) {
  const key = task.isRollover ? task.rolloverKey : task.id
  const dot = TYPE_DOT[task.type]
  const isTball = task.type === 'tball' && !task.isRollover && !!task.range
  const subjects = !task.isRollover && SCOREABLE.has(task.id) && onScoreChange
    ? SCORE_SUBJECTS[task.id]
    : null

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
      {subjects && (
        <div className="score-subjects">
          {subjects.map(sub => {
            const scoreKey = `${task.id}_${sub.key}`
            return (
              <div key={sub.key} className="score-subject-item">
                <span className="score-subject-label">{sub.label}</span>
                <ScoreInput
                  key={scoreKey}
                  scoreKey={scoreKey}
                  score={dayScores?.[scoreKey]}
                  onScoreChange={onScoreChange}
                />
              </div>
            )
          })}
        </div>
      )}
    </li>
  )
}
