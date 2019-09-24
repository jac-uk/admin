<template>
  <div>
    <LoadingMessage
      v-if="loaded === false"
      :load-failed="loadFailed"
    >
      <template v-slot:failedLoadMessage>
        <h1 class="govuk-heading-xl">
          Page not found
        </h1>
        <p class="govuk-body">
          If you typed the web address, check it is correct.
        </p>
        <p class="govuk-body">
          If you pasted the web address, check you copied the entire address.
        </p>
        <p class="govuk-body">
          Come back to Dashboard page: 
          <router-link
            to="/dashboard"
          >
            Go to Dashboard
          </router-link>
        </p>
      </template>
    </LoadingMessage>
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
  watch: {
    '$route': function (newRoute) {
      this.$store.dispatch('exerciseCreateJourney/setCurrentRoute', newRoute.name);
    },
  },
  mounted() {
    const id = this.$route.params.id;
    
    this.$store.dispatch('exerciseDocument/bind', id)
      .then((data) => {
        if(!(data === null)) {
          this.loaded = true;
        }
        else {
          this.loadFailed = true;
        }
      }).catch((e) => {
        this.loadFailed = true;
        throw e;
      });

    this.$store.dispatch('exerciseCreateJourney/setCurrentRoute', this.$route.name);
  },
};
</script>
