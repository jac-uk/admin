<template>
  <div class="govuk-grid-column-two-thirds">
    <form @submit.prevent="validateAndSave">
      <h2 class="govuk-heading-l">
        Edit {{ isTieBreaker ? 'equal merit tie-breaker' : 'qualifying test' }} details
      </h2>

      <ErrorSummary
        :errors="errors"
        :show-save-button="false"
        @save="save"
      />

      <TextField
        id="qualifyingTest-title"
        v-model="qualifyingTest.title"
        label="Title"
        required
      />

      <DateInput
        id="qualifyingTest-startDate"
        v-model="qualifyingTest.startDate"
        type="datetime"
        label="Start date"
        required
        :min-date="minDate"
      />

      <DateInput
        id="qualifyingTest-endDate"
        v-model="qualifyingTest.endDate"
        type="datetime"
        label="End date"
        required
        :min-date="minDate"
      />

      <TextField
        id="qualifyingTest-testDuration"
        v-model="qualifyingTest.testDuration"
        label="Duration"
        hint="In minutes."
        type="number"
        required
        input-class="govuk-input--width-3"
      />

      <h3 class="govuk-heading-m">
        Additional instructions
      </h3>
      <span class="govuk-hint">Any additional instructions for the candidate - will be displayed before they start the test.</span>

      <RepeatableFields
        v-model="qualifyingTest.additionalInstructions"
        :component="repeatableFields.QTAdditionalInstruction"
        ident="additionalInstructions"
        required
      />

      <TextField
        id="qualifyingTest-feedback-survey"
        v-model="qualifyingTest.feedbackSurvey"
        label="Feedback Survey URL"
      />

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields';
import QTAdditionalInstruction from '@/components/RepeatableFields/QualifyingTests/AdditionalInstruction.vue';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';

export default {
  components: {
    ErrorSummary,
    TextField,
    DateInput,
    RepeatableFields,
  },
  extends: Form,
  data(){
    const exercise = this.$store.getters['exerciseDocument/data']();
    const data = this.$store.getters['qualifyingTest/data']();

    const defaults = {
      title: null,
      startDate: (data.isTieBreaker ? this.getEMZDate(exercise, 'Start') : this.getTimelineDate(exercise, data.type, 'Start')) || null,
      endDate: (data.isTieBreaker ? this.getEMZDate(exercise, 'End') : this.getTimelineDate(exercise, data.type, 'StarEnd')) || null,
      testDuration: null,
      additionalInstructions: [],
      feedbackSurvey: null,
    };

    const qualifyingTest = { ...defaults, ...data };

    return {
      exercise,
      repeatableFields: {
        QTAdditionalInstruction,
      },
      qualifyingTest: qualifyingTest,
    };
  },
  computed: {
    testTypes() {
      return QUALIFYING_TEST.TYPE;
    },
    isTieBreaker() {
      return this.qualifyingTest.isTieBreaker;
    },
    routeNamePrefix() {
      return this.isTieBreaker ? 'equal-merit-tie-breaker' : 'qualifying-test';
    },
    minDate() {
      return this.isTieBreaker ? this.getEMZDate(this.exercise, 'Start') : null;
    },
    maxDate() {
      return this.isTieBreaker ? this.getEMZDate(this.exercise, 'End') : null;
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('qualifyingTest/save', this.qualifyingTest);
      this.$router.push({ name: `${this.routeNamePrefix}-question-builder` });
    },
    getTimelineDate(exercise, qtType, dateType) {
      if (!exercise.shortlistingMethods) {
        return;
      }

      let fieldName;
      if (qtType === QUALIFYING_TEST.TYPE.SCENARIO && exercise.shortlistingMethods.includes('scenario-test-qualifying-test')) {
        fieldName = 'scenarioTest';
      }
      if (qtType === QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT && exercise.shortlistingMethods.includes('situational-judgement-qualifying-test')) {
        fieldName = 'situationalJudgementTest';
      }
      if (qtType === QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS && exercise.shortlistingMethods.includes('critical-analysis-qualifying-test')) {
        fieldName = 'criticalAnalysisTest';
      }

      const date = exercise[`${fieldName}Date`];
      const time = exercise[`${fieldName}${dateType}Time`];

      let datetime;
      if (date instanceof Date) {
        datetime = new Date(date.getTime());
      }
      if (time instanceof Date) {
        datetime.setHours(time.getHours());
        datetime.setMinutes(time.getMinutes());
      }

      return datetime;
    },
    getEMZDate(exercise, dateType) {
      const date = exercise[`equalMeritSecondStage${dateType}Date`];
      if (date instanceof Date) {
        return new Date(date.getTime());
      }
      return;
    },
  },
};
</script>
