<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <div class="text-right">
          <BackLink class="govuk-!-margin-top-0 govuk-!-margin-bottom-0" />
        </div>

        <h2 class="govuk-heading-l">
          Update exercise name
        </h2>

        <TextField
          id="exercise-name"
          v-model="formData.name"
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
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
    };
  },
  methods: {
    async save(isValid) {
      this.formData['progress.started'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push({ name: 'exercise-overview' });
    },
  },
};
</script>
