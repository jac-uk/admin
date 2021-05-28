<template>
  <div>
    <div class="govuk-grid-column-one-quarter print-none">
      <SideNavigation
        current="exercise-overview"
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
  props: {
    sideNavigation: {
      type: Array,
      required: true,
    },
  },
};
</script>
