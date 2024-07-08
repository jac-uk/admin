<template>
  <ExerciseReportsEligibilityIssuesV2 v-if="isLegalExercise" />
  <ExerciseReportsEligibilityIssuesV1 v-else />
</template>

<script>
import permissionMixin from '@/permissionMixin';
import ExerciseReportsEligibilityIssuesV1 from '@/views/Exercise/Reports/EligibilityIssuesV1.vue';
import ExerciseReportsEligibilityIssuesV2 from '@/views/Exercise/Reports/EligibilityIssuesV2.vue';

export default {
  name: 'EligibilityIssues',
  components: {
    ExerciseReportsEligibilityIssuesV1,
    ExerciseReportsEligibilityIssuesV2,
  },
  mixins: [permissionMixin],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isLegalExercise() {
      return ['legal', 'leadership'].includes(this.exercise.typeOfExercise);
    },
  },
};
</script>
