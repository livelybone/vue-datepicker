import {
  compareDates,
  DateInfoBase,
  DateInfoBase1,
  DateStr,
  fillTo,
  getMonthByStep,
  getMonthLen,
  parseDate,
  parseTime,
  TimeInfo,
  TimeStr,
} from '@livelybone/date-generator'

export const dateReg = /^((\d{4})-?(\d{1,2})?-?(\d{1,2})?)/
export const timeReg = /^((\d{1,2}):?(\d{1,2})?:?(\d{1,2})?)/
export const AllTypes = ['year', 'month', 'date', 'time'] as const
export const AllTimeTypes = ['hour', 'minute', 'second'] as const
export type TAllTypes = typeof AllTypes extends Readonly<(infer A)[]>
  ? A
  : never
export type TAllTimeTypes = typeof AllTimeTypes extends Readonly<(infer A)[]>
  ? A
  : never

export function sliceUtilEqual<T extends any>(arr: T[], val: T) {
  const index = Object.keys(arr).find(i => arr[+i] === val)
  if (!index) return arr
  return arr.slice(0, +index + 1)
}

// flag：
//    -1 - 如果 d1 小于等于 d2，返回 true
//    1 - 如果 d1 大于等于 d2，返回 true
//    0 - 如果 d1 等于 d2，返回 true
export function dateCompare<
  T extends Partial<DateInfoBase1>,
  U extends Partial<DateInfoBase1>
>(
  date: T | DateStr | undefined | null,
  targetDate: U | DateStr | undefined | null,
  flag = 1,
  type: Exclude<TAllTypes, 'time'> = 'date',
) {
  const $date =
    typeof date === 'string' ? parseDate(date) : date ? { ...date } : undefined
  const $targetDate =
    typeof targetDate === 'string'
      ? parseDate(targetDate)
      : targetDate
      ? { ...targetDate }
      : undefined

  if (!$date) return false
  if (!$targetDate) return true

  if (type === 'year') {
    $date.month = '01'
    $date.date = '01'
    $targetDate.month = '01'
    $targetDate.date = '01'
  } else if (type === 'month') {
    $date.date = '01'
    $targetDate.date = '01'
  }

  const compare = compareDates($date as any, $targetDate as any)
  return flag === 0 ? compare === 0 : compare * flag >= 0
}

// flag：
//    -1 - 如果 t1 小于等于 t2，返回 true
//    1 - 如果 t1 大于等于 t2，返回 true
//    0 - 如果 t1 等于 t2，返回 true
export function timeCompare(
  time?: TimeInfo | string,
  targetTime?: TimeInfo | string,
  flag = 1,
  type: TAllTimeTypes = 'second',
) {
  const $time =
    typeof time === 'string' ? parseTime(time) : time ? { ...time } : undefined
  const $targetTime =
    typeof targetTime === 'string'
      ? parseTime(targetTime)
      : targetTime
      ? { ...targetTime }
      : undefined

  if (!$time) return false
  if (!$targetTime) return true

  if (type === 'hour') {
    $time.minute = '00'
    $time.second = '00'
    $targetTime.minute = '00'
    $targetTime.second = '00'
  } else if (type === 'minute') {
    $time.second = '00'
    $targetTime.second = '00'
  }

  const get = (t: TimeInfo) =>
    +`${fillTo(2, t.hour)}${fillTo(2, t.minute)}${fillTo(2, t.second)}`
  const compare = get($time) - get($targetTime)

  return flag === 0 ? compare === 0 : compare * flag >= 0
}

export function datetimeCompare(
  datetime: (DateInfoBase & Partial<TimeInfo>) | undefined,
  targetDatetime: (DateInfoBase & TimeInfo) | undefined,
  flag = 1,
  type: TAllTimeTypes = 'second',
) {
  if (!datetime) return false
  if (!targetDatetime) return true

  if (flag === 0)
    return (
      dateCompare(datetime, targetDatetime, flag) &&
      (datetime.hour === undefined ||
        timeCompare(datetime as TimeInfo, targetDatetime, flag))
    )

  const compare = dateCompare(datetime, targetDatetime, flag)

  if (!compare) return false

  const compareReverse = dateCompare(datetime, targetDatetime, -flag)

  if (compareReverse)
    return (
      datetime.hour === undefined ||
      timeCompare(datetime as TimeInfo, targetDatetime, flag, type)
    )
  return true
}

