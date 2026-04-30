import { useState, useCallback } from 'react'
import { getScheduledTasks } from '../data/schedule.js'
import { load, save } from '../lib/rollover.js'

export function useTasks(dateStr) {
  const [data, setData] = useState(load)

  const scheduledTasks = getScheduledTasks(dateStr)
  const rollovers = (data.rollovers[dateStr] || []).map(t => ({
    ...t,
    rolloverKey: `ro_${t.sourceDate}_${t.id}`,
    isRollover: true,
  }))
  const checks = data.checks[dateStr] || {}

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

  const allTasks = [
    ...rollovers,
    ...scheduledTasks.map(t => ({ ...t, isRollover: false, rolloverKey: null })),
  ]

  const doneCount = allTasks.filter(t => {
    const key = t.isRollover ? t.rolloverKey : t.id
    return checks[key]
  }).length

  return { allTasks, checks, toggleCheck, doneCount, total: allTasks.length }
}
