<template>
  <div>
    <div class="text-right">
      <router-link
        v-if="isEditable"
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
import { mapGetters } from 'vuex';
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import exerciseTimeline from '@/helpersTMP/Timeline/exerciseTimeline';

export default {
  components: {
    Timeline,
  },
  computed: {
    ...mapGetters('exerciseDocument', {
      isEditable: 'isEditable',
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    timeline() {
      const timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline);
    },
  },
};
</script>
