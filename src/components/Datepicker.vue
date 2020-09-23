<template>
  <div class="datepicker" ref="wrap">
    <input-el
      ref="inputEl"
      :id="id"
      :value="[value]"
      :placeholder="placeholder || '请选择日期'"
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
        ref="datePin0"
        :value="valArr[0]"
        :selectedDates="tempSelectedDates"
        :type="type"
        :minDate="limit.minDate"
        :maxDate="limit.maxDate"
        :dayStr="dayStr"
        :monthStr="monthStr"
        :firstDayOfWeek="firstDayOfWeek"
        :tenYears="tenYears"
        @itemSelected="chose"
        @error="$emit('error', $event)"
      >
        <div v-if="multiple" class="btns" slot="btn">
          <span class="btn btn-sure" @click="confirm">{{ $btnStr }}</span>
        </div>
      </date-pin>
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
} from '../common/utils'
import DatePin from '../common/DatePin.vue'
import IconDate from '../common/IconDate.vue'
import mixin from '../common/mixin'
import InputEl from '../common/InputEl'

export default {
  mixins: [mixin],
  name: 'Datepicker',
  props: {
    multiple: Boolean,
    type: String,
    dayStr: Array,
    monthStr: Array,
    firstDayOfWeek: Number,
    btnStr: String,
  },
  data() {
    return {
      tempSelectedDates: [],
      selectedDates: [],
    }
  },
  computed: {
    $btnStr() {
      return this.btnStr || '确定'
    },
    valArr() {
      return this.value.split(/\s*,\s*/)
    },
    myValue() {
      return this.selectedDates.map(it => formatDate(it, this.type)).join(',')
    },
    limit() {
      const { error, ...rest } = dealDateLimit(this.min, this.max)
      if (error) this.$emit('error', new Error(error))
      return rest
    },
  },
  watch: {
    valArr: {
      immediate: true,
      handler(val) {
        const arr = this.myValue.split(',')
        val.forEach(v => {
          if (!arr.includes(v)) this.blur(v, false)
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
    inputEnter(ev) {
      const { value } = ev.target
      if (dateReg.test(value) || !value) {
        this.hide()
        ev.target.blur()
      }
    },
    blur(ev, isBlur = true) {
      const value = isBlur ? ev.target.value : ev

      if (this.myValue === value) this.$forceUpdate()
      else {
        const arr = this.multiple ? value.split(',') : [value]
        const dates = []
        let error = ''

        arr.forEach(val => {
          const date = parseDate(val)
          const { minDate, maxDate } = this.limit
          const err = dateValidator(date, this.type, minDate, maxDate)

          if (err) error += err
          else if (date) dates.push(date)
        })

        if (error) {
          this.$emit('error', new Error(error))
          this.selectedDates = dates
          this.$emit('input', this.myValue)
        } else {
          this.selectedDates = dates
          if (isBlur) this.$emit('input', this.myValue)
        }
      }
    },
    tempSelectedDatesChange() {
      this.$nextTick(() => {
        const last = [...this.tempSelectedDates].pop()
        const { datePin0 } = this.$refs
        if (last) datePin0.$refs.dateCom.dateObj = { ...last }
      })
    },
    chose({ value, nextType }) {
      if (value.type && !nextType) {
        if (!this.multiple) {
          this.tempSelectedDates = [value]
          this.confirm()
        } else {
          const index = Object.keys(this.tempSelectedDates).find(i =>
            dateCompare(value, this.tempSelectedDates[i], 0, this.type),
          )

          if (index) this.tempSelectedDates.splice(+index, 1)
          else this.tempSelectedDates.push(value)
        }
      }
    },
    confirm() {
      this.selectedDates = [...this.tempSelectedDates]
      this.$emit('input', this.myValue)
      this.hide()
    },
  },
  components: { IconDate, DatePin, InputEl },
}
</script>
