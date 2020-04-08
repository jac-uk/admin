<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
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
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
};
</script>
