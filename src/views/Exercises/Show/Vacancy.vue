<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
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
          Jurisdiction
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="item in exercise.jurisdiction"
              :key="item"
            >
              <span v-if="item === 'other'">
                {{ exercise.otherJurisdiction }}
              </span>
              <span v-else>
                {{ item | lookup }}
              </span>
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Waived statutory consultation?
        </dt>
        <dd class="govuk-summary-list__value">
          <span
            v-if="exercise.statutoryConsultationWaivedDetails && exercise.statutoryConsultationWaived == true"
          >
            Yes: {{ exercise.statutoryConsultationWaivedDetails }}
          </span>
          <span v-else>
            No
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Appointment type
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.appointmentType == 'salaried'">
            {{ exercise.appointmentType | lookup }}: 
            <span v-if="exercise.salaryGrouping">{{ exercise.salaryGrouping | lookup }}</span>
            <span v-if="exercise.salary">{{ exercise.salary | formatCurrency }}</span>
          </span>
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
            <li v-if="exercise.immediateStart > 0">
              {{ exercise.immediateStart }} Immediate start (S87)
            </li>
            <li v-if="exercise.futureStart > 0">
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
          Welsh requirement
        </dt>
        <dd class="govuk-summary-list__value">
          <ul
            v-if="exercise.welshRequirement === true"
            class="govuk-list"
          >
            <li
              v-for="item in exercise.welshRequirementType"
              :key="item"
            >
              {{ item | lookup }}
            </li>
          </ul>
          <span v-else-if="exercise.welshRequirement === false">None</span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Role summary
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.roleSummary }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          About the role
        </dt>
        <dd class="govuk-summary-list__value">
          <!-- eslint-disable -->
          <div
            class="govuk-body"
            v-html="exercise.aboutTheRole"
          />
          <!-- eslint-enable -->
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
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
