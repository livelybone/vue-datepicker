<template>
  <div class="datetime-picker" ref="wrap">
    <input
      class="vue-input"
      :id="id"
      :value="formattedDatetimeValue"
      :placeholder="placeholder"
      :readonly="!canEdit || isMobile"
      :disabled="!canEdit"
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
      <div class="picker-head">
        <span
          class="prev"
          :class="{ disabled: !showBtn.prev }"
          @click="showBtn.prev ? $refs.dateCom.to(-1) : ''"
          >&lt;</span
        >
        <span class="picker-h">
          <span
            v-if="
              choseType === 'date' ||
                choseType === 'month' ||
                choseType === 'time'
            "
            class="year"
            @click="choseHeadType('year')"
            >{{ timeObj.year }}</span
          >
          <span v-else-if="choseType === 'year'">{{ tenYears }}</span>
          <template v-if="choseType === 'date' || choseType === 'time'">
            &nbsp;-&nbsp;
            <span class="month" @click="choseHeadType('month')">{{
              timeObj.month
            }}</span>
          </template>
          <template v-if="choseType === 'time'">
            &nbsp;-&nbsp;
            <span class="date" @click="choseHeadType('date')">{{
              timeObj.date
            }}</span>
          </template></span
        >
        <span
          class="next"
          :class="{ disabled: !showBtn.next }"
          @click="showBtn.next ? $refs.dateCom.to(1) : ''"
          >&gt;</span
        >
      </div>
      <time-pin
        v-if="choseType === 'time'"
        :value="split(value).time"
        :scrollbarProps="scrollbarProps"
        :minTime="minTime"
        :maxTime="maxTime"
        :timeStr="timeStr"
        @input="input"
      />
      <date
        v-show="choseType !== 'time'"
        :value="split(value).date"
        :type="choseType"
        :minDate="minDate"
        :maxDate="maxDate"
        :dayStr="dayStr"
        @chose="chose"
        @to="chose"
        @emitData="showBtn = $event.showBtn"
        ref="dateCom"
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
import { dateCompare, dateReg } from '../common/date'
import Date from '../common/Date.vue'
import mixin from '../common/mixin'
import { timeCompare, timeReg } from '../common/time'
import TimePin from '../common/Time.vue'

export default {
  mixins: [mixin],
  name: 'DatetimePicker',
  props: {
    dayStr: Array,
    timeStr: Array,
    btnStr: String,
  },
  data() {
    return {
      timeObj: {},
      choseType: 'date',
      showBtn: { prev: true, next: true },
    }
  },
  computed: {
    tenYears() {
      const tenYear = Math.floor(this.timeObj.year / 10 - 0.5)
      return `${tenYear * 10 + 1} - ${(tenYear + 1) * 10}`
    },
    $btnStr() {
      return this.btnStr || '确定'
    },
    minDate() {
      return this.split(this.min).date
    },
    minTime() {
      return dateCompare(this.split(this.myValue).date, this.minDate, 0)
        ? this.split(this.min).time
        : '0'
    },
    maxDate() {
      return this.split(this.max).date
    },
    maxTime() {
      return dateCompare(this.split(this.myValue).date, this.maxDate, 0)
        ? this.split(this.max).time
        : '23:59:59'
    },
    myValue() {
      const {
        year,
        month,
        date,
        hour = '--',
        minute = '--',
        second = '--',
      } = this.timeObj
      const { fillTo } = DateGenerator
      return `${fillTo(4, year)}-${fillTo(2, month)}-${fillTo(
        2,
        date,
      )} ${fillTo(2, hour)}:${fillTo(2, minute)}:${fillTo(2, second)}`
    },
  },
  methods: {
    split(val) {
      const arr = val ? val.split(/\s/) : []
      return {
        date: this.parseInputDate(arr[0]),
        time: timeReg.test(arr[1]) ? arr[1] : '',
      }
    },
    fillTo(width, num) {
      return DateGenerator.fillTo(width, num)
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
      if (value !== this.myValue) {
        const { date, time } = this.split(value)
        if (dateReg.test(date) && timeReg.test(time)) {
          const dateObj = DateGenerator.parseDate(date.match(dateReg)[0])
          const timeObj = DateGenerator.parseTime(time.match(timeReg)[0])
          const dateGt =
            dateCompare(dateObj, this.minDate, 1) &&
            dateCompare(dateObj, this.maxDate, -1)
          if (
            (dateGt &&
              (timeCompare(timeObj, this.minTime, 1, this.myType) &&
                timeCompare(timeObj, this.maxTime, -1, this.myType))) ||
            (dateGt &&
              !dateCompare(dateObj, this.minDate, 0) &&
              !dateCompare(dateObj, this.maxDate, 0))
          ) {
            this.timeObj = { ...dateObj, ...timeObj }
            if (isBlur) this.$emit('input', this.myValue)
          } else if (!isBlur) {
            console.warn(
              'vue-datepicker: DatetimePicker: value is out of range',
            )
            this.$emit('input', '')
          }
        } else {
          this.$emit('input', '')
        }
      } else {
        this.$forceUpdate()
      }
    },
    chose(val) {
      this.timeObj = { ...this.timeObj, ...val }
      if (val.type === 'date') {
        this.choseType = 'time'
      } else if (val.type === 'month') {
        this.choseType = 'date'
      } else if (val.type === 'year') {
        this.choseType = 'month'
      }
    },
    input(val) {
      this.timeObj = { ...this.timeObj, ...val }
      this.$emit('input', this.myValue)
    },
  },
  components: { TimePin, Date },
}
</script>
