<template>
  <div class="panel govuk-!-margin-bottom-4">
    <span class="govuk-caption-m">Type of exercise</span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-0 long-text">
      <div class="capitalize govuk-!-display-inline-block">
        {{ exercise.typeOfExercise }}
      </div>
      <div
        v-if="exercise.appointmentType"
        class="capitalize govuk-!-display-inline-block"
      >
        , {{ $filters.lookup(exercise.appointmentType) }}
      </div>
      <div
        v-if="exercise.isCourtOrTribunal"
        class="capitalize govuk-!-display-inline-block"
      >
        , {{ $filters.lookup(exercise.isCourtOrTribunal) }}
      </div>
    </h2>
    <span class="govuk-caption-s color-middle">
      <span class="vh">&nbsp;</span>
    </span>
  </div>
</template>
<script>
//import { capitalizeFirstLetter } from '@/helpers/helpers';
export default {
  name: 'TypeOfExercise',
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
  },
};
</script>
<style>
  .capitalize::first-letter {
    text-transform: uppercase;
  }
</style>
