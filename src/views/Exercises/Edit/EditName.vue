<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';

export default {
  components: {
    TextField,
    BackLink,
  },
  extends: Form,
  data(){
    const defaults = {
      name: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
    };
  },
  methods: {
    async save(isValid) {
      this.exercise.progress.started = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push({ name: 'exercise-show-overview' });
    },
  },
};
</script>
