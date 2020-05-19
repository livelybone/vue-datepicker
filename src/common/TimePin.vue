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
      ref="scrollbar"
      :style="pickerItemStyle"
      :key="i"
      :isMobile="$scrollbarProps.isMobile"
      :maxHeight="$scrollbarProps.maxHeight"
      :marginToWrap="$scrollbarProps.marginToWrap"
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
import VueScrollbar from 'vue-scrollbar-live'
import {
  fillTo,
  getHour,
  getMinute,
  getSecond,
  parseTime,
} from '@livelybone/date-generator'
import { createNowTimeObj, formatTimeObj, timeCompare } from './utils'

export default {
  name: 'Time',
  props: {
    selectedTime: Object,
    type: String,
    scrollbarProps: Object,
    minTime: String,
    maxTime: String,
    timeStr: Array,
  },
  data() {
    return {
      timeObj: formatTimeObj(createNowTimeObj()),
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
        ...(typeof this.minTime === 'string'
          ? parseTime(this.minTime)
          : this.minTime),
      }
    },
    maxT() {
      return {
        ...{ hour: 23, minute: 59, second: 59 },
        ...(typeof this.maxTime === 'string'
          ? parseTime(this.maxTime)
          : this.maxTime),
      }
    },
    hours() {
      return getHour({
        min: this.minT.hour,
        max: this.maxT.hour,
      })
    },
    minutes() {
      return getMinute({
        min: +this.timeObj.hour === +this.minT.hour ? this.minT.minute : 0,
        max: +this.timeObj.hour === +this.maxT.hour ? this.maxT.minute : 59,
      })
    },
    seconds() {
      return getSecond({
        min:
          +this.timeObj.hour === +this.minT.hour &&
          +this.timeObj.minute === +this.minT.minute
            ? this.minT.second
            : 0,
        max:
          +this.timeObj.hour === +this.maxT.hour &&
          +this.timeObj.minute === +this.maxT.minute
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
        hour: (this.timeObj.hour - 1) / 22,
        minute: (this.timeObj.minute - 1) / 58,
        second: (this.timeObj.second - 1) / 58,
      }
    },
  },
  watch: {
    'timeObj.hour': {
      handler() {
        if (!timeCompare(this.timeObj, this.minT, 1, 'minute'))
          this.timeObj.minute = fillTo(2, this.minT.minute)
        else if (!timeCompare(this.timeObj, this.maxT, -1, 'minute'))
          this.timeObj.minute = fillTo(2, this.maxT.minute)
        else if (!timeCompare(this.timeObj, this.minT))
          this.timeObj.second = fillTo(2, this.minT.second)
        else if (!timeCompare(this.timeObj, this.maxT, -1))
          this.timeObj.second = fillTo(2, this.maxT.second)
        else this.$emit('chose', { type: 'hour', ...this.timeObj })
        this.$forceUpdate()
      },
    },
    'timeObj.minute': {
      handler() {
        if (!timeCompare(this.timeObj, this.minT))
          this.timeObj.second = fillTo(2, this.minT.second)
        else if (!timeCompare(this.timeObj, this.maxT, -1))
          this.timeObj.second = fillTo(2, this.maxT.second)
        else this.$emit('chose', { type: 'minute', ...this.timeObj })
        this.$forceUpdate()
      },
    },
    'timeObj.second': {
      handler() {
        this.$emit('chose', { type: 'second', ...this.timeObj })
      },
    },
  },
  methods: {
    chose(item, type = 'second') {
      if (item.canBeChose) {
        if (type === 'second') {
          this.timeObj.second = item.value
        } else if (type === 'minute') {
          this.timeObj.minute = item.value
        } else if (type === 'hour') {
          this.timeObj.hour = item.value
        }
        this.timeObj = { ...this.timeObj }
      }
    },
    correctScroll() {
      setTimeout(() => {
        Object.keys(this.scrollTo).forEach((k, i) => {
          if (this.$refs.scrollbar[i]) {
            this.$refs.scrollbar[i].$scrollTo(this.scrollTo[k])
          }
        })
      })
    },
  },
  components: { scrollbar: VueScrollbar },
}
</script>
