<template>
  <div>
    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'exercise-edit-vacancy'}"
      >
        Update vacancy information
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Vacancy information
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Type of exercise
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.typeOfExercise }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Is the vacancy for a court or tribunal?
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.isCourtOrTribunal }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Appointment type
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.appointmentType }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Salary group
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.salaryGrouping }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Is salaried part-time working (SPTW) offered?
        </dt>
        <dd class="govuk-summary-list__value">
          {{ booleanAmender(exercise.isSPTWOffered) }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Detail of salaried part-time working (SPTW)
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.yesSalaryDetails }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Number of vacancies
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li>
              {{ exercise.immediateStart }} Immediate start (S87)
            </li>
            <li>
              {{ exercise.futureStart }} Future start (S94)
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Location
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.location }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Jurisdiction
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.jurisdiction }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          About the role
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.aboutTheRole }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Welsh requirement
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.welshRequirement"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
  },
  methods: {
    booleanAmender (value) {
      if (value === true) { return 'Yes'; }
      if (value === false) { return 'No'; }
    },
  },
};
</script>

<style lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
</style>
