<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <router-link
        v-if="exerciseId"
        class="govuk-back-link"
        :to="{name: 'exercise-show-applications', params: { id: exerciseId }}"
      >
        Back
      </router-link>

      <h1 class="govuk-heading-xl govuk-!-margin-bottom-0">
        Application {{ applicationReferenceNumber }}
      </h1>

      <router-link
        class="govuk-link"
        :to="{name: 'exercise-show-application'}"
      >
        Full details
      </router-link>

      <router-link
        class="govuk-link"
        :to="{name: 'exercise-show-application-streamlined'}"
      >
        Panel pack view
      </router-link>

      <RouterView />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
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
