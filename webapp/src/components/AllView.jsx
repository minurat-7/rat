import { useTasks } from '../hooks/useTasks.js'
import { todayStr } from '../data/schedule.js'

const TBALL_ORDER  = ['tball_el','tball_tri','tball_seq','tball_sum','tball_dif','tball_int']
const TBALL_LABELS = { tball_el:'지수로그', tball_tri:'삼각함수', tball_seq:'수열', tball_sum:'함극', tball_dif:'미분', tball_int:'적분' }
const LEC_ORDER    = ['lec_hanji_ban','lec_seji_ban','lec_hanji_tech','lec_seji_tech','lec_ko_lit']
const LEC_LABELS   = { lec_hanji_ban:'한지', lec_seji_ban:'세지', lec_hanji_tech:'한지기출', lec_seji_tech:'세지기출', lec_ko_lit:'문학' }

function SubjectGroup({ label, tasks, checks, onToggle }) {
  if (!tasks?.length) return null
  return (
    <div className="all-subject">
      <span className="all-label">{label}</span>
      <div className="all-sessions">
        {tasks.map(t => {
          const key = t.isRollover ? t.rolloverKey : t.id
          return (
            <label key={key} className="all-row">
              <input type="checkbox" checked={!!checks[key]} onChange={() => onToggle(key)} />
              <span className="all-range">{t.range || t.text}</span>
              <span className="all-date">{t.isRollover ? t.sourceDate.slice(5).replace('-','/') : ''}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default function AllView() {
  const { allTasks, checks, toggleCheck } = useTasks(todayStr())
  const pending = allTasks.filter(t => !checks[t.isRollover ? t.rolloverKey : t.id])

  const g = (tasks, keyFn) => {
    const m = {}
    for (const t of tasks) { const k = keyFn(t); if (!m[k]) m[k]=[]; m[k].push(t) }
    return m
  }

  const tballG = g(pending.filter(t => t.type === 'tball'), t => t.id)
  const lecG   = g(pending.filter(t => t.type === 'lecture'), t => t.id)

  return (
    <div className="all-two-col">
      {/* ── 왼쪽: T.ball ── */}
      <div className="all-col">
        <p className="all-col-title">T.BALL</p>
        {TBALL_ORDER.map(id => (
          <SubjectGroup key={id} label={TBALL_LABELS[id]} tasks={tballG[id]} checks={checks} onToggle={toggleCheck} />
        ))}
        {!TBALL_ORDER.some(id => tballG[id]?.length) && <p className="all-empty">없음</p>}
      </div>

      <div className="all-divider" />

      {/* ── 오른쪽: 인강 ── */}
      <div className="all-col">
        <p className="all-col-title">인강</p>
        {LEC_ORDER.map(id => (
          <SubjectGroup key={id} label={LEC_LABELS[id]} tasks={lecG[id]} checks={checks} onToggle={toggleCheck} />
        ))}
        {!LEC_ORDER.some(id => lecG[id]?.length) && <p className="all-empty">없음</p>}
      </div>
    </div>
  )
}
