<template>
  <div>
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
  components: {
    LoadingMessage,
  },
  data() {
    return {
      loaded: false,
      loadFailed: false,
    };
  },
  watch: {
    '$route': function (newRoute) {
      this.$store.dispatch('exerciseCreateJourney/setCurrentRoute', newRoute.name);
    },
  },
  mounted() {
    const id = this.$route.params.id;

    this.$store.dispatch('exerciseDocument/bind', id)
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

    this.$store.dispatch('exerciseCreateJourney/setCurrentRoute', this.$route.name);
  },
  methods: {
    redirectToErrorPage() {
      this.$router.replace({ name: 'exercise-not-found' });
    },
  },
};
</script>
