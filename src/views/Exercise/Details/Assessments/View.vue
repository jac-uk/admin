<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
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
      <span
        v-for="assessmentMethod in assessmentMethods"
        :key="assessmentMethod"
        class="display-block"
      >
        {{ $filters.lookup(assessmentMethod) }}
        <strong>
          {{ assessmentMethod === 'Self Assessment with competencies' ? `- Word limit: ${exercise.selfAssessmentWordLimit}` : '' }}
        </strong>
      </span>
    </p>
  </div>
</template>

<script>
import { isEditable } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { ASSESSMENT_METHOD } from '@/helpers/constants';

export default {
  name: 'AssessmentsView',
  mixins: [permissionMixin],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    assessmentMethods() {
      const assessmentMethods = [];
      if (this.exercise && this.exercise.assessmentMethods) {
        Object.values(ASSESSMENT_METHOD).forEach((method) => {
          if (this.exercise.assessmentMethods[method]) {
            assessmentMethods.push(this.$filters.lookup(method));
          }
        });
      }
      return assessmentMethods;
    },
  },
};
</script>
