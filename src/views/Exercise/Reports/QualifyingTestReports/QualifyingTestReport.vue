<template>
  <div class="govuk-grid-row">
    <LoadingMessage
      v-if="loaded === false"
      :load-failed="loadFailed"
    />
    <RouterView v-else />
  </div>
</template>

<script>
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
export default {
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loaded: false,
      loadFailed: false,
    };
  },
  computed: {
    qualifyingTestReportId() {
      return this.$route.params.qualifyingTestReportId;
    },
  },
  watch: {
    '$route.params.qualifyingTestReportId'() {
      this.loadPage();
    },
  },
  mounted() {
    this.loadPage();
  },
  unmounted() {
    this.$store.dispatch('qualifyingTestReport/unbind');
  },
  methods: {
    async loadPage() {
      this.loaded = false;
      await this.$store.dispatch('qualifyingTestReport/bind', this.qualifyingTestReportId);
      this.loaded = true;
    },
  },
};
</script>
