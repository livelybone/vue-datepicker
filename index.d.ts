// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import { GntCalendarOptions } from '@livelybone/date-generator'
import { VuePopperProps } from '@livelybone/vue-popper'
import { VueScrollbarProps } from 'vue-scrollbar-live'

declare class CommonProps extends Vue {
  /**
   * Id of input element
   * */
  id?: string | number

  placeholder?: string

  min?: string

  max?: string

  canEdit?: boolean

  inputStyle?: CSSStyleDeclaration | string

  /**
   * Props of module [@livelybone/vue-popper](https://github.com/livelybone/vue-popper)
   *
   * Default to：
   * {
   *   arrowPosition: 'start',
   *   arrowOffsetScaling: 1,
   *   popperOptions: {
   *     placement: 'bottom-start',
   *     modifiers: {
   *       preventOverflow: {
   *         boundariesElement:
   *           typeof document !== 'undefined' ? document.body : '',
   *       },
   *     },
   *   },
   * }
   * */
  popperProps?: VuePopperProps

  /**
   * Props of scrollbar, see [vue-scrollbar-live](https://github.com/livelybone/vue-scrollbar-live)
   *
   * Default to: { isMobile: false, maxHeight: 200 }
   * */
  scrollbarProps?: VueScrollbarProps
}

declare class Datepicker extends CommonProps {
  value?: string

  /**
   * Options: 'year', 'month', 'date'
   *
   * Default: 'date'
   * */
  type?: string

  /**
   * Used to set day name
   *
   * Default to:
   * ['日', '一', '二', '三', '四', '五', '六']
   * */
  dayStr?: string[]

  /**
   * Used to set month name
   *
   * Default to:
   * `['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']`
   * */
  monthStr?: string[]

  firstDayOfWeek?: GntCalendarOptions['firstDayOfWeek']

  multiple: boolean

  /**
   * Used to set text of button
   *
   * Default to: '确定'
   * */
  btnStr: string
}

declare class DateRangePicker extends CommonProps {
  value?: [string, string] | [string] | []

  /**
   * Options: 'year', 'month', 'date'
   *
   * Default: 'date'
   * */
  type?: string

  /**
   * Used to set day name
   *
   * Default to:
   * ['日', '一', '二', '三', '四', '五', '六']
   * */
  dayStr?: string[]

  /**
   * Used to set month name
   *
   * Default to:
   * `['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']`
   * */
  monthStr?: string[]

  firstDayOfWeek?: GntCalendarOptions['firstDayOfWeek']

  rangeSeparator?: string

  secondPlaceholder?: string
}

declare class Timepicker extends CommonProps {
  value?: string

  /**
   * Options: 'hour', 'minute', 'second'
   *
   * Default: 'second'
   * */
  type?: string

  /**
   * Used to set time name
   *
   * Default to: ['时', '分', '秒']
   * */
  timeStr?: string[]

  /**
   * Used to set text of button
   *
   * Default to: '确定'
   * */
  btnStr?: string
}

declare class DatetimePicker extends CommonProps {
  value?: string

  /**
   * Used to set day name. Start with Sunday
   *
   * Default to: ['日', '一', '二', '三', '四', '五', '六']
   * */
  dayStr?: string[]

  /**
   * Used to set month name
   *
   * Default to:
   * `['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']`
   * */
  monthStr?: string[]

  firstDayOfWeek?: GntCalendarOptions['firstDayOfWeek']

  /**
   * Used to set time name
   *
   * Default to: ['时', '分', '秒']
   * */
  timeStr?: string[]

  /**
   * Used to set text of button
   *
   * Default to: '确定'
   * */
  btnStr?: string

  /**
   * Options: 'hour', 'minute', 'second'
   *
   * Default to: 'second'
   * */
  timeType?: string
}

/**
 * Svg icon
 * */
declare class IconDate extends Vue {}

/**
 * Svg icon
 * */
declare class IconTime extends Vue {}

export {
  Datepicker,
  DateRangePicker,
  Timepicker,
  DatetimePicker,
  IconTime,
  IconDate,
}
