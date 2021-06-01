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
export default {
  components: {
    SideNavigation,
  },
  data() {
    const exercise = this.$store.state.exerciseDocument.record;
    const path = `/exercise/${exercise.id}/stages`;
    let review = 0;
    let shortlisted = 0;
    let selected = 0;
    let recommended = 0;
    let handover = 0;
    if (exercise.applicationRecords){
      review = exercise.applicationRecords.review;
      if (exercise.applicationRecords.shortlisted) { shortlisted = exercise.applicationRecords.shortlisted; }
      if (exercise.applicationRecords.selected) { selected = exercise.applicationRecords.selected; }
      if (exercise.applicationRecords.recommended) { recommended = exercise.applicationRecords.recommended; }
      if (exercise.applicationRecords.handover) { handover = exercise.applicationRecords.handover; }
    }
    const sideNavigation = [
      {
        title: `Review (${review})`,
        path: `${path}/review`,
      },
      {
        title: `Shortlisted (${shortlisted})`,
        path: `${path}/shortlisted`,
      },
      {
        title: `Selected (${selected})`,
        path: `${path}/selected`,
      },
      {
        title: `Recommended (${recommended})`,
        path: `${path}/recommended`,
      },
      {
        title: `Handover (${handover})`,
        path: `${path}/handover`,
      },
    ];
    return {
      sideNavigation: sideNavigation,
    };
  },
};
</script>
