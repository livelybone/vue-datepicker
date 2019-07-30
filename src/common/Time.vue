<template>
  <div class="picker-items time">
    <div class="row-item h">
      <span
        v-for="(item, i) in $timeStr"
        class="item second"
        :style="pickerItemStyle"
        :key="i"
        >{{ item }}</span
      >
    </div>
    <scrollbar
      v-for="(rowItems, i) in pickerItems"
      class="row-item line"
      :isMobile="$scrollbarProps.isMobile"
      :style="pickerItemStyle"
      :key="i"
      :maxHeight="$scrollbarProps.maxHeight"
      :scrollTo="scrollTo[i]"
    >
      <span
        v-for="(item, j) in rowItems"
        class="item"
        :class="{
          disabled: !item.canBeChose,
          [i]: true,
          selected: +item.value === +timeObj[i],
        }"
        :key="i + '' + j"
        @click="chose(item, i)"
        >{{ item.value }}</span
      >
    </scrollbar>
  </div>
</template>

<script>
import * as DateGenerator from '@livelybone/date-generator'
import VueScrollbar from 'vue-scrollbar-live'
import { timeCompare, timeReg } from './time'

export default {
  name: 'Time',
  beforeMount() {
    this.setValue(() => {
      const now = new Date()
      this.timeObj = {
        hour: this.fillTo(2, now.getHours()),
        minute: this.fillTo(2, now.getMinutes()),
        second: this.fillTo(2, now.getSeconds()),
      }
    })
  },
  props: {
    value: String,
    type: String,
    scrollbarProps: Object,
    minTime: String,
    maxTime: String,
    timeStr: Array,
  },
  data() {
    return {
      hour: '00',
      minute: '00',
      second: '00',
    }
  },
  computed: {
    myType() {
      return /^(hour|minute|second)$/.test(this.type) ? this.type : 'second'
    },
    $scrollbarProps() {
      return { maxHeight: 200, ...this.scrollbarProps }
    },
    $timeStr() {
      const arr =
        !this.timeStr ||
        this.timeStr.length < 3 ||
        this.timeStr.some(day => typeof day !== 'string')
          ? ['时', '分', '秒']
          : this.timeStr.slice(0, 3)
      if (this.myType === 'hour') return arr.slice(0, 1)
      if (this.myType === 'minute') return arr.slice(0, 2)
      return arr.slice(0, 3)
    },
    minT() {
      return {
        ...{ hour: 0, minute: 0, second: 0 },
        ...(this.minTime && DateGenerator.parseTime(this.minTime)),
      }
    },
    maxT() {
      return {
        ...{ hour: 23, minute: 59, second: 59 },
        ...(this.maxTime && DateGenerator.parseTime(this.maxTime)),
      }
    },
    timeObj: {
      get() {
        return {
          hour: this.hour,
          minute: this.minute,
          second: this.second,
        }
      },
      set(val) {
        this.hour = this.fillTo(2, val.hour)
        this.minute = this.fillTo(2, val.minute)
        this.second = this.fillTo(2, val.second)
      },
    },
    hours() {
      return DateGenerator.getHour({
        min: this.minT.hour,
        max: this.maxT.hour,
      })
    },
    minutes() {
      return DateGenerator.getMinute({
        min: +this.hour === this.minT.hour ? this.minT.minute : 0,
        max: +this.hour === this.maxT.hour ? this.maxT.minute : 59,
      })
    },
    seconds() {
      return DateGenerator.getSecond({
        min:
          +this.hour === this.minT.hour && +this.minute === this.minT.minute
            ? this.minT.second
            : 0,
        max:
          +this.hour === this.maxT.hour && +this.minute === this.maxT.minute
            ? this.maxT.second
            : 59,
      })
    },
    pickerItems() {
      const obj = { hour: this.hours }
      if (this.myType === 'hour') return obj
      obj.minute = this.minutes
      if (this.myType === 'minute') return obj
      obj.second = this.seconds
      return obj
    },
    pickerItemStyle() {
      if (this.myType === 'hour') return { width: '100%' }
      if (this.myType === 'minute') return { width: 'calc(100% / 2)' }
      return { width: 'calc(99% / 3)' }
    },
    scrollTo() {
      return {
        hour: (this.hour - 1) / 22,
        minute: (this.minute - 1) / 58,
        second: (this.second - 1) / 58,
      }
    },
  },
  watch: {
    hour() {
      if (!timeCompare(this, this.minT, 1, 'minute'))
        this.minute = this.fillTo(2, this.minT.minute)
      else if (!timeCompare(this, this.maxT, -1, 'minute'))
        this.minute = this.fillTo(2, this.maxT.minute)
      else if (!timeCompare(this, this.minT))
        this.second = this.fillTo(2, this.minT.second)
      else if (!timeCompare(this, this.maxT, -1))
        this.second = this.fillTo(2, this.maxT.second)
      else this.$emit('input', { type: 'hour', ...this.timeObj })
    },
    minute() {
      if (!timeCompare(this, this.minT))
        this.second = this.fillTo(2, this.minT.second)
      else if (!timeCompare(this, this.maxT, -1))
        this.second = this.fillTo(2, this.maxT.second)
      else this.$emit('input', { type: 'minute', ...this.timeObj })
    },
    second() {
      this.$emit('input', { type: 'second', ...this.timeObj })
    },
    value() {
      this.setValue()
    },
  },
  methods: {
    fillTo(width, num) {
      return DateGenerator.fillTo(width, num)
    },
    setValue(cb) {
      const date =
        this.value && DateGenerator.parseTime(this.value.match(timeReg)[1])
      if (date) {
        this.timeObj = date
      } else if (cb) {
        cb()
      }
    },
    chose(item, type = 'second') {
      if (item.canBeChose) {
        if (type === 'second') {
          this.second = item.value
        } else if (type === 'minute') {
          this.minute = item.value
        } else if (type === 'hour') {
          this.hour = item.value
        }
      }
    },
  },
  components: { scrollbar: VueScrollbar },
}
</script>
