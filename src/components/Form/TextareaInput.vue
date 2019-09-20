<template>
  <div class="govuk-form-group">
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
    <textarea
      :id="id"
      v-model="text"
      class="govuk-textarea"
      :rows="rows"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      default: '',
      type: String,
    },
    value: {
      default: '',
      type: String,
    },
    hint: {
      default: '',
      type: String,
    },
    rows: {
      default: '5',
      type: String,
    },
    id: {
      default: '',
      type: String,
    },
  },

  computed: {
    text: {
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
