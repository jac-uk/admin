<template>
  <div class="background-light-grey govuk-!-margin-bottom-4 govuk-!-padding-4">
    <div class="govuk-warning-text govuk-!-margin-0">
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        This exercise is waiting for your approval
      </strong>
      <p>Please verify the content of the exercise and Approve or Reject.</p>
      <div>
        <button
          :disabled="!isReadyForApprovalFromAdvertType"
          class="govuk-button govuk-button--warning govuk-!-margin-right-3"
          @click="$emit('setApprovalDecision', false)"
        >
          Reject
        </button>
        <button
          :disabled="!isReadyForApprovalFromAdvertType"
          class="govuk-button"
          @click="approve"
        >
          Approve
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import permissionMixin from '@/permissionMixin';
import { isReadyForApprovalFromAdvertType } from '@/helpers/exerciseHelper';
export default {
  name: 'ApproveReject',
  mixins: [permissionMixin],
  computed: {
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isReadyForApprovalFromAdvertType() {
      return isReadyForApprovalFromAdvertType(this.exercise);
    },
  },
  methods: {
    async approve() {
      await this.$store.dispatch('exerciseDocument/approve');
      this.$emit('setApprovalDecision', true);
    },
  },
};
</script>
