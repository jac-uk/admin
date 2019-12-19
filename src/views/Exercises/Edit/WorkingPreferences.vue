<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Working preferences
        </h1>

        <ErrorSummary 
          :errors="errors" 
          :show-save-button="true" 
          @save="save" 
        />

        <p class="govuk-body-l">
          [form]
        </p>

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
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    BackLink,
  },
  extends: Form,
  data() {
    const exercise = this.$store.getters['exerciseDocument/data']();
    return {
      exercise: exercise,
    };
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-working-preferences'));
    },
  },
};
</script>
