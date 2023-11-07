<template>
  <div class="govuk-!-margin-right-3 govuk-!-margin-left-3">
    <Banner
      v-if="notPublishedDuringApplicationWindow"
      message="This exercise is currently within the application window and is not published on the website."
      status="warning"
    />

    <Banner
      v-if="isApproved && !isPublished && !isArchived && (canUpdateExercises && canPublishExercises)"
      message="This exercise has been approved. Now you can publish it to the website."
      status="success"
    />
    <template v-if="isReadyForApproval">
      <RejectionForm
        v-if="canApproveExercise && showRejectionForm"
        @confirm-reject="confirmReject"
        @cancel-reject="cancelReject"
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
      <WarningDetails
        v-if="canApproveExercise"
        :title="rejectionText"
      >
        {{ rejectionReason }}
      </WarningDetails>

      <WarningDetails
        v-else-if="canUpdateExercises"
        title="This exercise was not approved by the senior leaders. Please resubmit for approval."
      >
        {{ rejectionReason }}
      </WarningDetails>
    </template>

    <SimpleBanner
      v-else-if="canApproveExercise && isApproved"
      :text="approvalText"
      style="margin-bottom: 0;"
    />

    <div :class="`govuk-!-margin-bottom-4 govuk-!-padding-4 govuk-!-font-size-27 ${isArchived ? 'background-red' : 'background-blue'}`">
      <span class="display-block govuk-!-font-size-27 govuk-!-margin-top-1 float-right">
        {{ isPublished ? 'Published' : 'Unpublished' }}
      </span>
      <span class="display-block govuk-!-font-size-27 govuk-!-margin-top-1">
        {{ $filters.lookup(exercise.state) }}
      </span>
      <div>
        <button
          v-if="!isArchived && canUpdateExercises && canAmendAfterLaunch && isApproved"
          class="govuk-button govuk-button--secondary govuk-!-margin-top-4 govuk-!-margin-bottom-0"
          @click="openUnlockExerciseModal"
        >
          Unlock to edit
        </button>
      </div>
    </div>

    <Modal ref="unlockExerciseModal">
      <ModalInner
        title="Unlock to edit the exercise"
        message="Please be aware that the exercise will be open and editable, and removed from the apply website if you unlock it. And it will need to be sent for approval to be published."
        button-text="I confirm, please unlock the exercise"
        @close="closeUnlockExerciseModal"
        @confirmed="unlock"
      />
    </Modal>
  </div>
</template>

<script>
import permissionMixin from '@/permissionMixin';
import { isReadyForApproval, isApprovalRejected, isApproved, isArchived } from '@/helpers/exerciseHelper';
import ApproveReject from '@/views/Exercise/Details/Overview/ApproveReject.vue';
import ApprovalCheckMessage from '@/views/Exercise/Details/Overview/ApprovalCheckMessage.vue';
import WarningDetails from '@/components/Micro/WarningDetails.vue';
import SimpleBanner from '@/components/Micro/SimpleBanner.vue';
import RejectionForm from '@/views/Exercise/Details/Overview/RejectionForm.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner.vue';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ApprovalProcess',
  components: {
    ApproveReject,
    ApprovalCheckMessage,
    WarningDetails,
    RejectionForm,
    SimpleBanner,
    Modal,
    ModalInner,
    Banner,
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
    canPublishExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canPublishExercise.value]);
    },
    approver() {
      const approval = this.getApproval;
      if (approval && approval.approved && this.isApproved) {
        const approverIsAuth = this.userId === approval.approved.user.id;
        return approverIsAuth ? 'you' : approval.approved.user.name;
      }
      return '';
    },
    rejecter() {
      const approval = this.getApproval;
      return (approval && this.isApprovalRejected) ? approval.rejected.user : '';
    },
    approvalText() {
      return `This exercise was approved by ${this.approver}.`;
    },
    rejectionText() {
      if (this.rejecter && this.rejecter.id === this.$store.state.auth.currentUser.uid)
        return 'You are rejecting an exercise.';
      return `This exercise was rejected by ${this.rejecter.name}`;
    },
    canUpdateExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canUpdateExercises.value]);
    },
    canAmendAfterLaunch() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canAmendAfterLaunch.value]);
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
    isArchived() {
      return isArchived(this.exercise);
    },
    isPublished() {
      return this.exercise.published;
    },
    notPublishedDuringApplicationWindow() {
      return !this.exercise.published && (new Date() > new Date(this.exercise.applicationOpenDate) && new Date() < new Date(this.exercise.applicationCloseDate));
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
    openUnlockExerciseModal() {
      this.$refs.unlockExerciseModal.openModal();
    },
    closeUnlockExerciseModal() {
      this.$refs.unlockExerciseModal.closeModal();
    },
    unlock() {
      this.$store.dispatch('exerciseDocument/unlock');
      this.closeUnlockExerciseModal();
    },
  },
};
</script>

<style>
.modal__message {
  text-align: center;
}
</style>
