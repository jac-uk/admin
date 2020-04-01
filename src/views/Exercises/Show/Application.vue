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

      <div class="jac-button-group">
        <router-link
          class="govuk-button govuk-button--secondary"
          :to="{ name: 'exercise-show-application' }"
        >
          Full details
        </router-link>

        <router-link
          class="govuk-button govuk-button--secondary"
          :to="{ name: 'exercise-show-application-streamlined' }"
        >
          Panel pack view
        </router-link>
        <span
          v-if="!streamlined"
          class=" govuk-!-margin-left-4"
        >
          <button
            v-if="isApplied"
            class="govuk-button"
            @click="unlock"
          >
            Unlock
          </button>
          <button
            v-else
            class="govuk-button"
            @click="submitApplication"
          >
            Mark as applied
          </button>
        </span>
      </div>

      <RouterView />
    </div>
  </div>
</template>

<script>
export default {
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

<style lang="scss" scoped>
.jac-button-group {
  margin-bottom: govuk-spacing(4);
  .govuk-button {
    margin-right: govuk-spacing(2);
  }
}
</style>
