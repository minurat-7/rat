import { getScheduledTasks, addDays, todayStr } from '../data/schedule.js'

export const LS_KEY = 'planner-2026'
export const PLAN_START = '2026-04-26'
const STORAGE_VER = 2  // bump to force re-rollover on all clients

export function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || { checks: {}, rollovers: {} } }
  catch { return { checks: {}, rollovers: {} } }
}

export function save(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

export function computeRollovers(data, fromDate, toDate) {
  const scheduled = getScheduledTasks(fromDate)
  const checks = data.checks[fromDate] || {}
  const prevRollovers = data.rollovers[fromDate] || []

  const unchecked = [
    ...scheduled.filter(t => !checks[t.id]),
    ...prevRollovers.filter(t => !checks[`ro_${t.sourceDate}_${t.id}`]),
  ]
  if (!unchecked.length) return data

  const newItems = unchecked.map(t => ({
    id: t.id, text: t.text, type: t.type,
    sourceDate: t.sourceDate || fromDate,
  }))
  const existing = data.rollovers[toDate] || []
  const merged = [
    ...existing,
    ...newItems.filter(n => !existing.some(e => e.id === n.id && e.sourceDate === n.sourceDate)),
  ]
  return { ...data, rollovers: { ...data.rollovers, [toDate]: merged } }
}

export function runRollover() {
  const today = todayStr()
  const raw = load()

  // If version mismatch, reset lastVisit to force full re-rollover from PLAN_START
  const lastVisit = (raw.ver || 0) < STORAGE_VER ? PLAN_START : (raw.lastVisit || PLAN_START)

  if (lastVisit >= today) {
    save({ ...raw, ver: STORAGE_VER, lastVisit: today })
    return
  }

  let updated = { ...raw, ver: STORAGE_VER, rollovers: {} }  // clear stale rollovers
  let cursor = lastVisit
  while (cursor < today) {
    const next = addDays(cursor, 1)
    updated = computeRollovers(updated, cursor, next)
    cursor = next
  }
  updated.lastVisit = today
  save(updated)
}
