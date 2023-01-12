<template>
  <div class="late-application">
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Late Application Request
    </div>
    <div class="modal__message govuk-body-l modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <LoadingMessage
          v-if="isLoading"
          :load-failed="loadFailed"
        />

        <div v-else-if="message">
          <p class="govuk-body">
            An application has been created for the following candidate: <br><br>
            <strong>{{ message.lateApplicationResponse.exerciseName }}</strong><br>
            {{ message.lateApplicationResponse.candidateName }}<br>
            {{ message.lateApplicationResponse.candidateEmail }}
          </p>
          <p class="govuk-body">
            Please update the application with an extension deadline and inform the candidate.
          </p>
          <button
            class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
            @click="close"
          >
            Close
          </button>
          <button
            class="govuk-button"
            @click="openDraftApplication"
          >
            Open Application
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
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      loadFailed: false,
    };
  },
  computed: {
    // approvedMessages() {
    //   return this.responseMessages.filter(item => {
    //     return item.lateApplicationResponse.decision && item.lateApplicationResponse.decision === 'approved';
    //   });
    // },
    // responseMessages() {
    //   return this.$store.getters['lateApplicationResponseMsg/getMessages'];
    // },
    // currentApprovedMessage() {
    //   return this.approvedMessages.length ? this.approvedMessages[0] : null;
    // },
    // messageId() {
    //   if (this.currentApprovedMessage) {
    //     return this.currentApprovedMessage.id;
    //   }
    //   return null;
    // },
    messageId() {
      return this.message.id;
    },
    applicationId() {
      if (this.message) {
        return this.message.lateApplicationResponse.applicationId;
      }
      return null;
    },
    exerciseId() {
      if (this.message) {
        return this.message.lateApplicationResponse.exerciseId;
      }
      return null;
    },
    reason() {
      if (this.message) {
        return this.message.lateApplicationResponse.reason;
      }
      return '';
    },
  },
  methods: {
    // markResponseMessageAsRead() {
    //   return this.$store.dispatch('lateApplicationResponseMsg/markAsRead', this.messageId);
    // },
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
          //await this.markResponseMessageAsRead();

          console.log('Calling markAsRead from ApprovalConfirmation');

          this.$emit('read', true);

          //this.closeIfNoMoreMessages();
          this.isLoading = false;
          //this.$emit('close');
        }
        catch (e) {
          this.loadFailed = true;
        }
      }, 2000);
    },
    // closeIfNoMoreMessages() {
    //   if (this.approvedMessages.length === 0) {
    //     this.$emit('close');
    //   }
    //   else {
    //     this.isLoading = false;
    //   }
    // },
  },
};
</script>

<style>
  .late-application .modal__title {
    color: #ffffff;
  }
</style>
