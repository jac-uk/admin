<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <div
          v-if="!hasJourney"
          class="text-right"
        >
          <BackLink class="govuk-!-margin-top-0 govuk-!-margin-bottom-0" />
        </div>

        <h2 class="govuk-heading-l">
          Application form
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <CheckboxGroup
          id="application-content"
          v-model="exercise.applicationContent.registration"
          required
          :messages="{required: 'Please choose at least one item'}"
          label="Configure which parts to include on the application form for this exercise"
        >
          <CheckboxItem
            v-for="item in applicationParts"
            :key="item"
            :value="item"
            :label="item | lookup"
          />
        </CheckboxGroup>
        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';

export default {
  components: {
    ErrorSummary,
    BackLink,
    CheckboxGroup,
    CheckboxItem,
  },
  extends: Form,
  data(){
    const defaults = {
      applicationContent: {
        registration: this.$store.getters['exerciseDocument/getApplicationParts'],
      },
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      exercise: exercise,
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    applicationParts() {
      return this.$store.getters['exerciseDocument/getApplicationParts'];
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-application-content'));
    },
  },
};
</script>
