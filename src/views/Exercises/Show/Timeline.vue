<template>
  <div>
    <div class="text-right">
      <router-link 
        v-if="canEdit"
        class="govuk-link"
        :to="{name: 'exercise-edit-timeline'}"
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
import Timeline from '@/components/Page/Timeline';
import createTimeline from '@/helpers/Timeline/createTimeline';
import exerciseTimeline from '@/helpers/Timeline/exerciseTimeline';

export default {
  components: {
    Timeline,
  },
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isApproved() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    canEdit() {
      return !this.isApproved;
    },
    timeline() {
      let timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline);
    },
  },
};
</script>
