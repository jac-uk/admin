<template>
  <div>
    <LoadingMessage
      v-if="loaded === false"
      :load-failed="loadFailed"
    />
    <div v-else>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-quarter">
          <BackLink />
        </div>
        <div class="govuk-grid-column-three-quarters">
          <div class="text-right govuk-!-margin-0">
            <AddToFavouritesButton />
          </div>
        </div>
      </div>      
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-full">
          <span class="govuk-caption-xl">{{ exercise.referenceNumber }}</span>
          <h1 class="govuk-heading-xl govuk-!-margin-bottom-0">
            {{ exerciseName }}
          </h1>
          <router-link
            class="display-block govuk-link govuk-!-margin-bottom-8"
            :to="{name: 'exercise-edit-name'}"
          >
            Edit name
          </router-link>
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
import AddToFavouritesButton from '@/components/Page/AddToFavouritesButton';
import BackLink from '@/components/BackLink';

export default {
  components: {
    LoadingMessage,
    Navigation,
    AddToFavouritesButton,
    BackLink,
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
      { page: 'Independent assessments', name: 'exercise-show-independent-assessments' },
      { page: 'Exercise reports', name: 'exercise-show-reports' },
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
    exerciseName() {
      return this.exercise.name.length < 80 ? this.exercise.name : this.exercise.name.substring(0,79)+'..';
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
