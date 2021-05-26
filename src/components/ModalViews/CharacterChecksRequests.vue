<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Character checks consent form {{ typeOfEmail }}
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          ref="formRef"
        >
          <div class="govuk-!-margin-bottom-5">
            <span class="govuk-body-m">Before proceeding, please confirm that you wish to send a {{ typeOfEmail }} to </span>
            <span class="govuk-body-m govuk-!-font-weight-bold">{{ numberOfCandidates }} candidate(s) </span>
            <span class="govuk-body-m">and the email template contains all required information</span>
          </div>
          <button
            class="govuk-button govuk-!-margin-right-3 govuk-!-top-3"
            @click.prevent="send"
          >
            I confirm, please send {{ typeOfEmail }}
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
//import { functions } from '@/firebase';

export default {
  name: 'CharacterChecksRequests',
  props: {
    selectedItems: {
      type: Array,
      required: false,
      default: () => [],
    },
    exerciseMailbox: {
      type: String,
      required: true,
      default: '',
    },
    exerciseManagerName: {
      type: String,
      required: true,
      default: '',
    },
    dueDate: {
      type: String,
      required: true,
      default: '',
    },
    type: {
      type: String,
      required: true,
      default: '',
    },
  },
  computed: {
    numberOfCandidates() {
      return this.selectedItems.length;
    },
    typeOfEmail() {
      return this.type;
    },
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
    async send() {
      console.log('date', this.dueDate);
      // try {
      //   const response = await functions.httpsCallable('sendCharacterCheckRequests')({
      //     items: this.selectedItems,
      //     type: this.type,
      //     exerciseMailbox: this.exerciseMailbox,
      //     exerciseManagerName: this.exerciseManagerName,
      //     dueDate: this.dueDate,
      //   });
      //   if (response.result === false) {
      //     this.$emit('setmessage', false, 'warning');
      //   } else {
      //     await this.$store.dispatch('characterChecks/updateStatus', {
      //       selectedItems: this.selectedItems,
      //       status: 'requested',
      //     });
      //     this.$emit('setmessage', true, 'success');
      //   }
      // } catch (error) {
      //   this.$emit('setmessage', false, 'warning');
      // }
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
