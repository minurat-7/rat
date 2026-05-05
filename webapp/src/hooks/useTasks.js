import { useState, useCallback, useMemo } from 'react'
import { getScheduledTasks, FE_TABLE } from '../data/schedule.js'
import { load, save } from '../lib/rollover.js'
import { TBALL_PROBLEMS, getProblemRange } from '../data/tballProblems.js'
import { LECTURE_LISTS, getLecRange } from '../data/lectureLists.js'

const TBALL_IDS = Object.keys(TBALL_PROBLEMS)
const FE_START  = '2026-05-17'

function computeTballIdx(tballStart = {}) {
  const result = {}
  for (const id of TBALL_IDS) {
    result[id] = (tballStart[id] || 0) % TBALL_PROBLEMS[id].length
  }
  return result
}

function computeLecCounts(lecStart = {}) {
  const result = {}
  for (const id of Object.keys(LECTURE_LISTS)) {
    result[id] = lecStart[id] || 0
  }
  return result
}

function getTballId(taskKey) {
  if (TBALL_PROBLEMS[taskKey]) return taskKey
  const m = taskKey.match(/^ro_[\d-]+_(.+)$/)
  return (m && TBALL_PROBLEMS[m[1]]) ? m[1] : null
}

function getLecId(taskKey) {
  if (LECTURE_LISTS[taskKey]) return taskKey
  const m = taskKey.match(/^ro_[\d-]+_(.+)$/)
  return (m && LECTURE_LISTS[m[1]]) ? m[1] : null
}

function computeFeStartIdx(checks, upToDate) {
  if (upToDate <= FE_START) return 0
  let count = 0
  let cursor = FE_START
  while (cursor < upToDate) {
    const dc = checks[cursor] || {}
    const n = getScheduledTasks(cursor).filter(t => t.type === 'fe').length
    for (let i = 0; i < n; i++) { if (dc[`fe_slot_${i}`]) count++ }
    cursor = new Date(cursor + 'T00:00:00')
    cursor.setDate(cursor.getDate() + 1)
    cursor = cursor.toISOString().slice(0, 10)
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

  const tballIdxToday = useMemo(() => computeTballIdx(data.tballStart), [data.tballStart])
  const lecCountsToday = useMemo(() => computeLecCounts(data.lecStart), [data.lecStart])
  const feStartIdx = useMemo(
    () => computeFeStartIdx(data.checks, dateStr),
    [data.checks, dateStr]
  )

  const rolloversWithRange = useMemo(() => rollovers.map(t => {
    if (t.type === 'tball' && TBALL_PROBLEMS[t.id]) {
      const idx = (data.tballStart[t.id] || 0) % TBALL_PROBLEMS[t.id].length
      return { ...t, range: getProblemRange(t.id, idx) }
    }
    if (t.type === 'lecture' && LECTURE_LISTS[t.id]) {
      return { ...t, range: getLecRange(t.id, data.lecStart[t.id] || 0) }
    }
    return t
  }), [rollovers, data.tballStart, data.lecStart])

  const toggleCheck = useCallback((taskId) => {
    setData(prev => {
      const wasChecked = !!(prev.checks[dateStr] || {})[taskId]
      const newChecked = !wasChecked

      const tballId = getTballId(taskId)
      const tballStart = { ...(prev.tballStart || {}) }
      if (tballId) {
        const cur = tballStart[tballId] || 0
        tballStart[tballId] = newChecked ? cur + 10 : Math.max(0, cur - 10)
      }

      const lecId = getLecId(taskId)
      const lecStart = { ...(prev.lecStart || {}) }
      if (lecId) {
        const cur = lecStart[lecId] || 0
        lecStart[lecId] = newChecked ? cur + 1 : Math.max(0, cur - 1)
      }

      const updated = {
        ...prev,
        tballStart,
        lecStart,
        checks: {
          ...prev.checks,
          [dateStr]: { ...(prev.checks[dateStr] || {}), [taskId]: newChecked },
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
  const [data] = useState(load)
  const tballIdx  = useMemo(() => computeTballIdx(data.tballStart), [data.tballStart])
  const lecCounts = useMemo(() => computeLecCounts(data.lecStart),  [data.lecStart])
  return { tballIdx, lecCounts }
}
