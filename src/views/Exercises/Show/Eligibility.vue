<template>
  <div>
    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'exercise-edit-eligibility'}"
      >
        Update eligibility information
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Eligibility information
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Post-qualification experience (PQE)
        </dt>
        <dd class="govuk-summary-list__value">
          <span>
            {{ exercise.postQualificationExperience }}
          </span>
          <span v-if="exercise.postQualificationExperience === 'Other'">
            {{ exercise.otherYears }}
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Does Schedule 2(d) apply?
        </dt>
        <dd class="govuk-summary-list__value">
          <span>
            {{ booleanAmender(exercise.schedule2DApply) }}
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Qualifications
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list govuk-list--bullet">
            <li
              v-for="qualification in qualifications"
              :key="qualification"
            >
              {{ qualification }}
            </li>
          </ul>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Does additional selection criteria (ASC) apply?
        </dt>
        <dd class="govuk-summary-list__value">
          <span>
            {{ booleanAmender(exercise.aSCApply) }}
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Additional skills and experience
        </dt>
        <dd class="govuk-summary-list__value">
          <span>
            {{ exercise.yesASCApply }}
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Reasonable length of service
        </dt>
        <dd class="govuk-summary-list__value">
          <span>
            {{ exercise.reasonableLengthService }}
          </span>
          <span v-if="exercise.reasonableLengthService === 'Other'">
            {{ exercise.otherLOS }}
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Retirement age
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.retirementAge === 'Other'">
            {{ exercise.otherRetirement }} years
          </span>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
export default {
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    qualifications() {
      const qualifications = this.exercise.qualifications;

      if (!(qualifications instanceof Array)) {
        return [''];
      }

      const list = qualifications.filter(value => (value !== 'Other'));
      list.sort();

      if (qualifications.includes('Other')) {
        const otherLabel = this.exercise.otherQualifications;
        list.push(`Other: ${otherLabel}`);
      }

      return list;
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
