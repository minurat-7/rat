import { getScheduledTasks, addDays, todayStr } from '../data/schedule.js'

export const LS_KEY = 'planner-2026'
export const PLAN_START = '2026-05-05'
const STORAGE_VER = 3

export function load() {
  try {
    const d = JSON.parse(localStorage.getItem(LS_KEY)) || {}
    return {
      checks: d.checks || {},
      rollovers: d.rollovers || {},
      tballStart: d.tballStart || {},
      lecStart: d.lecStart || {},
      scores: d.scores || {},
      ver: d.ver,
      lastVisit: d.lastVisit,
    }
  } catch { return { checks: {}, rollovers: {}, tballStart: {}, lecStart: {} } }
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

  // Always recompute from PLAN_START so cascades work correctly:
  // clearing rollovers and re-walking every day ensures unchecked tasks
  // from Apr26 roll into Apr27, then Apr28, etc., all the way to today.
  let updated = { ...raw, ver: STORAGE_VER, rollovers: {} }
  let cursor = PLAN_START
  while (cursor < today) {
    const next = addDays(cursor, 1)
    updated = computeRollovers(updated, cursor, next)
    cursor = next
  }
  updated.lastVisit = today
  save(updated)
}
