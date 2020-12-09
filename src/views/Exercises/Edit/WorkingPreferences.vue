<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />

        <h1 class="govuk-heading-xl">
          Working preferences
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />
        <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h3 class="govuk-fieldset__heading">
              Location question
            </h3>
          </legend>
          <TextField
            id="exercise-location-question"
            v-model="exercise.locationQuestion"
            label="What question would you like to ask?"
          />
          <RadioGroup
            id="exercise-location-question-type"
            v-model="exercise.locationQuestionType"
            label="How would you like the question answered?"
            :messages="{
              required: 'Please choose one of the following options'
            }"
          >
            <RadioItem
              value="single-choice"
              label="Single choice"
            />
            <RadioItem
              value="multiple-choice"
              label="Multiple choice"
            />
            <RadioItem
              value="ranked-choice"
              label="Ranked choice"
            />
          </RadioGroup>
          <RepeatableFields
            v-model="exercise.locationQuestionAnswers"
            :component="repeatableFields.Answer"
            ident="location"
            type-name="answer"
            required
          />
        </fieldset>

        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h3 class="govuk-fieldset__heading">
              Jurisdiction question
            </h3>
          </legend>
          <TextField
            id="exercise-jurisdiction-question"
            v-model="exercise.jurisdictionQuestion"
            label="What question would you like to ask?"
          />
          <RadioGroup
            id="exercise-jurisdiction-question-type"
            v-model="exercise.jurisdictionQuestionType"
            label="How would you like the question answered?"
            :messages="{
              required: 'Please choose one of the following options'
            }"
          >
            <RadioItem
              value="single-choice"
              label="Single choice"
            />
            <RadioItem
              value="multiple-choice"
              label="Multiple choice"
            />
            <RadioItem
              value="ranked-choice"
              label="Ranked choice"
            />
          </RadioGroup>
          <RepeatableFields
            v-model="exercise.jurisdictionQuestionAnswers"
            :component="repeatableFields.Answer"
            ident="jurisdiction"
            type-name="answer"
            required
          />
        </fieldset>

        <hr class="govuk-section-break govuk-section-break--visible govuk-!-margin-bottom-5">

        <RepeatableFields
          v-model="exercise.additionalWorkingPreferences"
          :component="repeatableFields.WorkingPreferenceQuestion"
          ident="additional-working-preferences"
          type-name="question"
          :allow-empty="true"
        />

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
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields';
import Answer from '@/components/RepeatableFields/Answer';
import WorkingPreferenceQuestion from '@/components/RepeatableFields/WorkingPreferenceQuestion';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';

export default {
  components: {
    ErrorSummary,
    BackLink,
    TextField,
    RepeatableFields,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data() {
    const defaults = {
      locationQuestion: null,
      locationQuestionType: 'single-choice',
      locationQuestionAnswers: null,
      jurisdictionQuestion: null,
      jurisdictionQuestionType: 'single-choice',
      jurisdictionQuestionAnswers: null,
      additionalWorkingPreferences: [],
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      repeatableFields: {
        Answer,
        WorkingPreferenceQuestion,
      },
      exercise: exercise,
    };
  },
  methods: {
    async save(isValid) {
      this.exercise.progress.workingPreferences = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-working-preferences'));
    },
  },
};
</script>
