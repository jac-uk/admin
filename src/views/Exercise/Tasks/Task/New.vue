<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>

    <p
      v-if="isQualifyingTest"
      class="govuk-body-l"
    >
      Please complete Critical Analysis and Situational Judgement tests before continuing
    </p>
    <p
      v-else
      class="govuk-body-l"
    >
      Please check the following details before continuing
    </p>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            Applications
          </div>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ totalApplications }}
          </h2>
        </div>
      </div>

      <div
        v-for="(timelineTask, index) in timelineTasks"
        :key="`timelineTask-${index}`"
        class="govuk-grid-column-one-half"
      >
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <span class="govuk-caption-m">{{ timelineTask.entry }} dates</span>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ timelineTask.dateString }}
          </h2>
        </div>
      </div>
    </div>

    <ActionButton
      class="govuk-!-margin-bottom-0"
      type="primary"
      :disabled="!totalApplications"
      @click="btnInitialise"
    >
      Continue
    </ActionButton>
  </div>
</template>

<script>
import { beforeRouteEnter, btnNext } from './helper';
import { TASK_TYPE } from '@/helpers/constants';
import { taskEntryStatus, previousTaskType, getTimelineTasks } from '@/helpers/exerciseHelper';
import { functions } from '@/firebase';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';

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
    timelineTasks() {
      return getTimelineTasks(this.exercise, this.type);
    },
    isSift() {
      return this.type === TASK_TYPE.SIFT;
    },
    isSelection() {
      return this.type === TASK_TYPE.SELECTION;
    },
    isScenario() {
      return this.type === TASK_TYPE.SCENARIO;
    },
    isCriticalAnalysis() {
      return this.type === TASK_TYPE.CRITICAL_ANALYSIS;
    },
    isSituationalJudgement() {
      return this.type === TASK_TYPE.SITUATIONAL_JUDGEMENT;
    },
    isQualifyingTest() {
      return this.type === TASK_TYPE.QUALIFYING_TEST;
    },
    hasCriticalAnalysis() {
      return this.exercise.shortlistingMethods.indexOf('critical-analysis-qualifying-test') >= 0 && this.exercise.criticalAnalysisTestDate;
    },
    hasSituationalJudgement() {
      return this.exercise.shortlistingMethods.indexOf('situational-judgement-qualifying-test') >= 0 && this.exercise.situationalJudgementTestDate;
    },
    hasQualifyingTest() {
      return this.hasCriticalAnalysis && this.hasSituationalJudgement;
    },
    criticalAnalysis() {
      return this.$store.getters['tasks/getTask'](TASK_TYPE.CRITICAL_ANALYSIS);
    },
    situationalJudgement() {
      return this.$store.getters['tasks/getTask'](TASK_TYPE.SITUATIONAL_JUDGEMENT);
    },
    totalApplications() {
      if (!this.exercise) return 0;
      if (!this.exercise._applicationRecords) return 0;
      // if (this.isSelection) return this.exercise._applicationRecords.selectable || 0;
      if (this.isQualifyingTest) return 0;
      const prevTaskType = previousTaskType(this.exercise, this.type);
      if (prevTaskType) {
        const prevTask = this.$store.getters['tasks/getTask'](prevTaskType);
        if (prevTask && prevTask._stats && prevTask._stats.totalForEachOutcome) {
          return prevTask._stats.totalForEachOutcome[`${prevTaskType}Passed`];
        }
      } else {
        return this.exercise._applicationRecords.applied || 0;
      }
      return 0;
    },
  },
  methods: {
    btnNext,
    async btnInitialise() {
      await functions.httpsCallable('initialiseTask')({
        exerciseId: this.exercise.id,
        type: this.type,
        status: taskEntryStatus(this.exercise, this.type),
      });
      this.btnNext();
    },
  },
};
</script>
