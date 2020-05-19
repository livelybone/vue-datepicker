<template>
  <div class="timepicker" ref="wrap">
    <input-el
      ref="inputEl"
      :id="id"
      :value="[value]"
      :placeholder="placeholder || '请选择时间'"
      :readonly="!canEdit || isMobile"
      :inputStyle="inputStyle"
      :rangeSeparator="rangeSeparator"
      :isFocus="showPicker"
      @inputEnter="inputEnter"
      @clear="onClear"
    >
      <slot name="prefix" slot="prefix">
        <icon-time />
      </slot>
      <slot name="suffix" slot="suffix" />
    </input-el>
    <popper
      v-if="canEdit"
      v-show="showPicker"
      class="picker"
      :referenceElm="$refs.wrap"
      :popperOptions="$popperProps.popperOptions"
      :arrowOffsetScaling="$popperProps.arrowOffsetScaling"
      :arrowPosition="$popperProps.arrowPosition"
    >
      <div class="picker-content">
        <time-pin
          ref="timePin0"
          :selectedTime="timeObj"
          :type="type"
          :minTime="limit.minTime"
          :maxTime="limit.maxTime"
          :timeStr="timeStr"
          :scrollbarProps="scrollbarProps"
          @chose="chose"
        />
        <div class="btns">
          <span
            class="btn btn-sure"
            @click="
              $emit('input', myValue)
              hide()
            "
            >{{ $btnStr }}</span
          >
        </div>
      </div>
    </popper>
  </div>
</template>

<script>
import { parseTime } from '@livelybone/date-generator'
import mixin from '../common/mixin'
import {
  dealTimeLimit,
  formatTime,
  timeReg,
  timeValidator,
} from '../common/utils'
import TimePin from '../common/TimePin.vue'
import IconTime from '../common/IconTime.vue'
import InputEl from '../common/InputEl'

export default {
  mixins: [mixin],
  name: 'Timepicker',
  props: {
    type: String,
    timeStr: Array,
    btnStr: String,
  },
  data() {
    return {
      timeObj: null,
    }
  },
  computed: {
    myType() {
      return /^(hour|minute|second)$/.test(this.type) ? this.type : 'second'
    },
    $btnStr() {
      return this.btnStr || '确定'
    },
    myValue() {
      return formatTime(this.timeObj, this.type)
    },
    limit() {
      const { error, ...rest } = dealTimeLimit(this.min, this.max)
      if (error) this.$emit('error', new Error(error))
      return rest
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (this.myValue !== val) this.blur(val, false)
      },
    },
    timeObj: {
      immediate: true,
      handler(val, oldVal) {
        if (formatTime(val, this.type) !== formatTime(oldVal, this.type)) {
          this.timeChange()
        }
      },
    },
  },
  methods: {
    hideEffect() {
      this.$nextTick(() => {
        if (this.showPicker) {
          this.$refs.timePin0.correctScroll()
        } else {
          this.blur({ target: this.$refs.inputEl.$refs.input0 }, true)
        }
      })
    },
    inputEnter(ev) {
      const { value } = ev.target
      if (timeReg.test(value) || !value) {
        this.hide()
        ev.target.blur()
      }
    },
    blur(ev, isBlur = true) {
      const value = isBlur ? ev.target.value : ev
      if (value === this.myValue) this.$forceUpdate()
      else {
        const time = parseTime(value)
        const { minTime, maxTime } = this.limit
        const error = timeValidator(time, this.type, minTime, maxTime)

        if (error) {
          this.$emit('error', new Error(error))
          this.timeObj = null
          this.$emit('input', this.myValue)
        } else {
          this.timeObj = time
          if (isBlur) this.$emit('input', this.myValue)
        }
      }
    },
    timeChange() {
      this.$nextTick(() => {
        const { timePin0 } = this.$refs
        if (this.timeObj) timePin0.timeObj = { ...this.timeObj }
      })
    },
    chose(val) {
      this.timeObj = val
    },
  },
  components: { TimePin, IconTime, InputEl },
}
</script>
