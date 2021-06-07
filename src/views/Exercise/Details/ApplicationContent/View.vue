<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
        class="govuk-link"
        :to="{name: 'exercise-details-application-content-edit'}"
      >
        Update application form
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Application form
    </h2>

    <p class="govuk-body">
      <span
        v-for="item in selectedApplicationParts"
        :key="item"
        class="display-block"
      >{{ item | lookup }}</span>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('exerciseDocument', [
      'isEditable',
      'getApplicationParts',
    ]),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    selectedApplicationParts() {
      if (this.exercise && this.exercise.applicationContent && this.exercise.applicationContent.registration) {
        const selected = Object.entries(this.exercise.applicationContent.registration).filter((keyValue) => keyValue[1] === true);
        return selected.map((keyValue) => keyValue[0]);
      } else {
        return this.getApplicationParts();
      }
    },
  },
};
</script>
