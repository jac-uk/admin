<template>
  <div class="govuk-!-margin-right-3 govuk-!-margin-left-3">
    <template v-if="isReadyForApproval">
      <RejectionForm
        v-if="canApproveExercise && showRejectionForm"
        @confirmReject="confirmReject"
        @cancelReject="cancelReject"
      />

      <ApproveReject
        v-else-if="canApproveExercise"
        @reject="reject"
      />

      <ApprovalCheckMessage
        v-else-if="canUpdateExercises"
      />
    </template>

    <template v-else-if="isApprovalRejected">
      <SimpleBannerDetails
        v-if="canApproveExercise"
        :title="rejectionText"
      >
        {{ rejectionReason }}
      </SimpleBannerDetails>

      <WarningDetails
        v-else-if="canUpdateExercises"
        title="This exercise was not approved by senior leaders. Please resubmit for approval."
      >
        {{ rejectionReason }}
      </WarningDetails>
    </template>

    <SimpleBanner
      v-else-if="canApproveExercise && isApproved"
      :text="approvalText"
    />
  </div>
</template>
<script>
import permissionMixin from '@/permissionMixin';
import { isReadyForApproval, isApprovalRejected, isApproved } from '@/helpers/exerciseHelper';
import ApproveReject from '@/views/Exercise/Details/Overview/ApproveReject';
import ApprovalCheckMessage from '@/views/Exercise/Details/Overview/ApprovalCheckMessage';
import WarningDetails from '@/components/Micro/WarningDetails';
import SimpleBanner from '@/components/Micro/SimpleBanner';
import SimpleBannerDetails from '@/components/Micro/SimpleBannerDetails';
import RejectionForm from '@/views/Exercise/Details/Overview/RejectionForm';
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'ApprovalProcess',
  components: {
    ApproveReject,
    ApprovalCheckMessage,
    WarningDetails,
    RejectionForm,
    SimpleBanner,
    SimpleBannerDetails,
  },
  mixins: [permissionMixin],
  data() {
    return {
      showRejectionForm: false,
    };
  },
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
    }),
    ...mapGetters({
      getApproval: 'exerciseDocument/_approval',
    }),
    rejectionReason() {
      const approval = this.getApproval;
      return (approval && approval.rejected) ? approval.rejected.message : '';
    },
    approver() {
      const approval = this.getApproval;
      if (approval && this.isApproved) {
        const approverIsAuth = this.userId === approval.approved.user.id;
        return approverIsAuth ? 'you' : approval.approved.user.name;
      }
      return '';
    },
    rejecter() {
      const approval = this.getApproval;
      return (approval && this.isApprovalRejected) ? approval.rejected.user.name : '';
    },
    approvalText() {
      return `This exercise was approved by ${this.approver}`;
    },
    rejectionText() {
      return `This exercise was rejected by ${this.rejecter}`;
    },
    canUpdateExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canUpdateExercises.value]);
    },
    canApproveExercise() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canApproveExercise.value]);
    },
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    isReadyForApproval() {
      return isReadyForApproval(this.exercise);
    },
    isApprovalRejected() {
      return isApprovalRejected(this.exercise);
    },
    isApproved() {
      return isApproved(this.exercise);
    },
  },
  methods: {
    reject() {
      this.showRejectionForm = true;
    },
    cancelReject() {
      this.showRejectionForm = false;
    },
    confirmReject() {
      this.showRejectionForm = false;
    },
  },
};
</script>
