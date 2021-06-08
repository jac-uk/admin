<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Exercise State
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
              v-model="formData.state"
              required
            >
              <option
                v-for="exerciseState in exerciseStates"
                :key="exerciseState"
                :value="exerciseState"
              >
                {{ exerciseState | lookup }}
              </option>
            </Select>
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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';

export default {
  name: 'PanelMemberChange',
  components: {
    Select,
    ErrorSummary,
  },
  extends: Form,
  props: {
    state: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        state: 'review',
      },
      exerciseStates: [
        'approved',
        'shortlisting',
        'selection',
        'recommended',
        'handover',
      ],
    };
  },
  created() {
    this.formData.state = this.state;
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.modalOpen = false;
      this.$emit('confirmed');
      document.body.style.overflow = '';
    },
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.formData);
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
