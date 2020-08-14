<template>
  <div>
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h3 class="govuk-fieldset__heading">
        Scenario
      </h3>
    </legend>
    <TextareaInput
      id="scenario-scenario-input"
      ident="scenario-scenario-input"
      label="Question X"
    />
  </div>
</template>

<script>
import TextareaInput from '@/components/Form/TextareaInput';

export default {
  components: {
    TextareaInput,
  },
};
</script>
