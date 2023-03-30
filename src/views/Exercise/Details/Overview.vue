<template>
  <div class="govuk-grid-row">
    <ApprovalProcess />

    <div class="govuk-grid-column-one-half">
      <div
        v-if="exercise.immediateStart"
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Number of vacancies
        </h2>
        <p class="govuk-body">
          Immediate start (S87)
          <span
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ exercise.immediateStart | formatNumber }}</span>
        </p>
      </div>

      <div
        v-if="totalApplications || hasOpened"
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2
          class="govuk-heading-l"
          @click="refreshApplicationCounts"
        >
          Number of applications
        </h2>
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-one-half">
            <p class="govuk-body">
              Draft
              <span class="govuk-heading-l govuk-!-margin-top-1">{{ draftApplications | formatNumber }}</span>
            </p>
          </div>
          <div class="govuk-grid-column-one-half">
            <p class="govuk-body">
              Applied
              <span class="govuk-heading-l govuk-!-margin-top-1">{{ appliedApplications | formatNumber }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-column-one-half">
      <div :class="`govuk-!-margin-bottom-6 govuk-!-padding-3 ${isArchived ? 'background-red' : 'background-blue'}`">
        <span v-if="isPublished">
          Published
        </span>
        <div
          v-if="isApproved"
          class="float-right"
        >
          <a
            v-if="canUpdateExercises"
            class="govuk-link"
            @click="changeState"
          >
            Change
          </a>
        </div>
        <span
          v-if="exercise.state"
          class="display-block govuk-!-font-size-27"
        >
          <!-- {{ exercise.state | lookup }} -->
          {{ exercise.state }}
        </span>
        <span
          v-else
          class="display-block govuk-!-font-size-27"
        >Draft</span>
      </div>
      <Timeline :data="timeline" />
      <RouterLink
        v-if="timeline && timeline.length"
        :to="{ name: 'exercise-details-timeline' }"
        class="govuk-link"
      >
        View timeline
      </RouterLink>
    </div>

    <div
      v-if="taskList && taskList.length"
      class="govuk-grid-column-full govuk-!-margin-top-5 govuk-!-margin-bottom-2"
    >
      <h2 class="govuk-heading-m">
        Task list
      </h2>
      <table class="govuk-table">
        <tbody class="govuk-table__body">
          <tr
            v-for="task in taskList"
            :key="task.id"
            class="govuk-table__row"
          >
            <th class="govuk-table__header">
              <router-link
                class="govuk-link"
                :to="{name: task.id, params: { referrer: 'exercise-show-overview' }}"
              >
                {{ task.title }}
              </router-link>
            </th>
            <td class="govuk-table__cell text-right">
              <strong
                v-if="task.done"
                :id="`${task.id}-completed`"
                class="govuk-tag"
              >
                Done
              </strong>
              <span
                v-else
                :id="`${task.id}-completed`"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-2">
      <button
        v-if="!isPublished && !isArchived && (canUpdateExercises && canPublishExercises)"
        :disabled="!canPublish"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="publish"
      >
        Publish on website
      </button>
      <button
        v-if="isPublished && !isArchived && (canUpdateExercises && canPublishExercises)"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="unPublish"
      >
        Remove from website
      </button>
      <button
        v-if="canUpdateExercises && isDraft"
        :disabled="!isReadyToSubmit"
        class="govuk-button govuk-!-margin-right-3"
        @click="openApprovalModal"
      >
        Submit for Approval
      </button>
      <button
        v-if="!isArchived && hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value, PERMISSIONS.exercises.permissions.canAmendAfterLaunch.value]) && isApproved"
        class="govuk-button govuk-!-margin-right-3"
        @click="unlock"
      >
        Set to Draft
      </button>
      <ActionButton
        v-if="canUpdateExercises && isApproved"
        @click="copyToClipboard"
      >
        Copy to Clipboard
      </ActionButton>
      <br>
      <ActionButton
        v-if="isReadyForProcessing && !isArchived && hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
          PERMISSIONS.applicationRecords.permissions.canCreateApplicationRecords.value
        ])"
        class="govuk-!-margin-right-3"
        @click="startProcessing()"
      >
        Begin processing applications
      </ActionButton>
      <ActionButton
        v-if="isProcessing && !isArchived && hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.applicationRecords.permissions.canCreateApplicationRecords.value,
          PERMISSIONS.qualifyingTests.permissions.canReadQualifyingTests.value,
          PERMISSIONS.qualifyingTestResponses.permissions.canCreateQualifyingTestResponses.value
        ])"
        class="govuk-!-margin-right-3"
        @click="updateProcessing()"
      >
        Process late applications
      </ActionButton>
      <!-- if exercise has [DATE] then use that date as when to show Archive button, else always show -->
      <!-- {{ exercise.hasOwnProperty('eMPOutcomeDate') ? Date.now > exercise.eMPOutcomeDate : true }} -->
      <Modal
        ref="archiveModal"
      >
        <ModalInner
          @close="closeArchiveModal"
          @confirmed="archive"
        />
      </Modal>
      <Modal
        ref="deleteModal"
      >
        <ModalInner
          title="Delete Exercise"
          message="Are you sure you want to delete this exercise?"
          @close="closeDeleteModal"
          @confirmed="confirmDelete"
        />
      </Modal>
      <button
        v-if="canArchiveExercises"
        :class="`govuk-button ${!isArchived ? 'govuk-button--warning' : ''} govuk-!-margin-right-3`"
        @click="openArchiveModal"
      >
        {{ isArchived ? 'Unarchive exercise' : 'Archive exercise' }}
      </button>
      <button
        v-if="isDraft && hasPermissions([PERMISSIONS.exercises.permissions.canDeleteExercises.value])"
        :class="`govuk-button ${!isArchived ? 'govuk-button--warning' : ''}`"
        :disabled="!isDraft"
        @click="openDeleteModal"
      >
        Delete exercise
      </button>
      <div v-if="!isProduction">
        <button
          v-if="isReadyForTesting && !isArchived"
          class="govuk-button"
          @click="changeNoOfTestApplications()"
        >
          Create test applications
        </button>
        <ActionButton
          v-if="isTesting"
          ref="createTestApplicationsBtn"
          @click="createTestApplications()"
        >
          Create test applications
        </ActionButton>
      </div>
      <Banner
        v-if="isReadyForApproval && !isReadyForApprovalFromAdvertType"
        :message="approveErrorMessage"
      />
    </div>
    <Modal
      ref="modalChangeExerciseState"
    >
      <ChangeExerciseState
        :state="exercise.state"
        @close="$refs['modalChangeExerciseState'].closeModal()"
      />
    </Modal>
    <Modal ref="modalChangeNoOfTestApplications">
      <ChangeNoOfTestApplications
        :no-of-test-applications="1"
        @close="cancelChangeNoOfTestApplications()"
        @confirmed="confirmedNoOfTestApplications()"
      />
    </Modal>
    <Modal
      ref="approvalModal"
    >
      <ExercisePreApprovalTaskList
        @close="closeApprovalModal"
        @confirmed="submitForApproval"
      />
    </Modal>
  </div>
