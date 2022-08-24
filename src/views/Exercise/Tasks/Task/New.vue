<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>

    <component
      :is="newView"
      v-if="newView"
      :exercise="exercise"
      :type="type"
      :timeline-tasks="timelineTasks"
      :total-applications="totalApplications"
    />

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
import defaultView from './New/default';
import qualifyingTest from './New/qualifyingTest';
import stageOutcome from './New/stageOutcome';

export default {
  components: {
    ActionButton,
    defaultView,
    qualifyingTest,
    stageOutcome,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    newView() {
      switch (this.type) {
      case TASK_TYPE.SHORTLISTING_OUTCOME:
      case TASK_TYPE.SELECTION_OUTCOME:
        return 'stageOutcome';
      case TASK_TYPE.QUALIFYING_TEST:
        return 'qualifyingTest';
      default:
        return 'defaultView';
      }
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    timelineTasks() {
      return getTimelineTasks(this.exercise, this.type);
    },
    isQualifyingTest() {
      return this.type === TASK_TYPE.QUALIFYING_TEST;
    },
    totalApplications() {
      if (!this.exercise) return 0;
      if (!this.exercise._applicationRecords) return 0;
      if (this.isQualifyingTest) return 0;
      const prevTaskType = previousTaskType(this.exercise, this.type);
      if (prevTaskType) {
        const prevTask = this.$store.getters['tasks/getTask'](prevTaskType);
        if (prevTask && prevTask._stats && prevTask._stats.totalForEachOutcome) {
          return prevTask._stats.totalForEachOutcome[taskEntryStatus(this.exercise, this.type)];
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
