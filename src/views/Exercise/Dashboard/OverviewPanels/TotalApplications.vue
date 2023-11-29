<template>
  <div class="panel govuk-!-margin-bottom-4 govuk-!-padding-bottom-2">
    <span class="govuk-caption-m">
      Applications <span class="float-right govuk-body-s tiny-text">Last Updated: {{ $filters.formatDate(applicationCounts._lastUpdated, 'datetime') }}</span>
    </span>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-third">
        <span class="govuk-body-s govuk-!-margin-bottom-0">
          Draft
        </span>
        <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
          {{ numberOfDraftApplications }}
        </h2>
      </div>
      <div class="govuk-grid-column-one-third">
        <span class="govuk-body-s govuk-!-margin-bottom-0">
          Applied
        </span>
        <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
          {{ numberOfAppliedApplications }}
        </h2>
      </div>
      <div class="govuk-grid-column-one-third">
        <span class="govuk-body-s govuk-!-margin-bottom-0">
          Withdrawn
        </span>
        <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
          {{ numberOfWithdrawnApplications }}
        </h2>
      </div>
    </div>
    <!-- <span class="govuk-body-s tiny-text">Last Updated: {{ $filters.formatDate(applicationCounts._lastUpdated, 'datetime') }}</span> -->
  </div>
</template>
<script>
import { applicationCounts } from '@/helpers/exerciseHelper';
export default {
  name: 'TotalApplications',
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    applicationCounts() {
      return applicationCounts(this.exercise);
    },
    numberOfDraftApplications() {
      return this.applicationCounts.draft || 0;
    },
    numberOfAppliedApplications() {
      return this.applicationCounts.applied || 0;
    },
    numberOfWithdrawnApplications() {
      return this.applicationCounts.withdrawn || 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.tiny-text {
  margin-bottom: 0;
  padding-top: 2px;
  color: $govuk-secondary-text-colour;
}
</style>
