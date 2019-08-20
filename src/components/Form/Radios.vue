<template>
  <div
    :id="id"
    class="govuk-form-group"
  >
    <fieldset
      class="govuk-fieldset"
      :aria-describedby="hint ? hintId : false"
    >
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
        {{ label }}
      </legend>
      <span
        v-if="hint"
        :id="hintId"
        class="govuk-hint"
      >
        {{ hint }}
      </span>
      <div class="govuk-radios">
        <slot />
      </div>
    </fieldset>
  </div>
</template>

<script>
export default {
  name: 'Radios',
  props: {
    label: {
      required: true,
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
      validator: () => true,
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
};
</script>
