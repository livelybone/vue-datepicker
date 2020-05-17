import { objectDeepMerge } from '@livelybone/copy'
import VuePopper from '@livelybone/vue-popper'
import IconDel from './IconDel'

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
    inputStyle: [String, Object],
    popperProps: Object,
    scrollbarProps: Object,
  },
  data() {
    return {
      isFocus: false,
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
      return objectDeepMerge(
        {},
        this.defaultPopperProps,
        this.popperProps || {},
      )
    },
    isMobile() {
      return this.scrollbarProps && this.scrollbarProps.isMobile
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
    focus() {
      this.isFocus = true
    },
    onClear() {
      this.blur({ target: { value: '' } })
    },
  },
  components: { popper: VuePopper, IconDel },
  beforeMount() {
    this.blur(this.value, false)
    window.addEventListener('click', this.hide)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hide)
  },
}
