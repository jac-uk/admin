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
import firebase from '@firebase/app';
import TextField from '@/components/Form/TextField';
import DateInput from '@/components/Form/DateInput';

export default {
  name: 'SubmissionExtension',
  components: {
    TextField,
    DateInput,
  },
  data() {
    return {
      dateExtension: null,
      dateExtensionReason: null,
    };
  },
  created() {
    this.dateExtension = this.$attrs.dateExtension;
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
      const data = {
        dateExtension: this.dateExtension,
      };
      const dataNotes = {
        applicationId: this.$attrs.applicationId,
        body: `Application extended to: ${this.dateExtension}: ${this.dateExtensionReason}`,
        candidate: {
          id: this.$attrs.userId,
        },
        created: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await this.$store.dispatch('application/update', { data: data, id: this.$attrs.applicationId });
      await this.$store.dispatch('notes/save', { data: dataNotes });
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
