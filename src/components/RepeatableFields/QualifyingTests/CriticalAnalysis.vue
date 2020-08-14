<template>
  <div>
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h3 class="govuk-fieldset__heading">
        Critical Analysis
      </h3>
    </legend>
    <TextField
      id="critical-analysis-question-input"
      ident="critical-analysis-question-input"
      label="Question X"
    />      
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  components: {
    TextField,
  },
};
</script>
