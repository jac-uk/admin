<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Application Process
      </h2>
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          @submit.prevent="validateAndSave"
        >
          <ErrorSummary
            :errors="errors"
          />
          <fieldset>
            <Select
              id="exercise-state"
              v-model="formData.step"
              label="Current stage"
              required
            >
              <option
                v-for="step in steps"
                :key="step"
                :value="step"
              >
                {{ $filters.lookup(step) }}
              </option>
            </Select>
            <DateInput
              id="start"
              v-model="formData.start"
              label="Open for changes"
              required
            />
            <DateInput
              id="end"
              v-model="formData.end"
              label="Closed for changes"
              required
            />
          </fieldset>
          <button
            class="govuk-button govuk-!-margin-right-3"
          >
            Save
          </button>
          <button
            type="button"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="closeModal"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput.vue';
import { configuredApplicationContentSteps } from '@/helpers/exerciseHelper';

export default {
  name: 'EditCurrentStep',
  components: {
    Select,
    DateInput,
    ErrorSummary,
  },
  extends: Form,
  props: {
    exercise: {
      type: Object,
      required: true,
    },
  },
  emits: ['close'],
  data() {
    return {
      formData: {
        step: 'registration',
        start: null,
        end: null,
      },
      steps: configuredApplicationContentSteps(this.exercise),
    };
  },
  created() {
    if (this.exercise && this.exercise._applicationContent && this.exercise._applicationContent._currentStep) {
      this.formData.step = this.exercise._applicationContent._currentStep.step;
      this.formData.start = this.exercise._applicationContent._currentStep.start;
      this.formData.end = this.exercise._applicationContent._currentStep.end;
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async save() {
      const saveData = {};
      saveData['_applicationContent._currentStep'] = this.formData;
      await this.$store.dispatch('exerciseDocument/save', saveData);
      this.closeModal();
    },
  },
};
</script>

<style scoped>
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }
</style>
