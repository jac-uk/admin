<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
        class="govuk-link"
        :to="{name: 'exercise-details-vacancy-edit'}"
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
          <span v-if="exercise.typeOfExercise">{{ $filters.lookup(exercise.typeOfExercise) }}</span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Is the vacancy for a court or tribunal?
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.isCourtOrTribunal">{{ $filters.lookup(exercise.isCourtOrTribunal) }}</span>
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
                {{ $filters.lookup(item) }}
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
          <span v-if="exercise.statutoryConsultationWaived === true">
            Yes{{ exercise.statutoryConsultationWaivedDetails ? `: ${exercise.statutoryConsultationWaivedDetails}` : '' }}
          </span>
          <span v-else-if="exercise.statutoryConsultationWaived === false">No</span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Appointment type
        </dt>
        <dd class="govuk-summary-list__value">
          <span v-if="exercise.appointmentType == 'salaried'">
            {{ $filters.lookup(exercise.appointmentType) }}:
            <span v-if="exercise.salaryGrouping">{{ $filters.lookup(exercise.salaryGrouping) }}</span>
            <span v-if="exercise.salary">{{ $filters.formatCurrency(exercise.salary) }}</span>
          </span>
          <span v-else-if="exercise.appointmentType == 'fee-paid'">{{ $filters.lookup(exercise.appointmentType) }}: £{{ exercise.feePaidFee }}</span>
          <span v-else-if="exercise.appointmentType">{{ $filters.lookup(exercise.appointmentType) }}</span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Is salaried part-time working (SPTW) offered?
        </dt>
        <dd class="govuk-summary-list__value">
          <p v-if="exercise.isSPTWOffered === true">
            Yes
            <span v-if="exercise.yesSalaryDetails">
              - {{ exercise.yesSalaryDetails }}
            </span>
            <Banner
              v-else
              status="warning"
              message="Caution! - No details for SPTW have been added"
            />
          </p>
          <p v-else-if="exercise.isSPTWOffered === false">
            No
            <span v-if="exercise.noSalaryDetails"> - {{ exercise.noSalaryDetails }}</span>
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
          Location (Welsh)
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.locationWelsh }}
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
              {{ $filters.lookup(item) }}
            </li>
          </ul>
          <span v-else-if="exercise.welshRequirement === false">None</span>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Brief Overview
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.roleSummary"
          />
        </dd>
      </div>
      <div
        v-if="exercise.welshPosts"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Brief Overview (Welsh)
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.roleSummaryWelsh"
          />
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Full Details
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.aboutTheRole"
          />
        </dd>
      </div>
      <div
        v-if="exercise.welshPosts"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Full Details (Welsh)
        </dt>
        <dd class="govuk-summary-list__value">
          <CustomHTML
            class="govuk-body"
            :value="exercise.aboutTheRoleWelsh"
          />
        </dd>
      </div>
    </dl>
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        <ListingPreview
          class="govuk-!-margin-bottom-4"
          :exercise="exercise"
        />
        <DetailPreview
          v-if="exercise.advertType !== 'listing'"
          :exercise="exercise"
        />
      </dt>
    </div>
  </div>
</template>

<script>
import { isEditable } from '@jac-uk/jac-kit/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import Banner from '@jac-uk/jac-kit/components/Banner/Banner.vue';
import CustomHTML from '@/components/CustomHTML.vue';
import ListingPreview from '@/components/Previews/ListingPreview.vue';
import DetailPreview from '@/components/Previews/DetailPreview.vue';
//import { APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';
import { APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';

export default {
  name: 'VacancyView',
  components: {
    CustomHTML,
    Banner,
    DetailPreview,
    ListingPreview,
  },
  mixins: [permissionMixin],
  data() {
    return {
      APPLICATION_STATUS: Object.freeze(APPLICATION_STATUS), // this makes vue not reactive on this data property
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
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
