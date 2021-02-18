<template>
  <div>
    <LoadingMessage
      v-if="!loaded"
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
          <h1 class="govuk-heading-xl govuk-!-margin-bottom-0">
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
            :pages="mainNavigation"
            title="Exercise"
          />
          <Navigation
            v-if="exercise.applicationsCount || hasOpened"
            :pages="applicationStatusNavigation"
            title="Applications"
          />
          <Navigation
            :pages="exerciseTasksNavigation"
            title="Tasks"
          />
          <Navigation
            v-if="exercise.applicationRecords"
            :pages="applicationStageNavigation"
            title="Stages"
          />
          <Navigation
            v-if="exercise.applicationRecords"
            :pages="applicationReportNavigation"
            title="Reports"
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
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage';
import Navigation from '@jac-uk/jac-kit/draftComponents/Navigation';
import AddToFavouritesButton from '@jac-uk/jac-kit/draftComponents/AddToFavouritesButton';
import { mapState, mapGetters } from 'vuex';
import { STATUS } from '@jac-uk/jac-kit/helpers/constants';

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
      return this.exercise.name && this.exercise.name.length < 80 ? this.exercise.name : `${this.exercise.name.substring(0,79)}..`;
    },
    isInFavourites() {
      return this.userId && this.exercise && this.exercise.favouriteOf && this.exercise.favouriteOf.indexOf(this.userId) >= 0;
    },
    hasOpened() {
      if (this.exercise && this.exercise.applicationOpenDate <= new Date()) {
        return true;
      }
      return false;
    },
    mainNavigation() {
      const result = [
        {
          title: 'Overview',
          name: 'exercise-show-overview',
        },
        {
          title: 'Website listing',
          name: 'exercise-show-summary',
        },
        {
          title: 'Vacancy information',
          name: 'exercise-show-vacancy',
        },
        {
          title: 'Contacts',
          name: 'exercise-show-contacts',
        },
        {
          title: 'Timeline',
          name: 'exercise-show-timeline',
        },
        {
          title: 'Shortlisting',
          name: 'exercise-show-shortlisting',
        },
        {
          title: 'Eligibility information',
          name: 'exercise-show-eligibility',
        },
        {
          title: 'Working preferences',
          name: 'exercise-show-working-preferences',
        },
        {
          title: 'Assessment options',
          name: 'exercise-show-assessment-options',
        },
        {
          title: 'Exercise downloads',
          name: 'exercise-show-downloads',
        },
      ];
      if (this.exercise.inviteOnly) {
        result.splice(1, 0, { title: 'Exercise invitations',name: 'exercise-show-invitations' });
      }
      return result;
    },
    applicationStatusNavigation(){
      return [
        {
          title: 'Draft',
          name: 'exercise-show-applications-in-status',
          params: {
            status: STATUS.DRAFT,
          },
        },
        {
          title: 'Applied',
          name: 'exercise-show-applications-in-status',
          params: {
            status: STATUS.APPLIED,
          },
        },
        {
          title: 'Withdrawn',
          name: 'exercise-show-applications-in-status',
          params: {
            status: STATUS.WITHDRAWN,
          },
        },
      ];
    },
    exerciseTasksNavigation(){
      const tasks = [
        {
          title: 'Qualifying Tests',
          name: 'exercise-tasks-qualifying-tests',
          params: {
            nav: '/tasks/qualifying-tests',
          },
        },
      ];
      if (this.exercise.applicationRecords) {
        tasks.push(
          {
            title: 'Independent Assessments',
            name: 'exercise-tasks-independent-assessments',
          },
          {
            title: 'Character Checks',
            name: 'exercise-tasks-character-checks',
          },
        );
      }
      if (this.exercise.siftStartDate) {
        tasks.push(
          {
            title: 'Sift',
            name: 'exercise-tasks-sift',
          },
        );
      }
      if (this.exercise.selectionDays) {
        tasks.push(
          {
            title: 'Selection day',
            name: 'exercise-tasks-selection',
          },
        );
      }
      return tasks;
    },
    applicationStageNavigation(){
      if (this.exercise.applicationRecords){
        const review = this.exercise.applicationRecords.review;
        const shortlisted = this.exercise.applicationRecords.shortlisted ? this.exercise.applicationRecords.shortlisted : 0;
        const selected = this.exercise.applicationRecords.selected ? this.exercise.applicationRecords.selected : 0;
        const recommended = this.exercise.applicationRecords.recommended ? this.exercise.applicationRecords.recommended : 0;
        const handover = this.exercise.applicationRecords.handover ? this.exercise.applicationRecords.handover : 0;
        return [
          {
            title: `Review (${review})`,
            name: 'exercise-stages-review-list',
          },
          {
            title: `Shortlisted (${shortlisted})`,
            name: 'exercise-stages-shortlisted-list',
          },
          {
            title: `Selected (${selected})`,
            name: 'exercise-stages-selected-list',
          },
          {
            title: `Recommended (${recommended})`,
            name: 'exercise-stages-recommended-list',
          },
          {
            title: `Handover (${handover})`,
            name: 'exercise-stages-handover-list',
          },
        ];
      } else {
        return [];
      }
    },
    applicationReportNavigation(){
      if (this.exercise.applicationRecords){
        return [
          {
            title: 'Diversity',
            name: 'exercise-show-report-diversity',
          },
          {
            title: 'Outreach',
            name: 'exercise-show-report-outreach',
          },
          {
            title: 'Character Issues',
            name: 'exercise-show-report-character-issues',
          },
          {
            title: 'Eligibility Issues',
            name: 'exercise-show-report-eligibility-issues',
          },
          {
            title: 'Reasonable Adjustments',
            name: 'exercise-show-report-reasonable-adjustments',
          },
          {
            title: 'Qualifying Test Reports',
            name: 'qualifying-test-reports',
            params: {
              nav: '/reports/qualifying-test-reports',
            },
          },
          {
            title: 'Agency',
            name: 'exercise-show-report-agency',
          },
          {
            title: 'Handover',
            name: 'exercise-show-report-handover',
          },
        ];
      } else {
        return [];
      }
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
            id: this.exercise ? this.exercise.id : this.$route.params.id,
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
.govuk-heading-xl {
  margin-bottom: 0;
}
</style>
