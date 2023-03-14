<template>
  <div class="govuk-!-margin-bottom-3 background-light-grey govuk-!-padding-left-4 govuk-!-padding-right-4 govuk-!-padding-top-4">
    <div class="govuk-warning-text">
      <div>
        <span
          class="govuk-warning-text__icon"
          aria-hidden="true"
        >!</span>
        <strong class="govuk-warning-text__text">
          <span class="govuk-warning-text__assistive">Warning</span>
          You are rejecting an exercise
        </strong>
      </div>
      <TextareaInput
        id="rejection-reason"
        hint="Please give your reason for rejection"
        @input="validate"
      />
      <div>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="cancel"
        >
          Cancel
        </button>
        <button
          class="govuk-button govuk-button--warning"
          :disabled="!isValid"
          @click="confirmReject"
        >
          Reject
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import { mapState } from 'vuex';
export default {
  name: 'RejectionForm',
  components: { TextareaInput },
  emits: ['cancelReject', 'confirmReject'],
  data() {
    return {
      rejectionReason: '',
    };
  },
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
      displayName: state => state.auth.currentUser.displayName,
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isValid() {
      return this.rejectionReason ? true : false;
    },
  },
  methods: {
    validate(val) {
      this.rejectionReason = val;
    },
    cancel() {
      this.$emit('cancelReject');
    },
    async confirmReject() {
      this.$emit('confirmReject');
      await this.$store.dispatch('exerciseDocument/updateApprovalProcess', {
        userId: this.userId,
        userName: this.displayName,
        decision: 'rejected',
        rejectionReason: this.rejectionReason,
      });
    },
  },
};
</script>
