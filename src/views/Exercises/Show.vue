<template>
  <div>
    <LoadingMessage
      v-if="loaded === false"
      :load-failed="loadFailed"
    />
    <div v-else>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-quarter">
          <router-link
            class="govuk-back-link"
            :to="goBack"
          >
            Back
          </router-link>          
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

export default {
  components: {
    LoadingMessage,
    Navigation,
    AddToFavouritesButton,
  },
  data() {
    return {
      loaded: false,
      loadFailed: false,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseName() {
      return this.exercise.name && this.exercise.name.length < 80 ? this.exercise.name : this.exercise.name.substring(0,79)+'..';
    },
    isDraft() {
      // returns true unless exercise has a state that other than draft
      if (this.exercise && this.exercise.state && this.exercise.state !== 'draft') {
        return false;
      }
      return true;
    },
    navPages() {
      const pages = [
        { page: 'Overview', name: 'exercise-show-overview' },
        { page: 'Vacancy information', name: 'exercise-show-vacancy' },
        { page: 'Contacts', name: 'exercise-show-contacts' },
        { page: 'Timeline', name: 'exercise-show-timeline' },
        { page: 'Shortlisting', name: 'exercise-show-shortlisting' },
        { page: 'Eligibility information', name: 'exercise-show-eligibility' },
        { page: 'Working preferences', name: 'exercise-show-working-preferences' },
        { page: 'Assessment options', name: 'exercise-show-assessment-options' },
        { page: 'Exercise downloads', name: 'exercise-show-downloads' },

      ];
      if (!this.isDraft) {
        pages.push({ page: 'Applications', name: 'exercise-show-applications' });
        pages.push({ page: 'Independent assessments', name: 'exercise-show-independent-assessments' });
        pages.push({ page: 'Exercise reports', name: 'exercise-show-reports' });
      }
      return pages;
    },
    goBack() {
      if (this.$route.name === 'exercise-show-overview') {
        return {
          name: 'dashboard',
        };
      } else {
        return {
          name: 'exercise-show-overview',
          params: {
            id: this.exercise.id,
          },
        };
      }
    },
  },
  mounted() {
    this.$store.dispatch('exerciseCreateJourney/end'); // ensures journey through forms is ended
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
