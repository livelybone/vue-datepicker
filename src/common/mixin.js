import { objectDeepMerge } from '@livelybone/copy'
import VuePopper from '@livelybone/vue-popper'

/**
 * Use timeout to trigger make sure that this callback is triggered after click event
 * */
export function triggerAfterClickEvent(cb) {
  setTimeout(cb)
}

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
  watch: {
    showPicker(val) {
      if (!val) this.hideEffect()
    },
  },
  methods: {
    hide(hide = true) {
      if (typeof hide === 'object') {
        const { target } = hide
        const { clear } = this.$refs.inputEl.$refs
        if (target && (!clear || !clear.contains(target))) {
          this.showPicker = this.$refs.wrap.contains(target)
        }
      } else if (!hide) {
        this.showPicker = true
      } else {
        setTimeout(() => {
          this.showPicker = !hide
        }, 200)
      }
    },
    hideEffect() {
      this.$nextTick(() => {
        this.blur({ target: this.$refs.inputEl.$refs.input0 }, true)
      })
    },
    onClear() {
      this.blur({ target: { value: '' } })
    },
  },
  components: { popper: VuePopper },
  beforeMount() {
    window.addEventListener('click', this.hide, true)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hide, true)
  },
}
