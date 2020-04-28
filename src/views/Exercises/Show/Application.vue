<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <BackLink />

      <div id="download-as-pdf-div">
        <h1 class="govuk-heading-xl govuk-!-margin-bottom-4">
          Application {{ applicationReferenceNumber }}
        </h1>

        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import BackLink from '@/components/BackLink';

export default {
  components: {
    BackLink,
  },
  computed: {
    application() {
      return this.$store.state.application.record;
    },
    applicationId() {
      return this.$route.params.applicationId;
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    applicationReferenceNumber() {
      return this.$store.state.application.record ? this.$store.state.application.record.referenceNumber : null;
    },
  },
  created() {
    if (this.applicationId) {
      this.$store.dispatch('application/bind', this.applicationId).then( (application) => {
        this.$store.dispatch('exerciseDocument/bind', application.exerciseId);
      });
    }
  },
  destroyed() {
    this.$store.dispatch('application/unbind');
    this.$store.dispatch('exerciseDocument/unbind');
  },
};
</script>

