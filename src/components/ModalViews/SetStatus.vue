<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Set application status
    </div>
    <div
      v-if="!processing && !complete"
      class="modal__content govuk-!-margin-6"
    >
      <ErrorSummary
        :errors="errors"
      />
      <span>
        <div 
          class="govuk-form-group"
        >
          <label
            for="passStatus"
            class="govuk-heading-m govuk-!-margin-bottom-2"
          > Select a status </label>
          <select
            id="passStatus"
            v-model="applicationStatus"
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
        Application statuses updated
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
import { lookup } from '@jac-uk/jac-kit/filters/filters';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';

export default {
  name: 'SetStatus',
  components: {
    ErrorSummary,
  },
  filters: {
    lookup: function(value) {
      return lookup(value);
    },
  },
  data() {
    return {
      applicationStatus: null,
      processing: false,
      complete: false,
      errors: [],
    };
  },
  computed: {
    applicationIds() {
      return this.$attrs['selected-items'];
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
        await functions.httpsCallable('updateStatus')({
          applicationIds: this.applicationIds,
          applicationStatus: this.applicationStatus,
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
