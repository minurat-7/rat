function subLecs(startMain, startSub, endMain, endSub) {
  const items = []
  for (let m = startMain; m <= endMain; m++) {
    const s0 = m === startMain ? startSub : 1
    const s1 = m === endMain   ? endSub   : 3
    for (let s = s0; s <= s1; s++) items.push(`${m}-${s}`)
  }
  return items
}

function nums(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => String(i + start))
}

export const LECTURE_LISTS = {
  lec_hanji_ban:  { label: '한지',     items: subLecs(9, 1, 13, 3), per: 1.5 },
  lec_seji_ban:   { label: '세지',     items: subLecs(8, 1, 13, 3), per: 1.5 },
  lec_hanji_tech: { label: '한지 기출', items: nums(4, 9),           per: 1   },
  lec_seji_tech:  { label: '세지 기출', items: nums(2, 9),           per: 1   },
  lec_ko_lit:     { label: '국어 문학', items: nums(10, 30),         per: 1   },
}

export function getLecRange(lectureId, occurrenceCount) {
  const lec = LECTURE_LISTS[lectureId]
  if (!lec) return null

  const offset = occurrenceCount * lec.per
  if (offset >= lec.items.length) return '완료'

  const si = Math.floor(offset)
  const halfStart = offset % 1 !== 0

  if (lec.per === 1) return `${lec.items[si]}강`

  const endOffset = offset + lec.per
  const ei = Math.min(Math.floor(endOffset), lec.items.length - 1)
  const halfEnd = endOffset % 1 !== 0 && ei < lec.items.length

  const s = `${lec.items[si]}강${halfStart ? ' 반' : ''}`
  const e = `${lec.items[ei]}강${halfEnd   ? ' 반' : ''}`
  return s === e ? s : `${s} ~ ${e}`
}
