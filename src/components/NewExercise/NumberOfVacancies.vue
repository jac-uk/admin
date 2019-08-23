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
      v-model="immediateStart"
      klass="govuk-input--width-5 govuk-input"
      label="Immediate start"
      hint="These are also called section 87 (S87) vacancies"
      type="narrow"
    />

    <TextField
      id="future__start"
      v-model="futureStart"
      klass="govuk-input--width-5 govuk-input"
      label="Future Start"
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
  data() {
    return {
      immediateStart: '' ,
      futureStart: '',
    };
  },
};
</script>
