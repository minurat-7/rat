import { useState } from 'react'
import { useProgress, useTasks } from '../hooks/useTasks.js'
import { TBALL_PROBLEMS, getProblemRange } from '../data/tballProblems.js'
import { LECTURE_LISTS, getLecRange } from '../data/lectureLists.js'
import { load, save, LS_KEY } from '../lib/rollover.js'
import { todayStr } from '../data/schedule.js'

const TBALL_ORDER  = ['tball_el','tball_tri','tball_seq','tball_sum','tball_dif','tball_int']
const TBALL_LABELS = { tball_el:'지수로그', tball_tri:'삼각함수', tball_seq:'수열', tball_sum:'함극', tball_dif:'미분', tball_int:'적분' }
const LEC_ORDER    = ['lec_hanji_ban','lec_seji_ban','lec_hanji_tech','lec_seji_tech','lec_ko_lit']
const LEC_LABELS   = { lec_hanji_ban:'한지', lec_seji_ban:'세지', lec_hanji_tech:'한지 기출', lec_seji_tech:'세지 기출', lec_ko_lit:'문학' }

const SUBJECT_INFO = {
  math:  { label: '수학',  color: '#000' },
  ko:    { label: '국어',  color: '#cc0000' },
  en:    { label: '영어',  color: '#0055cc' },
  seji:  { label: '세지',  color: '#007700' },
  hanji: { label: '한지',  color: '#cc6600' },
}

function ScoreChart({ scores }) {
  const subjectPoints = {}

  for (const [date, dayScores] of Object.entries(scores)) {
    for (const [scoreKey, score] of Object.entries(dayScores)) {
      if (score == null) continue
      for (const subKey of Object.keys(SUBJECT_INFO)) {
        if (scoreKey.endsWith('_' + subKey)) {
          if (!subjectPoints[subKey]) subjectPoints[subKey] = []
          subjectPoints[subKey].push({ date, score })
          break
        }
      }
    }
  }

  for (const pts of Object.values(subjectPoints)) {
    pts.sort((a, b) => a.date.localeCompare(b.date))
  }

  const allDates = [...new Set(
    Object.values(subjectPoints).flatMap(pts => pts.map(p => p.date))
  )].sort()

  const hasData = allDates.length > 0
  if (!hasData) return <p className="score-empty">아직 기록 없음</p>

  const W = 300, H = 90
  const pad = { l: 24, r: 8, t: 14, b: 16 }
  const cW = W - pad.l - pad.r
  const cH = H - pad.t - pad.b
  const xOf = d => pad.l + (allDates.length === 1 ? cW / 2 : (allDates.indexOf(d) / (allDates.length - 1)) * cW)
  const yOf = s => pad.t + (1 - s / 100) * cH

  const activeSubs = Object.keys(SUBJECT_INFO).filter(k => subjectPoints[k]?.length)

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="score-svg">
        {[0, 50, 100].map(v => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yOf(v)} y2={yOf(v)} stroke="#f0f0f0" strokeWidth="1" />
            <text x={pad.l - 3} y={yOf(v) + 3} textAnchor="end" fontSize="7" fill="#ccc">{v}</text>
          </g>
        ))}
        {activeSubs.map(subKey => {
          const pts = subjectPoints[subKey]
          const { color, label } = SUBJECT_INFO[subKey]
          const last = pts[pts.length - 1]
          return (
            <g key={subKey}>
              {pts.length > 1 && (
                <polyline
                  points={pts.map(p => `${xOf(p.date)},${yOf(p.score)}`).join(' ')}
                  fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"
                />
              )}
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={xOf(p.date)} cy={yOf(p.score)} r="3" fill={color} />
                  <text x={xOf(p.date)} y={yOf(p.score) - 5} textAnchor="middle"
                    fontSize="8" fontWeight="600" fill={color}>{p.score}</text>
                </g>
              ))}
              <text x={xOf(last.date) + 5} y={yOf(last.score) + 3}
                textAnchor="start" fontSize="7" fill={color} opacity="0.7">{label[0]}</text>
            </g>
          )
        })}
        {allDates.map(d => (
          <text key={d} x={xOf(d)} y={H - 1} textAnchor="middle" fontSize="7" fill="#bbb">
            {d.slice(5).replace('-', '/')}
          </text>
        ))}
      </svg>
      <div className="score-legend">
        {activeSubs.map(k => (
          <span key={k} className="score-legend-item" style={{ color: SUBJECT_INFO[k].color }}>
            ● {SUBJECT_INFO[k].label}
          </span>
        ))}
      </div>
    </div>
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

function DataTransfer() {
  const [importText, setImportText] = useState('')
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)

  function handleExport() {
    const raw = localStorage.getItem(LS_KEY) || '{}'
    navigator.clipboard.writeText(raw).then(
      () => setMsg('클립보드에 복사됨'),
      () => setMsg('복사 실패 — 아래 텍스트를 직접 복사하세요')
    )
    setImportText(raw)
  }

  function handleImport() {
    try {
      const parsed = JSON.parse(importText)
      save(parsed)
      setDone(true)
    } catch {
      setMsg('오류: 올바른 데이터 형식이 아님')
    }
  }

  if (done) return null

  return (
    <div className="data-transfer">
      <p className="prog-section-title">데이터 이전</p>
      <div className="data-transfer-btns">
        <button className="dt-btn" onClick={handleExport}>내보내기 (복사)</button>
      </div>
      <textarea
        className="dt-textarea"
        value={importText}
        onChange={e => setImportText(e.target.value)}
        placeholder="여기에 붙여넣기 후 가져오기 버튼 누르기"
        rows={4}
      />
      <button className="dt-btn dt-btn-import" onClick={handleImport} disabled={!importText}>
        가져오기
      </button>
      {msg && <p className="dt-msg">{msg}</p>}
    </div>
  )
}

export default function ProgressView() {
  const today = todayStr()
  const { tballIdx, lecCounts } = useProgress(today)
  const { allTasks, checks } = useTasks(today)
  // 항상 최신 localStorage에서 직접 읽어 stale state 문제 방지
  const scores = load().scores || {}

  const pending = allTasks.filter(t => !checks[t.isRollover ? t.rolloverKey : t.id])
  const ptball = pending.filter(t => t.type === 'tball').length
  const plec   = pending.filter(t => t.type === 'lecture').length
  const pfe    = pending.filter(t => t.type === 'fe').length

  const bannerParts = []
  if (ptball) bannerParts.push(`T.ball ${ptball * 10}문제`)
  if (plec)   bannerParts.push(`인강 ${plec}강`)
  if (pfe)    bannerParts.push(`F&E ${pfe}세트`)

  return (
    <div className="progress-view">
      {bannerParts.length > 0 && (
        <p className="pending-banner">밀린 항목: {bannerParts.join(' · ')}</p>
      )}

      <p className="prog-section-title" style={{ marginTop: bannerParts.length ? 16 : 0 }}>성적 추세</p>
      <div className="score-chart-wrap">
        <ScoreChart scores={scores} />
      </div>

      <p className="prog-section-title" style={{ marginTop: 20 }}>T.BALL</p>
      {TBALL_ORDER.map(id => {
        const problems = TBALL_PROBLEMS[id]
        const idx = tballIdx[id] || 0
        const total = problems.length
        return (
          <ProgRow key={id} label={TBALL_LABELS[id]}
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
          <ProgRow key={id} label={LEC_LABELS[id]}
            pct={(done / total) * 100}
            range={getLecRange(id, occ) || '완료'}
            fraction={`${done}/${total}`}
          />
        )
      })}

      <DataTransfer />
    </div>
  )
}
