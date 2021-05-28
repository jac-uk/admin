<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <SubNavigation
        current="exercise-details"
        :pages="subNavigation"
      />
    </div>
    <RouterView :side-navigation="sideNavigation" />
  </div>
</template>

<script>
import SubNavigation from '@/components/Navigation/SubNavigation';
export default {
  components: {
    SubNavigation,
  },
  props: {
    subNavigation: {
      required: true,
      type: Array,
    },
    exercise: {
      required: true,
      type: Object,
    },
  },
  data() {
    const sideNavigation = [
      {
        title: 'Overview',
        name: 'exercise-overview',
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
      {
        title: 'Application form',
        name: 'exercise-application-content',
      },
    ];
    if (this.exercise.inviteOnly) {
      sideNavigation.splice(1, 0, { title: 'Exercise invitations',name: 'exercise-show-invitations' });
    }
    return {
      sideNavigation: sideNavigation,
    };
  },
};
</script>
