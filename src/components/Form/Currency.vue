<template>
  <div
    class="govuk-form-group"
    :class="{'govuk-form-group--error': hasError}"
  >
    <label
      :for="id"
      class="govuk-heading-m govuk-!-margin-bottom-2"
    >
      {{ label }}
    </label>
    <span
      v-if="hint"
      class="govuk-hint"
    >
      {{ hint }}
    </span>
    <FormFieldError
      :id="id"
      :error-message="errorMessage"
    />
    <span class="moj-label__currency">£</span>
    <input
      :id="id"
      v-model="currencyInput"
      class="govuk-input moj-input__currency govuk-input--width-10"
      type="number"
      @change="validate"
    >
  </div>
</template>

<script>
import FormField from '@/components/Form/FormField';
import FormFieldError from '@/components/Form/FormFieldError';

export default {
  components: {
    FormFieldError,
  },
  extends: FormField,
  props: {
    value: {
      default: null,
      type: String,
    },
  },
  computed: {
    currencyInput: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },

  },
};
</script>
<style scoped>
  .moj-label__currency {
    line-height: 1.25;
    font-style: 1rem;
    background-color: #f3f2f1;
    position: absolute;
    margin: 2px 0 0 2px !important;
    padding: 5.5px 12px;
    border-right: 2px solid #0b0c0c;
  }

  @media (min-width: 40.0625em) {
    .moj-label__currency {
      font-size: 1.1875rem;
      line-height: 1.31579;
    }
  }

  @media (max-width: 40.0525em) {
    .moj-label__currency {
      padding: 0.5em 0.75em;
    }
  }

  .moj-input__currency {
    margin: 0;
    padding-left: 2.5em;
  }
</style>
