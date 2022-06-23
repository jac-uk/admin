<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-one-quarter print-none">
      <SideNavigation
        v-if="!hasJourney"
        :pages="sideNavigation"
      />
    </div>
    <div class="govuk-grid-column-three-quarters print-full-width">
      <RouterView />
    </div>
  </div>
</template>

<script>
import SideNavigation from '@/components/Navigation/SideNavigation';
export default {
  components: {
    SideNavigation,
  },
  computed: {
    exercise () {
      return this.$store.state.exerciseDocument.record;
    },
    hasJourney () {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    sideNavigation () {
      if (!this.exercise) { return []; }
      const path = `/exercise/${this.exercise.id}/details`;
      const sideNavigation = [
        {
          title: 'Overview',
          path: `${path}/overview`,
        },
        {
          title: 'Website listing',
          path: `${path}/summary`,
        },
        {
          title: 'Vacancy information',
          path: `${path}/vacancy`,
        },
        {
          title: 'Contacts',
          path: `${path}/contacts`,
        },
        {
          title: 'Timeline',
          path: `${path}/timeline`,
        },
        {
          title: 'Shortlisting',
          path: `${path}/shortlisting`,
        },
        {
          title: 'Eligibility information',
          path: `${path}/eligibility`,
        },
        {
          title: 'Working preferences',
          path: `${path}/preferences`,
        },
        {
          title: 'Assessment options',
          path: `${path}/assessments`,
        },
        {
          title: 'Exercise downloads',
          path: `${path}/downloads`,
        },
      ];
      if (this.exercise._applicationContent) {
        sideNavigation.push({
          title: 'Application process',
          path: `${path}/application-content`,
        });
      }
      if (this.exercise.inviteOnly) {
        sideNavigation.splice(1, 0, { title: 'Exercise invitations', path: `${path}/invitations` });
      }
      return sideNavigation;
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler (newRoute) {
        this.$store.dispatch('exerciseCreateJourney/setCurrentRoute', newRoute.name);
      },
    },
  },
};
</script>
