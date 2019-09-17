<template>
  <div>
    <div class="text-right">
      <router-link 
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
export default {
  components: {
    Timeline,
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    timeline() {
      return [
        { 'entry': 'Open for applications', 'date': this.exercise.applicationOpenDate },
        { 'entry': 'Closed for applications', 'date': this.exercise.applicationCloseDate },
        { 'entry': 'QT', 'date': this.exercise.sjcaTestDate },
        { 'entry': 'Scenario test', 'date': this.exercise.scenarioTestDate },
        { 'entry': 'Scenario test outcome to candidates', 'date': this.exercise.scenarioTestOutcome },
        { 'entry': 'Contact independent assessors', 'date': this.exercise.contactIndependentAssessors },
        { 'entry': 'Selection day', 'date': this.exercise.selectionDays },
        { 'entry': 'Character checks', 'date': this.exercise.characterChecks },
        { 'entry': 'Statutory consultation', 'date': this.exercise.statutoryConsultation },
        { 'entry': 'Selection process outcome', 'date': this.exercise.finalOutcome },
      ];
    },
  },
};
</script>
