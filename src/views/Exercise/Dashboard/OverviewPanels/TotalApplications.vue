<template>
  <div class="panel govuk-!-margin-bottom-4 govuk-!-padding-bottom-2">
    <span class="govuk-caption-m">
      Applications <span class="float-right govuk-body-s tiny-text">Last Updated: {{ $filters.formatDate(applicationCounts._lastUpdated, 'datetime') }}</span>
    </span>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-third tooltip-anchor">
        <span class="govuk-body-s govuk-!-margin-bottom-0 ">
          Applied
        </span>

        <div class="tooltip-wrapper">
          <Tooltip>
            <template #content>
              <div>
                Includes withdrawals.
              </div>
            </template>
          </Tooltip>
        </div>

        <router-link
          :to="{ path: `/exercise/${exerciseId}/applications/applied`}"
          class="govuk-link govuk-link--no-underline govuk-link-active-colour"
        >
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ numberOfAppliedApplications }}
          </h2>
        </router-link>
      </div>
      <div class="govuk-grid-column-one-third">
        <span class="govuk-body-s govuk-!-margin-bottom-0">
          Draft
        </span>
        <router-link
          :to="{ path: `/exercise/${exerciseId}/applications/draft`}"
          class="govuk-link govuk-link--no-underline govuk-link-active-colour"
        >
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ numberOfDraftApplications }}
          </h2>
        </router-link>
      </div>
      <div class="govuk-grid-column-one-third">
        <span class="govuk-body-s govuk-!-margin-bottom-0">
          Withdrew
        </span>
        <router-link
          :to="{ path: `/exercise/${exerciseId}/applications/withdrawn`}"
          class="govuk-link govuk-link--no-underline govuk-link-active-colour"
        >
          <h2 class="govuk-heading-l govuk-!-margin-top-0 govuk-!-margin-bottom-0 govuk-!-padding-0">
            {{ numberOfWithdrawnApplications }}
          </h2>
        </router-link>
      </div>
    </div>
    <!-- <span class="govuk-body-s tiny-text">Last Updated: {{ $filters.formatDate(applicationCounts._lastUpdated, 'datetime') }}</span> -->
  </div>
</template>
<script>
import { applicationCounts } from '@/helpers/exerciseHelper';
import Tooltip from '@/components/Tooltip.vue';
export default {
  name: 'TotalApplications',
  components: {
    Tooltip,
  },
  computed: {
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
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

.tooltip-wrapper {
  position: absolute;
  top: 0px;
  left:70px;
}
.tooltip-anchor {
  position: relative;
}
</style>
