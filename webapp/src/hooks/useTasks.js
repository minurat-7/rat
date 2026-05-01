import { useState, useCallback, useMemo } from 'react'
import { getScheduledTasks, addDays, FE_TABLE } from '../data/schedule.js'
import { load, save, PLAN_START } from '../lib/rollover.js'
import { TBALL_PROBLEMS, getProblemRange } from '../data/tballProblems.js'

const TBALL_IDS = Object.keys(TBALL_PROBLEMS)
const FE_START = '2026-05-17'

// Count how many times each tball task appears in the SCHEDULE before upToDate.
// This gives a stable, check-independent range for every session.
function computeTballIdxBySchedule(upToDate) {
  const counts = {}
  let cursor = PLAN_START
  while (cursor < upToDate) {
    for (const t of getScheduledTasks(cursor)) {
      if (TBALL_PROBLEMS[t.id]) counts[t.id] = (counts[t.id] || 0) + 1
    }
    cursor = addDays(cursor, 1)
  }
  const result = {}
  for (const id of TBALL_IDS) {
    const total = TBALL_PROBLEMS[id].length
    result[id] = ((counts[id] || 0) * 10) % total
  }
  return result
}

// Count completed F&E sets from check history before upToDate.
function computeFeStartIdx(checks, upToDate) {
  if (upToDate <= FE_START) return 0
  let count = 0
  let cursor = FE_START
  while (cursor < upToDate) {
    const dc = checks[cursor] || {}
    const feSlots = getScheduledTasks(cursor).filter(t => t.type === 'fe').length
    for (let i = 0; i < feSlots; i++) {
      if (dc[`fe_slot_${i}`]) count++
    }
    cursor = addDays(cursor, 1)
  }
  return count % FE_TABLE.length
}

export function useTasks(dateStr) {
  const [data, setData] = useState(load)

  const scheduledTasks = useMemo(() => getScheduledTasks(dateStr), [dateStr])

  const rollovers = useMemo(() => (data.rollovers[dateStr] || []).map(t => ({
    ...t, rolloverKey: `ro_${t.sourceDate}_${t.id}`, isRollover: true,
  })), [data.rollovers, dateStr])

  const checks = data.checks[dateStr] || {}

  // Tball index for today's scheduled tasks (based on schedule appearances before today)
  const tballIdxToday = useMemo(() => computeTballIdxBySchedule(dateStr), [dateStr])

  // Tball index per source date for rollover tasks
  const rolloversWithRange = useMemo(() => {
    const sourceDates = [...new Set(rollovers.map(t => t.sourceDate))]
    const idxByDate = {}
    for (const d of sourceDates) {
      idxByDate[d] = computeTballIdxBySchedule(d)
    }
    return rollovers.map(t => {
      if (t.type === 'tball' && TBALL_PROBLEMS[t.id]) {
        const idx = (idxByDate[t.sourceDate] || {})[t.id] || 0
        return { ...t, range: getProblemRange(t.id, idx) }
      }
      return t
    })
  }, [rollovers])

  const feStartIdx = useMemo(
    () => computeFeStartIdx(data.checks, dateStr),
    [data.checks, dateStr]
  )

  const toggleCheck = useCallback((taskId) => {
    setData(prev => {
      const updated = {
        ...prev,
        checks: {
          ...prev.checks,
          [dateStr]: {
            ...(prev.checks[dateStr] || {}),
            [taskId]: !((prev.checks[dateStr] || {})[taskId]),
          },
        },
      }
      save(updated)
      return updated
    })
  }, [dateStr])

  const todayTasks = useMemo(() => scheduledTasks.map(t => {
    if (t.type === 'tball' && TBALL_PROBLEMS[t.id]) {
      return { ...t, isRollover: false, rolloverKey: null, range: getProblemRange(t.id, tballIdxToday[t.id] || 0) }
    }
    if (t.type === 'fe') {
      const slotNum = parseInt(t.id.slice(-1)) || 0
      const set = FE_TABLE[(feStartIdx + slotNum) % FE_TABLE.length]
      const range = set ? `#${set.id} ${set.title}${set.type ? ' ' + set.type : ''}` : null
      return { ...t, isRollover: false, rolloverKey: null, range }
    }
    return { ...t, isRollover: false, rolloverKey: null }
  }), [scheduledTasks, tballIdxToday, feStartIdx])

  const allTasks = [...rolloversWithRange, ...todayTasks]

  const doneCount = allTasks.filter(t => checks[t.isRollover ? t.rolloverKey : t.id]).length

  return {
    allTasks, todayTasks, rollovers: rolloversWithRange,
    checks, toggleCheck, doneCount, total: allTasks.length,
  }
}
