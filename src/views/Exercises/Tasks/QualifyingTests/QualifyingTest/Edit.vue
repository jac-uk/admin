<template>
  <div class="govuk-grid-column-two-thirds">
    <form @submit.prevent="validateAndSave">
      <BackLink />

      <h2 class="govuk-heading-l">
        Edit qualifying test details
      </h2>

      <ErrorSummary
        :errors="errors"
        :show-save-button="false"
        @save="save"
      />

      <TextField
        id="qualifyingTest-title"
        v-model="qualifyingTest.title"
        label="Title"
        required
      />

      <DateInput
        id="qualifyingTest-startDate"
        v-model="qualifyingTest.startDate"
        type="datetime"
        label="Start date"
        required
      />

      <DateInput
        id="qualifyingTest-endDate"
        v-model="qualifyingTest.endDate"
        type="datetime"
        label="End date"
        required
      />

      <TextField
        id="qualifyingTest-testDuration"
        v-model="qualifyingTest.testDuration"
        label="Duration"
        hint="In minutes."
        type="number"
        required
        input-class="govuk-input--width-3"
      />

      <h3 class="govuk-heading-m">
        Additional instructions
      </h3>
      <span class="govuk-hint">Any additional instructions for the candidate - will be displayed before they start the test.</span>

      <RepeatableFields
        v-model="qualifyingTest.additionalInstructions"
        :component="repeatableFields.QTAdditionalInstruction"
        ident="additionalInstructions"
        required
      />

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import BackLink from '@/components/BackLink';
import TextField from '@/components/Form/TextField';
import DateInput from '@/components/Form/DateInput';
import RepeatableFields from '@/components/RepeatableFields';
import QTAdditionalInstruction from '@/components/RepeatableFields/QualifyingTests/AdditionalInstruction.vue';
import { QUALIFYING_TEST } from '@/helpers/constants';

export default {
  components: {
    ErrorSummary,
    TextField,
    DateInput,
    RepeatableFields,
    BackLink,
  },
  extends: Form,
  data(){
    const defaults = {
      title: null,
      startDate: null,
      endDate: null,
      testDuration: null,
      additionalInstructions: [],
    };
    const data = this.$store.getters['qualifyingTest/data']();

    const qualifyingTest = { ...defaults, ...data };

    return {
      repeatableFields: {
        QTAdditionalInstruction,
      },
      qualifyingTest: qualifyingTest,
    };
  },
  computed: {
    testTypes() {
      return QUALIFYING_TEST.TYPE;
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('qualifyingTest/save', this.qualifyingTest);
      this.$router.push({ name: 'qualifying-test-question-builder' });
    },
  },
};
</script>
