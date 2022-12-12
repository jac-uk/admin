<template>
  <div class="govuk-warning-text">
    <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
    <strong class="govuk-warning-text__text">
      <span class="govuk-warning-text__assistive">Warning</span>
      This exercise is waiting for your approval
    </strong>
    <p>Please verify the content of the exercise and Approve or Reject.</p>
    <div>
      <button
        :disabled="!isReadyForApprovalFromAdvertType"
        class="govuk-button govuk-!-margin-right-3"
        @click="approve"
      >
        Approve
      </button>
      <button
        :disabled="!isReadyForApprovalFromAdvertType"
        class="govuk-button govuk-button--warning govuk-!-margin-right-3"
        @click="$emit('setApprovalDecision', false)"
      >
        Reject
      </button>
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
