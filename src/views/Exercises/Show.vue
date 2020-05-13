<template>
  <div>
    <LoadingMessage
      v-if="loaded === false"
      :load-failed="loadFailed"
    />
    <div v-else>
      <div class="govuk-grid-row print-none">
        <div class="govuk-grid-column-one-quarter">
          <router-link
            class="govuk-back-link"
            :to="goBack"
          >
            Back
          </router-link>          
        </div>
        <div class="govuk-grid-column-three-quarters">
          <div class="float-right govuk-!-margin-0">
            <AddToFavouritesButton
              :in-favourites="isInFavourites"
              @click="updateFavourites"
            />
          </div>
        </div>
      </div>      
      <div class="govuk-grid-row clearfix govuk-!-margin-bottom-8">
        <div class="govuk-grid-column-full">
          <span class="govuk-caption-xl">{{ exercise.referenceNumber }}</span>
          <h1 class="govuk-heading-xl">
            {{ exerciseName }}
          </h1>
          <router-link
            v-if="isEditable"
            class="govuk-link print-none"
            :to="{name: 'exercise-edit-name'}"
          >
            Edit name
          </router-link>
        </div>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-quarter print-none">
          <Navigation
            :items="navPages"
            label="Main Navigation"
          />
        </div>
        <div class="govuk-grid-column-three-quarters print-full-width">
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
import { mapState, mapGetters } from 'vuex';

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
    ...mapState({
      userId: state => state.auth.currentUser.uid,
    }),
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseName() {
      return this.exercise.name && this.exercise.name.length < 80 ? this.exercise.name : this.exercise.name.substring(0,79)+'..';
    },
    isInFavourites() {
      return this.userId && this.exercise && this.exercise.favouriteOf && this.exercise.favouriteOf.indexOf(this.userId) >= 0;
    },
    hasOpened() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
        case 'approved':
        case 'pre-launch':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    navPages() {
      const pages = [
        { 
          page: 'Exercise', 
          name: 'exercise-overview-title',
          children: [
            { page: 'Overview', name: 'exercise-show-overview' },
            { page: 'Website listing', name: 'exercise-show-summary' },
            { page: 'Vacancy information', name: 'exercise-show-vacancy' },
            { page: 'Contacts', name: 'exercise-show-contacts' },
            { page: 'Timeline', name: 'exercise-show-timeline' },
            { page: 'Shortlisting', name: 'exercise-show-shortlisting' },
            { page: 'Eligibility information', name: 'exercise-show-eligibility' },
            { page: 'Working preferences', name: 'exercise-show-working-preferences' },
            { page: 'Assessment options', name: 'exercise-show-assessment-options' },
            { page: 'Exercise downloads', name: 'exercise-show-downloads' },
          ],
        },
      ];
      if (this.exercise.applicationsCount || this.hasOpened) {
        pages.push({ 
          page: 'Applications',
          name: 'exercise-show-applications',
          children: [
            { page: 'Draft', name: 'exercise-show-applications-in-status', params: { status: 'draft' } },
            { page: 'Applied', name: 'exercise-show-applications-in-status', params: { status: 'applied' } },
          ],
        });
        pages[1].children.push({ page: 'Independent Assessments', name: 'exercise-show-independent-assessments' });
        pages.push({
          page: 'Reports',
          name: 'exercise-show-reports',
          children: [
            { page: 'Diversity', name: 'exercise-show-report-diversity' },
            { page: 'Character Issues', name: 'exercise-show-report-character-issues' },
            { page: 'Eligibility Issues', name: 'exercise-show-report-eligibility-issues' },
            { page: 'Reasonable Adjustments', name: 'exercise-show-report-reasonable-adjustments' },
          ],
        });
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
    updateFavourites() {
      if (this.isInFavourites) {
        this.$store.dispatch('exerciseDocument/removeFromFavourites', this.userId);
      } else {
        this.$store.dispatch('exerciseDocument/addToFavourites', this.userId);
      }
    },
  },
};
</script>
<style>

  .govuk-heading-xl{
    margin-bottom: 0;
  }

</style>
