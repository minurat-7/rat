// F&E problem table from the curriculum sheet
// Each set: { id, subject, topic, fungo, entry }
// fungo/entry are problem numbers in the T.ball book
export const FE_TABLE = [
  // 수1 - 지수로그
  { id: 'fe_s1_el_1', subject: '수1', topic: '지수로그', fungo: 1, entry: 21 },
  { id: 'fe_s1_el_2', subject: '수1', topic: '지수로그', fungo: 4, entry: 24 },
  { id: 'fe_s1_el_3', subject: '수1', topic: '지수로그', fungo: null, entry: 27 },
  { id: 'fe_s1_el_4', subject: '수1', topic: '지수로그', fungo: null, entry: 30 },
  // 수1 - 삼각함수
  { id: 'fe_s1_tri_1', subject: '수1', topic: '삼각함수', fungo: null, entry: 33 },
  { id: 'fe_s1_tri_2', subject: '수1', topic: '삼각함수', fungo: null, entry: 36 },
  // 수1 - 수열
  { id: 'fe_s1_seq_1', subject: '수1', topic: '수열', fungo: 15, entry: 39 },
  { id: 'fe_s1_seq_2', subject: '수1', topic: '수열', fungo: null, entry: 41 },
  { id: 'fe_s1_seq_3', subject: '수1', topic: '수열', fungo: 18, entry: 43 },
  { id: 'fe_s1_seq_4', subject: '수1', topic: '수열', fungo: null, entry: 45 },
  { id: 'fe_s1_seq_5', subject: '수1', topic: '수열', fungo: null, entry: 47 },
  // 수2 - 극한과 연속
  { id: 'fe_s2_lim_1', subject: '수2', topic: '극한과 연속', fungo: 2, entry: 19 },
  { id: 'fe_s2_lim_2', subject: '수2', topic: '극한과 연속', fungo: 5, entry: 22 },
  { id: 'fe_s2_lim_3', subject: '수2', topic: '극한과 연속', fungo: 7, entry: 25 },
  { id: 'fe_s2_lim_4', subject: '수2', topic: '극한과 연속', fungo: 9, entry: 28 },
  { id: 'fe_s2_lim_5', subject: '수2', topic: '극한과 연속', fungo: 11, entry: 31 },
  { id: 'fe_s2_lim_6', subject: '수2', topic: '극한과 연속', fungo: 13, entry: 34 },
  // 수2 - 미분 (same section as 극한과 연속 in the image, listed under 미분)
  // 수2 - 적분
  { id: 'fe_s2_int_1', subject: '수2', topic: '적분', fungo: null, entry: 37 },
  { id: 'fe_s2_int_2', subject: '수2', topic: '적분', fungo: null, entry: 40 },
  { id: 'fe_s2_int_3', subject: '수2', topic: '킬러', fungo: 16, entry: 42 },
  { id: 'fe_s2_int_4', subject: '수2', topic: '적분', fungo: null, entry: 44 },
  { id: 'fe_s2_int_5', subject: '수2', topic: '적분', fungo: null, entry: 46 },
  // 확통 - 경우의수
  { id: 'fe_prob_c_1', subject: '확통', topic: '경우의수', fungo: null, entry: 3 },
  { id: 'fe_prob_c_2', subject: '확통', topic: '경우의수', fungo: null, entry: 6 },
  { id: 'fe_prob_c_3', subject: '확통', topic: '경우의수', fungo: null, entry: 8 },
  // 확통 - 확률
  { id: 'fe_prob_p_1', subject: '확통', topic: '확률', fungo: 10, entry: 14 },
  { id: 'fe_prob_p_2', subject: '확통', topic: '확률', fungo: 12, entry: 17 },
  { id: 'fe_prob_p_3', subject: '확통', topic: '확률', fungo: null, entry: 20 },
  { id: 'fe_prob_p_4', subject: '확통', topic: '확률', fungo: null, entry: 23 },
  // 확통 - 통계
  { id: 'fe_prob_s_1', subject: '확통', topic: '통계', fungo: 26, entry: 29 },
  { id: 'fe_prob_s_2', subject: '확통', topic: '통계', fungo: null, entry: 32 },
  { id: 'fe_prob_s_3', subject: '확통', topic: '통계', fungo: null, entry: 35 },
  { id: 'fe_prob_s_4', subject: '확통', topic: '통계', fungo: null, entry: 38 },
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
      { id: 'tball_sum', type: 'tball', text: 'T.ball 합극 10문제' },
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
      { id: 'tball_sum', type: 'tball', text: 'T.ball 합극 10문제' },
    ],
    5: [ // FRI
      { id: 'tball_tri', type: 'tball', text: 'T.ball 삼각함수 10문제' },
      { id: 'tball_dif', type: 'tball', text: 'T.ball 미분 10문제' },
    ],
  }

  // May 4 override: 20문제
  if (dateStr === '2026-05-04') {
    tasks.push({ id: 'tball_seq', type: 'tball', text: 'T.ball 수열 20문제' })
    tasks.push({ id: 'tball_sum', type: 'tball', text: 'T.ball 합극 20문제' })
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
      tasks.push({ id: `fe_slot_${i}`, type: 'fe', text: `F&E ${i + 1}번째 세트` })
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

// Navigate dates
export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}
