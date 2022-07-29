<template>
  <div class="govuk-grid-row">
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
          >{{ exercise.immediateStart }}</span>
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
              <span class="govuk-heading-l govuk-!-margin-top-1">{{ draftApplications }}</span>
            </p>
          </div>
          <div class="govuk-grid-column-one-half">
            <p class="govuk-body">
              Applied
              <span class="govuk-heading-l govuk-!-margin-top-1">{{ appliedApplications }}</span>
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
            v-if="hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
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
        v-if="!isPublished && hasPermissions([
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.exercises.permissions.canPublishExercise.value
        ])"
        :disabled="!canPublish"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="publish"
      >
        Publish on website
      </button>
      <button
        v-if="isPublished && hasPermissions([
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.exercises.permissions.canPublishExercise.value,
        ])"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="unPublish"
      >
        Remove from website
      </button>
      <button
        v-if="hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value]) && isDraft"
        :disabled="!isReadyToSubmit"
        class="govuk-button govuk-!-margin-right-3"
        @click="submitForApproval"
      >
        Submit for Approval
      </button>
      <button
        v-if="hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value, PERMISSIONS.exercises.permissions.canApproveExercise.value]) && isReadyForApproval"
        :disabled="!isReadyForApprovalFromAdvertType"
        class="govuk-button govuk-!-margin-right-3"
        @click="approve"
      >
        Approve
      </button>
      <button
        v-if="hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value, PERMISSIONS.exercises.permissions.canAmendAfterLaunch.value]) && isApproved"
        class="govuk-button govuk-!-margin-right-3"
        @click="unlock"
      >
        Unlock
      </button>
      <ActionButton
        v-if="hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value]) && isApproved"
        @click="copyToClipboard"
      >
        Copy to Clipboard
      </ActionButton>
      <br>
      <ActionButton
        v-if="isReadyForProcessing && hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
          PERMISSIONS.applicationRecords.permissions.canCreateApplicationRecords.value
        ])"
        @click="startProcessing()"
      >
        Begin processing applications
      </ActionButton>
      <ActionButton
        v-if="isProcessing && hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.exercises.permissions.canUpdateExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.applicationRecords.permissions.canCreateApplicationRecords.value,
          PERMISSIONS.qualifyingTests.permissions.canReadQualifyingTests.value,
          PERMISSIONS.qualifyingTestResponses.permissions.canCreateQualifyingTestResponses.value
        ])"
        @click="updateProcessing()"
      >
        Process late applications
      </ActionButton>
      <!-- if exercise has [DATE] then use that date as when to show Archive button, else always show -->
      <!-- {{ exercise.hasOwnProperty('eMPOutcomeDate') ? Date.now > exercise.eMPOutcomeDate : true }} -->
      <button
        :class="`govuk-button govuk-!-margin-left-3 ${!isArchived ? 'govuk-button--warning' : ''}`"
        @click="archive()"
      >
        {{ isArchived ? 'Unarchive exercise' : 'Archive exercise' }}
      </button>
      <div v-if="!isProduction">
        <button
          v-if="isReadyForTesting"
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
  </div>
</template>

<script>
import Timeline from '@jac-uk/jac-kit/draftComponents/Timeline';
import createTimeline from '@jac-uk/jac-kit/helpers/Timeline/createTimeline';
import exerciseTimeline from '@jac-uk/jac-kit/helpers/Timeline/exerciseTimeline';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import { lookup } from '@/filters';
import ChangeExerciseState from '@/components/ModalViews/ChangeExerciseState';
import ChangeNoOfTestApplications from '@/components/ModalViews/ChangeNoOfTestApplications';
import { functions } from '@/firebase';
import { logEvent } from '@/helpers/logEvent';
import { authorisedToPerformAction }  from '@/helpers/authUsers';
import { isArchived, isApproved, isProcessing, applicationCounts } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { ADVERT_TYPES } from '@/helpers/constants';

export default {
  components: {
    Timeline,
    ActionButton,
    Modal,
    Banner,
    ChangeExerciseState,
    ChangeNoOfTestApplications,
  },
  mixins: [permissionMixin],
  computed: {
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
      const returnReadyForApproval = this.exercise
        && this.exercise.state
        && this.exercise.state === 'ready';
      return returnReadyForApproval;
    },
    isReadyForApprovalFromAdvertType() {
      const returnReady = this.exercise
        && (!this.exercise.advertType || this.exercise.advertType === ADVERT_TYPES.FULL || this.exercise.advertType === ADVERT_TYPES.EXTERNAL);
      return returnReady;
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
    submitForApproval() {
      this.$store.dispatch('exerciseDocument/submitForApproval');
    },
    approve() {
      this.$store.dispatch('exerciseDocument/approve');
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
