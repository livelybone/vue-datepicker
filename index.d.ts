// eslint-disable-next-line import/no-extraneous-dependencies
import { VuePopperProps } from '@livelybone/vue-popper'
import Vue from 'vue'
import { VueScrollbarProps } from 'vue-scrollbar-live'

declare class CommonProps extends Vue {
  /**
   * Id of input element
   * */
  id: string | number
  /**
   * value of component
   * */
  value: string
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
   * Default to:
   * { isMobile: false, maxHeight: 200 }
   * */
  scrollbarProps?: VueScrollbarProps
}

declare class Datepicker extends CommonProps {
  /**
   * Used to set day name
   *
   * Default to:
   * ['日', '一', '二', '三', '四', '五', '六']
   * */
  dayStr: string[]
}

declare class Timepicker extends CommonProps {
  /**
   * Used to set time name
   *
   * Default to:
   * ['时', '分', '秒']
   * */
  timeStr: string[]
  /**
   * Used to set text of button
   *
   * Default to:
   * '确定'
   * */
  btnStr: string[]
}

declare class DatetimePicker extends CommonProps {
  /**
   * Used to set day name
   *
   * Default to:
   * ['日', '一', '二', '三', '四', '五', '六']
   * */
  dayStr: string[]
  /**
   * Used to set time name
   *
   * Default to:
   * ['时', '分', '秒']
   * */
  timeStr: string[]
  /**
   * Used to set text of button
   *
   * Default to:
   * '确定'
   * */
  btnStr: string[]
}

export { Datepicker, Timepicker, DatetimePicker }
