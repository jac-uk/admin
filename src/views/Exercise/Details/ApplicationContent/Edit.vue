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

        <label>Configure which parts to include on the application form for this exercise</label>
        <Checkbox
          v-for="item in applicationParts"
          :id="`application-part-${item}`"
          :key="item"
          v-model="formData.applicationContent.registration[item]"
        >
          {{ item | lookup }}
        </Checkbox>
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
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox';

export default {
  components: {
    ErrorSummary,
    BackLink,
    Checkbox,
  },
  extends: Form,
  data(){
    const defaults = {
      applicationContent: {
        registration: this.$store.getters['exerciseDocument/getApplicationPartsMap'],
      },
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    applicationParts() {
      return this.$store.getters['exerciseDocument/getApplicationParts']();
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-application-content'));
    },
  },
};
</script>
