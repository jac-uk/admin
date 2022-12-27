<template>
  <div class="govuk-!-margin-right-3 govuk-!-margin-left-3">

    <template v-if="isReadyForApproval">
      <RejectionForm
        v-if="canApproveExercise && approvalDecision === false"
        @setApprovalDecision="setApprovalDecision"
      />

      <ApproveReject
        v-else-if="canApproveExercise && approvalDecision === null"
        @setApprovalDecision="setApprovalDecision"
      />

      <ApprovalCheckMessage
        v-else-if="canUpdateExercises"
      />
    </template>

    <template v-else-if="isApprovalRejected">
      <SimpleBannerDetails
        v-if="canApproveExercise"
        title="This exercise was rejected by you."
      >
        {{ exercise.rejection_reason }}
      </SimpleBannerDetails>

      <WarningDetails
        v-else-if="canUpdateExercises"
        title="This exercise was not approved by senior leaders. Please resubmit for approval."
      >
        {{ exercise.rejection_reason }}
      </WarningDetails>
    </template>

    <SimpleBanner
      v-else-if="canApproveExercise && isApproved"
      text="This exercise was approved by you."
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
      approvalDecision: null,   // null|false|true
    };
  },
  computed: {
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
    setApprovalDecision(decision) {
      this.approvalDecision = decision;
    },
  },
};
</script>
