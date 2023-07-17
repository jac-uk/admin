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
              {{ $filters.lookup(exercise.salaryGrouping) }}
            </span>
            <span
              v-if="exercise.salary"
              class="govuk-body"
            >
              {{ $filters.formatCurrency(exercise.salary) }}
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
                {{ $filters.formatDate(exercise.applicationOpenDate, 'datetime') }}
              </span>
              <span
                v-else
                class="govuk-body"
              >
                {{ $filters.formatEstimatedDate(exercise.estimatedLaunchDate) }}
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
                {{ $filters.formatDate(exercise.applicationCloseDate, 'datetime') }}
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
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline.vue';
import exerciseMixin from '@/views/Exercise/exerciseMixin.js';

export default {
  name: 'DetailPreview',
  components: {
    Timeline,
  },
  mixins: [exerciseMixin],
  props: {
    exercise: {
      type: Object,
      default: null,
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
