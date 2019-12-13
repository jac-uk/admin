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
      <div 
        v-if="isLegal"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Post-qualification experience (PQE)
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.postQualificationExperience === 'other'">
            {{ exercise.otherYears }} years
          </span>
          <span v-else-if="exercise.postQualificationExperience">
            {{ exercise.postQualificationExperience }} years
          </span>
        </dd>
      </div>
      <div 
        v-if="isLegal && isTribunal"
        class="govuk-summary-list__row"
      >
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
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Does additional selection criteria (ASC) apply?
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.aSCApply === true">
            Yes - {{ exercise.yesASCApply }}
          </span>
          <span v-else-if="exercise.aSCApply === false">
            No
          </span>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Does previous judicial experience (PJE) apply?
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.previousJudicialExperienceApply === true">
            Yes
          </span>
          <span v-else-if="exercise.previousJudicialExperienceApply === false">
            No
          </span>
        </dd>
      </div>

      <div 
        v-if="isLegal"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Qualifications
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="qualification in exercise.qualifications"
              :key="qualification"
            >
              <span v-if="qualification == 'other'">{{ exercise.otherQualifications }}</span>
              <span v-else>{{ qualification | lookup }}</span>
            </li>
          </ul>
        </dd>
      </div>

      <div 
        v-if="isNonLegal"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Memberships
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="membership in exercise.memberships"
              :key="membership"
            >
              <span v-if="membership == 'other'">{{ exercise.otherMemberships }}</span>
              <span v-else>{{ membership | lookup }}</span>
            </li>
          </ul>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Reasonable length of service
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.reasonableLengthService === 'other'">
            {{ exercise.otherLOS }} years
          </span>
          <span v-else-if="exercise.reasonableLengthService">
            {{ exercise.reasonableLengthService }} years
          </span>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Retirement age
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.retirementAge === 'other'">
            {{ exercise.otherRetirement }} years
          </span>
          <span v-else-if="exercise.retirementAge">
            {{ exercise.retirementAge }} years
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
    isLegal() {
      if (this.exercise.typeOfExercise === 'legal') {
        return true;
      }
      if (this.exercise.typeOfExercise === 'leadership') {
        return true;
      }
      return false;
    },
    isNonLegal() {
      if (this.exercise.typeOfExercise === 'non-legal') {
        return true;
      }
      if (this.exercise.typeOfExercise === 'leadership-non-legal') {
        return true;
      }
      return false;
    },
    isTribunal() {
      return this.exercise.isCourtOrTribunal === 'tribunal';
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
