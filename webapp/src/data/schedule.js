// F&E set list — ordered as they appear in the workbook
export const FE_TABLE = [
  { id:  1, title: '지수와 로그',                 type: 'Fungo' },
  { id:  2, title: '함수의 극한과 연속',           type: 'Fungo' },
  { id:  3, title: '여러 가지 순열',               type: 'Entry' },
  { id:  4, title: '지수/로그함수의 그래프',       type: 'Fungo' },
  { id:  5, title: '미분계수와 도함수',             type: 'Fungo' },
  { id:  6, title: '중복조합',                     type: 'Entry' },
  { id:  7, title: '지수와 로그',                  type: 'Entry' },
  { id:  8, title: '접선과 평균값 정리',           type: 'Fungo' },
  { id:  9, title: '이항정리',                     type: 'Entry' },
  { id: 10, title: '지수/로그함수의 그래프',       type: 'Entry' },
  { id: 11, title: '증가·감소와 극대·극소',       type: 'Fungo' },
  { id: 12, title: '확률의 정의와 덧셈정리',       type: 'Fungo' },
  { id: 13, title: '삼각함수의 그래프',             type: 'Entry' },
  { id: 14, title: '함수의 그래프와 그 응용',      type: 'Fungo' },
  { id: 15, title: '확률의 곱셈정리',              type: 'Fungo' },
  { id: 16, title: '삼각함수의 활용',              type: 'Fungo' },
  { id: 17, title: '부정적분과 정적분의 정의',     type: 'Fungo' },
  { id: 18, title: '독립시행의 정리',              type: 'Entry' },
  { id: 19, title: '등차수열, 등비수열',           type: 'Entry' },
  { id: 20, title: '부정적분과 정적분의 정의',     type: 'Entry' },
  { id: 21, title: '이산확률변수와 이항분포',      type: 'Entry' },
  { id: 22, title: '시그마와 여러 가지 수열',      type: 'Fungo' },
  { id: 23, title: '정적분의 활용',                type: 'Entry' },
  { id: 24, title: '연속확률변수와 정규분포',      type: 'Fungo' },
  { id: 25, title: '수열의 귀납적 정의',           type: 'Entry' },
  { id: 26, title: '함수의 극한과 연속',           type: 'Entry' },
  { id: 27, title: '확률의 정의와 덧셈정리',       type: 'Entry' },
  { id: 28, title: '지수/로그함수의 응용',         type: 'Entry' },
  { id: 29, title: '미분계수와 도함수',             type: 'Entry' },
  { id: 30, title: '확률의 곱셈정리',              type: 'Entry' },
  { id: 31, title: '지수/로그함수 OX판단',         type: 'Entry' },
  { id: 32, title: '증가·감소와 극대·극소',       type: 'Entry' },
  { id: 33, title: '연속확률변수와 정규분포',      type: 'Entry' },
  { id: 34, title: '삼각방정식과 부등식',          type: 'Entry' },
  { id: 35, title: '함수의 그래프와 그 응용',      type: 'Entry' },
  { id: 36, title: '모집단과 표본',                type: 'Entry' },
  { id: 37, title: '삼각함수의 활용',              type: 'Entry' },
  { id: 38, title: '그래프의 이동 특성과 정적분',  type: 'Entry' },
  { id: 39, title: '모평균의 추정',                type: 'Entry' },
  { id: 40, title: '시그마와 여러 가지 수열',      type: 'Entry' },
  { id: 41, title: '직선 운동',                   type: 'Fungo' },
  { id: 42, title: '빈칸추론 (확통)',              type: 'Entry' },
  { id: 43, title: '수학적 귀납법과 빈칸추론',     type: 'Entry' },
  { id: 44, title: '미분과 적분 OX판단',           type: null   },
  { id: 45, title: '미분과 적분 22',              type: null   },
]

