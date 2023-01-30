<template>
  <div class="panel govuk-!-margin-bottom-4">
    <span class="govuk-caption-m">Type of exercise</span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-0 long-text">
      <span class="capitalize">{{ exercise.typeOfExercise }}</span>
      <span
        v-if="exercise.appointmentType"
        class="capitalize"
      >, {{ exercise.appointmentType | lookup }}</span>
      <span
        v-if="exercise.isCourtOrTribunal"
        class="capitalize"
      >, {{ exercise.isCourtOrTribunal | lookup }}</span>
    </h2>
    <span class="govuk-caption-s color-middle">
      <span class="vh">&nbsp;</span>
    </span>
  </div>
</template>
<script>
export default {
  name: 'TypeOfExercise',
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
  },
};
</script>
