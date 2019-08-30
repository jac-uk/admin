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
            to="/exercise/new/create-an-exercise"
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
            v-for="vacancy in vacancies"
            :key="vacancy.reference"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              <a href="detail">{{ vacancy.reference }}</a>
            </dt>
            <dd class="govuk-summary-list__value">
              <a href="detail">{{ vacancy.title }}</a>
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
  computed: mapState('vacancies', [
    'vacancies',
  ]),
};
</script>

<style>
  .govuk-summary-list__key {
    margin-bottom: 5px;
    font-weight: 700;
    width: 15%;
  }

  @media (min-width: 40.0625em) {
    .govuk-summary-list__key {
      width: 30px;
    }
  }
</style>
