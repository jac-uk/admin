<template>
  <div class="panel govuk-!-margin-bottom-4">
    <span class="govuk-caption-m">
      Total applications
    </span>
    <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
      <span class="">{{ applicationCounts._total }}</span>
    </h2>
    <span class="govuk-caption-s color-middle">
      <span class="long-text">Last Updated: {{ $filters.formatDate(applicationCounts._lastUpdated, 'datetime') }}</span>
    </span>
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
  },
};
</script>
