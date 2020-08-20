<template>
  <div>
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h3 class="govuk-fieldset__heading">
        Scenario
      </h3>
    </legend>
    <TextareaInput
      id="scenario-question-input"
      v-model="text"
      ident="scenario-question-input"
      label="Scenario Text"
    />      
  </div>
</template>

<script>
import TextareaInput from '@/components/Form/TextareaInput';

export default {
  components: {
    TextareaInput,
  },
  props: {
    value: {
      type: String,
      default: '',
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
