<template>
  <div
    :id="id"
    class="govuk-form-group"
  >
    <fieldset
      class="govuk-fieldset"
      :aria-describedby="hint ? hintId : false"
    >
      <legend
        v-if="label"
        class="govuk-fieldset__legend govuk-fieldset__legend--m"
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
      <div class="govuk-checkboxes">
        <slot v-if="inputValue instanceof Array" />
      </div>
    </fieldset>
  </div>
</template>

<script>
export default {
  name: 'CheckboxGroup',
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
      type: String,
    },
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
