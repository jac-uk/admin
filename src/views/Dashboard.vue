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
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <dl class="govuk-summary-list govuk-!-margin-bottom-9">
          <div 
            v-for="exercise in records"
            :key="exercise.id"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              <RouterLink :to="{ name: 'exercise-show-overview', params: { id: exercise.id } }">
                {{ exercise.referenceNumber }}
              </RouterLink>
            </dt>
            <dd class="govuk-summary-list__value">
              <RouterLink :to="{ name: 'exercise-show-overview', params: { id: exercise.id } }">
                {{ exercise.name }}
              </RouterLink>
            </dd>
          </div>
        </dl>
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

<style scoped>
  .govuk-summary-list__key-narrow {
    margin-bottom: 5px;
    font-weight: 700;
    width: 15%;
  }

  @media (min-width: 40.0625em) {
    .govuk-summary-list__key-narrow {
      width: 30px;
    }
  }
</style>
