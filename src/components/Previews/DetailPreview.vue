<template>
  <div>
    <h1
      class="govuk-heading-m govuk-!-margin-bottom-0"
    >
      Detail
    </h1>
    <div
      class="listing-box"
    >
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <h1 class="govuk-heading-xl">
            {{ exercise.name }}
          </h1>

          <p v-if="exercise.immediateStart && showNumberOfVacancies">
            <span class="govuk-body govuk-!-font-weight-bold">
              Number of vacancies:
            </span>
            <span class="govuk-body">
              {{ exercise.immediateStart }}
            </span>
          </p>

          <p v-if="exercise.location && showLocation">
            <span class="govuk-body govuk-!-font-weight-bold">Location:</span> <span class="govuk-body"> {{ exercise.location }}</span>
          </p>

          <p v-if="exercise.appointmentType == 'salaried' && showAppointmentType">
            <span class="govuk-body govuk-!-font-weight-bold">
              Salary:
            </span>
            <span
              v-if="exercise.salaryGrouping"
              class="govuk-body"
            >
              {{ exercise.salaryGrouping | lookup }}
            </span>
            <span
              v-if="exercise.salary"
              class="govuk-body"
            >
              {{ exercise.salary | formatCurrency }}
            </span>
          </p>

          <p
            v-if="exercise.exerciseMailbox"
            class="govuk-!-margin-bottom-8"
          >
            <span class="govuk-body govuk-!-font-weight-bold">Contact: </span>
            <a
              :href="`mailto:${exercise.exerciseMailbox}?subject=Re:${exercise.referenceNumber}`"
              class="govuk-body govuk-link"
            >{{ exercise.exerciseMailbox }}</a>
          </p>

          <div
            v-if="timeline.length && advertTypeFull"
          >
            <h2 class="govuk-heading-l">
              Timeline
            </h2>
            <Timeline :data="timeline" />
          </div>

          <div v-if="!advertTypeFull">
            <p>
              <span
                class="govuk-body govuk-!-font-weight-bold"
              >
                <span class="govuk-body govuk-!-font-weight-bold"> Launch Date: </span>
              </span>
              <span
                v-if="exercise.applicationOpenDate"
                class="govuk-body"
              >
                {{ exercise.applicationOpenDate | formatDate('datetime') }}
              </span>
              <span
                v-else
                class="govuk-body"
              >
                {{ exercise.estimatedLaunchDate | formatEstimatedDate }}
              </span>
            </p>
            <p v-if="exercise.applicationCloseDate">
              <span
                class="govuk-body govuk-!-font-weight-bold"
              >
                <span class="govuk-body govuk-!-font-weight-bold"> Closing Date: </span>
              </span>
              <span
                class="govuk-body"
              >
                {{ exercise.applicationCloseDate | formatDate('datetime') }}
              </span>
            </p>
          </div>

          <h2 class="govuk-heading-l">
            Overview of the role
          </h2>

          <div
            v-dompurify-html="exercise.aboutTheRole"
            class="govuk-body"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import exerciseTimeline from '@/helpersTMP/Timeline/exerciseTimeline';
import createTimeline from '@/helpersTMP/Timeline/createTimeline';
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline';

const ADVERT_TYPES = {
  LISTING: 'listing',
  BASIC: 'basic',
  FULL: 'full',
  EXTERNAL: 'external',
};

export default {
  name: 'DetailPreview',
  components: {
    Timeline,
  },
  props: {
    exercise: {
      type: Object,
      default: null,
    },
  },
  computed: {
    timeline() {
      const timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline);
    },
    showNumberOfVacancies() {
      return this.advertTypeFull || this.advertType === ADVERT_TYPES.BASIC ? true : false;
    },
    showLocation() {
      return this.advertTypeFull || this.advertType === ADVERT_TYPES.BASIC ? true : false;
    },
    advertType() {
      return this.exercise.advertType ? this.exercise.advertType : ADVERT_TYPES.FULL;
    },
    advertTypeFull() {
      return this.advertType === ADVERT_TYPES.FULL;
    },
  },
};
</script>

<style scoped>
  .listing-box {
    border: 5px solid #a5a5a5 !important;
    padding: 40px;
  }
</style>
