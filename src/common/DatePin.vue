<template>
  <div class="picker-content">
    <div class="picker-head">
      <span
        class="prev"
        :class="{ disabled: !showBtn.prev }"
        @click="showBtn.prev ? $refs.dateCom.to(-1) : ''"
        >&lt;</span
      >
      <span class="picker-h">
        <span
          v-if="currType !== 'year'"
          class="year"
          @click="choseHeadType('year')"
          >{{ currDateObj.year }}</span
        >
        <span v-else>{{ tenYears }}</span>
        <template v-if="currType === 'date' || currType === 'time'">
          &nbsp;-&nbsp;
          <span class="month" @click="choseHeadType('month')">{{
            renderMonth(currDateObj.month)
          }}</span>
        </template>
        <template v-if="currType === 'time'">
          &nbsp;-&nbsp;
          <span class="date" @click="choseHeadType('date')">{{
            currDateObj.date
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
    <date
      v-show="currType !== 'time'"
      :value="value"
      :type="currType"
      :minDate="minDate"
      :maxDate="maxDate"
      :dayStr="dayStr"
      :monthStr="monthStr"
      :firstDayOfWeek="firstDayOfWeek"
      :selectedDates="selectedDates"
      :isRange="isRange"
      @mouseover="$emit('mouseover', $event)"
      @chose="selected"
      @to="selected"
      @pageChange="pageChange"
      @emitData="showBtn = $event.showBtn"
      @error="$emit('error', $event)"
      ref="dateCom"
    />
    <slot name="time" />
    <slot name="btn" />
  </div>
</template>

<script>
import Date from './Date'
import { triggerAfterClickEvent } from './mixin'
import { AllTypes, getTenYears, sliceUtilEqual } from './utils'

export default {
  name: 'DatePin',
  props: {
    type: String,
    value: String,
    minDate: [String, Object],
    maxDate: [String, Object],
    selectedDates: Array,
    isRange: Boolean,
    dayStr: Array,
    monthStr: Array,
    firstDayOfWeek: Number,
  },
  data() {
    return {
      currType: 'date',
      availableTypes: AllTypes,
      showBtn: { prev: true, next: true },
      currDateObj: {},
      tenYears: '',
    }
  },
  computed: {
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
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        this.availableTypes = sliceUtilEqual(AllTypes, val || 'date')
        this.currType = this.availableTypes.length < 3 ? val : 'date'
      },
    },
    currType: {
      immediate: true,
      handler(val) {
        this.$emit('typeChange', val)
      },
    },
  },
  methods: {
    choseHeadType(val) {
      triggerAfterClickEvent(() => {
        this.currType = val
      })
    },
    selected(val) {
      triggerAfterClickEvent(() => {
        const index = Object.keys(this.availableTypes).find(
          i => this.availableTypes[i] === val.type,
        )
        const nextType = this.availableTypes[+index + 1]
        this.$emit('itemSelected', {
          value: val,
          currType: this.currType,
          nextType,
        })
        this.currType = nextType || this.currType
      })
    },
    pageChange(item) {
      this.currDateObj = item.currObj
      this.tenYears = getTenYears(item.currObj)
      this.$emit('pageChange', item)
    },
    renderMonth(monthValue) {
      return this.$monthStr[+monthValue - 1]
    },
  },
  components: { Date },
}
</script>
