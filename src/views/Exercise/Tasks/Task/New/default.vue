<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-third">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <p
      class="govuk-body"
    >
      Please confirm the following
    </p>

    <Checkbox
      v-for="(timelineTask, index) in timelineTasks"
      :id="`timelineTask-${index}`"
      :key="`timelineTask-${index}`"
      v-model="formData.timelineTasks[index]"
    >
      {{ timelineTask.entry }} will happen {{ timelineTask.dateString }}
    </Checkbox>

    <Checkbox
      v-if="entryStatus"
      id="entryStatus"
      v-model="formData.entryStatus"
    >
      Only '{{ $filters.lookup(entryStatus) }}' applications will be included
    </Checkbox>

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
      :disabled="!isFormCompleted"
      :action="btnInitialise"
    >
      Continue
    </ActionButton>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { btnNext } from '../helper';
import { TASK_TYPE } from '@jac-uk/jac-kit/helpers/constants';
import { taskEntryStatus, previousTaskType, getTimelineTasks, getTaskSteps } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import { functions } from '@/firebase';
import { isDateInFuture } from '@jac-uk/jac-kit/helpers/date';

export default {
  components: {
    ActionButton,
    Checkbox,
    FullScreenButton,
    ProgressBar,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      formData: {
        entryStatus: null,
        timelineTasks: [],
      },
    };
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
    task() {
      return { status: 'new' };
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    isQualifyingTest() {
      return this.type === TASK_TYPE.QUALIFYING_TEST;
    },
    taskIsOverdue() {
      const timelineTask = this.timelineTasks[0];
      return !isDateInFuture(timelineTask.date);
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
    isFormCompleted() {
      let expectedLength = 0;
      let actualLength = 0;
      if (this.entryStatus) {
        expectedLength += 1;
        if (this.formData.entryStatus === true) actualLength += 1;
      }
      expectedLength += this.timelineTasks.length;
      actualLength += this.formData.timelineTasks.length;
      return expectedLength === actualLength;
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
      await httpsCallable(functions, 'createTask')(params);
      this.btnNext();
    },
  },
};
</script>
