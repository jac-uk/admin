<template>
  <div>
    <component
      :is="newView"
      v-if="newView"
      :type="type"
    />
  </div>
</template>

<script>
import { beforeRouteEnter, getExpectedRouteName } from './helper';
import { TASK_TYPE } from '@/helpers/constants';
import defaultView from './New/default.vue';
import expired from './New/expired.vue';
import qualifyingTest from './New/qualifyingTest.vue';
import stageOutcome from './New/stageOutcome.vue';
import { isDateInFuture } from '@jac-uk/jac-kit/helpers/date';
import { getTimelineTasks } from '@jac-uk/jac-kit/helpers/exerciseHelper';

export default {
  components: {
    defaultView,
    expired,
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
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    timelineTasks() {
      return getTimelineTasks(this.exercise, this.type);
    },
    taskIsOverdue() {
      const timelineTask = this.timelineTasks[0];
      if (!timelineTask) return false;
      return !isDateInFuture(timelineTask.date);
    },
    newView() {
      if (this.taskIsOverdue) {
        switch (this.type) {
        case TASK_TYPE.SHORTLISTING_OUTCOME:
        case TASK_TYPE.SELECTION_OUTCOME:
          return 'stageOutcome';
        default:
          return 'expired';
        }
      } else {
        switch (this.type) {
        case TASK_TYPE.SHORTLISTING_OUTCOME:
        case TASK_TYPE.SELECTION_OUTCOME:
          return 'stageOutcome';
        case TASK_TYPE.QUALIFYING_TEST:
          return 'qualifyingTest';
        default:
          return 'defaultView';
        }
      }
    },
  },
  created() {
    const task = this.$store.getters['tasks/getTask'](this.type);
    if (task && task.status) {
      this.$router.replace({
        name: getExpectedRouteName(this.type),
        params: this.$route.params,
      });
    }
  },
};
</script>
