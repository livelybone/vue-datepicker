import * as DateGenerator from '@livelybone/date-generator'

export const dateReg = /^((\d{4})-?(\d{1,2})?-?(\d{1,2})?)/

export function dateCompare(d1, d2, flag = 1, type = 'date') {
  if (!d2 || !d1) return true

  const d11 = typeof d1 === 'object' ? d1 : DateGenerator.parseDate(d1)
  const d21 = typeof d2 === 'object' ? d2 : DateGenerator.parseDate(d2)

  if (flag !== 0) {
    if (type === 'year') return (d11.year - d21.year) * flag >= 0
    if (type === 'month') {
      return (
        (d11.year - d21.year) * flag > 0 ||
        (+d11.year === +d21.year && (d11.month - d21.month) * flag >= 0)
      )
    }
    return (
      (d11.year - d21.year) * flag > 0 ||
      (+d11.year === +d21.year && (d11.month - d21.month) * flag > 0) ||
      (+d11.year === +d21.year &&
        +d11.month === +d21.month &&
        (d11.date - d21.date) * flag >= 0)
    )
  }

  if (type === 'year') return d11.year - d21.year === 0
  if (type === 'month') {
    return +d11.year === +d21.year && d11.month - d21.month === 0
  }
  return (
    +d11.year === +d21.year &&
    +d11.month === +d21.month &&
    d11.date - d21.date === 0
  )
}
