<template>
  <div class="datetime-picker" ref="wrap">
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
        <icon-date />
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
      <date-pin
        type="time"
        ref="datePin0"
        :selectedDates="[timeObj]"
        :minDate="limit.minDate"
        :maxDate="limit.maxDate"
        :dayStr="dayStr"
        :firstDayOfWeek="firstDayOfWeek"
        @itemSelected="chose"
        @typeChange="typeChange"
        @error="$emit('error', $event)"
      >
        <time-pin
          v-show="showTimePin"
          slot="time"
          ref="timePin0"
          :selectedTime="timeObj"
          :type="timeType"
          :scrollbarProps="scrollbarProps"
          :minTime="limit.minTime"
          :maxTime="limit.maxTime"
          :timeStr="timeStr"
          @chose="chose({ value: $event })"
        />
        <div class="btns" slot="btn">
          <span
            class="btn btn-sure"
            @click="
              $emit('input', myValue)
              hide()
            "
            >{{ $btnStr }}</span
          >
        </div>
      </date-pin>
    </popper>
  </div>
</template>

<script>
import {
  dateReg,
  datetimeValidator,
  dealDatetimeLimit,
  formatDateObj,
  formatDatetime,
  formatTimeObj,
  parseDatetime,
  timeReg,
} from '../common/utils'
import DatePin from '../common/DatePin.vue'
import mixin from '../common/mixin'
import TimePin from '../common/TimePin.vue'
import IconDate from '../common/IconDate.vue'
import InputEl from '../common/InputEl'

export default {
  mixins: [mixin],
  name: 'DatetimePicker',
  props: {
    dayStr: Array,
    firstDayOfWeek: Number,
    timeStr: Array,
    btnStr: String,
    timeType: String, // hour, minute, second. default: second
  },
  data() {
    return {
      timeObj: null,
      choseType: 'date',
      showBtn: { prev: true, next: true },
      showTimePin: false,
    }
  },
  computed: {
    $btnStr() {
      return this.btnStr || '确定'
    },
    limit() {
      const { error, ...rest } = dealDatetimeLimit(
        this.min,
        this.max,
        this.timeObj,
      )

      if (error) this.$emit('error', new Error(error))
      return rest
    },
    myValue() {
      return formatDatetime(this.timeObj, this.timeType)
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val !== this.myValue) this.blur(val, false)
      },
    },
    timeObj: {
      immediate: true,
      handler(val, oldVal) {
        if (
          formatDatetime(val, this.timeType) !==
          formatDatetime(oldVal, this.timeType)
        ) {
          this.timeChange()
        }
      },
    },
  },
  methods: {
    split(val) {
      const arr = val ? val.trim().split(/\s+/) : []
      return {
        date: dateReg.test(arr[0]) ? arr[0] : '',
        time: timeReg.test(arr[1]) ? arr[1] : '',
      }
    },
    inputEnter(ev) {
      const { value } = ev.target
      const { date, time } = this.split(value)
      if ((dateReg.test(date) && timeReg.test(time)) || !value) {
        this.hide()
        ev.target.blur()
      }
    },
    blur(ev, isBlur = true) {
      const value = isBlur ? ev.target.value : ev
      if (value === this.myValue) this.$forceUpdate()
      else {
        const datetime = parseDatetime(value)
        const { minDatetime, maxDatetime } = this.limit
        const error = datetimeValidator(
          datetime,
          this.timeType,
          minDatetime,
          maxDatetime,
        )

        if (error) {
          this.$emit('error', new Error(error))
          this.timeObj = null
          this.$emit('input', this.myValue)
        } else {
          this.timeObj = datetime
          if (isBlur) this.$emit('input', this.myValue)
        }
      }
    },
    timeChange() {
      this.$nextTick(() => {
        const { timePin0, datePin0 } = this.$refs
        if (this.timeObj) {
          timePin0.timeObj = formatTimeObj({ ...this.timeObj })
          datePin0.$refs.dateCom.dateObj = formatDateObj({ ...this.timeObj })
        }
      })
    },
    chose({ value }) {
      this.timeObj = { ...this.timeObj, ...value }
    },
    typeChange(type) {
      this.showTimePin = type === 'time'
    },
    input(val) {
      this.timeObj = { ...this.timeObj, ...val }
      this.$emit('input', this.myValue)
    },
  },
  components: { TimePin, DatePin, IconDate, InputEl },
}
</script>
