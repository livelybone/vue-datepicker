<template>
  <div class="picker-items dates">
    <div v-if="type === 'date'" class="row-item h">
      <span v-for="(item, i) in $dayStr" class="item date" :key="i">{{
        item
      }}</span>
    </div>
    <div v-for="(rowItems, i) in pickerItems" class="row-item" :key="i">
      <span
        v-for="(item, j) in rowItems"
        class="item"
        :class="{
          'not-in-month': type === 'date' && !item.isInThisMonth,
          disabled: !item.canBeChose,
          [type]: true,
          selected: isSelected(item),
          'is-now': item.isNow,
          'is-in-range': isInRange(item),
        }"
        :key="i + '' + j"
        @click="chose(item)"
        @mouseover="item.canBeChose && $emit('mouseover', item)"
        >{{ renderItem(type, item[type]) }}</span
      >
    </div>
  </div>
</template>

<script>
import {
  getDateByStep,
  getMonthByStep,
  gntCalendar,
  gntMonth,
  gntYear,
} from '@livelybone/date-generator'
import {
  AllTypes,
  createNowTimeObj,
  dateCompare,
  formatDateObj,
  getNextMonthFirstDate,
  getNextTenYearFirstDate,
  getNextYearFirstDate,
  getPrevMonthLastDate,
  getPrevTenYearLastDate,
  getPrevYearLastDate,
  sliceUtilEqual,
} from './utils'

export default {
  name: 'Date',
  props: {
    type: String,
    minDate: Object,
    maxDate: Object,
    dayStr: Array,
    monthStr: Array,
    selectedDates: Array,
    isRange: Boolean,
    firstDayOfWeek: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dateObj: formatDateObj(createNowTimeObj()),
    }
  },
  computed: {
    $dayStr() {
      const dayStr =
        !this.dayStr ||
        this.dayStr.length < 7 ||
        this.dayStr.some(day => typeof day !== 'string')
          ? ['日', '一', '二', '三', '四', '五', '六']
          : this.dayStr.slice(0, 7)
      return dayStr
        .slice(this.firstDayOfWeek)
        .concat(dayStr.slice(0, this.firstDayOfWeek))
    },
    $monthStr() {
      const monthStr =
        !this.monthStr ||
        this.monthStr.length < 12 ||
        this.monthStr.some(month => typeof month !== 'string')
          ? [
              '01',
              '02',
              '03',
              '04',
              '05',
              '06',
              '07',
              '08',
              '09',
              '10',
              '11',
              '12',
            ]
          : this.monthStr.slice(0, 12)
      return monthStr
    },
    years() {
      if (!this.dateObj.year) return []
      return gntYear(Math.floor(this.dateObj.year / 10 - 0.5) * 10 + 1, 10, {
        splitLen: 3,
        min: this.minDate.year,
        max: this.maxDate.year,
      })
    },
    months() {
      return gntMonth(this.dateObj.year, {
        splitLen: 3,
        min: this.minDate,
        max: this.maxDate,
      })
    },
    dates() {
      return gntCalendar(this.dateObj, {
        min: this.minDate,
        max: this.maxDate,
        firstDayOfWeek: this.firstDayOfWeek,
      })
    },
    pickerItems() {
      if (this.type === 'year') return this.years
      if (this.type === 'month') return this.months
      return this.dates
    },
  },
  watch: {
    pickerItems(val) {
      let showBtn = null
      if (this.type === 'time') {
        showBtn = {
          prev: dateCompare(getDateByStep(this.dateObj, -1), this.minDate, 1),
          next: dateCompare(getDateByStep(this.dateObj, 1), this.maxDate, -1),
        }
      } else {
        const { prev, next } = {
          date: {
            prev: v => getPrevMonthLastDate(v),
            next: v => getNextMonthFirstDate(v),
          },
          month: {
            prev: v => getPrevYearLastDate(v.year),
            next: v => getNextYearFirstDate(v.year),
          },
          year: {
            prev: v => getPrevTenYearLastDate(v.year),
            next: v => getNextTenYearFirstDate(v.year),
          },
        }[this.type]
        showBtn = {
          prev: dateCompare(prev(this.dateObj), this.minDate, 1, this.type),
          next: dateCompare(next(this.dateObj), this.maxDate, -1, this.type),
        }
      }
      this.$emit('emitData', { showBtn, items: val })
    },
    dateObj: {
      immediate: true,
      handler(val) {
        // This event is used to trigger the interaction of another comp
        this.$emit('pageChange', { currObj: val })
      },
    },
  },
  methods: {
    chose(item) {
      if (item.canBeChose) {
        this.dateObj[this.type] = item[this.type]
        this.$emit('chose', { type: this.type, ...item })
        this.$forceUpdate()
      }
    },
    isSelected(item) {
      if (!this.selectedDates) return false

      const checkProps = sliceUtilEqual(AllTypes, this.type)
      return this.selectedDates
        .filter(Boolean)
        .some(it => checkProps.every(k => item[k] === it[k]))
    },
    isInRange(item) {
      if (
        this.isRange &&
        this.selectedDates &&
        this.selectedDates.filter(Boolean).length > 1
      ) {
        const date = {
          ...item,
          month: (this.type !== 'year' && item.month) || '01',
          date: (this.type === 'date' && item.date) || '01',
        }
        return (
          dateCompare(date, this.selectedDates[0], 1, this.type) &&
          dateCompare(date, this.selectedDates[1], -1, this.type)
        )
      }
      return false
    },
    to(step = 1) {
      if (this.type === 'year') {
        this.dateObj = formatDateObj({
          ...this.dateObj,
          year: +this.dateObj.year + 10 * step,
        })
        this.$emit('to', { type: 'ten-year', ...this.dateObj })
      } else if (this.type === 'month') {
        this.dateObj = formatDateObj({
          ...this.dateObj,
          year: +this.dateObj.year + step,
        })
        if (this.dateObj.canBeChose)
          this.$emit('to', { type: 'year', ...this.dateObj })
      } else if (this.type === 'date') {
        this.dateObj = getMonthByStep(this.dateObj, step)
        if (this.dateObj.canBeChose)
          this.$emit('to', { type: 'month', ...this.dateObj })
      } else {
        this.dateObj = getDateByStep(this.dateObj, step)
        if (this.dateObj.canBeChose)
          this.$emit('to', { type: 'date', ...this.dateObj })
      }
    },
    renderItem(type, itemValue) {
      if (type === 'month') {
        return this.$monthStr[+itemValue - 1]
      }
      return itemValue
    },
  },
}
</script>
