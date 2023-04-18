<template>
  <div>
    <div class="modal__title text-left govuk-!-padding-2 background-blue">
      <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
        Override an exercise
      </h2>
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div style="text-align: left;">
        <p
          v-if="errorMessage"
          class="govuk-error-message"
        >
          {{ errorMessage }}
        </p>
        <TextField
          id="reference-number"
          v-model="referenceNumber"
          label="Reference number"
          required
        />
        <button
          class="govuk-button govuk-!-margin-right-3"
          :disabled="!referenceNumber"
          @click="save"
        >
          Override
        </button>
        <button
          type="button"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';

export default {
  name: 'OverrideExercise',
  components: {
    TextField,
  },
  data() {
    return {
      referenceNumber: '',
      errorMessage: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async save() {
      this.errorMessage = '';

      if (!this.referenceNumber) {
        this.errorMessage = 'Please enter reference number.';
        return;
      }

      const content = this.$store.state.clipboard.data.content;
      if (this.referenceNumber.replace(/\s/g, '') === content.referenceNumber) {
        this.errorMessage = 'Reference number should not be the same.';
        return;
      }
  
      const exercise = await this.$store.dispatch('exerciseDocument/getDocumentDataByReferenceNumber', this.referenceNumber);
      if (exercise?.id) {
        this.$emit('confirmed', { exerciseId: exercise.id, referenceNumber: this.referenceNumber });
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Reference number does not exist.';
      }
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