function $fillTo(width: number, num?: string | number) {
  return num !== undefined ? fillTo(width, num) : ''
}

export function getTenYears(val: DateInfoBase) {
  if (!val) return ''

  const tenYear = Math.floor(+val.year / 10 - 0.5)
  return `${tenYear * 10 + 1} - ${(tenYear + 1) * 10}`
}

export function createEmptyTimeObj() {
  return { year: '', month: '', date: '', hour: '', minute: '', second: '' }
}

export function createNowTimeObj() {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  }
}

export function formatDateObj(val: DateInfoBase1) {
  return {
    year: (val.year && fillTo(4, val.year)) || '',
    month: (val.month && fillTo(2, val.month)) || '',
    date: (val.date && fillTo(2, val.date)) || '',
  }
}

export function formatTimeObj(
  val: { [key in keyof TimeInfo]: number | string },
) {
  return {
    hour: (val.hour && fillTo(2, val.hour)) || '',
    minute: (val.minute && fillTo(2, val.minute)) || '',
    second: (val.second && fillTo(2, val.second)) || '',
  }
}

export function formatDate(d: DateInfoBase, type: TAllTypes = 'date') {
  if (!d) return ''

  const arr = []
  const year = $fillTo(4, d.year)
  if (year) {
    arr.push(year)

    const month = $fillTo(2, d.month)
    if (month) {
      arr.push(month)

      const date = $fillTo(2, d.date)
      if (date) arr.push(date)
    }
  }

  return arr.slice(0, sliceUtilEqual(AllTypes as any, type).length).join('-')
}

export function formatTime(t: TimeInfo, type: TAllTimeTypes = 'second') {
  if (!t) return ''

  const arr = []
  const hour = $fillTo(2, t.hour)
  if (hour) {
    arr.push(hour)

    const minute = $fillTo(2, t.minute)
    if (minute) {
      arr.push(minute)

      const second = $fillTo(2, t.second)
      if (second) arr.push(second)
    }
  }

  return arr
    .slice(0, sliceUtilEqual(AllTimeTypes as any, type).length)
    .join(':')
}

function mergePropExceptEmpty(o1: any, o2: any) {
  return Object.keys({ ...o1, ...o2 }).reduce(
    (pre, k) => ({ ...pre, [k]: (o2 && o2[k]) || (o1 && o1[k]) }),
    o1,
  )
}

export function dealDateLimit(
  min: DateStr | undefined,
  max: DateStr | undefined,
) {
  const error: string[] = []
  const minDate = (min && parseDate(min)) || undefined
  if (min && !minDate) error.push(`Prop min(${min}) is invalid`)
  const maxDate = (max && parseDate(max)) || undefined
  if (max && !maxDate) error.push(`Prop max(${max}) is invalid`)
  return {
    minDate: formatDateObj(
      mergePropExceptEmpty({ year: '0000', month: '01', date: '01' }, minDate),
    ),
    maxDate: formatDateObj(
      mergePropExceptEmpty({ year: '9999', month: '12', date: '31' }, maxDate),
    ),
    error: error.join(';'),
  }
}

export function dealTimeLimit(
  min: TimeStr | undefined,
  max: TimeStr | undefined,
) {
  const error: string[] = []
  const minTime = (min && parseTime(min)) || undefined
  if (min && !minTime) error.push(`Prop min(${min}) is invalid`)
  const maxTime = (max && parseTime(max)) || undefined
  if (max && !maxTime) error.push(`Prop max(${max}) is invalid`)
  return {
    minTime: formatTimeObj(
      mergePropExceptEmpty({ hour: '00', minute: '00', second: '00' }, minTime),
    ),
    maxTime: formatTimeObj(
      mergePropExceptEmpty({ hour: '23', minute: '59', second: '59' }, maxTime),
    ),
    error: error.join(';'),
  }
}

