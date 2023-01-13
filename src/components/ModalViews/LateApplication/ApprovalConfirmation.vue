<template>
  <div class="late-application">
    <div class="modal__title govuk-!-padding-2 govuk-heading-m">
      Late Application Request
    </div>
    <div class="modal__message govuk-body-l modal__content govuk-!-margin-6">
      <div class="govuk-grid-row">
        <div if="message">
          <template v-if="decision === 'rejected'">
            <p class="govuk-body">
              An application has been rejected for the following candidate: <br /><br />
              <strong>{{ message.lateApplicationResponse.exerciseName }}</strong><br />
              {{ message.lateApplicationResponse.candidateName }}<br>
              {{ message.lateApplicationResponse.candidateEmail }}
            </p>
            <p class="govuk-body">
              For the following reason: <br /><br />
              {{ rejectionReason }}
            </p>
            <button
              class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
              @click="close"
            >
              Close
            </button>
          </template>
          <template v-else-if="decision === 'approved'">
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
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ApprovalConfirmation',
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
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
    decision() {
      if (this.message) {
        return this.message.lateApplicationResponse.decision;
      }
      return '';
    },
    reason() {
      if (this.message) {
        return this.message.lateApplicationResponse.reason;
      }
      return '';
    },
    rejectionReason() {
      if (this.message && this.message.lateApplicationResponse.rejectionReason) {
        return this.message.lateApplicationResponse.rejectionReason;
      }
      return '';
    },
  },
  methods: {
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
      this.$emit('read', true);
    },
  },
};
</script>
