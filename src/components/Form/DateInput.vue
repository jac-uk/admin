<template>
  <div class="govuk-form-group">
    <fieldset
      class="govuk-fieldset"
      aria-describedby="hint"
      role="group"
    >
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
        <h1
          v-if="label"
          class="govuk-fieldset__heading"
        >
          {{ label }}
        </h1>
      </legend>
      <span
        v-if="hint"
        id="hint"
        class="govuk-hint"
      >
        {{ hint }}
      </span>
      <div
        :id="id"
        class="govuk-date-input"
      >
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label
              class="govuk-label govuk-date-input__label"
              :for="`${id}-day`"
            >
              Day
            </label>
            <input
              :id="`${id}-day`"
              ref="dayInput"
              v-model.lazy="dayInput"
              class="govuk-input govuk-date-input__input govuk-input--width-2"
              name="${id}-day"
              type="tel"
            >
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label
              class="govuk-label govuk-date-input__label"
              :for="`${id}-month`"
            >
              Month
            </label>
            <input
              :id="`${id}-month`"
              ref="monthInput"
              v-model.lazy="monthInput"
              class="govuk-input govuk-date-input__input govuk-input--width-2"
              name="${id}-month" 
              type="tel"
            >
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label
              class="govuk-label govuk-date-input__label"
              :for="`${id}-year`"
            >
              Year
            </label>
            <input
              :id="`${id}-year`"
              ref="yearInput"
              v-model.lazy="yearInput"
              class="govuk-input govuk-date-input__input govuk-input--width-4"
              name="${id}-year" 
              type="tel"
            >
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script>
import validateDay from '@/helpers/Form/validateDay';
import validateMonth from '@/helpers/Form/validateMonth';
import validateYear from '@/helpers/Form/validateYear';
import zeroPad from '@/helpers/Form/zeroPad';

export default {
  props: {
    label: {
      default: '',
      type: String,
    },
    hint: {
      default: '',
      type: String,
    },
    id: {
      required: true,
      default: '',
      type: String,
    },
    value: {
      required: true,
      validator: (value) => (value instanceof Date || value === null || value === undefined),
    },
  },
  data() {
    return {
      day: null,
      month: null,
      year: null,
    };
  },
  computed: {
    dayInput: {
      get() {
        return zeroPad(this.day);
      },
      set(value) {
        this.day = validateDay(value);
      },
    },
    monthInput: {
      get() {
        return zeroPad(this.month);
      },
      set(value) {
        this.month = validateMonth(value);
      },
    },
    yearInput: {
      get() {
        return this.year;
      },
      set(value) {
        this.year = validateYear(value);
      },
    },
    dateConstructor() {
      const day = this.day;
      const month = this.month;
      const year = this.year;

      if(!day || !month|| !year) {
        return null;
      }

      return [year, month-1, day];
    },
    date: {
      get() {
        if (this.dateConstructor === null) {
          return null;
        } else {
          return new Date(Date.UTC(...this.dateConstructor));
        }
      },
      set(value) {
        if (value instanceof Date) {
          this.day = value.getUTCDate();
          this.month = value.getUTCMonth() + 1;
          this.year = value.getUTCFullYear();
        }
      },
    },
  },
  watch: {
    date(value) {
      this.$emit('input', value);
    },
    value(newValue, oldValue) {
      if (!this.datesAreEqual(newValue, oldValue)) {
        this.date = newValue;
      }
    },
  },
  created() {
    this.date = this.value;
  },
  methods: {
    datesAreEqual(date1, date2) {
      return (
        date1 instanceof Date &&
        date2 instanceof Date &&
        date1.getTime() === date2.getTime()
      );
    },
  },
};
</script>
