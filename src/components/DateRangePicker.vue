<template>
  <div class="date-range-picker" ref="wrap">
    <input-el
      ref="inputEl"
      :id="id"
      :value="value"
      :placeholder="placeholder || '请选择开始'"
      :secondPlaceholder="secondPlaceholder || '请选择结束'"
      :readonly="!canEdit || isMobile"
      :inputStyle="inputStyle"
      :rangeSeparator="rangeSeparator"
      :isFocus="showPicker"
      :isRange="true"
      @inputEnter="inputEnter"
      @clear="onClear"
      @focus="index = $event"
    >
      <slot name="prefix" slot="prefix">
        <icon-date />
      </slot>
      <slot name="suffix" slot="suffix" />
    </input-el>
    <popper
      v-if="canEdit"
      v-show="showPicker"
      class="picker range-picker"
      :referenceElm="$refs.wrap"
      :popperOptions="$popperProps.popperOptions"
      :arrowOffsetScaling="$popperProps.arrowOffsetScaling"
      :arrowPosition="$popperProps.arrowPosition"
    >
      <date-pin
        ref="datePin0"
        :type="type"
        :value="value[0]"
        :selectedDates="rangeItems"
        :minDate="limit.minDate"
        :maxDate="firstMaxDate"
        :dayStr="dayStr"
        :monthStr="monthStr"
        :firstDayOfWeek="firstDayOfWeek"
        :isRange="true"
        @itemSelected="chose(0, $event)"
        @error="$emit('error', $event)"
        @pageChange="updateMin"
        @mouseover="hoverObj = $event"
      />
      <date-pin
        ref="datePin1"
        :type="type"
        :selectedDates="rangeItems"
        :minDate="lastMinDate"
        :maxDate="limit.maxDate"
        :dayStr="dayStr"
        :monthStr="monthStr"
        :firstDayOfWeek="firstDayOfWeek"
        :isRange="true"
        @itemSelected="chose(1, $event)"
        @error="$emit('error', $event)"
        @pageChange="updateMax"
        @mouseover="hoverObj = $event"
      />
    </popper>
  </div>
</template>

<script>
import { parseDate } from '@livelybone/date-generator'
import {
  dateCompare,
  dateReg,
  dateValidator,
  dealDateLimit,
  formatDate,
  getFirstMaxDate,
  getLastMinDate,
  isInSamePage,
} from '../common/utils'
import DatePin from '../common/DatePin.vue'
import IconDate from '../common/IconDate.vue'
import mixin from '../common/mixin'
import InputEl from '../common/InputEl'

export default {
  mixins: [mixin],
  name: 'DateRangePicker',
  props: {
    type: String,
    value: Array,
    secondPlaceholder: String,
    dayStr: Array,
    monthStr: Array,
    firstDayOfWeek: Number,
    rangeSeparator: String,
  },
  data() {
    return {
      tempSelectedDates: [null, null],
      selectedDates: [null, null],
      firstMaxDate: undefined,
      lastMinDate: undefined,
      index: -1,
      hoverObj: null,
    }
  },
  computed: {
    myValue() {
      return [
        formatDate(this.selectedDates[0], this.type),
        formatDate(this.selectedDates[1], this.type),
      ]
    },
    limit() {
      const { error, ...rest } = dealDateLimit(this.min, this.max)
      if (error) this.$emit('error', new Error(error))
      return rest
    },
    isInSamePage() {
      return isInSamePage(this.tempSelectedDates, this.type)
    },
    rangeItems() {
      if (this.tempSelectedDates.every(Boolean) || !this.hoverObj)
        return this.tempSelectedDates
      return [...this.tempSelectedDates, this.hoverObj]
        .filter(Boolean)
        .sort((a, b) => (dateCompare(a, b, -1, this.type) ? -1 : 1))
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        val.slice(0, 2).forEach((v, i) => {
          if (v !== this.myValue[i]) this.blur(v, false, i)
        })
      },
    },
    selectedDates: {
      immediate: true,
      handler(val, oldVal) {
        if (
          val.length !== oldVal ||
          val.some((v, i) => !dateCompare(v, oldVal[i], 0, this.type))
        ) {
          this.tempSelectedDates = [...val]
          this.tempSelectedDatesChange()
        }
      },
    },
  },
  methods: {
    hideEffect() {
      this.$nextTick(() => {
        if (this.index >= 0) {
          this.blur(
            { target: this.$refs.inputEl.$refs[`input${this.index}`] },
            true,
            this.index,
          )
          this.index = -1
        }
      })
    },
    inputEnter(ev) {
      const { value } = ev.target
      if (dateReg.test(value) || !value) {
        this.hide()
        ev.target.blur()
      }
    },
    blur(ev, isBlur = true, i = -1) {
      const value = isBlur ? ev.target.value : ev

      if (i === -1) {
        this.selectedDates = []
        this.$emit('input', this.myValue)
      } else if (value === this.myValue[i]) this.$forceUpdate()
      else {
        const date = parseDate(value)
        const { minDate, maxDate } = this.limit
        const error = dateValidator(date, this.type, minDate, maxDate)

        if (error) {
          this.$emit('error', new Error(error))
          this.selectedDates[i] = null
          const input = this.$refs.inputEl.$refs[`input${i}`]
          if (input) input.value = ''
        } else {
          this.selectedDates[i] = date
        }
        this.selectedDates = [...this.selectedDates]
        if (this.selectedDates.every(Boolean)) {
          this.selectedDates.sort((a, b) =>
            dateCompare(a, b, -1, this.type) ? -1 : 1,
          )
          if (isBlur) this.$emit('input', this.myValue)
        }
      }
    },
    updateMin({ currObj }) {
      const minDate = getLastMinDate(currObj, this.type)
      this.firstMaxDate = dateCompare(minDate, this.limit.minDate)
        ? minDate
        : this.limit.minDate
    },
    updateMax({ currObj }) {
      const maxDate = getFirstMaxDate(currObj, this.type)
      this.firstMaxDate = dateCompare(maxDate, this.limit.maxDate)
        ? this.limit.maxDate
        : maxDate
    },
    tempSelectedDatesChange() {
      this.$nextTick(() => {
        const [first, second] = this.tempSelectedDates
        const { datePin0, datePin1 } = this.$refs
        if (first) datePin0.$refs.dateCom.dateObj = { ...first }
        datePin1.$refs.dateCom.dateObj =
          second && !this.isInSamePage
            ? { ...second }
            : getLastMinDate(datePin0.$refs.dateCom.dateObj, this.type)
      })
    },
    chose(i, { value, nextType }) {
      if (value.type && !nextType) {
        if (this.tempSelectedDates.every(Boolean)) {
          this.tempSelectedDates = [null, null]
        }
        const index = this.tempSelectedDates[i] ? (i + 1) % 2 : i
        this.tempSelectedDates[index] = value
        this.tempSelectedDates = [...this.tempSelectedDates]

        if (this.tempSelectedDates.every(Boolean)) {
          this.tempSelectedDates.sort((a, b) =>
            dateCompare(a, b, -1, this.type) ? -1 : 1,
          )
          this.selectedDates = [...this.tempSelectedDates]
          this.$emit('input', this.myValue)
          this.hide()
        }
      }
    },
  },
  components: { DatePin, IconDate, InputEl },
}
</script>
