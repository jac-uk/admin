<template>
  <div class="background-light-grey govuk-!-margin-bottom-4 govuk-!-padding-4">
    <div class="govuk-warning-text">
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        Your are rejecting an exercise
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
        @click="$emit('setApprovalDecision', null)"
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
</template>
<script>
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
export default {
  name: 'RejectionForm',
  components: { TextareaInput },
  data() {
    return {
      rejectionReason: '',
    };
  },
  computed: {
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
    async confirmReject() {
      await this.$store.dispatch('exerciseDocument/save', {
        state: 'draft',
        rejection_reason: this.rejectionReason,
      });
      this.$emit('setApprovalDecision', true);
    },
  },
};
</script>
