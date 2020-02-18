<template>
  <div>
    <BackLink />

    <h1 class="govuk-heading-xl govuk-!-margin-bottom-0">
      Application
    </h1>

    <router-link
      class="govuk-link"
      :to="{name: 'exercise-show-application-streamlined', params: { applicationId: application.id }}"
    >
      See limited version
    </router-link>
    
    <JsonRenderer :value="application" />
    <div class="govuk-column-full">
      <DownloadLink
        v-if="application && application.uploadedCV"
        :exercise-id="application.exerciseId"
        :user-id="application.userId"
        title="Uploaded CV"
        :file-name="application.uploadedCV"
        class="govuk-!-margin-right-3"
      />
      <DownloadLink
        v-if="application && application.uploadedSelfAssessment"
        :exercise-id="application.exerciseId"
        :user-id="application.userId"
        title="Uploaded Self Assessment"
        :file-name="application.uploadedSelfAssessment"
        class="govuk-!-margin-right-3"
      />
      <DownloadLink
        v-if="application && application.uploadedSuitabilityStatement"
        :exercise-id="application.exerciseId"
        :user-id="application.userId"
        title="Uploaded Suitability Statement"
        :file-name="application.uploadedSuitabilityStatement"
        class="govuk-!-margin-right-3"
      />
    </div>
    <button
      v-if="isApplied"
      class="govuk-button govuk-!-margin-right-3 govuk-!-margin-top-3"
      @click="unlock"
    >
      Unlock
    </button>
    <button
      v-else
      class="govuk-button govuk-!-margin-right-3 govuk-!-margin-top-3"
      @click="submitApplication"
    >
      Mark as applied
    </button>
  </div>
</template>

<script>
import BackLink from '@/components/BackLink';
import JsonRenderer from '@/components/JsonRenderer';
import DownloadLink from '@/components/DownloadLink';

export default {
  components: {
    BackLink,
    JsonRenderer,
    DownloadLink,
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    application() {
      return this.$store.state.application.record;
    },
    isApplied() {
      if (this.application) {
        switch (this.application.status) {
        case 'applied':
          return true;
        default:
          return false;
        }
      }
      return false;
    },
  },
  created() {
    if (this.$route.params.applicationId) {
      this.$store.dispatch('application/bind', this.$route.params.applicationId);
    }
  },
  destroyed() {
    this.$store.dispatch('application/unbind');
  },
  methods: {
    unlock() {
      this.$store.dispatch('application/unlock');
    },
    submitApplication() {
      this.$store.dispatch('application/submit');
    },
  },
};
</script>

<style>
  .table-header {
    text-transform: capitalize;
    white-space: nowrap;
  }
</style>
