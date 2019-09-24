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
    <div v-else>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          <div class="text-right govuk-!-margin-0">
            <a
              href="#"
              class="govuk-button govuk-button--secondary govuk-!-margin-0"
            >
              ☆ Add to favourites
            </a>
          </div>
          <span class="govuk-caption-xl">118</span>
          <h1 class="govuk-heading-xl">
            {{ exercise.name }}
          </h1>
        </div>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-quarter">
          <Navigation
            :items="navPages"
            label="Main Navigation"
          />
        </div>
        <div class="govuk-grid-column-three-quarters">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingMessage from '@/components/LoadingMessage';
import Navigation from '@/components/Page/Navigation';

export default {
  components: {
    LoadingMessage,
    Navigation,
  },
  data() {
    const navPages = [
      { page: 'Overview', name: 'exercise-show-overview' },
      { page: 'Applications', name: 'exercise-show-applications' },
      { page: 'Contacts', name: 'exercise-show-contacts' },
      { page: 'Timeline', name: 'exercise-show-timeline' },
      { page: 'Shortlisting', name: 'exercise-show-shortlisting' },
      { page: 'Vacancy information', name: 'exercise-show-vacancy' },
      { page: 'Eligibility information', name: 'exercise-show-eligibility' },
    ];

    return {
      loaded: false,
      loadFailed: false,
      navPages,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
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
  },
};
</script>
