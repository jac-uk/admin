<template>
  <div>
    <button
      class="user-feedback-link"
      type="button"
      @click="openModal"
    >
      Raise A Support Issue With This Page
    </button>
    <Modal
      ref="feedbackModal"
    >
      <SimpleModalInner
        title="Support Issue Form"
        message="Fill in the form below to raise a support issue about this page"
      >
        <FeedbackForm
          @close="closeFeedbackModal"
          @success="openConfirmationModal"
        />
      </SimpleModalInner>
    </Modal>

    <Modal
      ref="confirmFeedbackModal"
    >
      <ModalInner
        title="Confirm Feedback"
        message="Your feedback has been forwarded to the team and you will be contacted shortly."
        button-text="Close"
        :cancelable="false"
        @confirmed="closeConfirmFeedbackModal"
        @close="closeConfirmFeedbackModal"
      />
    </Modal>
  </div>
</template>

<script>
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';

// @TODO: Preload as many details as possible

// @TODO: MOVE THIS INTO THE JAC-KIT ??
import SimpleModalInner from '@/components/Feedback/SimpleModalInner.vue';
import FeedbackForm from '@/components/Feedback/FeedbackForm.vue';

export default {
  name: 'UserFeedbackLink',
  components: {
    Modal,
    ModalInner,
    SimpleModalInner,
    FeedbackForm,
  },
  methods: {
    openModal() {
      this.$refs.feedbackModal.openModal();
    },
    closeFeedbackModal() {
      this.$refs.feedbackModal.closeModal();
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

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.user-feedback-link {
  position: fixed;
  top: 20px;
  right: 0;
  padding: 10px;
  background-color: #fff7bf;
  border-left: 1px solid black;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-right: none;
}
</style>
