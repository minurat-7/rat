import { useTasks } from '../hooks/useTasks.js'
import { todayStr } from '../data/schedule.js'

const TBALL_ORDER = ['tball_el', 'tball_tri', 'tball_seq', 'tball_sum', 'tball_dif', 'tball_int']
const TBALL_LABELS = {
  tball_el:  '지수로그', tball_tri: '삼각함수', tball_seq: '수열',
  tball_sum: '함극',     tball_dif: '미분',      tball_int: '적분',
}

export default function AllView() {
  const { allTasks, checks, toggleCheck } = useTasks(todayStr())

  const mathTasks = allTasks.filter(t => t.type === 'tball' || t.type === 'fe')
  const pending   = mathTasks.filter(t => !checks[t.isRollover ? t.rolloverKey : t.id])

  // Group tball by subject, preserving source-date order within each group
  const groups = {}
  for (const t of pending.filter(t => t.type === 'tball')) {
    if (!groups[t.id]) groups[t.id] = []
    groups[t.id].push(t)
  }

  const fePending = pending.filter(t => t.type === 'fe')
  const hasPending = pending.length > 0

  return (
    <div className="all-view">
      {TBALL_ORDER.map(id => {
        const tasks = groups[id]
        if (!tasks?.length) return null
        return (
          <div key={id} className="all-subject">
            <div className="all-subject-label">{TBALL_LABELS[id]}</div>
            <div className="all-sessions">
              {tasks.map(t => {
                const key = t.isRollover ? t.rolloverKey : t.id
                return (
                  <label key={key} className="all-row">
                    <input type="checkbox" checked={!!checks[key]} onChange={() => toggleCheck(key)} />
                    <span className="all-range">{t.range || '-'}</span>
                    {t.isRollover && (
                      <span className="all-date">{t.sourceDate.slice(5).replace('-', '/')}</span>
                    )}
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}

      {fePending.length > 0 && (
        <div className="all-subject">
          <div className="all-subject-label">F&amp;E</div>
          <div className="all-sessions">
            {fePending.map(t => (
              <label key={t.id} className="all-row">
                <input type="checkbox" checked={!!checks[t.id]} onChange={() => toggleCheck(t.id)} />
                <span className="all-range">{t.range || t.text}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {!hasPending && <p className="empty">밀린 문제 없음</p>}
    </div>
  )
}
