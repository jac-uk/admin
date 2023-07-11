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
import expiredQT from './New/expiredQT.vue';
import qualifyingTest from './New/qualifyingTest.vue';
import { isDateInFuture } from '@jac-uk/jac-kit/helpers/date';
import { getTimelineTasks } from '@/helpers/exerciseHelper';

export default {
  components: {
    defaultView,
    expired,
    expiredQT,
    qualifyingTest,
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
        case TASK_TYPE.CRITICAL_ANALYSIS:
        case TASK_TYPE.SITUATIONAL_JUDGEMENT:
        case TASK_TYPE.SCENARIO:
          return 'expiredQT';
        default:
          return 'expired';
        }
      } else {
        switch (this.type) {
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
