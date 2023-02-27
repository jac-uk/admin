<template>
  <div>
    <h1 class="govuk-heading-l">
      {{ type | lookup }}
    </h1>

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
      {{ timelineTask.entry }} will happen on {{ timelineTask.dateString }}
    </Checkbox>

    <Checkbox
      v-if="entryStatus"
      id="entryStatus"
      v-model="formData.entryStatus"
    >
      Only '{{ entryStatus | lookup }}' applications will be included
    </Checkbox>

    <ActionButton
      class="govuk-!-margin-bottom-0"
      type="primary"
      :disabled="!isFormCompleted"
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
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox';
import { functions } from '@/firebase';

export default {
  components: {
    ActionButton,
    Checkbox,
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
    isQualifyingTest() {
      return this.type === TASK_TYPE.QUALIFYING_TEST;
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
      await functions.httpsCallable('createTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
  },
};
</script>
