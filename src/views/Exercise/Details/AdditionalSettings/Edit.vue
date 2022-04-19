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
          Additional settings
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <CheckboxGroup
          id="capabilities"
          v-model="formData.capabilities"
          required
          label="Capabilities"
          :messages="{required: 'Please choose at least one capability'}"
        >
          <CheckboxItem
            v-for="capability in capabilities"
            :key="capability"
            :value="capability"
            :label="capability | lookup"
          />
        </CheckboxGroup>

        <CheckboxGroup
          id="selectionCategories"
          v-model="formData.selectionCategories"
          required
          label="Selection Tools"
          :messages="{required: 'Please choose at least one'}"
        >
          <CheckboxItem
            v-for="item in selectionCategories"
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
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
import { CAPABILITIES, SELECTION_CATEGORIES } from '@/helpers/exerciseHelper';

export default {
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
    BackLink,
  },
  extends: Form,
  data(){
    const defaults = {
      capabilities: null,
      selectionCategories: null,
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
    capabilities() {
      return CAPABILITIES;
    },
    selectionCategories() {
      return SELECTION_CATEGORIES;
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.additionalSettings'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-additional-settings'));
    },
  },
};
</script>
