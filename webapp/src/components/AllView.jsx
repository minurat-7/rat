import { useTasks } from '../hooks/useTasks.js'
import { todayStr } from '../data/schedule.js'

const TBALL_ORDER = ['tball_el','tball_tri','tball_seq','tball_sum','tball_dif','tball_int']
const TBALL_LABELS = {
  tball_el:'지수로그', tball_tri:'삼각함수', tball_seq:'수열',
  tball_sum:'함극',    tball_dif:'미분',      tball_int:'적분',
}
const LEC_ORDER = ['lec_hanji_ban','lec_seji_ban','lec_hanji_tech','lec_seji_tech','lec_ko_lit']
const LEC_LABELS = {
  lec_hanji_ban:'한지', lec_seji_ban:'세지',
  lec_hanji_tech:'한지 기출', lec_seji_tech:'세지 기출', lec_ko_lit:'국어 문학',
}

function Row({ task, checked, onToggle }) {
  const key = task.isRollover ? task.rolloverKey : task.id
  return (
    <label className="all-row">
      <input type="checkbox" checked={!!checked} onChange={() => onToggle(key)} />
      <span className="all-range">{task.range || task.text}</span>
      <span className="all-date">{task.isRollover ? task.sourceDate.slice(5).replace('-','/') : ''}</span>
    </label>
  )
}

function SubjectGroup({ label, tasks, checks, onToggle }) {
  if (!tasks?.length) return null
  return (
    <div className="all-subject">
      <span className="all-label">{label}</span>
      <div className="all-sessions">
        {tasks.map(t => (
          <Row key={t.isRollover ? t.rolloverKey : t.id} task={t} checked={checks[t.isRollover ? t.rolloverKey : t.id]} onToggle={onToggle} />
        ))}
      </div>
    </div>
  )
}

export default function AllView() {
  const { allTasks, checks, toggleCheck } = useTasks(todayStr())

  const pending = allTasks.filter(t => !checks[t.isRollover ? t.rolloverKey : t.id])

  const tballPending = pending.filter(t => t.type === 'tball')
  const lecPending   = pending.filter(t => t.type === 'lecture')
  const fePending    = pending.filter(t => t.type === 'fe')

  const groupBy = (tasks, keyFn) => {
    const g = {}
    for (const t of tasks) { const k = keyFn(t); if (!g[k]) g[k]=[]; g[k].push(t) }
    return g
  }

  const tballGroups = groupBy(tballPending, t => t.id)
  const lecGroups   = groupBy(lecPending,   t => t.id)

  const hasTball = tballPending.length > 0
  const hasLec   = lecPending.length > 0
  const hasFe    = fePending.length > 0

  return (
    <div className="all-view">
      {hasTball && (
        <>
          <p className="all-section-title">T.ball</p>
          {TBALL_ORDER.map(id => (
            <SubjectGroup key={id} label={TBALL_LABELS[id]} tasks={tballGroups[id]} checks={checks} onToggle={toggleCheck} />
          ))}
        </>
      )}

      {hasLec && (
        <>
          <p className="all-section-title">인강</p>
          {LEC_ORDER.map(id => (
            <SubjectGroup key={id} label={LEC_LABELS[id]} tasks={lecGroups[id]} checks={checks} onToggle={toggleCheck} />
          ))}
        </>
      )}

      {hasFe && (
        <>
          <p className="all-section-title">F&amp;E</p>
          <SubjectGroup label="세트" tasks={fePending} checks={checks} onToggle={toggleCheck} />
        </>
      )}

      {!hasTball && !hasLec && !hasFe && <p className="empty">밀린 할 일 없음</p>}
    </div>
  )
}
