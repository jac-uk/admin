<template>
  <div>
    <h1 class="govuk-heading-l">
      Independent Assessments
    </h1>
    <div
      v-if="hasInitialisedAssessments && hasPermissions([PERMISSIONS.assessments.permissions.canReadAssessments.value])"
      class="govuk-grid-row"
    >
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Sent
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ assessmentsSent }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">Completed</span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ assessmentsCompleted }}
          </h2>
        </div>
      </div>
    </div>
    <dl 
      v-if="hasPermissions([PERMISSIONS.assessments.permissions.canReadAssessments.value])"
      class="govuk-summary-list"
    >
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Contact date
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.contactIndependentAssessors | formatDate('long') }}
        </dd>
        <dd class="govuk-summary-list__actions">
          <strong
            v-if="contactOverdue"
            class="govuk-tag govuk-tag--red"
          >
            Overdue
          </strong>
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Due date
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.independentAssessmentsReturnDate | formatDate('long') }}
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
      <div
        v-if="exercise.independentAssessmentsHardLimitDate"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          Hard limit
        </dt>
        <dd class="govuk-summary-list__value">
          {{ exercise.independentAssessmentsHardLimitDate | formatDate('long') }}
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
    </dl>
    <div v-if="exercise.exercisePhoneNumber && exercise.emailSignatureName">
      <div
        v-if="hasInitialisedAssessments"
      >
        <TabsList
          ref="tabs"
          class="print-none"
          :tabs="tabs"
          :active-tab.sync="activeTab"
        />

        <Banner
          :message="sendErrors"
          status="warning"
        />

        <ActionButton
          v-if="isNotRequested && hasPermissions([
            PERMISSIONS.exercises.permissions.canReadExercises.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value,
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canUpdateAssessments.value,
            PERMISSIONS.notifications.permissions.canCreateNotifications.value
          ])"
          type="primary"
          class="govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'request', { assessmentIds: selectedItems }, sendRequests)"
        >
          Send requests
        </ActionButton>
        <ActionButton
          v-if="isNotRequested && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value
          ])"
          class="govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'testRequest', { assessmentIds: selectedItems, notificationType: 'reminder' }, testRequest)"
        >
          Test request
        </ActionButton>
        <ActionButton
          v-if="isRequested && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.notifications.permissions.canCreateNotifications.value
          ])"
          type="primary"
          class="govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'reminder', { assessmentIds: selectedItems }, sendReminders)"
        >
          Send reminders
        </ActionButton>
        <ActionButton
          v-if="isRequested && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value
          ])"
          class="govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'testReminder', { assessmentIds: selectedItems, notificationType: 'reminder' }, testRequest)"
        >
          Test reminder
        </ActionButton>
        <ActionButton
          v-if="(isRequested || isCompleted) && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canUpdateAssessments.value,
            PERMISSIONS.assessments.permissions.canDeleteAssessments.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value
          ])"
          class="govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'cancel', { assessmentIds: selectedItems }, cancelAssessments)"
        >
          Cancel
        </ActionButton>
        <ActionButton
          v-if="(isRequested || isCompleted || isCancelled || isDeclined) && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canUpdateAssessments.value
          ])"
          class="govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'reset', { assessmentIds: selectedItems, status: 'draft' }, resetAssessments)"
        >
          Reset
        </ActionButton>
        <ActionButton
          v-if="isCompleted && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canDeleteAssessments.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value
          ])"
          class="govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'delete', { assessmentIds: selectedItems, status: 'pending' }, resetAssessments)"
        >
          Delete
        </ActionButton>

        <Table
          :key="activeTab"
          data-key="id"
          :data="records"
          :page-size="50"
          :columns="tableColumns"
          multi-select
          :selection.sync="selectedItems"
          :custom-search="{
            placeholder: 'Search candidate names',
            handler: candidateSearch,
            field: 'userId',
          }"
          :filters="filters"
          @change="getTableData"
        >
          <template #row="{row}">
            <TableCell :title="tableColumns[0].title">
              <RouterLink
                class="govuk-link"
                :to="{name: 'exercise-application', params: { applicationId: row.application.id }}"
              >
                {{ row.application.referenceNumber }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumns[1].title">
              <RouterLink
                :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
                target="_blank"
              >
                {{ row.candidate.fullName }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumns[2].title">
              {{ row.assessor.type | lookup }}
            </TableCell>
            <TableCell :title="tableColumns[2].title">
              <a
                :href="`mailto:${row.assessor.email}`"
                class="govuk-link govuk-link--no-visited-state"
                target="_blank"
              >
                {{ row.assessor.fullName }}
              </a>
            </TableCell>
            <TableCell :title="tableColumns[3].title">
              {{ row.status | lookup }}
              <strong
                v-if="lateIASubmission(row)"
                class="govuk-tag govuk-tag--red"
              >
                Late
              </strong>
            </TableCell>
            <TableCell v-if="isCancelled" :title="tableColumns[4].title">
                {{ row.cancelReason }}
              </TableCell>
              <TableCell v-if="isDeclined" :title="tableColumns[4].title">
                {{ row.declineReason }}
              </TableCell>
            <TableCell :title="tableColumns[5].title">
              <div>
                <a
                  v-if="isNotRequested || isRequested"
                  target="_blank"
                  :href="`https://assessments-develop.judicialappointments.digital/sign-in?email=${row.assessor.email}&ref=assessments/${row.id}`"
                  style="display: block; line-height: 40px; white-space: nowrap;"
                >
                  Test the assessments app
                </a>

                <ActionButton
                  v-if="isRequested && unapprovedLateSubmission(row)"
                  class="moj-button-menu__item"
                  type="primary"
                  @click="approveLateSubmission(row)"
                >
                  Approve late submission
                </ActionButton>

                <button
                  v-if="(isRequested || isCompleted) && hasPermissions([
                    PERMISSIONS.assessments.permissions.canReadAssessments.value,
                    PERMISSIONS.assessments.permissions.canCreateAssessments.value,
                    PERMISSIONS.assessments.permissions.canUpdateAssessments.value
                  ])"
                  class="moj-button-menu__item govuk-button govuk-button--secondary info-btn--independent-asssessment--upload"
                  @click="modalUploadOpen({ id: row.id, uuid: $store.state.auth.currentUser.uid, ...row })"
                >
                  {{ row.fileRef ? 'Replace' : 'Upload' }}
                </button>

                <DownloadLink
                  v-if="isCompleted && row.fileRef && !unapprovedLateSubmission(row)"
                  v-model="row.fileRef"
                  class="moj-button-menu__item"
                  :file-name="row.fileRef"
                  :file-path="row.filePath"
                  :exercise-id="exercise.id"
                  :application-id="row.application.id"
                  :assessor-id="row.assessor.id"
                  title="Download"
                  type="button"
                />
              </div>
            </TableCell>
          </template>
        </Table>
      </div>

      <div v-else>
        <div
          v-if="hasPermissions([
            PERMISSIONS.exercises.permissions.canReadExercises.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value,
            PERMISSIONS.applications.permissions.canReadApplications.value,
            PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
            PERMISSIONS.assessments.permissions.canCreateAssessments.value
          ])"
        >
          <select
            id="exercise-stage"
            v-model="exerciseStage"
            class="govuk-select govuk-!-margin-right-3"
          >
            <option value="">
              Choose applications
            </option>
            <option
              v-if="applicationRecordCounts.review"
              value="review"
            >
              Review ({{ applicationRecordCounts.review }})
            </option>
            <option
              v-if="applicationRecordCounts.shortlisted"
              value="shortlisted"
            >
              Shortlisted ({{ applicationRecordCounts.shortlisted }})
            </option>

            <option
              v-if="applicationRecordCounts.selected"
              value="selected"
            >
              Selected ({{ applicationRecordCounts.selected }})
            </option>
          </select>

          <ActionButton
            type="primary"
            :disabled="!exerciseStage"
            @click="initialiseAssessments()"
          >
            Start assessments
          </ActionButton>
        </div>
      </div>
    </div>
    <div v-else>
      <Banner
        :message="warningMessage"
        status="warning"
      />
    </div>

    <Modal
      ref="modalRef"
    >
      <component
        :is="`UploadAssessment`"
        v-bind="uploadAsssessmentProps"
        @close="modalUploadClose"
      />
    </Modal>

    <Modal ref="modalRefRequests">
      <component
        :is="`IndependentAssessmentsRequests`"
        :type="modalType"
        :params="modalParams"
        @close="closeModal('modalRefRequests')"
        @ok="modalCallback"
      />
    </Modal>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import { isDateInFuture, isDateGreaterThan } from '@jac-uk/jac-kit/helpers/date';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal';
