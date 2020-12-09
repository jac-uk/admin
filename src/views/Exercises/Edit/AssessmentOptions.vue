<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Assessment options
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <RadioGroup
          id="shortlisting-methods"
          v-model="exercise.assessmentOptions"
          required
          :messages="{
            required: 'Please choose one of the following options'
          }"
        >
          <RadioItem
            value="self-assessment-with-competencies"
            label="Self Assessment with competencies"
          />
          <RadioItem
            value="self-assessment-with-competencies-and-covering-letter"
            label="Self Assessment with competencies and covering letter"
          />
          <RadioItem
            value="self-assessment-with-competencies-and-cv"
            label="Self Assessment with competencies and CV"
          />
          <RadioItem
            value="self-assessment-with-competencies-and-cv-and-covering-letter"
            label="Self Assessment with competencies and CV and covering letter"
          />
          <RadioItem
            value="statement-of-suitability-with-competencies"
            label="Statement of Suitability with competencies"
          />
          <RadioItem
            value="statement-of-suitability-with-skills-and-abilities"
            label="Statement of Suitability with skills and abilities"
          />
          <RadioItem
            value="statement-of-suitability-with-skills-and-abilities-and-covering-letter"
            label="Statement of Suitability with skills and abilities and covering letter"
          />
          <RadioItem
            value="statement-of-suitability-with-skills-and-abilities-and-cv"
            label="Statement of Suitability with skills and abilities and CV"
          />
          <RadioItem
            value="statement-of-suitability-with-skills-and-abilities-and-cv-and-covering-letter"
            label="Statement of Suitability with skills and abilities and CV and covering letter"
          />
          <RadioItem
            value="statement-of-eligibility"
            label="Statement of eligibility"
          />
          <RadioItem
            value="none"
            label="None"
          />
        </RadioGroup>

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';

export default {
  components: {
    ErrorSummary,
    BackLink,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data(){
    const defaults = {
      assessmentOptions: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
    };
  },
  methods: {
    async save(isValid) {
      this.exercise.progress.assessmentOptions = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-assessment-options'));
    },
  },
};
</script>
