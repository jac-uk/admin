<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
        class="govuk-link"
        :to="{name: 'exercise-details-eligibility-edit'}"
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
          Does Schedule 2(d) or Schedule 3(d) apply?
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.schedule2DOr3Apply === true || exercise.schedule2Apply">
            Yes: {{ $filters.lookup(exercise.appliedSchedule) }}
          </span>
          <span v-else-if="exercise.schedule2DOr3Apply === false">
            No
          </span>
        </dd>
      </div>

      <div
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Authorisations
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="authorisation in exercise.authorisations"
              :key="authorisation"
            >
              <span>{{ $filters.lookup(authorisation) }}</span>
            </li>
          </ul>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Does additional selection criteria (ASC) apply?
        </dt>
        <dd class="govuk-summary-list__value">
          <ul
            v-if="exercise.aSCApply == true"
            class="govuk-list"
          >
            <li
              v-for="(criterion, index) in exercise.selectionCriteria"
              :key="criterion.id"
            >
              <p
                class="govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-1"
              >
                {{ criterion.title }}
              </p>
              <CustomHTML
                :value="criterion.text"
              />
              <p
                v-if="criterion.wordLimit"
                class="govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-1"
              >
                {{ criterion.wordLimit }} word limit
              </p>
              <hr
                v-if="exercise.selectionCriteria.length > 1 && index < exercise.selectionCriteria.length - 1"
              >
            </li>
          </ul>
          <span v-else-if="exercise.aSCApply === false">
            Does not apply.
          </span>
        </dd>
      </div>

      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Does previous judicial experience (PJE) apply?
        </dt>
        <dd class="govuk-summary-list__value">
          <span>
            {{ $filters.toYesNo(exercise.previousJudicialExperienceApply) }}
          </span>
        </dd>
      </div>

      <div
        v-if="exercise.previousJudicialExperienceApply && exercise.pjeDays"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Number of days required experience
        </dt>
        <dd class="govuk-summary-list__value">
          <span>
            {{ exercise.pjeDays }}
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
              <span v-else>{{ $filters.lookup(qualification) }}</span>
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
              v-for="membership in memberships"
              :key="membership"
            >
              {{ $filters.lookup(membership) }}
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
import { isEditable, isLegal, isNonLegal, isTribunal } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import CustomHTML from '@/components/CustomHTML.vue';

export default {
  name: 'EligibilityView',
  components: {
    CustomHTML,
  },
  mixins: [permissionMixin],
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    isLegal() {
      return isLegal(this.exercise);
    },
    isNonLegal() {
      return isNonLegal(this.exercise);
    },
    isTribunal() {
      return isTribunal(this.exercise);
    },
    memberships() {
      // @NOTE this is needed because we don't have the custom memberships in lookup
      const memberships = [];

      if (this.exercise && this.exercise.memberships) {
        this.exercise.memberships.forEach(membership => {
          let isOther = false;
          if (membership === 'other' && !Array.isArray(this.exercise.otherMemberships)) {
            isOther = true;
            memberships.push(this.exercise.otherMemberships);
          } else if (Array.isArray(this.exercise.otherMemberships)) {
            this.exercise.otherMemberships.forEach(otherMembership => {
              if (membership === otherMembership.value) {
                isOther = true;
                memberships.push(otherMembership.label);
              }
            });
          }
          if (!isOther) {
            memberships.push(membership);
          }
        });
      }

      return memberships;
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.govuk-summary-list__value,
.govuk-summary-list__value:last-child,
.govuk-summary-list__key {
  @include govuk-media-query($from: tablet) {
    width: auto;
  }
}
</style>
