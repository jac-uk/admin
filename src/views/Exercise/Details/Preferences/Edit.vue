<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <div
          v-if="!hasJourney"
          class="text-right"
        >
          <BackLink class="govuk-!-margin-top-0 govuk-!-margin-bottom-0" />
        </div>

        <h2 class="govuk-heading-l">
          Working preferences
        </h2>

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
            v-model="formData.locationQuestion"
            label="What question would you like to ask?"
          />
          <RadioGroup
            id="exercise-location-question-type"
            v-model="formData.locationQuestionType"
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
            v-model="formData.locationQuestionAnswers"
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
            v-model="formData.jurisdictionQuestion"
            label="What question would you like to ask?"
          />
          <RadioGroup
            id="exercise-jurisdiction-question-type"
            v-model="formData.jurisdictionQuestionType"
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
            v-model="formData.jurisdictionQuestionAnswers"
            :component="repeatableFields.Answer"
            ident="jurisdiction"
            type-name="answer"
            required
          />
        </fieldset>

        <hr class="govuk-section-break govuk-section-break--visible govuk-!-margin-bottom-5">

        <RepeatableFields
          v-model="formData.additionalWorkingPreferences"
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
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
      repeatableFields: {
        Answer,
        WorkingPreferenceQuestion,
      },
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.workingPreferences'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-preferences'));
    },
  },
};
</script>
