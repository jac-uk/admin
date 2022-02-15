<template>
  <div>
    <h1 class="govuk-heading-l">
      New panel for {{ type | lookup }}
    </h1>
    <PanelForm
      :data="defaults"
      @save="savePanel"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import PanelForm from './components/AddEdit';

export default {
  components: {
    PanelForm,
  },
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseId() {
      return this.exercise.id;
    },
    defaults() {
      switch (this.type) {
      case 'sift':
        return {
          dateFrom: this.exercise.siftStartDate,
          dateTo: this.exercise.siftEndDate,
        };
      case 'selection':
        if (this.exercise.selectionDays && this.exercise.selectionDays.length) {
          return {
            dateFrom: this.exercise.selectionDays[0].selectionDayStart,
            dateTo: this.exercise.selectionDays[0].selectionDayEnd,
          };
        }
        break;
      case 'scenario':
        return {
          dateFrom: this.exercise.scenarioTestOutcome,
          dateTo: this.exercise.scenarioTestOutcome,
        };
      }
      return {};
    },
  },
  methods: {
    async savePanel(formData) {
      const data = { ...formData };
      data.type = this.type;
      data.exerciseId = this.exerciseId;
      data.status = 'draft';
      await this.$store.dispatch('panel/create', data);
      this.$router.push({ name: 'exercise-tasks-panels' });
    },
    cancel() {
      this.$router.push({ name: 'exercise-tasks-panels' });
    },
  },
};
</script>
