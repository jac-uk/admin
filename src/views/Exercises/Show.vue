<template>
  <div>
    <LoadingMessage
      v-if="loaded === false"
      :load-failed="loadFailed"
    />
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
        if(data === null) {
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
      this.$router.replace({ name: 'exercise-not-found' });
    },
  },
};
</script>
