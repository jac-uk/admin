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
  data() {
    const exercise = this.$store.state.exerciseDocument.record;
    const path = `/exercise/${exercise.id}/reports`;
    return {
      sideNavigation: [
        {
          title: 'Diversity',
          path: `${path}/diversity`,
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
      ],
    };
  },
};
</script>
