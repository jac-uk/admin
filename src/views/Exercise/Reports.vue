<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-one-quarter print-none">
      <SideNavigation
        :pages="sideNavigation"
      />
    </div>
    <div class="govuk-grid-column-three-quarters print-full-width">
      <RouterView />
    </div>
  </div>
</template>

<script>
import SideNavigation from '@/components/Navigation/SideNavigation.vue';

export default {
  components: {
    SideNavigation,
  },
  computed: {
    sideNavigation() {
      const exercise = this.$store.state.exerciseDocument.record;
      const path = `/exercise/${exercise.id}/reports`;
      const sideNavigation = [
        {
          title: 'Diversity',
          name: 'exercise-reports-diversity',
        },
        {
          title: 'Merit List',
          name: 'merit-list',
        },
        {
          title: 'Outreach',
          name: 'outreach',
        },
        {
          title: 'Character Issues',
          name: 'character-issues',
        },
        {
          title: 'Eligibility Issues',
          name: 'eligibility-issues',
        },
        {
          title: 'Reasonable Adjustments',
          name: 'reasonable-adjustments',
        },
        {
          title: 'Agency',
          name: 'agency',
        },
        {
          title: 'Handover',
          name: 'handover',
        },
        {
          title: 'Statutory Consultation',
          name: 'statutory-consultation',
        },
        {
          title: 'Custom',
          name: 'custom',
        },
      ];

      if (exercise.shortlistingMethods && exercise.shortlistingMethods.length) {
        if (
          (exercise.shortlistingMethods.indexOf('sift') >= 0 && exercise.siftStartDate)
          || (exercise.shortlistingMethods.indexOf('name-blind-paper-sift') >= 0 && exercise.nameBlindSiftStartDate)
        ) {
          sideNavigation.push(
            {
              title: 'Sift',
              path: `${path}/sift`,
            }
          );
        }
      }
      if (exercise.scenarioTestDate) {  // TODO: remove this when we have better support for scenarios
        sideNavigation.push(
          {
            title: 'Scenario Responses',
            path: `${path}/scenario`,
          }
        );
      }
      if (exercise.selectionDays) {
        sideNavigation.push(
          {
            title: 'Selection day',
            path: `${path}/selection`,
          }
        );
      }

      return sideNavigation;
    },
  },
};
</script>
