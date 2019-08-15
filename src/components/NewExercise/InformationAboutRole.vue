<template>
  <div>
    <h3 class="govuk-heading-xl">
      About the role
    </h3>
    <h2 class="govuk-heading-m">
      Number of vacancies
    </h2>
    <TextField 
      id="immediate_start" 
      label="Immediate start" 
      hint="These are also called section 87 (S87) vacancies"
      type="narrow"
    />
    <TextField 
      id="future__start" 
      label="Future start" 
      hint="These are also called section 94 (S94) vacancies"
      type="narrow"
    />
    <button
      type="submit"
      class="govuk-button"
      data-module="govuk-button"
    >
      Continue
    </button>
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
