<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <div class="text-right">
          <a
            href="#"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          >
            View all exercises
          </a>
          <a
            href="#"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          >
            Show my favourites
          </a>
          <router-link
            ref="linkToNewExercise"
            to="/exercises/new"
            class="govuk-button govuk-!-margin-right-1"
          >
            Create an exercise
          </router-link>
        </div>
      </div>
    </div>
    <h1 class="govuk-heading-xl govuk-!-margin-bottom-6">
      Your exercises
    </h1>
    <div 
      v-for="exercise in records"
      :key="exercise.id"
      class="exercise-list govuk-grid-row govuk-!-margin-0"
    >
      <div class="govuk-grid-column-one-quarter govuk-!-padding-2">
        <RouterLink :to="{ name: 'exercise-show-overview', params: { id: exercise.id } }">
          {{ exercise.referenceNumber }}
        </RouterLink>    
      </div>
      <div class="govuk-grid-column-one-half govuk-!-padding-2">
        <RouterLink :to="{ name: 'exercise-show-overview', params: { id: exercise.id } }">
          {{ exercise.name }}
        </RouterLink>
      </div>
      <div class="govuk-grid-column-one-quarter govuk-!-padding-2">
        <RouterLink :to="{ name: 'exercise-show-overview', params: { id: exercise.id } }">
          {{ exercise.applicationOpenDate | formatDate }}
        </RouterLink>
      </div>
    </div>     
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState('exerciseCollection', [
    'records',
  ]),
  created() {
    this.$store.dispatch('exerciseCollection/bind');
  },
};
</script>

<style lang="scss" scoped>
  .exercise-list {
    border-bottom: 1px solid $govuk-border-colour;
  }
</style>