import UploadAssessment from '@/components/ModalViews/UploadAssessment';
import IndependentAssessmentsRequests from '@/components/ModalViews/IndependentAssessmentsRequests'; 
import { applicationRecordCounts } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import { ASSESSOR_TYPES } from '@/helpers/constants';

export default {
  components: {
    Table,
    TableCell,
    ActionButton,
    Banner,
    DownloadLink,
    Modal,
    UploadAssessment,
    IndependentAssessmentsRequests,
    TabsList,
  },
  mixins: [permissionMixin],
  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('assessments/bind', { 
      exerciseId: this.exercise.id,
      status: this.getStatus(),
    });
    next();
  },
  data() {
    const tabs = [
      {
        ref: 'notrequested',
        title: 'Not requested',
      },
      {
        ref: 'requested',
        title: 'Requested',
      },
      {
        ref: 'completed',
        title: 'Completed',
      },
      {
        ref: 'cancelled',
        title: 'Cancelled',
      },
      {
        ref: 'declined',
        title: 'Declined',
      },
    ];

    return {
      exerciseStage: '',
      uploadAsssessmentProps: {},
      tabs,
      activeTab: 'notrequested',
      filters: [
        {
          title: 'Assessor type',
          field: 'assessor.type',
          type: 'checkbox',
          options: Object.values(ASSESSOR_TYPES),
        },
      ],
      sendErrors: '',
      modalType: '',
      modalParams: null,
      modalCallback: null,
      selectedItems: [],
    };
  },
  computed: {
    tableColumns() {
      const tableColumns = [
        { title: 'Reference number' },
        { title: 'Candidate name', sort: 'candidate.fullName', default: true },
        { title: 'Assessor type' },
        { title: 'Assessor' },
        { title: 'Status' },
      ];
      
      if (this.isCancelled || this.isDeclined) {
        return [
          ...tableColumns,
          { title: 'Reason' },
        ];
      } else {
        return [
          ...tableColumns,
          { title: 'Actions' },
        ];
      }
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
    },
    warningMessage() {
      let msg = 'Please add';
      if (!this.exercise.exercisePhoneNumber) {
        msg = `${msg} an exercise phone number`;
      }
      if (!this.exercise.exercisePhoneNumber && !this.exercise.emailSignatureName) {
        msg = `${msg} and`;
      }
      if (!this.exercise.emailSignatureName) {
        msg = `${msg} an email signature name`;
      }
      msg = `${msg} before sending IA requests`;
      return msg;
    },
    isNotRequested() {
      return this.activeTab === 'notrequested';
    },
    isRequested() {
      return this.activeTab === 'requested';
    },
    isCompleted() {
      return this.activeTab === 'completed';
    },
    isCancelled() {
      return this.activeTab === 'cancelled';
    },
    isDeclined() {
      return this.activeTab === 'declined';
    },
    records() {
      if (this.isNotRequested) {
        return this.$store.state.assessments.assessmentsNotRequestedRecords;
      } else if (this.isRequested) {
        return this.$store.state.assessments.assessmentsRequestedRecords;
      } else if (this.isCompleted) {
        return this.$store.state.assessments.assessmentsCompletedRecords;
      } else if (this.isCancelled) {
        return this.$store.state.assessments.assessmentsCancelledRecords;
      } else if (this.isDeclined) {
        return this.$store.state.assessments.assessmentsDeclinedRecords;
      } else {
        return [];
      }
    },
    assessmentsSent() {
      if (this.exercise.assessments && this.exercise.assessments.sent){
        return this.exercise.assessments.sent;
      }

      return 0;
    },
    assessmentsCompleted() {
      if (this.exercise.assessments && this.exercise.assessments.completed){
        return this.exercise.assessments.completed;
      }

      return 0;
    },
    status() {
      return this.$route.params.status;
    },
    contactOverdue() {
      return this.isNotRequested && !this.records.length && !isDateInFuture(this.exercise.contactIndependentAssessors);
    },
    hasInitialisedAssessments() {
      return this.exercise.assessments && this.exercise.assessments.initialised;
    },
    onStaging() {
      return window.location.href.indexOf('admin-staging') > 0;
    },
  },
  watch: {
    activeTab() {
      this.resetSelectedItems();
    },
  },
  methods: {
    async initialiseAssessments() {
      if (!this.exerciseStage) {
        return false;
      }
      await functions.httpsCallable('initialiseAssessments')({ exerciseId: this.exercise.id, stage: this.exerciseStage });
    },
    async cancelAssessments({ assessmentIds, cancelReason }) {
      this.resetSelectedItems();
      await functions.httpsCallable('cancelAssessments')({ exerciseId: this.exercise.id, assessmentIds, cancelReason });
    },
    async resetAssessments({ assessmentIds, status }) {
      this.resetSelectedItems();
      await functions.httpsCallable('resetAssessments')({ exerciseId: this.exercise.id, assessmentIds, status });
    },
    async sendRequests({ assessmentIds }) {
      this.resetSelectedItems();
      const result = await functions.httpsCallable('sendAssessmentRequests')({ exerciseId: this.exercise.id, assessmentIds });
      this.processSendAssessmentResult(result);
    },
    async sendReminders({ assessmentIds }) {
      this.resetSelectedItems();
      const result = await functions.httpsCallable('sendAssessmentReminders')({ exerciseId: this.exercise.id, assessmentIds });
      this.processSendAssessmentResult(result);
    },
    async resendRequest({ assessmentId }) {
      const result = await functions.httpsCallable('sendAssessmentRequests')({ exerciseId: this.exercise.id, assessmentId, resend: true });
      this.processSendAssessmentResult(result);
    },
    async sendReminder({ assessmentId }) {
      const result = await functions.httpsCallable('sendAssessmentReminders')({ exerciseId: this.exercise.id, assessmentId });
      this.processSendAssessmentResult(result);
    },
    async processSendAssessmentResult(result) {
      if (result.data.errors) {
        const csvAssessors = result.data.errors.map(err => `(${err.applicationRef}) ${err.assessor.fullName} - ${err.assessor.email}`)
          .join(', \n');
        this.sendErrors = `No emails were sent because the following assessors have invalid email addresses: ${csvAssessors}`;
        window.scrollTo(0, 350); // make sure the warning message is visible
      } else {
        this.sendErrors = '';
      }
    },
    async testRequest({ assessmentIds, notificationType }) {
      this.resetSelectedItems();
      await functions.httpsCallable('testAssessmentNotification')({ assessmentIds, notificationType });
    },
    lateIASubmission(assessment){
      // Not submitted and late
      if (assessment.status != 'completed' && !isDateInFuture(assessment.dueDate)){
        return true;
      }

      // Has timestamp, submitted and submitted late
      if (assessment.submittedDate && assessment.status == 'completed' && isDateGreaterThan(assessment.submittedDate, assessment.dueDate)){
        return true;
      }
      return false;
    },
    unapprovedLateSubmission(assessment){
      if (!this.lateIASubmission(assessment)){
        return false;
      }

      return assessment.approved == true ? false : true;
    },
    async approveLateSubmission(assessment){
      if (!this.unapprovedLateSubmission(assessment)){
        return false;
      }
      assessment.approved = true;

      await this.$store.dispatch('assessment/save', assessment);
    },
    openModal(modalRef, type, params, callback){
      this.$refs[modalRef].openModal();
      this.modalType = type;
      this.modalParams = params;
      this.modalCallback = callback;
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
      this.modalType = '';
      this.modalParams = null;
      this.modalCallback = null;
    },
    modalUploadOpen(obj) {
      this.uploadAsssessmentProps = obj;
      this.$refs.modalRef.openModal();
    },
    modalUploadClose() {
      this.$refs.modalRef.closeModal();
    },
    getStatus() {
      let status = '';
      if (this.isNotRequested) {
        status = 'draft';
      } else if (this.isRequested) {
        status = 'pending';
      } else if (this.isCompleted) {
        status = 'completed';
      } else if (this.isCancelled) {
        status = 'cancelled';
      } else if (this.isDeclined) {
        status = 'declined';
      }
      return status;
    },
    getTableData(params) {
      this.$store.dispatch('assessments/bind', {
        exerciseId: this.exercise.id,
        status: this.getStatus(),
        ...params,
      });
    },
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm, exerciseId: this.exercise.id });
    },
    resetSelectedItems() {
      this.selectedItems = [];
    },
  },
};
</script>

<style scoped>
.govuk-table__cell,
.govuk-table__header {
  vertical-align: middle;
}
</style>
