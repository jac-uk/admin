<template>
  <div>
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      {{ $filters.lookup(type) }} consent form {{ notificationType }}
    </div>
    <div class="modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <form
          ref="formRef"
        >
          <div class="govuk-!-margin-bottom-5">
            <span class="govuk-body-m">Before proceeding, please confirm that you wish to send a {{ notificationType }} to </span>
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
  name: 'CandidateFormNotification',
  components: {
    ActionButton,
  },
  mixins: [permissionMixin],
  props: {
    type: {
      type: String,
      required: true,
      default: '',
    },
    notificationType: {
      type: String,
      required: true,
      default: '',
    },
    selectedItems: {
      type: Array,
      required: false,
      default: () => [],
    },
    exercise: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'confirmed', 'setmessage', 'reset'],
  data() {
    return {
      processing: false,
    };
  },
  computed: {
    exerciseMailbox() {
      return this.exercise?.exerciseMailbox || '';
    },
    exerciseManagerName() {
      return this.exercise?.emailSignatureName || '';
    },
    numberOfCandidates() {
      return this.selectedItems.length;
    },
    buttonText() {
      return `I confirm, please send ${this.notificationType}`;
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
      try {
        const response = await functions.httpsCallable('sendCandidateFormNotifications')({
          type: this.type,
          notificationType: this.notificationType,
          items: this.selectedItems,
          exerciseMailbox: this.exerciseMailbox,
          exerciseManagerName: this.exerciseManagerName,
        });
        if (response === false) {
          this.$emit('setmessage', false, 'warning');
        } else {
          this.$emit('setmessage', true, this.notificationType, 'success');
        }
      } catch (error) {
        this.$emit('setmessage', false, this.notificationType, 'warning');
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
