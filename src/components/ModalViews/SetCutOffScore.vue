<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Set a cut off score
    </div>
    <div
      v-if="!processing && !complete"
      class="modal__content govuk-!-margin-6"
    >
      <ErrorSummary
        :errors="errors"
      />
      <TextField
        id="score"
        v-model="cutOffScore"
        type="number"
        label="Set a cut off score"
        required
      />
      <span v-if="cutOffScore">
        <div 
          class="govuk-form-group"
        >
          <label
            for="passStatus"
            class="govuk-heading-m govuk-!-margin-bottom-2"
          > Status for applicants with a score of {{ cutOffScore }} or higher </label>
          <select
            id="passStatus"
            v-model="cutOffPassStatus"
            class="govuk-select"
            required
          >
            <option value="">
              Select a status
            </option>
            <option value="passedFirstTest">
              Passed First Test
            </option>
            <option value="passedScenarioTest">
              Passed Scenario Test
            </option>
          </select>
        </div>
        <div
          class="govuk-form-group"
        >
          <label
            for="failStatus"
            class="govuk-heading-m govuk-!-margin-bottom-2"
          > Status for applicants with a score of {{ cutOffScore - 1 }} or lower </label>
          <select
            id="failStatus"
            v-model="cutOffFailStatus"
            class="govuk-select"
            required
          >
            <option value="">
              Select a status
            </option>
            <option value="failedFirstTest">
              Failed First Test
            </option>
            <option value="failedScenarioTest">
              Failed Scenario Test
            </option>
          </select>
        </div>
      </span>
      <div>
        <button
          class="govuk-button govuk-!-margin-right-3"
          @click="save"
        >
          Save
        </button>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="closeModal"
        >
          Cancel
        </button>
      </div>
    </div>
    <div
      v-if="processing"
      class="modal__content govuk-!-margin-6"
    >
      Please wait whilst we process your request...
    </div>
    <div
      v-if="complete"
      class="modal__content govuk-!-margin-6"
    >
      <p>
        Applicant statuses updated
      </p>
      <button
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="closeModal"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';

export default {
  name: 'SetCutOffScore',
  components: {
    TextField,
    ErrorSummary,
  },
  data() {
    return {
      cutOffScore: null,
      cutOffPassStatus: null,
      cutOffFailStatus: null,
      processing: false,
      complete: false,
      errors: [],
    };
  },
  computed: {
    applicationIds() {
      return this.$attrs['application-ids'];
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async save() {
      this.errors = [];
      this.processing = true;
      try {
        await functions.httpsCallable('cutOffScoreUpdateStatuses')({
          applicationIds: this.applicationIds,
          cutOffScore: this.cutOffScore,
          cutOffPassStatus: this.cutOffPassStatus,
          cutOffFailStatus: this.cutOffFailStatus,
        });
        this.processing = false;
        this.complete = true;
      } catch (e) {
        this.processing = false;
        this.errors.push(e);
      }
    },
  },
};
</script>

<style>
#score {
  width: 20% !important;
}
</style>
