<template>
  <div>
    <router-link
      class="govuk-back-link govuk-!-margin-top-0"
      :to="{ name: 'exercise-task-panelsInitialised' }"
    >
      Back
    </router-link>
    <h1 class="govuk-heading-l">
      New panel for {{ $filters.lookup(type) }}
    </h1>
    <PanelForm
      :data="defaults"
      @save="savePanel"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import PanelForm from './components/AddEdit.vue';

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
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    exerciseId() {
      return this.exercise.id;
    },
    defaults() {
      switch (this.type) {
      case 'sift':
        if (this.exercise.shortlistingMethods.indexOf('name-blind-paper-sift') >= 0 && this.exercise.nameBlindSiftStartDate) {
          return {
            dateFrom: this.exercise.nameBlindSiftStartDate,
            dateTo: this.exercise.nameBlindSiftEndDate,
          };
        } else {
          return {
            dateFrom: this.exercise.siftStartDate,
            dateTo: this.exercise.siftEndDate,
          };
        }
      case 'selectionDay':
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
      data.exercise = {
        id: this.exerciseId,
        referenceNumber: this.exercise.referenceNumber,
        name: this.exercise.name,
      };
      data.markingScheme = this.task.markingScheme,
      data.status = 'draft';
      await this.$store.dispatch('panel/create', data);
      this.$router.push({ name: 'exercise-task-loading' });
    },
    cancel() {
      this.$router.push({ name: 'exercise-task-loading' });
    },
  },
};
</script>
