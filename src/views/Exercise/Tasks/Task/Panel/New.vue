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
