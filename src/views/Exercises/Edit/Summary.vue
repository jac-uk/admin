<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Website listing
        </h1>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <TextField
          id="exercise-name"
          v-model="exercise.name"
          label="Exercise name"
          required
        />

        <DateInput
          id="estimated-launch-date"
          v-model="exercise.estimatedLaunchDate"
          label="Estimated launch date"
          required
        />        

        <TextareaInput
          id="role-summary"
          v-model="exercise.roleSummary"
          label="Role summary"
          hint="Short summary of the role for the vacancies listing page."
          rows="2"
          required
        />

        <TextField
          id="subscriber-alerts-url"
          v-model="exercise.subscriberAlertsUrl"
          label="Subscriber alerts url"
          type="url"
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import TextField from '@/components/Form/TextField';
import TextareaInput from '@/components/Form/TextareaInput';
import DateInput from '@/components/Form/DateInput';
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    TextField,
    TextareaInput,
    DateInput,
    BackLink,
  },
  extends: Form,
  data() {
    const defaults = {
      name: null,
      estimatedLaunchDate: null,
      roleSummary: null,
      subscriberAlertsUrl: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
    };
  },
  methods: {
    async save(isValid) {
      this.exercise.progress.vacancySummary = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-summary'));
    },
  },
};
</script>
