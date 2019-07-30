// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'

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
  inputStyle?: Object
  /**
   * Props of module [@livelybone/vue-popper](https://github.com/livelybone/vue-popper)
   *
   * Default to：
   * {
   *   arrowPosition: 'start',
   *   arrowOffsetScaling: 1,
   *   popperOptions: {
   *     placement: 'bottom-start',
   *     positionFixed: true,
   *     // more options in https://popper.js.org
   *   },
   * }
   * */
  popperProps?: Object
  /**
   * Props of scrollbar, see [vue-scrollbar-live](https://github.com/livelybone/vue-scrollbar-live)
   *
   * Default to:
   * { isMobile: false, maxHeight: 200 }
   * */
  scrollbarProps?: Object
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
