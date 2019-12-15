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
          {{ exercise.typeOfExercise | lookup }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Is the vacancy for a court or tribunal?
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.isCourtOrTribunal | lookup }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Appointment type
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.appointmentType == 'salaried'">{{ exercise.appointmentType | lookup }}: {{ exercise.salaryGrouping | lookup }}</span>
          <span v-else-if="exercise.appointmentType == 'fee-paid'">{{ exercise.appointmentType | lookup }}: £{{ exercise.feePaidFee }}</span>
          <span v-else>{{ exercise.appointmentType | lookup }}</span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Is salaried part-time working (SPTW) offered?
        </dt>
        <dd class="govuk-summary-list__value">
          <p v-if="exercise.isSPTWOffered === true">
            Yes<span v-if="exercise.yesSalaryDetails"> - {{ exercise.yesSalaryDetails }}</span>
          </p>
          <p v-else-if="exercise.isSPTWOffered === false">
            No<span v-if="exercise.noSalaryDetails"> - {{ exercise.noSalaryDetails }}</span>
          </p>
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
          Welsh requirement
        </dt>
        <dd class="govuk-summary-list__value">
          <ul
            v-if="exercise.welshRequirement.length"
            class="govuk-list"
          >
            <li
              v-for="item in exercise.welshRequirement"
              :key="item"
            >
              {{ item | lookup }}
            </li>
          </ul>
          <span v-else>None</span>
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
