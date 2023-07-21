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
          <ActionButton
            v-if="hasPermissions([
              PERMISSIONS.applications.permissions.canReadApplications.value,
              PERMISSIONS.applications.permissions.canUpdateApplications.value,
              PERMISSIONS.notifications.permissions.canCreateNotifications.value
            ])"
            type="primary"
            class="govuk-!-margin-right-3 govuk-!-top-3"
            :action="send"
          >
            {{ buttonText }}
          </ActionButton>
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
import { functions } from '@/firebase';
import permissionMixin from '@/permissionMixin';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';

export default {
  name: 'CharacterChecksRequests',
  components: {
    ActionButton,
  },
  mixins: [permissionMixin],
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
  emits: ['close', 'confirmed', 'setmessage', 'reset'],
  data() {
    return {
      processing: false,
    };
  },
  computed: {
    numberOfCandidates() {
      return this.selectedItems.length;
    },
    typeOfEmail() {
      return this.type;
    },
    buttonText() {
      return `I confirm, please send ${this.type}`;
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
    async updateApplicationRecord(status) {
      await this.$store.dispatch('characterChecks/updateStatus', {
        selectedItems: this.selectedItems,
        newStatus: status,
      });
    },
    async send() {
      try {
        const response = await functions.httpsCallable('sendCharacterCheckRequests')({
          items: this.selectedItems,
          type: this.type,
          exerciseMailbox: this.exerciseMailbox,
          exerciseManagerName: this.exerciseManagerName,
          dueDate: this.dueDate,
        });
        if (response === false) {
          this.$emit('setmessage', false, 'warning');
        } else {
          if (this.type === 'request') {
            this.updateApplicationRecord('requested');
          }
          if (this.type === 'reminder') {
            this.updateApplicationRecord('reminder sent');
          }
          this.$emit('setmessage', true, this.type, 'success');
          return true;
        }
      } catch (error) {
        this.$emit('setmessage', false, this.type, 'warning');
      }
      this.closeModal();
      this.$emit('reset');
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
