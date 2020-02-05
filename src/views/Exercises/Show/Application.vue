<template>
  <div>
    <BackLink />
    <h1 class="govuk-heading-xl govuk-!-margin-bottom-0">
      Application
    </h1>
    <JsonRenderer :value="application" />
    <button
      v-if="isApplied"
      class="govuk-button govuk-!-margin-right-3"
      @click="unlock"
    >
      Unlock
    </button>
    <button
      v-else
      class="govuk-button govuk-!-margin-right-3"
      @click="submitApplication"
    >
      Mark as applied
    </button>
  </div>
</template>

<script>
import BackLink from '@/components/BackLink';
import JsonRenderer from '@/components/JsonRenderer';

export default {
  components: {
    BackLink,
    JsonRenderer,
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