export function dealDatetimeLimit(
  min: string | undefined,
  max: string | undefined,
  selectedDate?: DateInfoBase,
) {
  const minArr = (min || '').trim().split(/\s+/)
  const maxArr = (max || '').trim().split(/\s+/)
  const { minDate, maxDate } = dealDateLimit(minArr[0], maxArr[0])
  const compare = {
    toMin: minDate && selectedDate ? compareDates(selectedDate, minDate) : 1,
    toMax: maxDate && selectedDate ? compareDates(selectedDate, maxDate) : -1,
  }

  const { minTime: $minTime, maxTime: $maxTime } = dealTimeLimit(
    minArr[1],
    maxArr[1],
  )

  const error: string[] = []
  const minDatetime = minDate ? { ...minDate, ...$minTime } : undefined
  if (min && !minDatetime) error.push(`Prop min(${min}) is invalid`)
  const maxDatetime = maxDate ? { ...maxDate, ...$maxTime } : undefined
  if (max && !maxDatetime) error.push(`Prop min(${max}) is invalid`)
  const minTime = (() => {
    if (compare.toMin === 0) return $minTime
    if (compare.toMin < 0) return { hour: '23', minute: '59', second: '59' }
    return { hour: '00', minute: '00', second: '00' }
  })()
  const maxTime = (() => {
    if (compare.toMax === 0) return $maxTime
    if (compare.toMax > 0) return { hour: '00', minute: '00', second: '00' }
    return { hour: '23', minute: '59', second: '59' }
  })()
  return {
    minArr,
    maxArr,
    minDate,
    maxDate,
    minTime,
    maxTime,
    minDatetime,
    maxDatetime,
    error: error.join(';'),
  }
}

export function getNextMonthFirstDate(
  dateInfo?: DateInfoBase1,
): typeof dateInfo extends undefined ? undefined : DateInfoBase {
  if (!dateInfo) return undefined as any

  const month = getMonthByStep(dateInfo, 1)
  return { ...month, date: fillTo(2, 1) }
}

export function getPrevMonthLastDate(
  dateInfo?: DateInfoBase1,
): typeof dateInfo extends undefined ? undefined : DateInfoBase {
  if (!dateInfo) return undefined as any

  const month = getMonthByStep(dateInfo, -1)
  return { ...month, date: fillTo(2, getMonthLen(month.year, month.month)) }
}

export function getCurrMonthLastDate(
  dateInfo?: DateInfoBase1,
): typeof dateInfo extends undefined ? undefined : DateInfoBase {
  if (!dateInfo) return undefined as any

  return formatDateObj({
    ...dateInfo,
    date: fillTo(2, getMonthLen(dateInfo.year, dateInfo.month)),
  })
}

export function getPrevYearLastDate(year: string | number) {
  if (!year) return undefined
  return { year: fillTo(4, +year - 1), month: '12', date: '31' }
}

export function getCurrYearLastDate(year: string | number) {
  if (!year) return undefined
  return { year: fillTo(4, +year), month: '12', date: '31' }
}

export function getPrevTenYearLastDate(year: string | number) {
  if (!year) return undefined
  return {
    year: fillTo(4, (Math.ceil(+year / 10) - 1) * 10),
    month: '12',
    date: '31',
  }
}

export function getCurrTenYearLastDate(year: string | number) {
  if (!year) return undefined
  return {
    year: fillTo(4, Math.ceil(+year / 10) * 10),
    month: '12',
    date: '31',
  }
}

export function getNextYearFirstDate(year: string | number) {
  if (!year) return undefined
  return { year: fillTo(4, +year + 1), month: '01', date: '01' }
}

export function getNextTenYearFirstDate(year: string | number) {
  if (!year) return undefined
  return {
    year: fillTo(4, Math.ceil(+year / 10) * 10 + 1),
    month: '01',
    date: '01',
  }
}

