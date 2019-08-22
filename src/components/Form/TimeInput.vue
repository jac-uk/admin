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
              :for="`${id}-hour`"
            >
              Hour
            </label>
            <input
              :id="`${id}-hour`"
              ref="hourInput"
              v-model.lazy="hourInput"
              class="govuk-input govuk-date-input__input govuk-input--width-2"
              name="${id}-hour"
              type="tel"
            >
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label
              class="govuk-label govuk-date-input__label"
              :for="`${id}-minute`"
            >
              Minute
            </label>
            <input
              :id="`${id}-minute`"
              ref="minuteInput"
              
              class="govuk-input govuk-date-input__input govuk-input--width-2"
              name="${id}-minute" 
              type="tel"
            >
          </div>
        </div>
      </div>
      VALUE: {{ value }}
    </fieldset>
  </div>
</template>

<script>
import validateMinute from '@/helpers/Form/validateMinute';
import validateHour from '@/helpers/Form/validateHour';
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
      minute: null,
      hour: null,
    };
  },
  computed: {
    hourInput: {
      get() {
        if(this.hour === 0) {
          return '00';
        }
        return zeroPad(this.hour);
      },
      set(value) {
        this.hour = validateHour(value);
      },
    },
    minuteInput: {
      get() {
        if(this.minute === 0) {
          return '00';
        }
        return zeroPad(this.minute);
      },
      set(value) {
        this.minute = validateMinute(value);
      },
    },
    dateConstructor() {
      const hour = this.hour; 
      const minute = this.minute;

      if(hour === null  || minute === null) {
        return null;
      }

      return [0, 0, 0, hour, minute];
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
          this.hour = value.getHours();
          this.minute = value.getMinutes();
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
