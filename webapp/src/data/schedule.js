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
// task shape: { id, type, text, detail? }
// type: 'tball' | 'lecture' | 'fe' | 'event'
export function getScheduledTasks(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const dow = d.getDay() // 0=Sun,1=Mon,...,6=Sat
  const [year, month, day] = dateStr.split('-').map(Number)

  // Special event days — override normal schedule
  const specials = {
    '2026-05-07': [{ id: 'event_mock_edu', type: 'event', text: '교육청 모의고사' }, { id: 'event_mock_edu_ans', type: 'event', text: '모의고사 오답' }],
    '2026-05-20': [{ id: 'event_deepf', type: 'event', text: '5월 더프' }, { id: 'event_deepf_ans', type: 'event', text: '더프 오답' }],
    '2026-06-04': [{ id: 'event_mock_jun', type: 'event', text: '6월 모의고사' }, { id: 'event_mock_jun_ans', type: 'event', text: '모의고사 오답' }],
  }
  if (specials[dateStr]) return specials[dateStr]

  const tasks = []

  // Out of range
  const start = new Date('2026-04-26T00:00:00')
  const end = new Date('2026-06-06T00:00:00')
  if (d < start || d > end) return []

  // T.ball tasks by day-of-week (not on Saturday)
  const tballByDow = {
    0: [ // SUN
      { id: 'tball_el', type: 'tball', text: 'T.ball 지수로그 10문제' },
      { id: 'tball_int', type: 'tball', text: 'T.ball 적분 10문제' },
    ],
    1: [ // MON — May 4 gets 20문제 override below
      { id: 'tball_seq', type: 'tball', text: 'T.ball 수열 10문제' },
      { id: 'tball_sum', type: 'tball', text: 'T.ball 함극 10문제' },
    ],
    2: [ // TUE
      { id: 'tball_tri', type: 'tball', text: 'T.ball 삼각함수 10문제' },
      { id: 'tball_dif', type: 'tball', text: 'T.ball 미분 10문제' },
    ],
    3: [ // WED
      { id: 'tball_el', type: 'tball', text: 'T.ball 지수로그 10문제' },
      { id: 'tball_int', type: 'tball', text: 'T.ball 적분 10문제' },
    ],
    4: [ // THU
      { id: 'tball_seq', type: 'tball', text: 'T.ball 수열 10문제' },
      { id: 'tball_sum', type: 'tball', text: 'T.ball 함극 10문제' },
    ],
    5: [ // FRI
      { id: 'tball_tri', type: 'tball', text: 'T.ball 삼각함수 10문제' },
      { id: 'tball_dif', type: 'tball', text: 'T.ball 미분 10문제' },
    ],
  }

  // May 4 override: 20문제
  if (dateStr === '2026-05-04') {
    tasks.push({ id: 'tball_seq', type: 'tball', text: 'T.ball 수열 20문제' })
    tasks.push({ id: 'tball_sum', type: 'tball', text: 'T.ball 함극 20문제' })
  } else if (dow !== 6) {
    const tball = tballByDow[dow] || []
    tasks.push(...tball)
  }

  // Lecture tasks by day-of-week
  const lectureByDow = {
    0: [ // SUN
      { id: 'lec_ko_lit', type: 'lecture', text: '인강) 국어 문학 1강' },
    ],
    1: [ // MON
      { id: 'lec_hanji_ban', type: 'lecture', text: '인강) 한지 1강 반' },
    ],
    2: [ // TUE
      { id: 'lec_hanji_ban', type: 'lecture', text: '인강) 한지 1강 반' },
      { id: 'lec_ko_lit', type: 'lecture', text: '인강) 국어 문학 1강' },
    ],
    3: [ // WED
      { id: 'lec_seji_ban', type: 'lecture', text: '인강) 세지 1강 반' },
    ],
    4: [ // THU
      { id: 'lec_seji_ban', type: 'lecture', text: '인강) 세지 1강 반' },
      { id: 'lec_ko_lit', type: 'lecture', text: '인강) 국어 문학 1강' },
    ],
    5: [ // FRI
      { id: 'lec_hanji_tech', type: 'lecture', text: '인강) 한지 기술 1강' },
    ],
    6: [ // SAT
      { id: 'lec_seji_tech', type: 'lecture', text: '인강) 세지 기술 1강' },
    ],
  }

  // SUN May 3: extra lecture
  if (dateStr === '2026-05-03') {
    tasks.push({ id: 'lec_hanji_ban', type: 'lecture', text: '인강) 한지 1강 반' })
  }
  // MON May 4: extra lecture
  if (dateStr === '2026-05-04') {
    tasks.push({ id: 'lec_ko_lit', type: 'lecture', text: '인강) 국어 문학 1강' })
  }

  tasks.push(...(lectureByDow[dow] || []))

  // SAT: 수학 모의고사
  if (dow === 6) {
    tasks.unshift({ id: 'event_math_mock', type: 'event', text: '수학 모의고사' })
  }

  // F&E tasks — start May 17
  const feStart = new Date('2026-05-17T00:00:00')
  if (d >= feStart) {
    const feWeek2Start = new Date('2026-05-24T00:00:00')
    const feCount = d >= feWeek2Start ? 2 : 1
    for (let i = 0; i < feCount; i++) {
      tasks.push({ id: `fe_slot_${i}`, type: 'fe', text: 'F&E' })
    }
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
