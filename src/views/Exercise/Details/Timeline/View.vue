<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable && hasPermission(PERMISSIONS.exercises.permissions.canUpdateExercises.value)"
        class="govuk-link"
        :to="{name: 'exercise-details-timeline-edit'}"
      >
        Update timeline
      </router-link>
    </div>

    <h2 class="govuk-heading-l">
      Timeline
    </h2>
    <Timeline :data="timeline" />
  </div>
</template>

<script>
import { isEditable } from '@/helpers/exerciseHelper';
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import exerciseTimeline from '@/helpersTMP/Timeline/exerciseTimeline';
import Permission from '@/components/Permission';

export default {
  components: {
    Timeline,
  },
  extends: Permission,
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isEditable() {
      return isEditable(this.exercise);
    },
    timeline() {
      const timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline);
    },
  },
};
</script>
