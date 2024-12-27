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
            {{ $filters.formatNumber(assessmentsSent) }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">Completed</span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ $filters.formatNumber(assessmentsCompleted) }}
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
          {{ $filters.formatDate(exercise.contactIndependentAssessors, 'long') }}
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
          {{ $filters.formatDate(exercise.independentAssessmentsReturnDate, 'long') }}
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
          {{ $filters.formatDate(exercise.independentAssessmentsHardLimitDate, 'long') }}
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
          v-model:active-tab="activeTab"
          :tabs="tabs"
          class="print-none"
        />
        <Banner
          :message="sendErrors"
          status="warning"
        />

        <button
          v-if="isNotRequested && hasPermissions([
            PERMISSIONS.exercises.permissions.canReadExercises.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value,
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canUpdateAssessments.value,
            PERMISSIONS.notifications.permissions.canCreateNotifications.value
          ])"
          class="govuk-button govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'request', { assessmentIds: selectedItems }, sendRequests)"
        >
          Send requests
        </button>
        <button
          v-if="isNotRequested && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value
          ])"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'testRequest', { assessmentIds: selectedItems, notificationType: 'request' }, testRequest)"
        >
          Test request
        </button>
        <button
          v-if="isRequested && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.notifications.permissions.canCreateNotifications.value
          ])"
          class="govuk-button govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'reminder', { assessmentIds: selectedItems }, sendReminders)"
        >
          Send reminders
        </button>
        <button
          v-if="isRequested && hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value
          ])"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'testReminder', { assessmentIds: selectedItems, notificationType: 'reminder' }, testRequest)"
        >
          Test reminder
        </button>
        <button
          v-if="(isRequested || isCompleted || isCancelled || isDeclined) && hasPermissions([
            PERMISSIONS.exercises.permissions.canReadExercises.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value,
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canUpdateAssessments.value
          ])"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'reset', { assessmentIds: selectedItems, status: 'draft' }, resetAssessments)"
        >
          Reset
        </button>
        <button
          v-if="(isRequested || isCompleted) && hasPermissions([
            PERMISSIONS.exercises.permissions.canReadExercises.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value,
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canUpdateAssessments.value
          ])"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="openModal('modalRefRequests', 'cancel', { assessmentIds: selectedItems }, cancelAssessments)"
        >
          Cancel
        </button>
        <button
          v-if="(isNotRequested || isRequested || isCompleted) && hasPermissions([
            PERMISSIONS.exercises.permissions.canReadExercises.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value,
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canUpdateAssessments.value
          ])"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          :disabled="!selectedItems.length"
          @click="
            openModal(
              'modalRefRequests',
              'delete',
              { assessmentIds: selectedItems, status: isNotRequested || isRequested ? 'deleted' : 'pending' }, resetAssessments)"
        >
          Delete
        </button>
        <Table
          :key="activeTab"
          v-model:selection="selectedItems"
          data-key="id"
          :data="records"
          :page-size="50"
          :columns="tableColumns"
          :multi-select="!isDeleted"
          :search-map="$searchMap.independentAssessments"
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
              {{ row.assessor.type ? $filters.lookup(row.assessor.type) : '' }}
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
              {{ $filters.lookup(row.status) }}
              <strong
                v-if="lateIASubmission(row)"
                class="govuk-tag govuk-tag--red"
              >
                Late
              </strong>
            </TableCell>
            <TableCell
              v-if="isCancelled"
              :title="tableColumns[4].title"
            >
              {{ row.cancelReason }}
            </TableCell>
            <TableCell
              v-if="isDeclined"
              :title="tableColumns[4].title"
            >
              {{ row.declineReason }}
            </TableCell>
            <TableCell
              v-if="!isDeleted"
              :title="tableColumns[5].title"
            >
              <div>
                <a
                  v-if="(isNotRequested || isRequested) && testAssessmentUrl"
                  style="display: block; line-height: 40px; white-space: nowrap; min-width: 250px;"
                  href="javascript: void(0)"
                  class="govuk-link"
                  @click="onTestAppClick(row)"
                >
                  {{ !loadingTestAppLink ? 'Test the assessments app' : 'Creating link...' }}
                </a>

                <ActionButton
                  v-if="isCompleted && unapprovedLateSubmission(row)"
                  class="moj-button-menu__item"
                  type="primary"
                  :action="() => approveLateSubmission(row)"
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
          v-if="!isArchived && hasPermissions([
            PERMISSIONS.exercises.permissions.canReadExercises.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value,
            PERMISSIONS.applications.permissions.canReadApplications.value,
            PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
            PERMISSIONS.assessments.permissions.canCreateAssessments.value
          ])"
        >
          <select
            id="exercise-status"
            v-model="exerciseStatus"
            class="govuk-select govuk-!-margin-right-3"
          >
            <option value="">
              Choose applications
            </option>
            <option
              v-for="availableStatus in availableStatuses"
              :key="availableStatus"
              :value="availableStatus"
            >
              {{ $filters.lookup(availableStatus) }}
              ({{ applicationRecordCounts.status ? $filters.formatNumber(applicationRecordCounts.status[availableStatus]) : 0 }})
            </option>
          </select>

          <ActionButton
            type="primary"
            :disabled="!exerciseStatus"
            :action="initialiseAssessments"
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
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import { isDateInFuture, isDateGreaterThan } from '@jac-uk/jac-kit/helpers/date';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import DownloadLink from '@jac-uk/jac-kit/draftComponents/DownloadLink.vue';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import UploadAssessment from '@/components/ModalViews/UploadAssessment.vue';
import IndependentAssessmentsRequests from '@/components/ModalViews/IndependentAssessmentsRequests.vue';
import { isArchived, applicationRecordCounts, availableStatuses } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList.vue';
import { ASSESSOR_TYPES } from '@/helpers/constants';

