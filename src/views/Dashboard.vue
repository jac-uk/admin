<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <div class="text-right">
          <button
            v-if="isFavourites"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="showAll"
          >
            View all exercises
          </button>
          <button
            v-else
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="showMyFavourites"
          >
            Show my favourites
          </button>
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
    <h1
      v-if="isFavourites"
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      Your exercises
    </h1>
    <h1
      v-else
      class="govuk-heading-xl govuk-!-margin-bottom-6"
    >
      All exercises
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
    'isFavourites',
  ]),
  created() {
    this.$store.dispatch('exerciseCollection/bind');
  },
  destroyed() {
    this.$store.dispatch('exerciseCollection/unbind');
  },
  methods: {
    showMyFavourites() {
      this.$store.dispatch('exerciseCollection/showFavourites');
    },
    showAll() {
      this.$store.dispatch('exerciseCollection/showAll');
    },
  },
};
</script>

<style lang="scss" scoped>
  .exercise-list {
    border-bottom: 1px solid $govuk-border-colour;
  }
</style>
