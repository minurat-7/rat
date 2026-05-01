import { useState, useCallback, useMemo } from 'react'
import { getScheduledTasks, addDays, FE_TABLE } from '../data/schedule.js'
import { load, save, PLAN_START } from '../lib/rollover.js'
import { TBALL_PROBLEMS, getProblemRange } from '../data/tballProblems.js'

const TBALL_IDS = Object.keys(TBALL_PROBLEMS)
const FE_START = '2026-05-17'

// Count completed sessions from check history to derive current position.
// Returns { tball_el: N, tball_tri: N, ... } where N = problems completed so far.
function computeTballProgress(checks, upToDate) {
  const counts = {}
  let cursor = PLAN_START
  while (cursor < upToDate) {
    const dc = checks[cursor] || {}
    for (const id of TBALL_IDS) {
      if (dc[id]) counts[id] = (counts[id] || 0) + 1
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
    const dayTasks = getScheduledTasks(cursor)
    const feSlots = dayTasks.filter(t => t.type === 'fe').length
    for (let i = 0; i < feSlots; i++) {
      if (dc[`fe_slot_${i}`]) count++
    }
    cursor = addDays(cursor, 1)
  }
  return count % FE_TABLE.length
}

function augment(task, tballProgress, feStartIdx) {
  if (task.type === 'tball' && TBALL_PROBLEMS[task.id]) {
    const idx = task.isRollover
      ? computeTballProgress({}, task.sourceDate)[task.id]  // placeholder, handled below
      : (tballProgress[task.id] || 0)
    return { ...task, range: getProblemRange(task.id, idx) }
  }
  if (task.type === 'fe' && !task.isRollover) {
    const slotNum = parseInt(task.id.slice(-1)) || 0
    const set = FE_TABLE[(feStartIdx + slotNum) % FE_TABLE.length]
    const range = set ? `#${set.id} ${set.title}${set.type ? ' ' + set.type : ''}` : null
    return { ...task, range }
  }
  return task
}

export function useTasks(dateStr) {
  const [data, setData] = useState(load)

  const scheduledTasks = useMemo(() => getScheduledTasks(dateStr), [dateStr])

  const rollovers = useMemo(() => (data.rollovers[dateStr] || []).map(t => ({
    ...t, rolloverKey: `ro_${t.sourceDate}_${t.id}`, isRollover: true,
  })), [data.rollovers, dateStr])

  const checks = data.checks[dateStr] || {}

  const tballProgress = useMemo(
    () => computeTballProgress(data.checks, dateStr),
    [data.checks, dateStr]
  )
  const feStartIdx = useMemo(
    () => computeFeStartIdx(data.checks, dateStr),
    [data.checks, dateStr]
  )

  // For rollover tball tasks, compute range based on sourceDate
  const rolloversWithRange = useMemo(() => rollovers.map(t => {
    if (t.type === 'tball' && TBALL_PROBLEMS[t.id]) {
      const srcProgress = computeTballProgress(data.checks, t.sourceDate)
      return { ...t, range: getProblemRange(t.id, srcProgress[t.id] || 0) }
    }
    return t
  }), [rollovers, data.checks])

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

  const todayTasks = useMemo(() =>
    scheduledTasks.map(t => ({
      ...augment({ ...t, isRollover: false, rolloverKey: null }, tballProgress, feStartIdx),
    })),
    [scheduledTasks, tballProgress, feStartIdx]
  )

  const allTasks = [...rolloversWithRange, ...todayTasks]

  const doneCount = allTasks.filter(t => checks[t.isRollover ? t.rolloverKey : t.id]).length

  return {
    allTasks, todayTasks, rollovers: rolloversWithRange,
    checks, toggleCheck, doneCount, total: allTasks.length,
  }
}
