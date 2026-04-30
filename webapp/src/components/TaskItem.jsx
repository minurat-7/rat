export default function TaskItem({ task, checked, onToggle }) {
  const key = task.isRollover ? task.rolloverKey : task.id

  return (
    <li className={`task-item${checked ? ' done' : ''}${task.isRollover ? ' rollover' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={!!checked}
          onChange={() => onToggle(key)}
        />
        <span className="task-text">{task.text}</span>
        {task.isRollover && (
          <span className="rollover-badge">↩ {task.sourceDate.slice(5).replace('-', '/')} 이월</span>
        )}
      </label>
    </li>
  )
}
