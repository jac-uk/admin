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
import SideNavigation from '@/components/Navigation/SideNavigation';

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
          path: `${path}/diversity`,
        },
        {
          title: 'Merit List',
          path: `${path}/merit-list`,
        },
        {
          title: 'Outreach',
          path: `${path}/outreach`,
        },
        {
          title: 'Character Issues',
          path: `${path}/character-issues`,
        },
        {
          title: 'Eligibility Issues',
          path: `${path}/eligibility-issues`,
        },
        {
          title: 'Reasonable Adjustments',
          path: `${path}/reasonable-adjustments`,
        },
        {
          title: 'Qualifying Test Reports',
          path: `${path}/qualifying-test-reports`,
          params: {
            nav: '/reports/qualifying-test-reports',
          },
        },
        {
          title: 'Agency',
          path: `${path}/agency`,
        },
        {
          title: 'Handover',
          path: `${path}/handover`,
        },
        {
          title: 'Statutory Consultation',
          path: `${path}/statutory-consultation`,
        },
        {
          title: 'Custom',
          path: `${path}/custom`,
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
      if (exercise.selectionDays) {
        sideNavigation.push(
          {
            title: 'Selection day',
            path: `${path}/selection`,
          }
        );
      }
      if (exercise.scenarioTestDate) {  // TODO: remove this when we have better support for scenarios
        sideNavigation.push(
          {
            title: 'Scenario Responses',
            path: `${path}/scenario`,
          }
        );
      }

      return sideNavigation;
    },
  },
};
</script>
