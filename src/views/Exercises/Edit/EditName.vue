<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />

        <h1 class="govuk-heading-l">
          Update exercise name
        </h1>

        <TextField
          id="exercise-name"
          v-model="exercise.name"
          label="Exercise name"
          required
        />

        <button class="govuk-button">
          Update exercise name
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@/components/Form/Form';
import TextField from '@/components/Form/TextField';
import BackLink from '@/components/BackLink';

export default {
  components: {
    TextField,
    BackLink,
  },
  extends: Form,
  data(){
    const exercise = this.$store.getters['exerciseDocument/data']();

    return {
      exercise: {
        name: exercise.name || null,
      },
    };
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        await this.$store.dispatch('exerciseDocument/save', this.exercise);
        this.$router.push({ name: 'exercise-show-overview' });
      }
    },
  },
};
</script>
