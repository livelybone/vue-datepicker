<template>
  <div class="timepicker" ref="wrap">
    <input
      class="vue-input"
      :id="id"
      :value="value"
      :placeholder="placeholder"
      :readonly="!canEdit || isMobile"
      :style="inputStyle"
      @click="canEdit ? hide(false) : ''"
      @keyup.enter="inputEnter"
      @blur="blur"
    />
    <popper
      v-if="canEdit && showPicker"
      class="picker"
      :referenceElm="$refs.wrap"
      :popperOptions="$popperProps.popperOptions"
      :arrowOffsetScaling="$popperProps.arrowOffsetScaling"
      :arrowPosition="$popperProps.arrowPosition"
    >
      <time-pin
        :scrollbarProps="scrollbarProps"
        :value="value"
        :type="type"
        :minTime="minTime"
        :maxTime="maxTime"
        :timeStr="timeStr"
        @input="input"
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
    </popper>
  </div>
</template>

<script>
import * as DateGenerator from '@livelybone/date-generator'
import mixin from '../common/mixin'
import { timeCompare, timeReg } from '../common/time'
import TimePin from '../common/Time.vue'

export default {
  mixins: [mixin],
  name: 'Timepicker',
  props: {
    timeStr: Array,
    btnStr: String,
  },
  data() {
    return {
      timeObj: {},
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
      const { hour, minute, second } = this.timeObj
      return `${this.fillTo(2, hour)}:${this.fillTo(2, minute)}:${this.fillTo(
        2,
        second,
      )}`
    },
    minTime() {
      if (this.min && !timeReg.test(this.min)) {
        console.warn('Timepicker: prop min is invalid')
        return ''
      }
      return this.min
    },
    maxTime() {
      if (this.max && !timeReg.test(this.max)) {
        console.warn('Timepicker: prop max is invalid')
        return ''
      }
      return this.max
    },
  },
  watch: {
    value(val) {
      if (this.myValue === val) this.blur(val, false)
    },
  },
  methods: {
    fillTo(width, num) {
      return DateGenerator.fillTo(width, num)
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
      if (value !== this.myValue) {
        if (timeReg.test(value)) {
          const time = DateGenerator.parseTime(value.match(timeReg)[0])
          if (
            timeCompare(time, this.minTime, 1, this.myType) &&
            timeCompare(time, this.maxTime, -1, this.myType)
          ) {
            this.timeObj = time
            if (isBlur) this.$emit('input', this.myValue)
          } else if (!isBlur) {
            console.warn(
              'vue-datepicker: Timepicker: prop value is out of range',
            )
            this.$emit('input', '')
          }
        } else {
          if (value)
            console.warn('vue-datepicker: Timepicker: prop value is invalid')
          this.$emit('input', '')
        }
      } else {
        this.$forceUpdate()
      }
    },
    input(val) {
      this.timeObj = val
      this.$emit('input', this.myValue)
    },
  },
  components: { TimePin },
}
</script>
