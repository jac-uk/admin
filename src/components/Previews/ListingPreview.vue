<template>
  <div>
    <h1
      class="govuk-heading-m govuk-!-margin-bottom-0"
    >
      Listing
    </h1>
    <div
      :key="exercise.id"
      class="listing-box"
    >
      <div v-if="!exercise.inviteOnly">
        <a
          class="govuk-heading-m govuk-!-font-weight-bold govuk-link"
          href
          @click.prevent
        >
          {{ exercise.name }}
        </a>
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
        <div
          v-dompurify-html="exercise.roleSummary"
        />
      </div>

      <div v-if="exercise.welshPosts">
        <div v-if="!exercise.inviteOnly">
          <p>
            <span
              class="govuk-body govuk-!-font-weight-bold"
            >
              <span class="govuk-body govuk-!-font-weight-bold"> Dyddiad lansio: </span>
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
              <span class="govuk-body govuk-!-font-weight-bold"> Dyddiad cau: </span>
            </span>
            <span
              class="govuk-body"
            >
              {{ $filters.formatDate(exercise.applicationCloseDate, 'datetime') }}
            </span>
          </p>
          <div
            v-if="exercise.roleSummaryWelsh"
            v-dompurify-html="exercise.roleSummaryWelsh"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ListingPreview',
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
