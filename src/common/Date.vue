<template>
  <div class="picker-items dates">
    <div v-if="choseType === 'date'" class="row-item h">
      <span v-for="(item, i) in $dayStr" class="item date" :key="i">{{
        item
      }}</span>
    </div>
    <div v-for="(rowItems, i) in pickerItems" class="row-item" :key="i">
      <span
        v-for="(item, j) in rowItems"
        class="item"
        :class="{
          'not-in-month': choseType === 'date' && !item.isInThisMonth,
          disabled: !item.canBeChose,
          [choseType]: true,
          selected: isSelected(item),
        }"
        :key="i + '' + j"
        @click="chose(item)"
        >{{ item[choseType] }}</span
      >
    </div>
  </div>
</template>

<script>
import * as DateGenerator from '@livelybone/date-generator'
import { dateCompare, dateReg } from './date'

export default {
  name: 'Dates',
  beforeMount() {
    this.setValue(() => {
      const now = new Date()
      this.dateObj = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        date: now.getDate(),
      }
    })
  },
  props: {
    value: String,
    type: String,
    minDate: String,
    maxDate: String,
    dayStr: Array,
    firstDayOfWeek: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      year: '',
      month: '',
      date: '',
    }
  },
  computed: {
    choseType() {
      return /^(year|month|date|time)$/.test(this.type) ? this.type : 'date'
    },
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
    minD() {
      return {
        ...{ year: 0, month: 0, date: 0 },
        ...(this.minDate && DateGenerator.parseDate(this.minDate)),
      }
    },
    maxD() {
      return {
        ...{ year: Infinity, month: Infinity, date: Infinity },
        ...(this.maxDate && DateGenerator.parseDate(this.maxDate)),
      }
    },
    dateObj: {
      get() {
        return {
          year: this.year,
          month: this.month,
          date: this.date,
        }
      },
      set(val) {
        const { fillTo } = DateGenerator
        this.year = fillTo(4, val.year)
        this.month = fillTo(2, val.month)
        this.date = fillTo(2, val.date)
      },
    },
    years() {
      if (!this.year) return []
      return DateGenerator.gntYear(
        Math.floor(this.year / 10 - 0.5) * 10 + 1,
        10,
        {
          splitLen: 3,
          min: this.minD.year,
          max: this.maxD.year,
        },
      )
    },
    months() {
      return DateGenerator.gntMonth(this.year, {
        splitLen: 3,
        min: this.minDate,
        max: this.maxDate,
      })
    },
    dates() {
      return DateGenerator.gntCalendar(this, {
        min: this.minDate,
        max: this.maxDate,
        firstDayOfWeek: this.firstDayOfWeek,
      })
    },
    pickerItems() {
      if (this.choseType === 'year') {
        return this.years
      }
      if (this.choseType === 'month') {
        return this.months
      }
      return this.dates
    },
  },
  watch: {
    pickerItems(val) {
      let showBtn = null
      if (this.choseType === 'date') {
        const dates = this.getDate({ date: 1 })
        showBtn = {
          prev: dateCompare(dates[0], this.minDate),
          next: dateCompare(dates[1], this.maxDate, -1),
        }
      } else if (this.choseType === 'month' || this.choseType === 'year') {
        const first = val[0][0]
        const lastRow = val[val.length - 1]
        const last = lastRow[lastRow.length - 1]
        if (this.choseType === 'month') {
          showBtn = {
            prev: dateCompare(
              { year: first.year - 1, month: 12 },
              this.minDate,
              1,
              'month',
            ),
            next: dateCompare(
              { year: +last.year + 1, month: 1 },
              this.maxDate,
              -1,
              'month',
            ),
          }
        } else {
          showBtn = {
            prev: dateCompare(
              { year: first.year - 1 },
              this.minDate,
              1,
              'year',
            ),
            next: dateCompare(
              { year: +last.year + 1 },
              this.maxDate,
              -1,
              'year',
            ),
          }
        }
      } else {
        showBtn = {
          prev: dateCompare(this.getDate({ step: -1 }), this.minDate, 1),
          next: dateCompare(this.getDate({ step: 1 }), this.maxDate, -1),
        }
      }
      this.$emit('emitData', { showBtn, items: val })
    },
    value() {
      this.setValue()
    },
  },
  methods: {
    setValue(cb) {
      const date =
        this.value && DateGenerator.parseDate(this.value.match(dateReg)[1])
      if (date) {
        this.dateObj = date
      } else if (cb) {
        cb()
      }
      this.$emit('chose', { ...this.dateObj })
    },
    chose(item) {
      if (item.canBeChose) {
        if (this.choseType === 'date') {
          this.date = item.date
          this.$emit('chose', { type: 'date', ...item })
        } else if (this.choseType === 'month') {
          this.month = item.month
          this.$emit('chose', { type: 'month', ...item })
        } else if (this.choseType === 'year') {
          this.year = item.year
          this.$emit('chose', { type: 'year', ...item })
        }
      }
    },
    isSelected(item) {
      if (this.choseType === 'date') {
        return (
          item.year === this.year &&
          item.month === this.month &&
          item.date === this.date
        )
      }
      if (this.choseType === 'month') {
        return item.year === this.year && item.month === this.month
      }
      return item.year === this.year
    },
    to(step = 1) {
      if (this.choseType === 'year') {
        this.dateObj = { ...this.dateObj, year: +this.year + 10 * step }
        this.$emit('to', { type: 'ten-year', ...this.dateObj })
      } else if (this.choseType === 'month') {
        this.dateObj = { ...this.dateObj, year: +this.year + step }
        this.$emit('to', { type: 'year', ...this.dateObj })
      } else if (this.choseType === 'date') {
        const month = +this.month + step
        if ((step > 0 && month > 12) || (step < 0 && month < 1)) {
          this.dateObj = {
            ...this.dateObj,
            year: +this.year + step,
            month: step > 0 ? 1 : 12,
          }
        } else {
          this.dateObj = { ...this.dateObj, month }
        }
        this.$emit('to', { type: 'month', ...this.dateObj })
      } else {
        const date = this.getDate({ step })
        this.dateObj = date
        if (date.canBeChose) this.$emit('to', { type: 'date', ...this.dateObj })
      }
    },
    getDate({ step, date }) {
      const dates = this.dates.reduce((pre, arr) => pre.concat(arr), [])
      if (step !== undefined) {
        const index = Object.keys(dates).find(
          k =>
            dates[k].year === this.year &&
            dates[k].month === this.month &&
            dates[k].date === this.date,
        )
        return dates[+index + step]
      }
      const arr = Object.keys(dates).filter(k => +dates[k].date === +date)
      return [dates[arr[0] - 1], dates[+arr[1]]]
    },
  },
}
</script>
