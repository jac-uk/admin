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
      const path = `/exercise/${exercise.id}/applications`;
      let draft = 0;
      let applied = 0;
      let withdrawn = 0;
      if (exercise._applications){
        draft = exercise._applications.draft || 0;
        applied = exercise._applications.applied || 0;
        withdrawn = exercise._applications.withdrawn || 0;
      }
      const sideNavigation = [
        {
          title: `Draft (${this.$filters.formatNumber(draft)})`,
          path: `${path}/draft`,
        },
        {
          title: `Applied (${this.$filters.formatNumber(applied)})`,
          path: `${path}/applied`,
        },
        {
          title: `Withdrew (${this.$filters.formatNumber(withdrawn)})`,
          path: `${path}/withdrawn`,
        },
      ];
      return sideNavigation;
    },
  },
};
</script>
