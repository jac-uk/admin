<template>
  <div
    class="govuk-form-group"
    :class="{ 'govuk-form-group--error': hasError }"
  >
    <fieldset
      class="govuk-fieldset"
      :aria-describedby="hint ? `${id}-hint` : null"
      role="group"
    >
      <legend
        v-if="label && displayLabel"
        class="govuk-fieldset__legend govuk-fieldset__legend--m govuk-!-margin-bottom-2"
      >
        {{ label }}
      </legend>

      <span
        v-if="hint"
        :id="`${id}-hint`"
        class="govuk-hint"
      >
        {{ hint }}
      </span>

      <FormFieldError
        :id="id"
        :error-message="errorMessage"
      />

      <div
        :id="id"
        class="govuk-date-input"
      >
        <template v-if="type === 'datetime'">
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
                type="number"
              >
            </div>
          </div>
          <div class="govuk-date-input__item govuk-!-margin-right-7">
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
                v-model.lazy="minuteInput"
                class="govuk-input govuk-date-input__input govuk-input--width-2"
                type="number"
              >
            </div>
          </div>
        </template>

        <div
          v-if="type === 'date' || type === 'datetime'"
          class="govuk-date-input__item"
        >
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
              oninput="this.value=this.value.slice(0,this.maxLength)"
              maxlength="2"
              type="number"
              :disabled="disabled"
              @keydown="handleDay"
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
              oninput="this.value=this.value.slice(0,this.maxLength)"
              maxlength="2"
              type="number"
              :disabled="disabled"
              @keydown="handleMonth"
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
              oninput="this.value=this.value.slice(0,this.maxLength)"
              maxlength="4"
              type="number"
              :disabled="disabled"
              @keydown="handleYear"
            >
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script>
import parseAndClipNumber from '@jac-uk/jac-kit/helpers/Form/parseAndClipNumber';
import validateYear from '@jac-uk/jac-kit/helpers/Form/validateYear';
import zeroPad from '@jac-uk/jac-kit/helpers/Form/zeroPad';
import FormField from '@jac-uk/jac-kit/draftComponents/Form/FormField.vue';
import FormFieldError from '@jac-uk/jac-kit/draftComponents/Form/FormFieldError.vue';
export default {
  compatConfig: {
    COMPONENT_V_MODEL: false,
    // or, for full vue 3 compat in this component:
    //MODE: 3,
  },
  components: {
    FormFieldError,
  },
  extends: FormField,
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      default: 'date',
      validator: value => ['date', 'month', 'datetime'].indexOf(value) !== -1,
    },
    modelValue: {
      required: true,
      validator: value => value instanceof Date || value === null || value === undefined,
    },
    displayLabel: { // Need to be able to suppress displaying the label when we want more control over it
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      day: null,
      month: null,
      year: null,
      hour: null,
      minute: null,
    };
  },
  computed: {

    hourInput: {
      get() {
        return zeroPad(this.hour);
      },
      set(value) {
        this.hour = parseAndClipNumber(value, 0, 23);
      },
    },
    minuteInput: {
      get() {
        return zeroPad(this.minute);
      },
      set(value) {
        this.minute = parseAndClipNumber(value, 0, 59);
      },
    },
    dayInput: {
      get() {
        return zeroPad(this.day);
      },
      set(value) {
        this.day = parseAndClipNumber(value, 1, 31);
      },
    },
    monthInput: {
      get() {
        return zeroPad(this.month);
      },
      set(value) {
        this.month = parseAndClipNumber(value, 1, 12);
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
      const day = this.type === 'month' ? 1 : this.day;
      const month = this.month;
      const year = this.year;
      const hour = this.type === 'datetime' ? this.hour : 13; // default time to 1pm. this avoids BST issue we would have if we defaulted to 0
      const minute = this.type === 'datetime' ? this.minute : 0;
      if (!day || !month || !year) {
        return null;
      }
      return [year, month - 1, day, hour, minute];
    },
    date: {
      get() {
        if (this.dateConstructor === null) {
          return null;
        } else {
          return new Date(...this.dateConstructor);
        }
      },
      set(value) {
        if (value instanceof Date) {
          this.day = value.getDate();
          this.month = value.getMonth() + 1;
          this.year = value.getFullYear();
          this.hour = value.getHours();
          this.minute = value.getMinutes();
        }
      },
    },
  },
  watch: {
    date(value) {
      this.$emit('update:modelValue', value);
    },
    modelValue(newValue, oldValue) {
      if (!this.datesAreEqual(newValue, oldValue)) {
        this.date = newValue;
      }
    },
  },
  created() {
    this.date = this.modelValue;
  },
  methods: {
    datesAreEqual(date1, date2) {
      return date1 instanceof Date && date2 instanceof Date && date1.toISOString() === date2.toISOString();
    },
    handleDay(e) {
      if (!['Backspace', 'ArrowRight', 'ArrowLeft', 'Tab', 'Shift'].some((item) => item === e.key) && e.target.value.length === e.target.maxLength) {
        this.$refs['monthInput'].focus();
      }
    },
    handleMonth(e) {
      if (!['Backspace', 'ArrowRight', 'ArrowLeft', 'Tab', 'Shift'].some((item) => item === e.key) && e.target.value.length === e.target.maxLength) {
        this.$refs['yearInput'].focus();
      } else if (!e.target.value && e.key === 'Backspace') {
        this.$refs['dayInput'].focus();
      }
    },
    handleYear(e) {
      if (!e.target.value && e.key === 'Backspace') {
        this.$refs['monthInput'].focus();
      }
    },
  },
};
</script>
