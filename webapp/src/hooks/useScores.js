import { useState, useCallback } from 'react'
import { load, save } from '../lib/rollover.js'

export const SCOREABLE = new Set(['event_math_mock', 'event_mock_edu', 'event_deepf', 'event_mock_jun'])

export function useScores() {
  const [scores, setScoresState] = useState(() => load().scores || {})

  const setScore = useCallback((dateStr, eventId, value) => {
    setScoresState(prev => {
      const day = { ...(prev[dateStr] || {}) }
      if (value === '' || value == null) {
        delete day[eventId]
      } else {
        const num = Number(value)
        if (!isNaN(num)) day[eventId] = Math.max(0, Math.min(100, num))
      }
      const updated = { ...prev, [dateStr]: day }
      save({ ...load(), scores: updated })
      return updated
    })
  }, [])

  return { scores, setScore }
}
