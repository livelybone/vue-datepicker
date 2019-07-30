import { objectDeepMerge } from '@livelybone/copy'
import VuePopper from '@livelybone/vue-popper'

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
    inputStyle: Object,
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
