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
import LoadingMessage from '@/components/LoadingMessage';
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
  mounted() {
    const id = this.$route.params.qualifyingTestId;

    this.$store.dispatch('qualifyingTest/bind', id)
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
  methods: {
    redirectToPage() {
      // this.$router.replace({ name: 'page-not-found' });
      this.$router.replace({ name: 'exercise-tasks-qualifying-tests' });
    },
  },
};
</script>
