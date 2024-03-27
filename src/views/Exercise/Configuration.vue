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
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    sideNavigation() {
      if (!this.exercise) { return []; }
      const path = `/exercise/${this.exercise.id}/configuration`;
      const sideNavigation = [
        {
          title: 'Application version',
          path: `${path}/application-version`,
        },
        {
          title: 'Processing version',
          path: `${path}/processing-version`,
        },
      ];
      return sideNavigation;
    },
  },
};
</script>
