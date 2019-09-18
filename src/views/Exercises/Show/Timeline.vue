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
import formatDate from '@/helpers/formatDate';

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
        { 
          'entry': 'Open for applications', 'date': this.exercise.applicationOpenDate, 
        },
        { 
          'entry': 'Closed for applications', 
          'date': formatDate(this.exercise.applicationCloseDate), 
        },
        { 
          'entry': 'QT', 'date': `${formatDate(this.exercise.sjcaTestStartTime)} - ${formatDate(this.exercise.sjcaTestStartTime, 'time')} to ${formatDate(this.exercise.sjcaTestEndTime, 'time')}`, 
        },
        { 
          'entry': 'QT outcome to candidates', 
          'date': formatDate(this.exercise.sjcaTestOutcome, 'month'), 
        },
        {
          'entry': 'Scenario test',
          'date': `${formatDate(this.exercise.scenarioTestDate)} - ${formatDate(this.exercise.scenarioTestStartTime, 'time')} to ${formatDate(this.exercise.scenarioTestEndTime, 'time')}`,
        },
        { 'entry': 'Scenario test outcome to candidates', 
          'date': formatDate(this.exercise.scenarioTestOutcome),
        },
        { 
          'entry': 'Contact independent assessors', 
          'date': formatDate(this.exercise.contactIndependentAssessors) },
        { 
          'entry': 'Selection day', 
          'date': `${formatDate(this.exercise.selectionDays[0].selectionDayStart)} to ${formatDate(this.exercise.selectionDays[0].selectionDayEnd)}`,
        },
        { 
          'entry': 'Character checks', 
          'date': formatDate(this.exercise.characterChecks, 'month'), 
        },
        { 
          'entry': 'Statutory consultation', 
          'date': formatDate(this.exercise.statutoryConsultation, 'month'), 
        },
        { 
          'entry': 'Selection process outcome', 
          'date': formatDate(this.exercise.finalOutcome, 'month'),
        },
      ];
    },
  },
};
</script>
