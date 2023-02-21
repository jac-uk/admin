<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>

    <p
      class="govuk-body-l"
    >
      Please check the following details before continuing
    </p>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-5 govuk-!-padding-4 background-light-grey">
          <div class="govuk-caption-m">
            Applications <span v-if="entryStatus">({{ entryStatus | lookup }})</span>
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
          <span class="govuk-caption-m">{{ timelineTask.entry }}</span>
          <h2
            class="govuk-heading-m govuk-!-margin-bottom-0"
          >
            {{ timelineTask.dateString }}
          </h2>
        </div>
      </div>
    </div>

    <div
      v-if="taskIsOverdue"
      class="govuk-warning-text"
    >
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        This task is overdue. Please change dates on the <RouterLink
          :to="{ name: 'exercise-details-timeline' }"
          class="govuk-link"
        >timeline</RouterLink> if you wish to carry out the task.<br> Alternatively press continue to enter results data only.
      </strong>
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
import { btnNext } from '../helper';
import { TASK_TYPE } from '@/helpers/constants';
import { taskEntryStatus, previousTaskType, getTimelineTasks } from '@/helpers/exerciseHelper';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { functions } from '@/firebase';

export default {
  components: {
    ActionButton,
  },
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
    entryStatus() {
      return taskEntryStatus(this.exercise, this.type);
    },
    timelineTasks() {
      return getTimelineTasks(this.exercise, this.type);
    },
    isQualifyingTest() {
      return this.type === TASK_TYPE.QUALIFYING_TEST;
    },
    taskIsOverdue() {
      console.log(this.timelineTasks);
      return true;
    },
    totalApplications() {
      if (!this.exercise) return 0;
      if (!this.exercise._applicationRecords) return 0;
      if (this.isQualifyingTest) return 0;
      if (this.type === TASK_TYPE.EMP_TIEBREAKER) return 0; // TODO: remove this when we have support for other tasks
      const prevTaskType = previousTaskType(this.exercise, this.type);
      if (prevTaskType) {
        const prevTask = this.$store.getters['tasks/getTask'](prevTaskType);
        if (prevTask && prevTask._stats && prevTask._stats.totalForEachOutcome) {
          return prevTask._stats.totalForEachOutcome[taskEntryStatus(this.exercise, this.type)];
        }
      } else {
        return this.exercise._applicationRecords.review || 0;
      }
      return 0;
    },
  },
  methods: {
    btnNext,
    async btnInitialise() {
      const params = {
        exerciseId: this.exercise.id,
        type: this.type,
      };
      if (this.taskIsOverdue) {
        params.dataOnly = true;
      }
      await functions.httpsCallable('createTask')(params);
      this.btnNext();
    },
  },
};
</script>
