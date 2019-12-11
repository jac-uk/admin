<template>
  <div
    :id="id"
    class="govuk-form-group"
    :class="{'govuk-form-group--error': hasError}"
  >
    <fieldset
      class="govuk-fieldset"
      :aria-describedby="hint ? hintId : false"
    >
      <legend
        v-if="label"
        class="govuk-fieldset__legend govuk-fieldset__legend--m govuk-!-margin-bottom-2"
      >
        {{ label }}
      </legend>
      <span
        v-if="hint"
        :id="hintId"
        class="govuk-hint"
      >
        {{ hint }}
      </span>
      <FormFieldError
        :id="id"
        :error-message="errorMessage"
      />
      <div class="govuk-checkboxes">
        <slot v-if="inputValue instanceof Array" />
      </div>
    </fieldset>
  </div>
</template>

<script>
import FormField from '@/components/Form/FormField';
import FormFieldError from '@/components/Form/FormFieldError';

export default {
  name: 'CheckboxGroup',
  components: {
    FormFieldError,
  },
  extends: FormField,
  props: {
    value: {
      required: true,
      validator: (value) => (value instanceof Array || value === null || value === undefined),
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    hintId() {
      return `${this.id}__hint`;
    },
  },
  created() {
    if (!(this.value instanceof Array)) {
      this.$emit('input', []);
    }
  },
};
</script>
