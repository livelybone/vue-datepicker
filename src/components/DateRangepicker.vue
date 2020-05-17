<template>
  <div class="datepicker" ref="wrap">
    <div class="input-wrapper" :class="{ focus: isFocus }">
      <div class="prefix">
        <slot name="prefix">
          <icon-date />
        </slot>
      </div>
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
        @focus="focus"
      />
      <div class="suffix">
        <slot name="suffix" />
        <div class="icon-clear" @click="onClear">
          <icon-del />
        </div>
      </div>
    </div>
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
        :firstDayOfWeek="firstDayOfWeek"
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
import IconDate from '../common/IconDate.vue'
import mixin from '../common/mixin'

export default {
  mixins: [mixin],
  name: 'Datepicker',
  props: {
    dayStr: Array,
    firstDayOfWeek: Number,
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
      const { year = '0', month = '1', date = '1' } = this.dateObj
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
      this.isFocus = false
      const value = isBlur ? ev.target.value : ev
      if (value !== this.myValue) {
        if (dateReg.test(value)) {
          const date = DateGenerator.parseDate(value.match(dateReg)[1])
          if (
            dateCompare(date, this.minDate) &&
            dateCompare(date, this.maxDate, -1)
          ) {
            this.dateObj = date
            if (isBlur) this.$emit('input', this.myValue)
          } else if (!isBlur) {
            console.warn(
              'vue-datepicker: Datepicker: prop value is out of range',
            )
            this.$emit('input', '')
          }
        } else {
          if (value)
            console.warn('vue-datepicker: Datepicker: prop value is invalid')
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
  components: { Date, IconDate },
}
</script>
