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
import noApplications from './New/noApplications.vue';
import { isDateInFuture } from '@jac-uk/jac-kit/helpers/date';
import { getTimelineTasks, taskEntryStatus } from '@/helpers/exerciseHelper';

export default {
  components: {
    defaultView,
    expired,
    qualifyingTest,
    stageOutcome,
    noApplications,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      totalApplications: 0,
    };
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
        if (!this.totalApplications) return 'noApplications';
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
  async created() {
    const task = this.$store.getters['tasks/getTask'](this.type);
    if (task && task.status) {
      this.$router.replace({
        name: getExpectedRouteName(this.type),
        params: this.$route.params,
      });
    } else {
      // check we have applications
      const entryStatus = taskEntryStatus(this.exercise, this.type);
      if (entryStatus != '') {
        const count = await this.$store.dispatch('applicationRecords/getCount', { status: entryStatus, exerciseId: this.exercise.id });
        this.totalApplications = count;
      } else {
        if (this?.exercise?._applicationRecords?.status?.blank) {
          this.totalApplications = this.exercise._applicationRecords.status.blank;
        } else if (this?.exercise?._applicationRecords?.shortlisting) {
          this.totalApplications = this.exercise._applicationRecords.shortlisting;
        } else if (this?.exercise?._applications?.applied) {
          this.totalApplications = this.exercise._applications.applied;
        }
      }
    }
  },
};
</script>
