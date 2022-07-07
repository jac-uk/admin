<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }} test
    </h1>

    <p class="govuk-body-l">
      Please check the following details before creating a test on the QT Platform
    </p>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            Start
          </div>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ startDate | formatDate('datetime') }}
          </h2>
        </div>
      </div>

      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            End
          </div>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ endDate | formatDate('datetime') }}
          </h2>
        </div>
      </div>
    </div>

    <ActionButton
      class="govuk-!-margin-bottom-0"
      type="primary"
      @click="createQT"
    >
      Create on QT Platform
    </ActionButton>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { functions } from '@/firebase';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';

export default {
  components: {
    ActionButton,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    startDate() {
      return this.getTimelineDate(this.exercise, this.type, 'Start');
    },
    endDate() {
      return this.getTimelineDate(this.exercise, this.type, 'End');
    },
  },
  methods: {
    btnNext,
    async createQT() {
      const response = await functions.httpsCallable('createQualifyingTest')({
        exerciseId: this.exercise.id,
        folder: this.exercise.referenceNumber,
        test: {
          type: this.type,
          title: `${this.$options.filters.lookup(this.type)} test for ${this.exercise.referenceNumber}`,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      });
      if (response && response.data && response.data.success) {
        this.btnNext();
      }
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
  },
};
</script>
