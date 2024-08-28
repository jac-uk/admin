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
        <div v-if="assessmentMethod === 'Self Assessment with competencies'">
          <div
            v-for="(section, index) in exercise.selfAssessmentWordLimits"
            :key="index"
          >
            Question {{ 1 + index }}:
            <strong>
              {{ section.question }}
            </strong>
            <br>
            Word limit:
            <strong>
              {{ section.wordLimit }}
            </strong>
          </div>
        </div>
      </span>
    </p>
  </div>
</template>

<script>
import { isEditable } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { ASSESSMENT_METHOD } from '@jac-uk/jac-kit/helpers/constants';

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
