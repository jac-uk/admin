<template>
  <div class="govuk-form-group">
    <label
      :for="id"
      class="govuk-heading-m"
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
      :class="klass"
      v-model="text"
      :name="id"
      type="tel"
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
    klass: {
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
      default: '',
      // type: String,
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
