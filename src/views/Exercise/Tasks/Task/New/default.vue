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
      await functions.httpsCallable('createTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
  },
};
</script>