export default {
  name: 'IndependentAssessments',
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
      {
        ref: 'deleted',
        title: 'Deleted',
      },
    ];

    return {
      exerciseStatus: '',
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
      loadingTestAppLink: false,
    };
  },
  computed: {
    tableColumns() {
      const tableColumns = [
        { title: 'Reference number', sort: 'application.referenceNumber' },
        { title: 'Candidate name', sort: 'candidate.fullName', default: true },
        { title: 'Assessor type' },
        { title: 'Assessor', sort: 'assessor.fullName' },
        { title: 'Status' },
      ];

      if (this.isCancelled || this.isDeclined) {
        return [
          ...tableColumns,
          { title: 'Reason' },
        ];
      } else if (this.isDeleted) {
        return tableColumns;
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
    availableStatuses() {
      let statuses = availableStatuses(this.exercise);
      statuses = statuses.filter(status => this.applicationRecordCounts?.status && this.applicationRecordCounts?.status[status]);
      if (this.applicationRecordCounts?.status && this.applicationRecordCounts?.status['blank']) {
        statuses.push('blank');
      }
      return statuses;
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
    isDeleted() {
      return this.activeTab === 'deleted';
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
      } else if (this.isDeleted) {
        return this.$store.state.assessments.assessmentsDeletedRecords;
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
    isArchived() {
      return isArchived(this.exercise);
    },
    contactOverdue() {
      return !isDateInFuture(this.exercise.contactIndependentAssessors);
    },
    hasInitialisedAssessments() {
      return this.exercise.assessments && this.exercise.assessments.initialised;
    },
    testAssessmentUrl() {
      if (this.onDevelop) {
        return 'https://assessments-develop.judicialappointments.digital';
      } else if (this.onStaging) {
        return 'https://assessments-staging.judicialappointments.digital';
      }
      return '';
    },
    onDevelop() {
      return window.location.href.indexOf('admin-develop') > 0 || import.meta.env.DEV;
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
      if (!this.exerciseStatus) return;
      try {
        await httpsCallable(functions, 'initialiseAssessments')({ exerciseId: this.exercise.id, status: this.exerciseStatus });
        return true;
      } catch (error) {
        return;
      }
    },
    async cancelAssessments({ assessmentIds, cancelReason }) {
      this.resetSelectedItems();
      await httpsCallable(functions, 'cancelAssessments')({ exerciseId: this.exercise.id, assessmentIds, cancelReason });
    },
    async resetAssessments({ assessmentIds, status }) {
      this.resetSelectedItems();
      await httpsCallable(functions, 'resetAssessments')({ exerciseId: this.exercise.id, assessmentIds, status });
    },
    async sendRequests({ assessmentIds }) {
      this.resetSelectedItems();
      const result = await httpsCallable(functions, 'sendAssessmentRequests')({ exerciseId: this.exercise.id, assessmentIds });
      this.processSendAssessmentResult(result);
    },
    async sendReminders({ assessmentIds }) {
      this.resetSelectedItems();
      const result = await httpsCallable(functions, 'sendAssessmentReminders')({ exerciseId: this.exercise.id, assessmentIds });
      this.processSendAssessmentResult(result);
    },
    async resendRequest({ assessmentId }) {
      const result = await httpsCallable(functions, 'sendAssessmentRequests')({ exerciseId: this.exercise.id, assessmentId, resend: true });
      this.processSendAssessmentResult(result);
    },
    async sendReminder({ assessmentId }) {
      const result = await httpsCallable(functions, 'sendAssessmentReminders')({ exerciseId: this.exercise.id, assessmentId });
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
      await httpsCallable(functions, 'testAssessmentNotification')({ assessmentIds, notificationType });
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
      } else if (this.isDeleted) {
        status = 'deleted';
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
    async onTestAppClick(assessment) {
      try {
        this.loadingTestAppLink = true;
        const response = await httpsCallable(functions, 'getTestAssessmentAppLink')({
          assessmentId: assessment.id,
        });
        if (response && response.data) {
          window.open(response.data, '_blank'); // eslint-disable-line
          return;
        }
        //window.open(`${this.testAssessmentUrl}/assessment/${assessment.id}`, '_blank');

      } catch (error) {
        console.error(error);
      } finally {
        this.loadingTestAppLink = false;
      }

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
