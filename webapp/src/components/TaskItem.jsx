const TYPE_DOT = {
  tball:   { color: '#16a34a' },
  lecture: { color: '#9333ea' },
  fe:      { color: '#ea580c' },
  event:   { color: '#dc2626' },
}

export default function TaskItem({ task, checked, onToggle }) {
  const key = task.isRollover ? task.rolloverKey : task.id
  const dot = TYPE_DOT[task.type]
  const isTball = task.type === 'tball' && !task.isRollover && !!task.range

  return (
    <li className={`task-item${checked ? ' done' : ''}${task.isRollover ? ' rollover' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={!!checked}
          onChange={() => onToggle(key, isTball ? task.id : null)}
        />
        {dot && (
          <span
            className="type-dot"
            style={{ background: checked ? '#ccc' : dot.color }}
          />
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
    </li>
  )
}
