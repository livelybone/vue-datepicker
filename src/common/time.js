import * as DateGenerator from '@livelybone/date-generator'

export const timeReg = /^((\d{1,2}):?(\d{1,2})?:?(\d{1,2})?)/

export function timeCompare(t1, t2, flag = 1, type = 'second') {
  if (!t2 || !t1) return true

  const t11 = typeof t1 === 'object' ? t1 : DateGenerator.parseTime(t1)
  const t21 = typeof t2 === 'object' ? t2 : DateGenerator.parseTime(t2)

  if (flag !== 0) {
    if (type === 'hour') return (t11.hour - t21.hour) * flag >= 0
    if (type === 'minute') {
      return (
        (t11.hour - t21.hour) * flag > 0 ||
        (+t11.hour === +t21.hour && (t11.minute - t21.minute) * flag >= 0)
      )
    }
    return (
      (t11.hour - t21.hour) * flag > 0 ||
      (+t11.hour === +t21.hour && (t11.minute - t21.minute) * flag > 0) ||
      (+t11.hour === +t21.hour &&
        +t11.minute === +t21.minute &&
        (t11.second - t21.second) * flag >= 0)
    )
  }

  if (type === 'hour') return t11.hour - t21.hour === 0
  if (type === 'minute') {
    return +t11.hour === +t21.hour && t11.minute - t21.minute === 0
  }
  return (
    +t11.hour === +t21.hour &&
    +t11.minute === +t21.minute &&
    t11.second - t21.second === 0
  )
}
