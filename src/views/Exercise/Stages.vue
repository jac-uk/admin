<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-one-quarter print-none">
      <SideNavigation
        :pages="sideNavigation"
      />
    </div>
    <div class="exercise-stages govuk-grid-column-three-quarters print-full-width">
      <RouterView />
    </div>
  </div>
</template>

<script>
import SideNavigation from '@/components/Navigation/SideNavigation';
import { formatNumber } from '@/filters';

export default {
  components: {
    SideNavigation,
  },
  computed: {
    sideNavigation() {
      const exercise = this.$store.state.exerciseDocument.record;
      const path = `/exercise/${exercise.id}/stages`;
      let review = 0;
      let shortlisted = 0;
      let selected = 0;
      let recommended = 0;
      let handover = 0;
      if (exercise._applicationRecords){
        review = exercise._applicationRecords.review || 0;
        shortlisted = exercise._applicationRecords.shortlisted || 0;
        selected = exercise._applicationRecords.selected || 0;
        recommended = exercise._applicationRecords.recommended || 0;
        handover = exercise._applicationRecords.handover || 0;
      }
      const sideNavigation = [
        {
          title: `Review (${formatNumber(review)})`,
          path: `${path}/review`,
        },
        {
          title: `Shortlisted (${formatNumber(shortlisted)})`,
          path: `${path}/shortlisted`,
        },
        {
          title: `Selected (${formatNumber(selected)})`,
          path: `${path}/selected`,
        },
        {
          title: `Recommended (${formatNumber(recommended)})`,
          path: `${path}/recommended`,
        },
        {
          title: `Handover (${formatNumber(handover)})`,
          path: `${path}/handover`,
        },
      ];
      return sideNavigation;
    },
  },
};
</script>
