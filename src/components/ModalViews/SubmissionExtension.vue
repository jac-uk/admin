<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Submission Extension
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          ref="formRef"
        >
          <fieldset>
            <TextField
              id="date-extension-reason"
              v-model="dateExtensionReason"
              label="Reason for extension"
              required
            />
            <DateInput
              id="date-extension"
              v-model="dateExtension"
              :value="dateExtension"
            />
          </fieldset>
          <button
            class="govuk-button govuk-!-margin-right-3"
            @click.prevent="save"
          >
            Save
          </button>
          <button
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click.prevent="closeModal"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { serverTimestamp } from '@firebase/firestore';
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput.vue';

export default {
  name: 'SubmissionExtension',
  components: {
    TextField,
    DateInput,
  },
  emits: ['close', 'confirmed', 'saved'],
  data() {
    return {
      dateExtension: null,
      dateExtensionReason: null,
    };
  },
  created() {
    const query = this.$route?.query;
    this.dateExtensionReason = query.reason || '';
    this.dateExtension = this.$attrs.dateExtension;
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmModal() {
      this.$emit('confirmed');
    },
    async save() {
      const data = {
        dateExtension: this.dateExtension,
      };
      const dataNotes = {
        applicationId: this.$attrs.applicationId,
        body: `Application extended to: ${this.dateExtension}: ${this.dateExtensionReason}`,
        candidate: {
          id: this.$attrs.userId,
        },
        created: serverTimestamp(),
      };

      await this.$store.dispatch('application/update', { data: data, id: this.$attrs.applicationId });
      await this.$store.dispatch('notes/save', { data: dataNotes });
      this.$emit('saved');
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
  .modal__title {
    color: #ffffff;
  }
</style>
