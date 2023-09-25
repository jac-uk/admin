<template>
  <div>
    <!-- <button
      class="user-feedback-link"
      type="button"
      @click="openModal"
    >
      Raise A Support Issue With This Page
    </button> -->

    <a
      class="user-feedback-link"
      title="User Feedback"
      alt="User Feedback"
      @click="openModal"
    >
      <img
        src="@/assets/report-error-icon.svg"
        style="width: 30px"
      >
    </a>

    <Modal
      ref="feedbackModal"
      data-html2canvas-ignore
      class="fixed-width-modal"
    >
      <SimpleModalInner
        title="Raise A Support Issue With This Page"
        @close="closeFeedbackModal(true)"
      >
        <div
          v-if="showConfirmationModal"
          class="body-content modal__message govuk-body-l"
        >
          <div>Your feedback has been forwarded to the team and you will be contacted shortly.</div>
          <div class="govuk-!-margin-top-2">
            Your ticket number is: <strong>ABC123</strong>
          </div>
        </div>
        <!-- <FeedbackForm
          v-else
          @close="closeFeedbackModal"
          @success="showConfirmationModal = true"
        /> -->
        <FeedbackForm
          v-else
          @close="closeFeedbackModal(false)"
          @success="showConfirmationModal = true"
        />
      </SimpleModalInner>
    </Modal>

    <!-- <Modal
      ref="confirmFeedbackModal"
    >
      <ModalInner
        title="Confirm Feedback"
        button-text="Close"
        :cancelable="false"
        @confirmed="closeConfirmFeedbackModal"
        @close="closeConfirmFeedbackModal"
      >
        <template #body>
          <div class="body-content modal__message govuk-body-l">
            <div>Your feedback has been forwarded to the team and you will be contacted shortly.</div>
            <div class="govuk-!-margin-top-2">
              Your ticket number is: <strong>ABC123</strong>
            </div>
          </div>
        </template>
      </ModalInner>
    </Modal> -->
  </div>
</template>

<script>
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';

//import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';

// @TODO: Preload as many details as possible

// @TODO: MOVE THIS INTO THE JAC-KIT ??
import SimpleModalInner from '@/components/Feedback/SimpleModalInner.vue';
import FeedbackForm from '@/components/Feedback/FeedbackForm.vue';

export default {
  name: 'UserFeedbackLink',
  components: {
    Modal,
    //ModalInner,
    SimpleModalInner,
    FeedbackForm,
  },
  data() {
    return {
      uniqueTicketNumber: null,

      showConfirmationModal: false,
    };
  },
  computed: {
    confirmationMessage() {
      return `Your feedback has been forwarded to the team and you will be contacted shortly. Your ticket number is: ${this.uniqueTicketNumber}`;
    },
  },
  mounted() {
    this.uniqueTicketNumber = 'ABC123';
  },
  methods: {
    openModal() {
      this.$refs.feedbackModal.openModal();
    },
    async closeFeedbackModal(resetConfirmation) {
      await this.$refs.feedbackModal.closeModal();
      if (resetConfirmation) {
        this.showConfirmationModal = false;
      }
    },
    openConfirmationModal() {
      this.$refs.feedbackModal.closeModal();
      this.$refs.confirmFeedbackModal.openModal();
    },
    closeConfirmFeedbackModal() {
      this.$refs.confirmFeedbackModal.closeModal();
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss">
/**
* Important that this style block is not 'scoped' so that the .modal definition below applies to the modal in the sub component
*/
.user-feedback-link {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 0;
  margin: 0;
  cursor: pointer;
}

.modal {
  width: 550px !important;
  min-width: unset !important;
}
</style>
