import { useState, useCallback, useMemo } from 'react'
import { getScheduledTasks, addDays, FE_TABLE } from '../data/schedule.js'
import { load, save, PLAN_START } from '../lib/rollover.js'
import { TBALL_PROBLEMS, getProblemRange } from '../data/tballProblems.js'
import { LECTURE_LISTS, getLecRange } from '../data/lectureLists.js'

const TBALL_IDS   = Object.keys(TBALL_PROBLEMS)
const LECTURE_IDS = Object.keys(LECTURE_LISTS)
const FE_START    = '2026-05-17'

// Count schedule appearances of each task before upToDate
function countOccurrences(upToDate, predicate) {
  const counts = {}
  let cursor = PLAN_START
  while (cursor < upToDate) {
    for (const t of getScheduledTasks(cursor)) {
      if (predicate(t)) counts[t.id] = (counts[t.id] || 0) + 1
    }
    cursor = addDays(cursor, 1)
  }
  return counts
}

function computeTballIdx(upToDate) {
  const counts = countOccurrences(upToDate, t => TBALL_PROBLEMS[t.id])
  const result = {}
  for (const id of TBALL_IDS) {
    result[id] = ((counts[id] || 0) * 10) % TBALL_PROBLEMS[id].length
  }
  return result
}

function computeFeStartIdx(checks, upToDate) {
  if (upToDate <= FE_START) return 0
  let count = 0
  let cursor = FE_START
  while (cursor < upToDate) {
    const dc = checks[cursor] || {}
    const n = getScheduledTasks(cursor).filter(t => t.type === 'fe').length
    for (let i = 0; i < n; i++) { if (dc[`fe_slot_${i}`]) count++ }
    cursor = addDays(cursor, 1)
  }
  return count % FE_TABLE.length
}

function augmentTask(t, tballIdx, lecCounts, feStartIdx) {
  if (t.type === 'tball' && TBALL_PROBLEMS[t.id]) {
    return { ...t, range: getProblemRange(t.id, tballIdx[t.id] || 0) }
  }
  if (t.type === 'lecture' && LECTURE_LISTS[t.id]) {
    return { ...t, range: getLecRange(t.id, lecCounts[t.id] || 0) }
  }
  if (t.type === 'fe') {
    const slotNum = parseInt(t.id.slice(-1)) || 0
    const set = FE_TABLE[(feStartIdx + slotNum) % FE_TABLE.length]
    const range = set ? `#${set.id} ${set.title}${set.type ? ' ' + set.type : ''}` : null
    return { ...t, range }
  }
  return t
}

export function useTasks(dateStr) {
  const [data, setData] = useState(load)

  const scheduledTasks = useMemo(() => getScheduledTasks(dateStr), [dateStr])

  const rollovers = useMemo(() => (data.rollovers[dateStr] || []).map(t => ({
    ...t, rolloverKey: `ro_${t.sourceDate}_${t.id}`, isRollover: true,
  })), [data.rollovers, dateStr])

  const checks = data.checks[dateStr] || {}

  const tballIdxToday = useMemo(() => computeTballIdx(dateStr), [dateStr])
  const lecCountsToday = useMemo(
    () => countOccurrences(dateStr, t => LECTURE_LISTS[t.id]),
    [dateStr]
  )
  const feStartIdx = useMemo(
    () => computeFeStartIdx(data.checks, dateStr),
    [data.checks, dateStr]
  )

  const rolloversWithRange = useMemo(() => {
    const srcDates = [...new Set(rollovers.map(t => t.sourceDate))]
    const tballByDate = {}
    const lecByDate = {}
    for (const d of srcDates) {
      tballByDate[d] = computeTballIdx(d)
      lecByDate[d]   = countOccurrences(d, t => LECTURE_LISTS[t.id])
    }
    return rollovers.map(t => {
      if (t.type === 'tball' && TBALL_PROBLEMS[t.id]) {
        const idx = (tballByDate[t.sourceDate] || {})[t.id] || 0
        return { ...t, range: getProblemRange(t.id, idx) }
      }
      if (t.type === 'lecture' && LECTURE_LISTS[t.id]) {
        const occ = (lecByDate[t.sourceDate] || {})[t.id] || 0
        return { ...t, range: getLecRange(t.id, occ) }
      }
      return t
    })
  }, [rollovers])

  const toggleCheck = useCallback((taskId) => {
    setData(prev => {
      const updated = {
        ...prev,
        checks: {
          ...prev.checks,
          [dateStr]: { ...(prev.checks[dateStr] || {}), [taskId]: !((prev.checks[dateStr] || {})[taskId]) },
        },
      }
      save(updated)
      return updated
    })
  }, [dateStr])

  const todayTasks = useMemo(() => scheduledTasks.map(t =>
    augmentTask({ ...t, isRollover: false, rolloverKey: null }, tballIdxToday, lecCountsToday, feStartIdx)
  ), [scheduledTasks, tballIdxToday, lecCountsToday, feStartIdx])

  const allTasks = [...rolloversWithRange, ...todayTasks]
  const doneCount = allTasks.filter(t => checks[t.isRollover ? t.rolloverKey : t.id]).length

  return {
    allTasks, todayTasks, rollovers: rolloversWithRange,
    checks, toggleCheck, doneCount, total: allTasks.length,
  }
}

export function useProgress(dateStr) {
  const tballIdx = useMemo(() => computeTballIdx(dateStr), [dateStr])
  const lecCounts = useMemo(
    () => countOccurrences(dateStr, t => LECTURE_LISTS[t.id]),
    [dateStr]
  )
  return { tballIdx, lecCounts }
}
