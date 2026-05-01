import { useState, useCallback } from 'react'
import { getScheduledTasks } from '../data/schedule.js'
import { load, save } from '../lib/rollover.js'
import { TBALL_PROBLEMS, getProblemRange } from '../data/tballProblems.js'

export function useTasks(dateStr) {
  const [data, setData] = useState(load)

  const scheduledTasks = getScheduledTasks(dateStr)
  const rollovers = (data.rollovers[dateStr] || []).map(t => ({
    ...t,
    rolloverKey: `ro_${t.sourceDate}_${t.id}`,
    isRollover: true,
  }))
  const checks = data.checks[dateStr] || {}

  // taskId = check key, tballSubjectId = task.id if this is a tball task (else null)
  const toggleCheck = useCallback((taskId, tballSubjectId) => {
    setData(prev => {
      const wasChecked = (prev.checks[dateStr] || {})[taskId]
      const newChecks = {
        ...prev.checks,
        [dateStr]: { ...(prev.checks[dateStr] || {}), [taskId]: !wasChecked },
      }

      let tballProgress = { ...(prev.tballProgress || {}) }
      if (tballSubjectId && TBALL_PROBLEMS[tballSubjectId]) {
        const total = TBALL_PROBLEMS[tballSubjectId].length
        const cur = tballProgress[tballSubjectId] || 0
        tballProgress[tballSubjectId] = wasChecked
          ? Math.max(0, cur - 10)
          : (cur + 10) % total
      }

      const updated = { ...prev, checks: newChecks, tballProgress }
      save(updated)
      return updated
    })
  }, [dateStr])

  const tballProgress = data.tballProgress || {}

  const allTasks = [
    ...rollovers,
    ...scheduledTasks.map(t => {
      const range = (t.type === 'tball' && TBALL_PROBLEMS[t.id])
        ? getProblemRange(t.id, tballProgress[t.id] || 0)
        : null
      return { ...t, isRollover: false, rolloverKey: null, range }
    }),
  ]

  const doneCount = allTasks.filter(t => {
    const key = t.isRollover ? t.rolloverKey : t.id
    return checks[key]
  }).length

  return { allTasks, checks, toggleCheck, doneCount, total: allTasks.length }
}
