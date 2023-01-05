<template>
  <div class="late-application">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Request a Late Application to a Closed Exercise
      </div>
      <div class="modal__message govuk-body-l modal__content govuk-!-margin-6">
        <div class="govuk-grid-row">

          <div v-if="showRejectionForm">
            <ErrorSummary
              :errors="errors"
            />
            <form @submit.prevent="validateAndSave">
              <p>
                <TextArea
                  id="rejection-reason"
                  v-model="rejectionReason"
                  class="govuk-!-margin-top-7"
                  label="Rejection Reason"
                  required
                />
              </p>
              <button
                type="button"
                class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
                @click="cancelReject"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="govuk-button govuk-button--warning"
              >
                Reject
              </button>
            </form>
          </div>
          <div v-else-if="showApprovalConfirmation">
            <p>
              You approved a late application for the candidate:
            </p>
            <p class="govuk-!-font-weight-bold" v-if="approvedRequestMessage">
              {{ approvedRequestMessage.lateApplicationRequest.candidateName }}<br />
              {{ approvedRequestMessage.lateApplicationRequest.candidateEmail }}<br />
              {{ approvedRequestMessage.lateApplicationRequest.exerciseName }}
            </p>
            <button
                type="button"
                class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
                @click="closeIfNoMoreMessages"
              >
                Close
              </button>
          </div>
          <div v-else>
            <p>
              You received a request to approve a late application for the candidate:
            </p>
            <template v-if="currentRequestMessage">
              <p class="govuk-!-font-weight-bold">
                {{ currentRequestMessage.lateApplicationRequest.candidateName }}<br />
                {{ currentRequestMessage.lateApplicationRequest.candidateEmail }}<br />
                {{ currentRequestMessage.lateApplicationRequest.exerciseName }}
              </p>
              <p>
                {{ currentRequestMessage.lateApplicationRequest.reason }}
              </p>
              <button
                class="govuk-button govuk-!-margin-right-3"
                @click="approve"
              >
                Approve
              </button>
              <button
                class="govuk-button govuk-button--warning govuk-!-margin-right-3"
                @click="reject"
              >
                Reject
              </button>
            </template>

          </div>
        </div>
      </div>
    </div>
</template>
<script>
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import TextArea from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import clone from 'clone';

export default {
  name: 'Approval',
  components: {
    ErrorSummary,
    TextArea,
  },
  extends: Form,
  data() {
    return {
      errors: [],
      showRejectionForm: false,
      showApprovalConfirmation: false,
      rejectionReason: '',
      approvedRequestMessage: null,
    };
  },
  computed: {
    requestMessages() {
      return this.$store.getters['lateApplicationRequestMsg/getMessages'];
    },
    currentRequestMessage() {
      return this.requestMessages.length ? this.requestMessages[0] : null;
    },
    messageId() {
      if (this.currentRequestMessage) {
        return this.currentRequestMessage.id;
      }
      return null;
    },
    applicationId() {
      return this.$store.state.application.record ? this.$store.state.application.record.id : null;
    },
  },
  methods: {
    markRequestMessageAsRead() {
      return this.$store.dispatch('lateApplicationRequestMsg/markAsRead', this.messageId);
    },
    createResponseMessage(d) {
      const data = {
        requester: {
          fullName: this.$store.getters['auth/getDisplayName'],
          email: this.$store.getters['auth/getEmail'],
        },
        requestMessage: this.currentRequestMessage,
        decision: d.decision ? 'approved' : 'rejected',
      };
      if (d.rejectionReason) {
        data.rejectionReason = d.rejectionReason;
      }
      else if (d.applicationId) {
        data.applicationId = d.applicationId;
      }
      return this.$store.dispatch('lateApplicationResponseMsg/create', data);
    },
    async createDraftApplication() {
      return this.$store.dispatch(
        'application/createDraft', {
          exerciseId: this.currentRequestMessage.lateApplicationRequest.exerciseId,
          exerciseName: this.currentRequestMessage.lateApplicationRequest.exerciseName,
          exerciseRef: this.currentRequestMessage.lateApplicationRequest.exerciseRef,
          candidateId: this.currentRequestMessage.lateApplicationRequest.candidateId,
          candidateEmail: this.currentRequestMessage.lateApplicationRequest.candidateEmail,
          candidateFullname: this.currentRequestMessage.lateApplicationRequest.candidateName,
        }
      );
    },
    async approve() {
      // Store the request msg details in an object so they can be redisplayed once the request message status has changed
      this.approvedRequestMessage = clone(this.currentRequestMessage);

      await this.createDraftApplication();
      await this.createResponseMessage({
        decision: true,
        applicationId: this.applicationId,
      });

      // Reset the application record otherwise subsequent draft applications wont get created
      await this.$store.dispatch('application/unbind');

      this.showApprovalConfirmation = true;
      await this.markRequestMessageAsRead();
    },
    async reject() {
      this.showRejectionForm = true;
    },
    cancelReject() {
      this.reset();
    },
    async save() {
      // Reject
      await this.createResponseMessage({
        decision: false,
        rejectionReason: this.rejectionReason,
      });

      await this.markRequestMessageAsRead();
      this.closeIfNoMoreMessages();
      this.reset();
    },
    reset() {
      this.showApprovalConfirmation = false;
      this.showRejectionForm = false;
      this.rejectionReason = '';
    },
    async closeIfNoMoreMessages() {
      if (this.requestMessages.length === 0) {
        this.$emit('close');
      }
      else {
        this.reset();
      }
    },
  },
};
</script>

<style>
  .late-application .modal__title {
    color: #ffffff;
  }
</style>
