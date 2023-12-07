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
          >{{ $filters.formatNumber(exercise.immediateStart) }}</span>
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
              <span class="govuk-heading-l govuk-!-margin-top-1">{{ $filters.formatNumber(draftApplications) }}</span>
            </p>
          </div>
          <div class="govuk-grid-column-one-half">
            <p class="govuk-body">
              Applied
              <span class="govuk-heading-l govuk-!-margin-top-1">{{ $filters.formatNumber(appliedApplications) }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-column-one-half">
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
      v-if="isDraft && taskList && taskList.length"
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
                :to="{name: task.id, query: { referrer: 'exercise-show-overview' }}"
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
    <div class="govuk-grid-column-full govuk-!-margin-top-6">
      <button
        v-if="canUpdateExercises && isDraft"
        :disabled="!isReadyToSubmit"
        class="govuk-button govuk-!-margin-right-3"
        @click="openApprovalModal"
      >
        Submit for approval
      </button>

      <button
        v-if="isApproved && !isPublished && !isArchived && (canUpdateExercises && canPublishExercises)"
        :disabled="!canPublish"
        class="govuk-button govuk-!-margin-right-3"
        @click="publish"
      >
        Publish on website
      </button>
      <button
        v-if="isPublished && !isArchived && (canUpdateExercises && canPublishExercises)"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="unPublish"
      >
        Remove from apply website
      </button>

      <ActionButton
        v-if="isReadyForProcessing && !isArchived && hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
          PERMISSIONS.applicationRecords.permissions.canCreateApplicationRecords.value
        ])"
        type="primary"
        class="govuk-!-margin-right-3"
        :action="startProcessing"
      >
        Begin processing applications
      </ActionButton>
      <ActionButton
        v-if="isProcessing && !isArchived && hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.applicationRecords.permissions.canCreateApplicationRecords.value,
        ])"
        type="primary"
        class="govuk-!-margin-right-3"
        :action="updateProcessing"
      >
        Process late applications
      </ActionButton>
      <!-- if exercise has [DATE] then use that date as when to show Archive button, else always show -->
      <!-- {{ exercise.hasOwnProperty('eMPOutcomeDate') ? Date.now > exercise.eMPOutcomeDate : true }} -->

      <Modal ref="deleteModal">
        <ModalInner
          title="Delete Exercise"
          message="Are you sure you want to delete this exercise?"
          @close="closeDeleteModal"
          @confirmed="confirmDelete"
        />
      </Modal>

      <button
        v-if="isDraft && hasPermissions([PERMISSIONS.exercises.permissions.canDeleteExercises.value])"
        :class="`govuk-button ${!isArchived ? 'govuk-button--warning' : ''}`"
        :disabled="!isDraft"
        @click="openDeleteModal"
      >
        Delete exercise
      </button>
      <Banner
        v-if="isReadyForApproval && !isReadyForApprovalFromAdvertType"
        :message="approveErrorMessage"
      />
    </div>
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
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline.vue';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner.vue';
import { lookup } from '@/filters';
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
    ExercisePreApprovalTaskList,
    ApprovalProcess,
  },
  mixins: [permissionMixin],
  computed: {
    ...mapState({
      userId: state => state.auth.currentUser.uid,
      displayName: state => state.auth.currentUser.displayName,
    }),
    canUpdateExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canUpdateExercises.value]);
    },
    canApproveExercise() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canApproveExercise.value]);
    },
    canPublishExercises() {
      return this.hasPermissions([this.PERMISSIONS.exercises.permissions.canPublishExercise.value]);
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
    isTested() {
      return this.exercise && this.exercise.testingState && this.exercise.testingState === 'tested';
    },
    isProcessing() {
      return this.isApproved && this.isPublished && isProcessing(this.exercise);
    },
    isReadyForProcessing() {
      return this.isApproved && this.isPublished && !this.isProcessing;
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
      let timeline = exerciseTimeline(this.exercise);
      timeline = createTimeline(timeline);
      const now = new Date();
      let mostRelevantIndex = 0;
      timeline.forEach((item, index) => {
        if (item.date <= now) {
          mostRelevantIndex = index;
        }
      });
      return timeline.slice(mostRelevantIndex, mostRelevantIndex + 4);
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
          data.push({ title: 'Application process', id: 'exercise-details-application-content', done: this.exerciseProgress.applicationProcess, approved: this.approvalProgress['applicationProcess'] });
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
    async submitForApproval(note) {
      await this.$store.dispatch('exerciseDocument/updateApprovalProcess', {
        userId: this.userId,
        userName: this.displayName,
        decision: 'requested',
        rejectionResponse: note ? note : null,
      });
      await this.$store.dispatch('exerciseDocument/updateCommissioners');
      this.closeApprovalModal();
    },
    async confirmDelete() {
      this.closeDeleteModal();
      await this.$store.dispatch('exerciseDocument/delete');
      this.$router.push({ name: 'exercises' });
    },
    async publish() {
      await this.$store.dispatch('exerciseDocument/updateCommissioners');
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
      return true;
    },
    async updateProcessing() {
      // this is temporary function to cover late applications to existing exercises. It can be removed when we automatically create applicationRecords and existing exercises have been processed
      await functions.httpsCallable('initialiseMissingApplicationRecords')({ exerciseId: this.exerciseId });
      return true;
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
