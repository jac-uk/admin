<template>
  <LoadingMessage />
</template>

<script>
import { getExpectedRouteName } from './helper';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage';
export default {
  components: {
    LoadingMessage,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      exerciseLoaded: false,
      taskLoaded: false,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
  },
  created() {
    // if (!this.isExerciseLoaded()) {
    setTimeout(() => {
      this.isExerciseLoaded();
    }, 1500);
    // }
  },
  watch: {
    exercise: {
      handler: function() {
        this.isExerciseLoaded();
      },
      deep: true,
      // immediate: true,
    },
    task: {
      handler: function() {
        this.isExerciseLoaded();
      },
      deep: true,
      // immediate: true,
    },
  },
  methods: {
    isExerciseLoaded() {
      if (this.exercise) {
        const expectedRouteName = getExpectedRouteName(this.type);
        if (expectedRouteName !== this.$route.name) {
          this.$router.push({
            name: expectedRouteName,
            params: this.params,
          });
        }
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
