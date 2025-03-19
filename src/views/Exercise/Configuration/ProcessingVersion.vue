<template>
  <div>
    <h2 class="govuk-heading-l">
      Processing version
    </h2>

    <form @submit.prevent="validateAndSave">
      <ErrorSummary
        :errors="errors"
      />
      <RadioGroup
        id="feedback-for-proxy"
        v-model="formData._processingVersion"
        label="Which processing version would you like to use?"
        hint="See operations manual for full details of the different processing versions"
        required
      >
        <RadioItem
          :value="3"
          label="Processing version 3.0"
          hint="Introduced in July 2024, processing version 3.0 includes a number of new tasks"
        />
        <RadioItem
          :value="2"
          label="Processing version 2.0"
          hint="Introduced in March 2024, processing version 2.0 updates stages and statuses"
        />
        <RadioItem
          :value="1"
          label="Processing version 1.0"
          hint="The original!"
          disabled
        />
      </RadioGroup>
      <button
        class="govuk-button"
        :disabled="!hasChanges"
      >
        Save and continue
      </button>
    </form>
  </div>
</template>

<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import RadioGroup from '@jac-uk/jac-kit/draftComponents/Form/RadioGroup.vue';
import RadioItem from '@jac-uk/jac-kit/draftComponents/Form/RadioItem.vue';
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';

export default {
  components: {
    ErrorSummary,
    RadioGroup,
    RadioItem,
  },
  extends: Form,
  data() {
    const defaults = {
      _processingVersion: 3,
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    hasChanges() {
      return this.exercise._processingVersion !== this.formData._processingVersion;
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      await httpsCallable(functions, 'updateApplicationRecordStageStatus')({ exerciseId: this.exercise.id, version: this.exercise._processingVersion });
    },
  },
};
</script>