// Returns tasks for a given date string "YYYY-MM-DD"
// task shape: { id, type, text }
// type: 'tball' | 'lecture' | 'fe' | 'event'
export function getScheduledTasks(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const dow = d.getDay() // 0=Sun,1=Mon,...,6=Sat

  // Out of range
  if (d < new Date('2026-04-26T00:00:00') || d > new Date('2026-06-06T00:00:00')) return []

  // Full-day overrides
  if (dateStr === '2026-05-20') return [{ id:'event_deepf', type:'event', text:'5월 더프' }, { id:'event_deepf_ans', type:'event', text:'더프 오답' }]
  if (dateStr === '2026-06-04') return [{ id:'event_mock_jun', type:'event', text:'6월 모의고사' }, { id:'event_mock_jun_ans', type:'event', text:'모의고사 오답' }]

  const tasks = []

  // ── T.ball ──────────────────────────────────────────
  if (dateStr < '2026-05-05') {
    // OLD rotation (4/26~5/4, kept for rollover recomputation)
    if (dateStr === '2026-05-04') {
      tasks.push({ id:'tball_seq', type:'tball', text:'T.ball 수열 20문제' })
      tasks.push({ id:'tball_sum', type:'tball', text:'T.ball 함극 20문제' })
    } else {
      const old = {
        0:[['tball_el','지수로그'],['tball_int','적분']],
        1:[['tball_seq','수열'],['tball_sum','함극']],
        2:[['tball_tri','삼각함수'],['tball_dif','미분']],
        3:[['tball_el','지수로그'],['tball_int','적분']],
        4:[['tball_seq','수열'],['tball_sum','함극']],
        5:[['tball_tri','삼각함수'],['tball_dif','미분']],
      }
      ;(old[dow] || []).forEach(([id,name]) => tasks.push({ id, type:'tball', text:`T.ball ${name} 10문제` }))
    }
  } else {
    // NEW rotation (5/5~): 수1 / 수2 / 확통 분리
    // 수1: Mon=el Tue=seq Wed=tri Thu=el Fri=seq Sat=tri
    const SU1 = { 1:'tball_el', 2:'tball_seq', 3:'tball_tri', 4:'tball_el', 5:'tball_seq', 6:'tball_tri' }
    const SU1_NAMES = { tball_el:'지수로그', tball_seq:'수열', tball_tri:'삼각함수' }
    if (SU1[dow]) tasks.push({ id:SU1[dow], type:'tball', text:`T.ball ${SU1_NAMES[SU1[dow]]} 10문제` })

    // 수2: Tue/Fri=sum (5/5~), Wed=sum→dif from 5/13, Mon/Sat=sum from 5/11
    const su2 = (() => {
      if (dow === 2) return dateStr >= '2026-05-13' ? 'tball_dif' : 'tball_sum'
      if (dow === 1 && dateStr >= '2026-05-11') return 'tball_sum'
      if (dow === 5 && dateStr < '2026-05-15') return 'tball_sum'
      if (dow === 6 && dateStr !== '2026-05-16') return 'tball_sum'
      if (dow === 2) return 'tball_sum'
      return null
    })()
    if (su2) {
      const su2name = su2 === 'tball_dif' ? '미분' : '함극'
      tasks.push({ id:su2, type:'tball', text:`T.ball ${su2name} 10문제` })
    }

    // 확통: 5/7~(목), 5/10~(일/월/수/목/금)
    const probDays = dateStr >= '2026-05-10' ? [0,1,3,4,5] : [4]
    if (dateStr >= '2026-05-07' && probDays.includes(dow)) {
      tasks.push({ id:'tball_prob', type:'tball', text:'T.ball 확통 10문제' })
    }
  }

  // ── Lectures by day-of-week ──────────────────────────
  const lecByDow = {
    0: [['lec_ko_lit','국어 문학']],
    1: [['lec_hanji_ban','한지 1강 반']],
    2: [['lec_hanji_ban','한지 1강 반'],['lec_ko_lit','국어 문학']],
    3: [['lec_seji_ban','세지 1강 반']],
    4: [['lec_seji_ban','세지 1강 반'],['lec_ko_lit','국어 문학']],
    5: [['lec_hanji_tech','한지 기출 1강']],
    6: [['lec_seji_tech','세지 기출 1강']],
  }
  // SUN 5/3 extra
  if (dateStr === '2026-05-03') tasks.push({ id:'lec_hanji_ban', type:'lecture', text:'인강) 한지 1강 반' })
  // MON 5/4 extra
  if (dateStr === '2026-05-04') tasks.push({ id:'lec_ko_lit', type:'lecture', text:'인강) 국어 문학 1강' })
  ;(lecByDow[dow] || []).forEach(([id,name]) => tasks.push({ id, type:'lecture', text:`인강) ${name} 1강` }))

  // ── Special add-on events (not full-day overrides) ──
  if (dateStr === '2026-05-06') tasks.push({ id:'event_mibn', type:'lecture', text:'미분 기초 강의' })
  if (dateStr === '2026-05-07') tasks.push({ id:'event_mock_review', type:'event', text:'모의고사 오답' })
  if (dateStr === '2026-05-13') tasks.push({ id:'event_prob', type:'lecture', text:'확률 기초 수업' })
  if (dateStr === '2026-05-16') tasks.push({ id:'event_mock_edu', type:'event', text:'교육청 모의고사' })

  // ── SAT 수학 모의고사 (매주 토, 5/16 제외) ──────────
  if (dow === 6 && dateStr !== '2026-05-16') {
    tasks.unshift({ id:'event_math_mock', type:'event', text:'수학 모의고사' })
  }

  // ── F&E (5/17~) ─────────────────────────────────────
  if (d >= new Date('2026-05-17T00:00:00')) {
    const feCount = d >= new Date('2026-05-24T00:00:00') ? 2 : 1
    for (let i = 0; i < feCount; i++) tasks.push({ id:`fe_slot_${i}`, type:'fe', text:'F&E' })
  }

  return tasks
}

// Human-readable date string
export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const dows = ['일', '월', '화', '수', '목', '금', '토']
  const m = d.getMonth() + 1
  const day = d.getDate()
  const dow = dows[d.getDay()]
  return `${m}월 ${day}일 (${dow})`
}

function localDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return localDateStr(d)
}

export function todayStr() {
  return localDateStr(new Date())
}
