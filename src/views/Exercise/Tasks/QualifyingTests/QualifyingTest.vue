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
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage';
export default {
  name: 'QualifyingTest',
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
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
  },
  watch: {
    '$route.params.qualifyingTestId'() {
      this.loadPage();
    },
  },
  mounted() {
    this.loadPage();
  },
  destroyed() {
    this.$store.dispatch('qualifyingTest/unbind');
  },
  methods: {
    loadPage() {
      this.loaded = false;
      this.$store.dispatch('qualifyingTest/bind', this.qualifyingTestId)
        .then((data) => {
          if (data === null) {
            this.redirectToPage();
          }
          else {
            this.loaded = true;
          }
        }).catch((e) => {
          this.loadFailed = true;
          throw e;
        });
    },
    redirectToPage() {
      // this.$router.replace({ name: 'page-not-found' });
      // TODO: If the requested test is an Equal Merit tie-breaker redirects to the EM tie-breakers page
      // else redirect to the QTs page
      this.$router.replace({ name: 'exercise-tasks-qualifying-tests' });
    },
  },
};
</script>
