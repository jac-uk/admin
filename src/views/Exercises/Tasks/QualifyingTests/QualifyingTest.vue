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
          this.redirectToErrorPage();
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
    redirectToErrorPage() {
      this.$router.replace({ name: 'page-not-found' });
    },
  },
};
</script>
