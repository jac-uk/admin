<template>
  <div class="modal__title govuk-!-padding-2 govuk-heading-m">
    Raise A Support Issue With This Page
    <a
      class="close-link"
      @click="closeFeedbackModal(true)"
    >x</a>
  </div>
  <div class="modal__content govuk-!-margin-6">
    <div class="govuk-grid-row">
      <div
        v-if="showConfirmationModal"
        class="body-content modal__message govuk-body-l"
      >
        <div>Your feedback has been forwarded to the team and you will be contacted shortly.</div>
        <div class="govuk-!-margin-top-2">
          Your ticket number is: <strong>{{ bugReportRefNo }}</strong>
        </div>
      </div>
      <FeedbackForm
        v-else
        @close="closeFeedbackModal(false)"
        @success="showConfirmationModal = true"
      />
    </div>
  </div>
</template>

<script>
import FeedbackForm from '@/components/Feedback/FeedbackForm.vue';
export default {
  name: 'UserFeedbackModal',
  components: {
    FeedbackForm,
  },
  emits: ['close'],
  data() {
    return {
      showConfirmationModal: false,
    };
  },
  computed: {
    bugReport() {
      return this.$store.state.bugReport.record;
    },
    bugReportRefNo() {
      return this.bugReport ? this.bugReport.referenceNumber : '';
    },
  },
  methods: {
    async closeFeedbackModal(resetConfirmation) {
      this.$emit('close');
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
    isElementVisible(el) {
      const rect     = el.getBoundingClientRect(),
            vWidth   = window.innerWidth || document.documentElement.clientWidth,
            vHeight  = window.innerHeight || document.documentElement.clientHeight,
            efp      = function (x, y) { return document.elementFromPoint(x, y); };

      // Return false if it's not in the viewport
      if (rect.right < 0 || rect.bottom < 0
        || rect.left > vWidth || rect.top > vHeight)
        return false;

      // Return true if any of its four corners are visible
      return (
        el.contains(efp(rect.left,  rect.top))
        ||  el.contains(efp(rect.right, rect.top))
        ||  el.contains(efp(rect.right, rect.bottom))
        ||  el.contains(efp(rect.left,  rect.bottom))
      );
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss">
/**
* Important that this style block is not 'scoped' so that the .modal definition below applies to the modal in the sub component
*/
.modal {
  width: 620px !important;
  min-width: unset !important;
  text-align: left !important;
}
.modal__content  {
  text-align: left !important;
}
.modal__title {
  text-align: left;
  vertical-align: middle;
  border: solid 2px #1d70b8;
  background-color: #1d70b8;
  color: white;
}
.modal__message {
  vertical-align: middle;
}
.deny {
  background-color: #f3f2f1;
}
.close-link {
  position: absolute;
  right: 15px;
  cursor: pointer;
}
</style>
