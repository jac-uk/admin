<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-details-assessments-edit'}"
      >
        Update assessment options
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Assessment options
    </h2>

    <p class="govuk-body">
      <span class="display-block">{{ exercise.assessmentOptions | lookup }}</span>
      <span
        v-for="assessmentMethod in assessmentMethods"
        :key="assessmentMethod"
        class="display-block"
      >{{ assessmentMethod }}</span>
    </p>
  </div>
</template>

<script>
import { isEditable } from '@/helpers/exerciseHelper';

export default {
  computed: {
    exercise () {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable () {
      return isEditable(this.exercise);
    },
    assessmentMethods () {
      const assessmentMethods = [];
      if (this.exercise && this.exercise.assessmentMethods) {
        if (this.exercise.assessmentMethods.independentAssessments) {
          assessmentMethods.push('Independent Assessments');
        }
        if (this.exercise.assessmentMethods.leadershipJudgeAssessment) {
          assessmentMethods.push('Leadership Judge Assessment');
        }
      }
      return assessmentMethods;
    },
  },
};
</script>
