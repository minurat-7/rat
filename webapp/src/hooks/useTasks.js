import { useState, useEffect, useCallback } from 'react'
import { getScheduledTasks, addDays, todayStr } from '../data/schedule.js'

const LS_KEY = 'planner-2026'

function load() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || { checks: {}, rollovers: {} }
  } catch {
    return { checks: {}, rollovers: {} }
  }
}

function save(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

// Move unchecked tasks from fromDate into toDate's rollover list
function computeRollovers(data, fromDate, toDate) {
  const scheduled = getScheduledTasks(fromDate)
  const checks = data.checks[fromDate] || {}
  const existingRollovers = data.rollovers[fromDate] || []

  const unchecked = [
    ...scheduled.filter(t => !checks[t.id]),
    ...existingRollovers.filter(t => !checks[`ro_${t.sourceDate}_${t.id}`]),
  ]

  if (unchecked.length === 0) return data

  const newRollovers = unchecked.map(t => ({
    id: t.id,
    text: t.text,
    type: t.type,
    sourceDate: t.sourceDate || fromDate,
  }))

  const existing = data.rollovers[toDate] || []
  // Avoid duplicates
  const merged = [
    ...existing,
    ...newRollovers.filter(nr => !existing.some(e => e.id === nr.id && e.sourceDate === nr.sourceDate)),
  ]

  return { ...data, rollovers: { ...data.rollovers, [toDate]: merged } }
}

export function useTasks(dateStr) {
  const [data, setData] = useState(load)
  const today = todayStr()

  // On mount: roll over from last visited date up to today
  useEffect(() => {
    const raw = load()
    const lastVisit = raw.lastVisit
    if (!lastVisit || lastVisit >= today) {
      save({ ...raw, lastVisit: today })
      setData({ ...raw, lastVisit: today })
      return
    }

    let updated = { ...raw }
    let cursor = lastVisit
    while (cursor < today) {
      const next = addDays(cursor, 1)
      updated = computeRollovers(updated, cursor, next)
      cursor = next
    }
    updated.lastVisit = today
    save(updated)
    setData(updated)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