</template>

<script>
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import { lookup } from '@/filters';
import ChangeExerciseState from '@/components/ModalViews/ChangeExerciseState';
import ChangeNoOfTestApplications from '@/components/ModalViews/ChangeNoOfTestApplications';
import { functions } from '@/firebase';
import { logEvent } from '@/helpers/logEvent';
import { authorisedToPerformAction }  from '@/helpers/authUsers';
import { isArchived, isApproved, isProcessing, applicationCounts, isReadyForApproval, isApprovalRejected, isReadyForApprovalFromAdvertType } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { ADVERT_TYPES } from '@/helpers/constants';
import ExercisePreApprovalTaskList from '@/components/ModalViews/ExercisePreApprovalTaskList.vue';
import ApprovalProcess from '@/views/Exercise/Details/Overview/ApprovalProcess.vue';
import { mapState } from 'vuex';
export default {
  name: 'Overview',
  components: {
    Timeline,
    ActionButton,
    Modal,
    ModalInner,
    Banner,
    ChangeExerciseState,
    ChangeNoOfTestApplications,
    ExercisePreApprovalTaskList,
    ApprovalProcess,
  },
  mixins: [permissionMixin],
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
      displayName: state => state.auth.currentUser.displayName,
    }),
    canArchiveExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canAmendAfterLaunch.value]);
    },
    canUpdateExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canUpdateExercises.value]);
    },
    canApproveExercise() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canApproveExercise.value]);
    },
    canPublishExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canPublishExercise.value]);
    },
    isProduction() {
      return this.$store.getters['isProduction'];
    },
    exercise() {
      return this.$store.getters['exerciseDocument/data']();
    },
    exerciseId() {
      return this.$store.state.exerciseDocument.record ? this.$store.state.exerciseDocument.record.id : null;
    },
    applicationCounts() {
      return applicationCounts(this.exercise);
    },
    draftApplications() {
      return this.applicationCounts.draft || 0;
    },
    appliedApplications() {
      return this.applicationCounts.applied || 0;
    },
    totalApplications() {
      return this.applicationCounts._total || 0;
    },
    isPublished() {
      return this.exercise.published;
    },
    canPublish() {
      return this.exercise.progress && this.exercise.progress.vacancySummary;
    },
    isDraft() {
      // returns true unless exercise has a state that other than draft
      if (this.exercise && this.exercise.state && this.exercise.state !== 'draft') {
        return false;
      }
      return true;
    },
    isReadyForApproval() {
      return isReadyForApproval(this.exercise);
    },
    isReadyForApprovalFromAdvertType() {
      return isReadyForApprovalFromAdvertType(this.exercise);
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
    isTesting() {
      return this.exercise && this.exercise.testingState && this.exercise.testingState === 'testing';
    },
    isTested() {
      return this.exercise && this.exercise.testingState && this.exercise.testingState === 'tested';
    },
    isReadyForTesting() {
      return this.isPublished && this.isApproved && !this.isTesting && !this.isTested;
    },
    isProcessing() {
      return isProcessing(this.exercise);
    },
    isReadyForProcessing() {
      return this.isApproved && !this.isProcessing;
      // @TODO perhaps also check that exercise has closed
    },
    hasOpened() {
      if (this.exercise) {
        switch (this.exercise.state) {
        case 'draft':
        case 'ready':
        case 'approved':
        case 'pre-launch':
        case 'archived':
          return false;
        default:
          return true;
        }
      }
      return false;
    },
    timeline() {
      const timeline = exerciseTimeline(this.exercise);
      return createTimeline(timeline, 2);
    },
    exerciseProgress() {
      if (this.exercise && this.exercise.progress) {
        return this.exercise.progress;
      } else {
        return {};
      }
    },
    approvalProgress() {
      if (this.exercise && this.exercise.approval) {
        return this.exercise.approval;
      } else {
        return {};
      }
    },
    taskList() {
      const data = [];
      if (!this.exercise.state || this.exercise.state === 'draft' || this.exercise.state === 'ready') {
        if (this.exerciseProgress) {
          data.push({ title: 'Website listing', id: 'exercise-details-summary', done: this.exerciseProgress.vacancySummary, approved: this.approvalProgress['vacancySummary'] });
          data.push({ title: 'Vacancy information', id: 'exercise-details-vacancy', done: this.exerciseProgress.vacancyInformation, approved: this.approvalProgress['vacancyInformation'] });
          data.push({ title: 'Contacts', id: 'exercise-details-contacts', done: this.exerciseProgress.contacts, approved: this.approvalProgress['contacts'] });
          data.push({ title: 'Timeline', id: 'exercise-details-timeline', done: this.exerciseProgress.timeline, approved: this.approvalProgress['timeline'] });
          data.push({ title: 'Shortlisting', id: 'exercise-details-shortlisting', done: this.exerciseProgress.shortlisting, approved: this.approvalProgress['shortlisting'] });
          data.push({ title: 'Eligibility information', id: 'exercise-details-eligibility', done: this.exerciseProgress.eligibility, approved: this.approvalProgress['eligibility'] });
          data.push({ title: 'Working preferences', id: 'exercise-details-preferences', done: this.exerciseProgress.workingPreferences, approved: this.approvalProgress['workingPreferences'] });
          data.push({ title: 'Assessment options', id: 'exercise-details-assessments', done: this.exerciseProgress.assessmentOptions, approved: this.approvalProgress['assessmentOptions'] });
          data.push({ title: 'Exercise downloads', id: 'exercise-details-downloads', done: this.exerciseProgress.downloads, approved: this.approvalProgress['downloads'] });
          if (this.exercise.inviteOnly) {
            data.splice(1, 0, { title: 'Exercise invitations', id: 'exercise-details-invitations' , done: this.exerciseProgress.invitations, approved: this.approvalProgress['invitations'] });
          }
        }
      }
      return data;
    },
    isReadyToSubmit() {
      return this.exerciseProgress
        && this.exerciseProgress.vacancySummary
        && this.exerciseProgress.vacancyInformation
        && this.exerciseProgress.contacts
        && this.exerciseProgress.timeline
        && this.exerciseProgress.shortlisting
        && this.exerciseProgress.eligibility
        && this.exerciseProgress.workingPreferences
        && this.exerciseProgress.assessmentOptions
        && this.exerciseProgress.downloads;
    },
    approveErrorMessage() {
      const msg = `You can only approve exercises with the advertType '${ lookup(ADVERT_TYPES.FULL) }' or '${ lookup(ADVERT_TYPES.EXTERNAL) }'.`;
      return msg;
    },
  },
  methods: {
    async submitForApproval() {
      await this.$store.dispatch('exerciseDocument/updateApprovalProcess', {
        userId: this.userId,
        userName: this.displayName,
        decision: 'requested',
      });
      this.closeApprovalModal();
    },
    archive() {
      if (this.isArchived) {
        this.$store.dispatch('exerciseDocument/unarchive');
        logEvent('info', 'Exercise unarchived', {
          exerciseId: this.exerciseId,
          exerciseRef: this.exercise.referenceNumber,
        });
      } else {
        this.$store.dispatch('exerciseDocument/archive');
        logEvent('info', 'Exercise archived', {
          exerciseId: this.exerciseId,
          exerciseRef: this.exercise.referenceNumber,
        });
      }
      this.$refs.archiveModal.closeModal();
    },
    confirmDelete() {
      this.closeDeleteModal();
      // Redirect THEN delete so not breaking any references in the component
      this.$router.push({ name: 'exercises' }).then(() => {
        this.$store.dispatch('exerciseDocument/delete');
      });
    },
    unlock() {
      this.$store.dispatch('exerciseDocument/unlock');
    },
    async copyToClipboard() {
      const exercise = await this.$store.dispatch('exerciseDocument/getDocumentData', this.exerciseId);
      await this.$store.dispatch('clipboard/write', {
        environment: this.$store.getters.appEnvironment,
        type: 'exercise',
        title: `${exercise.referenceNumber} ${exercise.name}`,
        content: exercise,
      });
    },
    async publish() {
      await this.$store.dispatch('exerciseDocument/publish');
      logEvent('info', 'Exercise published', {
        exerciseId: this.exerciseId,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    async unPublish() {
      await this.$store.dispatch('exerciseDocument/unpublish');
      logEvent('info', 'Exercise unpublished', {
        exerciseId: this.exerciseId,
        exerciseRef: this.exercise.referenceNumber,
      });
    },
    async startProcessing() {
      await functions.httpsCallable('initialiseApplicationRecords')({ exerciseId: this.exerciseId });
    },
    async updateProcessing() {
      // this is temporary function to cover late applications to existing exercises. It can be removed when we automatically create applicationRecords and existing exercises have been processed
      await functions.httpsCallable('initialiseMissingApplicationRecords')({ exerciseId: this.exerciseId });
    },
    changeState() {
      this.$refs['modalChangeExerciseState'].openModal();
    },
    refreshApplicationCounts() {
      if (authorisedToPerformAction(this.$store.getters['auth/getEmail'])) {
        if (this.hasPermissions([
          this.PERMISSIONS.exercises.permissions.canReadExercises.value,
          this.PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          this.PERMISSIONS.applications.permissions.canReadApplications.value,
          this.PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
        ])) {
          this.$store.dispatch('exerciseDocument/refreshApplicationCounts');
        }
      }
    },
    changeNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].openModal();
      this.$store.dispatch('exerciseDocument/testing');
    },
    cancelChangeNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].closeModal();
      this.$store.dispatch('exerciseDocument/isReadyForTest');
    },
    confirmedNoOfTestApplications() {
      this.$refs['modalChangeNoOfTestApplications'].closeModal();
      this.$refs['createTestApplicationsBtn'].$el.click();
    },
    openArchiveModal() {
      this.$refs.archiveModal.openModal();
    },
    closeArchiveModal() {
      this.$refs.archiveModal.closeModal();
    },
    openApprovalModal() {
      this.$refs.approvalModal.openModal();
    },
    closeApprovalModal() {
      this.$refs.approvalModal.closeModal();
    },
    openDeleteModal() {
      this.$refs.deleteModal.openModal();
    },
    closeDeleteModal() {
      this.$refs.deleteModal.closeModal();
    },
    async createTestApplications() {
      const noOfTestApplications = this.$store.getters['exerciseDocument/noOfTestApplications'];
      if (!noOfTestApplications) return;
      await functions.httpsCallable('createTestApplications')({ exerciseId: this.exerciseId, noOfTestApplications });
      this.$store.dispatch('exerciseDocument/tested');
      this.$store.dispatch('exerciseDocument/changeNoOfTestApplications', 0);
    },
  },
};
</script>

<style scoped>
.background-blue .govuk-link {
  cursor: pointer;
}
.background-red {
  background-color: rgb(200, 30, 30);
  cursor: pointer;
}

</style>
