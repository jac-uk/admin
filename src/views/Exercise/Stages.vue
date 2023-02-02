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
import { lookup, formatNumber } from '../../filters';
import SideNavigation from '@/components/Navigation/SideNavigation';
import { availableStages } from '../../helpers/exerciseHelper';

export default {
  components: {
    SideNavigation,
  },
  computed: {
    sideNavigation() {
      const exercise = this.$store.state.exerciseDocument.record;
      const path = `/exercise/${exercise.id}/stages`;
      const stages = availableStages(exercise);
      const sideNavigation = [];
      stages.forEach(stage => {
        const count = (exercise._applicationRecords && exercise._applicationRecords[stage]) || 0;
        sideNavigation.push({
          title: `${lookup(stage)} (${formatNumber(count)})`, // TODO get label
          path: `${path}/${stage}`,
        });
      });
      return sideNavigation;
    },
  },
};
</script>
