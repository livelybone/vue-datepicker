<template>
  <div class="datepicker" ref="wrap">
    <input
      class="vue-input"
      :id="id"
      :value="formattedDateValue"
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
      <div class="picker-head">
        <span
          class="prev"
          :class="{ disabled: !showBtn.prev }"
          @click="showBtn.prev ? $refs.dateCom.to(-1) : ''"
          >&lt;</span
        >
        <span class="picker-h">
          <span
            v-if="choseType === 'date' || choseType === 'month'"
            class="year"
            @click="choseHeadType('year')"
            >{{ dateObj.year }}</span
          >
          <span v-else-if="choseType === 'year'">{{ tenYears }}</span>
          <template v-if="choseType === 'date'">
            &nbsp;-&nbsp;
            <span class="month" @click="choseHeadType('month')">{{
              dateObj.month
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
        :value="value"
        :type="choseType"
        :minDate="minDate"
        :maxDate="maxDate"
        :dayStr="dayStr"
        @chose="chose"
        @to="chose"
        @emitData="showBtn = $event.showBtn"
        ref="dateCom"
      />
    </popper>
  </div>
</template>

<script>
import * as DateGenerator from '@livelybone/date-generator'
import { dateCompare, dateReg } from '../common/date'
import Date from '../common/Date.vue'
import mixin from '../common/mixin'

export default {
  mixins: [mixin],
  name: 'Datepicker',
  props: {
    dayStr: Array,
  },
  data() {
    return {
      dateObj: {},
      choseType: 'date',
      showBtn: { prev: true, next: true },
    }
  },
  computed: {
    tenYears() {
      const tenYear = Math.floor(this.dateObj.year / 10 - 0.5)
      return `${tenYear * 10 + 1} - ${(tenYear + 1) * 10}`
    },
    myValue() {
      const { year, month, date } = this.dateObj
      const { fillTo } = DateGenerator
      return `${fillTo(4, year)}-${fillTo(2, month)}-${fillTo(2, date)}`
    },
    minDate() {
      if (this.min && !dateReg.test(this.min)) {
        console.warn('Datepicker: prop min is invalid')
        return ''
      }
      return this.min
    },
    maxDate() {
      if (this.max && !dateReg.test(this.max)) {
        console.warn('Datepicker: prop max is invalid')
        return ''
      }
      return this.max
    },
  },
  watch: {
    value(val) {
      if (val !== this.myValue) this.blur(val, false)
    },
  },
  methods: {
    inputEnter(ev) {
      const { value } = ev.target
      if (dateReg.test(value) || !value) {
        this.hide()
        ev.target.blur()
      }
    },
    blur(ev, isBlur = true) {
      const value = isBlur ? ev.target.value : ev
      if (value !== this.myValue) {
        const parsedInputDate = this.parseInputDate(value)
        if (dateReg.test(parsedInputDate)) {
          const date = DateGenerator.parseDate(
            parsedInputDate.match(dateReg)[1],
          )
          if (
            dateCompare(date, this.minDate) &&
            dateCompare(date, this.maxDate, -1)
          ) {
            this.dateObj = date
            if (isBlur) this.$emit('input', this.myValue)
          } else if (!isBlur) {
            console.warn('vue-datepicker: Datepicker: value is out of range')
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
      this.dateObj = val
      if (val.type === 'date') {
        this.$emit('input', this.myValue)
        this.hide()
      } else if (val.type === 'month') {
        this.choseType = 'date'
      } else if (val.type === 'year') {
        this.choseType = 'month'
      }
    },
  },
  components: { Date },
}
</script>
