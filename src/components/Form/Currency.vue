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
    <span class="moj-label__currency">£</span>
    <input
      :id="id"
      v-model="input"
      class=" govuk-input moj-input__currency govuk-input--width-10"
      :name="id"
      type="number"
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
    value: {
      default: null,
      type: Number,
    },
    hint: {
      default: '',
      type: String,
    },
    id: {
      default: '',
      type: String,
    },
  },

  computed: {
    input: {
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  font-size: 1rem;
  line-height: 1.25;
  background-color: #f3f2f1;
  position: absolute;
  margin: 2px 0 0 2px !important;
  padding: 5.5px 12px;
  border-right: 2px solid #0b0c0c;
}

@media (min-width: 40.0625em) {
  .moj-label__currency {
    font-size: 19px;
    font-size: 1.1875rem;
    line-height: 1.31579;
  }
}

@media print {
  .moj-label__currency {
    font-size: 14pt;
    line-height: 1.15;
  }
}

.moj-label__currency--error {
  background-color: #d4351c;
  border-right: 2px solid #d4351c;
  color: #ffffff;
}

@media (max-width: 40.0525em) {
  .moj-label__currency {
    padding: 8px 12px;
  }
}

.moj-input__currency {
  margin: 0;
  padding-left: 40px;
}

</style>
