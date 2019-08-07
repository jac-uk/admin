<template>
  <div>
    <h1 class="govuk-heading-xl">
      Dashboard
    </h1>
    <h2 class="govuk-heading-l">
      Your exercises
    </h2>
    <ul
      v-for="vacancy in vacancies"
      :key="vacancy.jac_ref"
      class="govuk-list"
    >
      <router-link
        tag="li"
        to="/dashboard"
        class="govuk-link"
      >
        <a>{{ vacancy.jac_ref }} {{ vacancy.title }}</a>
      </router-link>
    </ul>
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
