<template>
  <div class="late-application">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Request a Late Application to a Closed Exercise
      </div>
      <div class="modal__message govuk-body-l modal__content govuk-!-margin-6">
        <div class="govuk-grid-row">

          <LoadingMessage
            v-if="isLoading"
            :load-failed="loadFailed"
          />

          <div v-else-if="currentApprovedMessage">
            <p>
              The draft application for exercise: {{ currentApprovedMessage.lateApplicationResponse.exerciseName }}
            </p>
            <p>
              Was created for: {{ currentApprovedMessage.lateApplicationResponse.candidateName }}
            </p>
            <p>Please copy the email address to communicate the extension: {{ currentApprovedMessage.lateApplicationResponse.candidateEmail }}</p>
            <button
                class="govuk-button govuk-!-margin-right-3"
                @click="openDraftApplication"
              >
              Open Application
            </button>
            <button
              class="govuk-button govuk-button--warning govuk-!-margin-right-3"
              @click="close"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
</template>
<script>

import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage';

export default {
  name: 'ApprovalConfirmation',
  components: {
    LoadingMessage,
  },
  data() {
    return {
      isLoading: false,
      loadFailed: false,
    };
  },
  computed: {
    approvedMessages() {
      return this.responseMessages.filter(item => {
        return item.lateApplicationResponse.decision && item.lateApplicationResponse.decision === 'approved';
      });
    },
    responseMessages() {
      return this.$store.getters['lateApplicationResponseMsg/getMessages'];
    },
    currentApprovedMessage() {
      return this.approvedMessages.length ? this.approvedMessages[0] : null;
    },
    messageId() {
      if (this.currentApprovedMessage) {
        return this.currentApprovedMessage.id;
      }
      return null;
    },
    applicationId() {
      if (this.currentApprovedMessage) {
        return this.currentApprovedMessage.lateApplicationResponse.applicationId;
      }
      return null;
    },
    exerciseId() {
      if (this.currentApprovedMessage) {
        return this.currentApprovedMessage.lateApplicationResponse.exerciseId;
      }
      return null;
    },
    reason() {
      if (this.currentApprovedMessage) {
        return this.currentApprovedMessage.lateApplicationResponse.reason;
      }
      return '';
    },
  },
  methods: {
    markResponseMessageAsRead() {
      return this.$store.dispatch('lateApplicationResponseMsg/markAsRead', this.messageId);
    },
    openDraftApplication() {
      const route = this.$router.resolve({
        name: 'exercise-applications-application',
        params: {
          applicationId: this.applicationId,
          status: 'draft',
          id: this.exerciseId,
        },
        query: { reason: this.reason },
      });
      window.open(route.href, '_blank');
    },
    async close() {
      this.isLoading = true;
      setTimeout(async () => {
        try {
          await this.markResponseMessageAsRead();
          this.closeIfNoMoreMessages();
        }
        catch (e) {
          this.loadFailed = true;
        }
      }, 2000);
    },
    closeIfNoMoreMessages() {
      if (this.approvedMessages.length === 0) {
        this.$emit('close');
      }
      else {
        this.isLoading = false;
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
