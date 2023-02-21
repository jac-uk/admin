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
import defaultView from './New/default';
import qualifyingTest from './New/qualifyingTest';

export default {
  components: {
    defaultView,
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
    newView() {
      switch (this.type) {
      case TASK_TYPE.QUALIFYING_TEST:
        return 'qualifyingTest';
      default:
        return 'defaultView';
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
