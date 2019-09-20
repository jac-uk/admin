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
          <span v-if="exercise.postQualificationExperience === 'other'">
            {{ exercise.otherYears }}
          </span>
          <span v-else-if="exercise.postQualificationExperience">
            {{ exercise.postQualificationExperience }}
          </span>
          <span v-else>
            Null
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Does Schedule 2(d) apply?
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.schedule2DApply === true">
            Yes
          </span>
          <span v-else-if="exercise.schedule2DApply === false">
            No
          </span>
          <span v-else>
            Null
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Qualifications
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
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
          <span v-if="exercise.aSCApply === true">
            Yes
          </span>
          <span v-else-if="exercise.aSCApply === false">
            No
          </span>
          <span v-else>
            Null
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Additional skills and experience
        </dt>
        <dd class="govuk-summary-list__value" />
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Reasonable length of service
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.reasonableLengthService === 'other'">
            {{ exercise.otherLOS }}
          </span>
          <span v-else-if="exercise.reasonableLengthService">
            {{ exercise.reasonableLengthService }}
          </span>
          <span v-else>
            Null
          </span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Retirement age
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.retirementAge === 'other'">
            {{ exercise.otherRetirement }}
          </span>
          <span v-else-if="exercise.retirementAge">
            {{ exercise.retirementAge }}
          </span>
          <span v-else>
            Null
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
        return ['Null'];
      }

      const list = qualifications.filter(value => (value !== 'other'));
      list.sort();

      if (qualifications.includes('other')) {
        const otherLabel = this.exercise.otherQualifications;
        list.push(`Other: ${otherLabel}`);
      }

      return list;
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
