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
    <input
      :id="id"
      v-model="text"
      :class="inputClass + ' govuk-input'"
      :name="id"
      :type="type"
    >
  </div>
</template>

<script>
export default {
  props: {
    label: {
      default: '',
      type: String,
    },
    inputClass: {
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
    id: {
      default: '',
      type: String,
    },
    type: {
      default: 'text',
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
