import { useProgress } from '../hooks/useTasks.js'
import { TBALL_PROBLEMS, getProblemRange } from '../data/tballProblems.js'
import { LECTURE_LISTS, getLecRange } from '../data/lectureLists.js'
import { todayStr } from '../data/schedule.js'

const TBALL_ORDER  = ['tball_el','tball_tri','tball_seq','tball_sum','tball_dif','tball_int']
const TBALL_LABELS = { tball_el:'지수로그', tball_tri:'삼각함수', tball_seq:'수열', tball_sum:'함극', tball_dif:'미분', tball_int:'적분' }
const LEC_ORDER    = ['lec_hanji_ban','lec_seji_ban','lec_hanji_tech','lec_seji_tech','lec_ko_lit']
const LEC_LABELS   = { lec_hanji_ban:'한지', lec_seji_ban:'세지', lec_hanji_tech:'한지기출', lec_seji_tech:'세지기출', lec_ko_lit:'문학' }

function ProgRow({ label, pct, range, fraction }) {
  return (
    <div className="prog-row">
      <span className="prog-label">{label}</span>
      <div className="prog-bar-col">
        <div className="prog-bar-wrap">
          <div className="prog-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <span className="prog-range">{range}</span>
      </div>
      <span className="prog-fraction">{fraction}</span>
    </div>
  )
}

export default function ProgressView() {
  const { tballIdx, lecCounts } = useProgress(todayStr())

  return (
    <div className="progress-view">
      <p className="prog-section-title">T.BALL</p>
      {TBALL_ORDER.map(id => {
        const problems = TBALL_PROBLEMS[id]
        const idx = tballIdx[id] || 0
        const total = problems.length
        return (
          <ProgRow
            key={id}
            label={TBALL_LABELS[id]}
            pct={(idx / total) * 100}
            range={getProblemRange(id, idx)}
            fraction={`${idx}/${total}`}
          />
        )
      })}

      <p className="prog-section-title" style={{ marginTop: 20 }}>인강</p>
      {LEC_ORDER.map(id => {
        const lec = LECTURE_LISTS[id]
        const occ = lecCounts[id] || 0
        const done = Math.min(occ * lec.per, lec.items.length)
        const total = lec.items.length
        return (
          <ProgRow
            key={id}
            label={LEC_LABELS[id]}
            pct={(done / total) * 100}
            range={getLecRange(id, occ) || '완료'}
            fraction={`${done}/${total}`}
          />
        )
      })}
    </div>
  )
}
