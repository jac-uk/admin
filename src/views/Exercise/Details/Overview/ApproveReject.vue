<template>
  <div class="background-light-grey govuk-!-padding-left-4 govuk-!-padding-top-4 govuk-!-padding-bottom-4 govuk-!-margin-bottom-4">
    <div class="govuk-warning-text govuk-!-margin-0">
      <span
        class="govuk-warning-text__icon"
        aria-hidden="true"
      >!</span>
      <strong class="govuk-warning-text__text">
        <span class="govuk-warning-text__assistive">Warning</span>
        This exercise is waiting for your approval.
      </strong>
      
      <div class="govuk-!-padding-left-8">
        <p>Please verify the content of the exercise and Approve or Reject.</p>
        <div>
          <button
            :disabled="!isReadyForApprovalFromAdvertType"
            class="govuk-button govuk-button--warning govuk-!-margin-right-3 govuk-!-margin-bottom-0"
            @click="reject"
          >
            Reject
          </button>
          <button
            :disabled="!isReadyForApprovalFromAdvertType"
            class="govuk-button govuk-!-margin-bottom-0"
            @click="approve"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import permissionMixin from '@/permissionMixin';
import { isReadyForApprovalFromAdvertType } from '@/helpers/exerciseHelper';
import { mapState } from 'vuex';
export default {
  name: 'ApproveReject',
  mixins: [permissionMixin],
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
      displayName: state => state.auth.currentUser.displayName,
    }),
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isReadyForApprovalFromAdvertType() {
      return isReadyForApprovalFromAdvertType(this.exercise);
    },
  },
  methods: {
    async approve() {
      await this.$store.dispatch('exerciseDocument/updateApprovalProcess', {
        userId: this.userId,
        userName: this.displayName,
        decision: 'approved',
      });

    },
    reject() {
      this.$emit('reject');
    },
  },
};
</script>
