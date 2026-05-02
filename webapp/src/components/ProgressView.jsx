import { useProgress } from '../hooks/useTasks.js'
import { useScores } from '../hooks/useScores.js'
import { TBALL_PROBLEMS, getProblemRange } from '../data/tballProblems.js'
import { LECTURE_LISTS, getLecRange } from '../data/lectureLists.js'
import { todayStr } from '../data/schedule.js'

const TBALL_ORDER  = ['tball_el','tball_tri','tball_seq','tball_sum','tball_dif','tball_int']
const TBALL_LABELS = { tball_el:'지수로그', tball_tri:'삼각함수', tball_seq:'수열', tball_sum:'함극', tball_dif:'미분', tball_int:'적분' }
const LEC_ORDER    = ['lec_hanji_ban','lec_seji_ban','lec_hanji_tech','lec_seji_tech','lec_ko_lit']
const LEC_LABELS   = { lec_hanji_ban:'한지', lec_seji_ban:'세지', lec_hanji_tech:'한지 기출', lec_seji_tech:'세지 기출', lec_ko_lit:'문학' }

const EXAM_LABEL = {
  event_math_mock: '수학',
  event_mock_edu: '교육청',
  event_deepf: '더프',
  event_mock_jun: '6월',
}

function ScoreChart({ scores }) {
  const points = []
  for (const [date, dayScores] of Object.entries(scores)) {
    for (const [eventId, score] of Object.entries(dayScores)) {
      if (score != null && EXAM_LABEL[eventId]) {
        points.push({ date, eventId, score })
      }
    }
  }
  points.sort((a, b) => a.date.localeCompare(b.date))

  if (!points.length) return <p className="score-empty">아직 기록 없음</p>

  const W = 300, H = 80
  const pad = { l: 22, r: 8, t: 14, b: 14 }
  const cW = W - pad.l - pad.r
  const cH = H - pad.t - pad.b
  const xOf = i => pad.l + (points.length === 1 ? cW / 2 : (i / (points.length - 1)) * cW)
  const yOf = s => pad.t + (1 - s / 100) * cH

  const polyPts = points.map((p, i) => `${xOf(i)},${yOf(p.score)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="score-svg">
      {[0, 50, 100].map(v => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)} stroke="#f0f0f0" strokeWidth="1" />
          <text x={pad.l - 3} y={yOf(v) + 3} textAnchor="end" fontSize="7" fill="#ccc">{v}</text>
        </g>
      ))}
      {points.length > 1 && (
        <polyline points={polyPts} fill="none" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
      )}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={xOf(i)} cy={yOf(p.score)} r="3" fill="#000" />
          <text x={xOf(i)} y={yOf(p.score) - 5} textAnchor="middle" fontSize="8" fontWeight="600" fill="#222">
            {p.score}
          </text>
          <text x={xOf(i)} y={H - 2} textAnchor="middle" fontSize="7" fill="#aaa">
            {EXAM_LABEL[p.eventId]}
          </text>
        </g>
      ))}
    </svg>
  )
}

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
  const { scores } = useScores()

  return (
    <div className="progress-view">
      <p className="prog-section-title">성적 추세</p>
      <div className="score-chart-wrap">
        <ScoreChart scores={scores} />
      </div>

      <p className="prog-section-title" style={{ marginTop: 20 }}>T.BALL</p>
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
