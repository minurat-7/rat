import { useState, useCallback } from 'react'
import { load, save } from '../lib/rollover.js'

export const SCOREABLE = new Set(['event_math_mock', 'event_mock_edu', 'event_deepf', 'event_mock_jun'])

const FULL_SUBJECTS = [
  { key: 'ko',    label: '국어' },
  { key: 'en',    label: '영어' },
  { key: 'math',  label: '수학' },
  { key: 'seji',  label: '세지' },
  { key: 'hanji', label: '한지' },
]

export const SCORE_SUBJECTS = {
  event_math_mock: [{ key: 'math', label: '수학' }],
  event_mock_edu:  FULL_SUBJECTS,
  event_deepf:     FULL_SUBJECTS,
  event_mock_jun:  FULL_SUBJECTS,
}

export function useScores() {
  const [scores, setScoresState] = useState(() => load().scores || {})

  const setScore = useCallback((dateStr, scoreKey, value) => {
    setScoresState(prev => {
      const day = { ...(prev[dateStr] || {}) }
      if (value === '' || value == null) {
        delete day[scoreKey]
      } else {
        const num = Number(value)
        if (!isNaN(num)) day[scoreKey] = Math.max(0, Math.min(100, num))
      }
      const updated = { ...prev, [dateStr]: day }
      save({ ...load(), scores: updated })
      return updated
    })
  }, [])

  return { scores, setScore }
}
