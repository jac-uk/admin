<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="canEdit"
        class="govuk-link"
        :to="{name: 'exercise-edit-assessment-options'}"
      >
        Update assessment options
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Assessment options
    </h2>

    <p class="govuk-body">
      <span class="display-block">{{ exercise.assessmentOptions | lookup }}</span>
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isApproved() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    canEdit() {
      return !this.isApproved;
    },
  },
};
</script>
