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
    return {
      sideNavigation: [
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
          title: 'Qualifying Test Reports',
          name: 'qualifying-test-reports',
          query: { nav: '/reports/qualifying-test-reports' },
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
      ],
    };
  },
};
</script>
