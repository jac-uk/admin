<template>
  <div>
    <h1 class="govuk-heading-xl">
      Dashboard
    </h1>
    <h2 class="govuk-heading-l">
      Your exercises
    </h2>
    <ul
      class="govuk-list"
    >
      <li
        v-for="vacancy in vacancies"
        :key="vacancy.reference"
      >
        <router-link
          to="/exercise/view"
          class="govuk-link"
        >
          {{ vacancy.reference }} {{ vacancy.title }}
        </router-link>
      </li>
    </ul>
    <div>
      <router-link
        ref="linkToNewExercise"
        to="/exercise/new/create-an-exercise"
        class="govuk-button govuk-!-margin-top-9"
      >
        Create an exercise
      </router-link>
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