export function getFirstMaxDate(
  val: DateInfoBase1,
  type: Exclude<TAllTypes, 'time'> = 'date',
) {
  if (!val) return undefined
  if (type === 'year') return getPrevTenYearLastDate(val.year)
  if (type === 'month') return getPrevYearLastDate(val.year)
  return getPrevMonthLastDate(val)
}

export function getLastMinDate(
  val: DateInfoBase1,
  type: Exclude<TAllTypes, 'time'> = 'date',
) {
  if (!val) return undefined
  if (type === 'year') return getNextTenYearFirstDate(val.year)
  if (type === 'month') return getNextYearFirstDate(val.year)
  return getNextMonthFirstDate(val)
}

export function dateValidator(
  val?: string | DateInfoBase1,
  type: Exclude<TAllTypes, 'time'> = 'date',
  min: any = '',
  max: any = '',
) {
  if (!val) return ''

  const date = typeof val === 'string' ? parseDate(val) : val
  const checkProps = sliceUtilEqual(AllTypes as any, type)

  if (!date || !checkProps.every(k => date[k]))
    return `Value(${val}) is invalid`

  if (
    !(
      (!min || dateCompare(date, min, 1, type)) &&
      (!max || dateCompare(date, max, -1, type))
    )
  ) {
    return `Value${val} is out of range`
  }
  return ''
}

export function timeValidator(
  val?: string | TimeInfo,
  type: TAllTimeTypes = 'second',
  min: any = '',
  max: any = '',
) {
  if (!val) return ''

  const time = typeof val === 'string' ? parseTime(val) : val
  const checkProps = sliceUtilEqual(AllTimeTypes as any, type)

  if (!time || !checkProps.every(k => time[k]))
    return `Value(${val}) is invalid`

  if (
    !(
      (!min || timeCompare(time, min, 1, type)) &&
      (!max || timeCompare(time, max, -1, type))
    )
  ) {
    return `Value${val} is out of range`
  }
  return ''
}

export function parseDatetime(val: string) {
  const arr = val.trim().split(/\s+/)
  return {
    ...parseDate(arr[0]),
    ...parseTime(arr[1]),
  }
}

export function datetimeValidator(
  val?: any,
  type: TAllTimeTypes = 'second',
  min: any = '',
  max: any = '',
) {
  if (!val) return ''

  const time = typeof val === 'string' ? parseDatetime(val) : val
  const checkProps = AllTypes.slice(0, 3).concat(
    sliceUtilEqual(AllTimeTypes as any, type) as any[],
  )

  if (!time || !checkProps.every(k => time[k]))
    return `Value(${val}) is invalid`

  if (
    !(
      (!min || datetimeCompare(time, min, 1, type)) &&
      (!max || datetimeCompare(time, max, -1, type))
    )
  ) {
    return `Value${val} is out of range`
  }

  return ''
}

export function isInSameTenYear(v1: DateInfoBase1, v2: DateInfoBase1) {
  return dateCompare(v1, v2, 0, 'year')
}

export function isInSameYear(v1: DateInfoBase1, v2: DateInfoBase1) {
  return dateCompare(v1, v2, 0, 'year')
}

export function isInSameMonth(v1: DateInfoBase1, v2: DateInfoBase1) {
  return dateCompare(v1, v2, 0, 'month')
}

export function isInSamePage(
  [v1, v2]: [DateInfoBase1, DateInfoBase1],
  type?: Exclude<TAllTypes, 'time'>,
) {
  if (type === 'year') return isInSameTenYear(v1, v2)
  if (type === 'month') return isInSameYear(v1, v2)
  return isInSameMonth(v1, v2)
}

export function formatDatetime(val: any, type?: TAllTimeTypes) {
  let str = ''
  const d = formatDate(val)
  str += d
  if (!str) return ''
  const t = formatTime(val, type)
  return t ? `${str} ${t}` : ''
}
