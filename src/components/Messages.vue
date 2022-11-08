<template>
  <Modal ref="modalLateApplication">
    <div class="late-application">
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Request a Late Application to a Closed Exercise
      </div>
      <div class="modal__content govuk-!-margin-6">
        <div class="govuk-grid-row">
          <ErrorSummary
            :errors="errors"
          />
          <div v-if="state === 'start'">
            <p>
              You received a request to approve a late application for the candidate:
            </p>
            <p class="govuk-!-font-weight-bold" v-html="userDetails()" />
            <p>
              <RouterLink
                :to="{ name: 'exercise-overview', params: { id: messageToShow() && messageToShow().exerciseId } }"
              >
                {{ messageToShow() && (messageToShow().exerciseName || 'Exercise') }}
              </RouterLink><br>
              {{ messageToShow() && messageToShow().reason }}<br>
            </p>

            <button
              class="govuk-button govuk-!-margin-right-3"
              @click="actionApprove"
            >
              Approve
            </button>
            <button
              class="govuk-button govuk-button--warning govuk-!-margin-right-3"
              @click="actionReject"
            >
              Reject
            </button>
          </div>
          <div v-if="state === 'approved' ">
            <p>You approved a late application for:</p>
            <p class="govuk-!-font-weight-bold" v-html="userDetails()" />
          </div>
          <div v-if="state === 'approve' ">
            <p>Your approved late application is being processed:</p>
            <p class="govuk-!-font-weight-bold" v-html="userDetails()" />
          </div>
          <div v-if="state === 'reject' ">
            <div class="govuk-heading-m">
              Reject a late application
            </div>
            <p class="" v-html="userDetails()" />
          </div>
          <div v-if="state === 'rejected' ">
            <p>You rejected a late application:</p>
            <p class="govuk-!-font-weight-bold" v-html="userDetails()" />
            <p>{{ messageToShow() && messageToShow().reason }}</p>
          </div>
          <p>
            <button
              class="govuk-button govuk-button--secondary"
              @click="closeModal('modalLateApplication')"
            >
              Close
            </button>
          </p>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';

export default {
  name: 'Messages',
  components: {
    Modal,
    ErrorSummary,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      errors: [],
      formData: {},
      state: 'start', // start, approve, approved, reject, rejected
    };
  },
  computed: {
    messagesList() {
      const localMessages = this.$store.state.messages.records;
      console.log('localMessages', localMessages);
      return localMessages || [];
    },
  },
  async created() {
    const data = {
      type: this.type,
    };
    console.log('created data', data);
    await this.$store.dispatch('messages/bind', data )
      .then(
        () => {
          if (this.messagesList && this.checkIfShowMessage()) {
            this.openModal('modalLateApplication');
          }
        }
      );
  },
  methods: {
    checkIfShowMessage() {
      // Add the permissions to show message
      // check the criteria - by group or by person
      return true;
    },
    messageToShow() {
      let messageToShow = {};
      messageToShow = this.messagesList[0] && this.messagesList[0].lateApplicationRequests;
      return messageToShow;
    },
    openModal(modalRef){
      if (this.$refs[modalRef]) {
        this.$refs[modalRef].openModal();
      }
    },
    closeModal(modalRef) {
      this.formData = {};
      this.errors = [];
      this.$refs[modalRef].closeModal();
    },
    actionApprove() {
      this.state = 'approve';
      console.log('actionApprove', this.state);
      this.actionsToApprove();
    },
    actionsToApprove() {
      // actions taken offline after the approval:
      //  creates a draft
      //  optional: create a note
      this.state = 'approved';
    },
    actionReject() {
      this.state = 'reject';
      console.log('actionReject', this.state);
    },
    userDetails() {
      const userDetails = this.messageToShow();
      return `
        ${ userDetails && (userDetails.fullName || userDetails.name || '') }<br>
        ${ userDetails && (userDetails.email || '') }<br>
      `;
    },
  },
};
</script>

<style>
  .late-application .modal__title {
    color: #ffffff;
  }
</style>
