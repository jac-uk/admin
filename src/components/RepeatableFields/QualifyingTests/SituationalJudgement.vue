<template>
  <div>
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h3 class="govuk-fieldset__heading">
        Situational Judgement
      </h3>
    </legend>
    <TextField
      id="situational-judgement-question-input"
      v-model="text"
      ident="situational-judgement-question-input"
      label="Question Text"
    />      
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  components: {
    TextField,
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
