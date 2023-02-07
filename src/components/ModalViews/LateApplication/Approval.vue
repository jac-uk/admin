<template>
  <div class="late-application">
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Late Application Request
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
          <p class="govuk-body">
            You approved a late application for the candidate:
          </p>
          <p
            v-if="approvedRequestMessage"
            class="govuk-body"
          >
            <strong>{{ approvedRequestMessage.lateApplicationRequest.exerciseName }}</strong><br>
            {{ approvedRequestMessage.lateApplicationRequest.candidateName }}<br>
            {{ approvedRequestMessage.lateApplicationRequest.candidateEmail }}<br>
          </p>
          <button
            type="button"
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="close"
          >
            Close
          </button>
        </div>
        <div v-else>
          <p class="govuk-body">
            You have received a request to approve a late application for the following candidate:
          </p>
          <template v-if="message">
            <p class="govuk-body">
              <strong>{{ message.lateApplicationRequest.exerciseName }}</strong><br>
              {{ message.lateApplicationRequest.candidateName }}<br>
              {{ message.lateApplicationRequest.candidateEmail }}<br>
            </p>
            <p class="govuk-body">
              {{ message.lateApplicationRequest.reason }}
            </p>
            <button
              class="govuk-button govuk-button--warning govuk-!-margin-right-3"
              @click="reject"
            >
              Reject
            </button>
            <button
              class="govuk-button"
              @click="approve"
            >
              Approve
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
  props: {
    message: {
      type: Object,
      default: null,
    },
  },
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
    messageId() {
      return this.message.id;
    },
    applicationId() {
      return this.$store.state.application.record ? this.$store.state.application.record.id : null;
    },
  },
  methods: {
    createResponseMessage(d) {
      const data = {
        requester: {
          fullName: this.$store.getters['auth/getDisplayName'],
          email: this.$store.getters['auth/getEmail'],
        },
        requestMessage: this.message,
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
          exerciseId: this.message.lateApplicationRequest.exerciseId,
          exerciseName: this.message.lateApplicationRequest.exerciseName,
          exerciseRef: this.message.lateApplicationRequest.exerciseRef,
          candidateId: this.message.lateApplicationRequest.candidateId,
          candidateEmail: this.message.lateApplicationRequest.candidateEmail,
          candidateFullname: this.message.lateApplicationRequest.candidateName,
        }
      );
    },
    async approve() {
      // Store the request msg details in an object so they can be redisplayed once the request message status has changed
      this.approvedRequestMessage = clone(this.message);
      await this.createDraftApplication();
      await this.createResponseMessage({
        decision: true,
        applicationId: this.applicationId,
      });
      // Reset the application record otherwise subsequent draft applications wont get created
      await this.$store.dispatch('application/unbind');
      this.showApprovalConfirmation = true;
      // We send a false flag below to prevent the modal from closing as there is a confirmation msg being displayed first!
      this.$emit('read', false);
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
      this.$emit('read', true);
      this.reset();
    },
    reset() {
      this.showApprovalConfirmation = false;
      this.showRejectionForm = false;
      this.rejectionReason = '';
    },
    close() {
      this.$emit('close', true);
      this.reset();
    },
  },
};
</script>
