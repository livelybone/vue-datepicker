import { objectDeepMerge } from '@livelybone/copy'
import VuePopper from '@livelybone/vue-popper'
import moment from 'moment'
import { dateReg } from './date'

export const internalDateFormat = 'YYYY-MM-DD'
const timeFormat = 'HH:mm:ss'

export default {
  props: {
    id: [String, Number],
    value: String,
    placeholder: String,
    min: String,
    max: String,
    canEdit: {
      default: true,
      type: Boolean,
    },
    dateFormat: { String, default: 'YYYY-MM-DD' },
    inputStyle: [String, Object],
    popperProps: Object,
    scrollbarProps: Object,
  },
  data() {
    return {
      showPicker: false,
      defaultPopperProps: Object.freeze({
        arrowPosition: 'start',
        arrowOffsetScaling: 1,
        popperOptions: {
          placement: 'bottom-start',
          modifiers: {
            preventOverflow: {
              boundariesElement:
                typeof document !== 'undefined' ? document.body : '',
            },
          },
        },
      }),
    }
  },
  computed: {
    $popperProps() {
      return objectDeepMerge({}, this.defaultPopperProps, this.popperProps)
    },
    isMobile() {
      return this.scrollbarProps && this.scrollbarProps.isMobile
    },
    formattedDateValue() {
      return this.value
        ? moment(this.value, internalDateFormat).format(this.dateFormat)
        : null
    },
    formattedDatetimeValue() {
      return this.value
        ? moment(this.value, `${internalDateFormat} ${timeFormat}`).format(
            `${this.dateFormat} ${timeFormat}`,
          )
        : null
    },
  },
  methods: {
    hide(hide = true) {
      if (typeof hide === 'object') {
        const { target } = hide
        if (!(target && this.$refs.wrap.contains(target))) {
          this.showPicker = !hide
        }
      } else this.showPicker = !hide
    },
    choseHeadType(val) {
      setTimeout(() => {
        this.choseType = val
      })
    },
    parseInputDate(val) {
      if (dateReg.test(val)) {
        return val
      }
      if (moment(val, this.dateFormat, true).isValid()) {
        return moment(val, this.dateFormat).format(internalDateFormat)
      }
      if (val) {
        console.warn('vue-datepicker mixin parseInputDate: value is invalid')
      }
      return ''
    },
  },
  components: { popper: VuePopper },
  beforeMount() {
    this.blur(this.value, false)
    window.addEventListener('click', this.hide)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hide)
  },
}
