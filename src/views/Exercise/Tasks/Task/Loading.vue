<template>
  <LoadingMessage />
</template>

<script>
import { getExpectedRouteName } from './helper';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
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
  created() {
    // if (!this.isExerciseLoaded()) {
    setTimeout(() => {
      this.isExerciseLoaded();
    }, 1500);
    // }
  },
  methods: {
    isExerciseLoaded() {
      if (this.exercise) {
        const expectedRouteName = getExpectedRouteName(this.type);
        if (expectedRouteName !== this.$route.name) {
          return this.$router.push({ name: expectedRouteName });
        }
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
