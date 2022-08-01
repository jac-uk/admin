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
          Hard Limit
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
        <ActionButton
          v-if="hasPermissions([
            PERMISSIONS.assessments.permissions.canReadAssessments.value,
            PERMISSIONS.assessments.permissions.canDeleteAssessments.value,
            PERMISSIONS.exercises.permissions.canUpdateExercises.value
          ])"
          @click="cancelAssessments()"
        >
          Cancel Assessments
        </ActionButton>

        <TabsList
          ref="tabs"
          class="print-none"
          :tabs="tabs"
          :active-tab.sync="activeTab"
        />

        <div
          v-if="activeTab == 'notrequested'"
          class="application-details"
        >
          <Banner
            :message="sendErrors"
            status="warning"
          />

          <ActionButton
            v-if="hasPermissions([
              PERMISSIONS.exercises.permissions.canReadExercises.value,
              PERMISSIONS.exercises.permissions.canUpdateExercises.value,
              PERMISSIONS.assessments.permissions.canReadAssessments.value,
              PERMISSIONS.assessments.permissions.canUpdateAssessments.value,
              PERMISSIONS.notifications.permissions.canCreateNotifications.value
            ])"
            type="primary"
            class="govuk-!-margin-right-3"
            :disabled="!selectedItems.length"
            @click="openModal('modalRefRequests', 'requests', selectedItems, sendRequests)"
          >
            Send requests
          </ActionButton>
          <ActionButton
            v-if="hasPermissions([
              PERMISSIONS.assessments.permissions.canReadAssessments.value
            ])"
            class="moj-button-menu__item"
            :disabled="!selectedItems.length"
            @click="openModal('modalRefRequests', 'testRequest', selectedItems, testRequest)"
          >
            Test Request
          </ActionButton>

          <Table
            key="notrequested"
            data-key="id"
            :data="assessmentsNotRequestedRecords"
            :page-size="50"
            :columns="tableColumns"
            multi-select
            :selection.sync="selectedItems"
            :custom-search="{
              placeholder: 'Search candidate names',
              handler: candidateSearch,
              field: 'userId',
            }"
            @change="getAssessmentsNotRequested"
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
                >
                  {{ row.candidate.fullName }}
                </RouterLink>
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
              <TableCell :title="tableColumns[4].title">
                <a
                  v-if="onStaging"
                  target="_blank"
                  :href="`https://assessments-staging.judicialappointments.digital/sign-in?email=${row.assessor.email}&ref=assessments/${row.id}`"
                  class="govuk-link"
                >Test the assessments app</a>
              </TableCell>
            </template>
          </Table>
        </div>

        <div
          v-else-if="activeTab == 'requested'"
          class="application-details"
        >
          <Banner
            :message="sendErrors"
            status="warning"
          />
          <ActionButton
            v-if="hasPermissions([
              PERMISSIONS.assessments.permissions.canReadAssessments.value,
              PERMISSIONS.notifications.permissions.canCreateNotifications.value
            ])"
            type="primary"
            class="govuk-!-margin-right-3"
            :disabled="!selectedItems.length"
            @click="openModal('modalRefRequests', 'reminders', selectedItems, sendReminders)"
          >
            Send reminders
          </ActionButton>

          <Table
            key="requested"
            data-key="id"
            :data="assessmentsRequestedRecords"
            :page-size="50"
            :columns="tableColumns"
            multi-select
            :selection.sync="selectedItems"
            :custom-search="{
              placeholder: 'Search candidate names',
              handler: candidateSearch,
              field: 'userId',
            }"
            @change="getAssessmentsRequested"
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
                >
                  {{ row.candidate.fullName }}
                </RouterLink>
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
              <TableCell :title="tableColumns[4].title">
                <div class="moj-button-menu__wrapper">
                  <button
                    v-if="hasPermissions([
                      PERMISSIONS.assessments.permissions.canReadAssessments.value,
                      PERMISSIONS.assessments.permissions.canCreateAssessments.value,
                      PERMISSIONS.assessments.permissions.canUpdateAssessments.value
                    ])"
                    class="moj-button-menu__item govuk-button govuk-button--secondary info-btn--independent-asssessment--upload"
                    @click="modalUploadOpen({ id: row.id, uuid: $store.state.auth.currentUser.uid, ...row })"
                  >
                    {{ row.fileRef ? 'Replace' : 'Upload' }}
                  </button>
                </div>
                <a
                  v-if="onStaging"
                  target="_blank"
                  :href="`https://assessments-staging.judicialappointments.digital/sign-in?email=${row.assessor.email}&ref=assessments/${row.id}`"
                  class="govuk-link"
                >Test the assessments app</a>
              </TableCell>
            </template>
          </Table>
        </div>

        <div
          v-else-if="activeTab == 'completed'"
          class="application-details"
        >
          <Banner
            :message="sendErrors"
            status="warning"
          />
          <Table
            key="completed"
            data-key="id"
            :data="assessmentsCompletedRecords"
            :page-size="50"
            :columns="tableColumns"
            multi-select
            :selection.sync="selectedItems"
            :custom-search="{
              placeholder: 'Search candidate names',
              handler: candidateSearch,
              field: 'userId',
            }"
            @change="getAssessmentsCompleted"
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
                >
                  {{ row.candidate.fullName }}
                </RouterLink>
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
              <TableCell :title="tableColumns[4].title">
                <div class="moj-button-menu">
                  <div
                    v-if="row.status === 'completed'"
                    class="moj-button-menu__wrapper"
                  >
                    <DownloadLink
                      v-if="row.fileRef && !unapprovedLateSubmission(row)"
                      v-model="row.fileRef"
                      class="moj-button-menu__item"
                      :file-name="row.fileRef"
                      :file-path="row.filePath"
                      :exercise-id="exercise.id"
                      :application-id="row.application.id"
                      :assessor-id="row.assessor.id"
                      title="Download assessment"
                      type="button"
                    />
                    <ActionButton
                      v-if="unapprovedLateSubmission(row)"
                      class="moj-button-menu__item"
                      type="primary"
                      @click="approveLateSubmission(row)"
                    >
                      Approve late submission
                    </ActionButton>
                  </div>
                </div>
                <div class="moj-button-menu__wrapper">
                  <button
                    v-if="hasPermissions([
                      PERMISSIONS.assessments.permissions.canReadAssessments.value,
                      PERMISSIONS.assessments.permissions.canCreateAssessments.value,
                      PERMISSIONS.assessments.permissions.canUpdateAssessments.value
                    ])"
                    class="moj-button-menu__item govuk-button govuk-button--secondary info-btn--independent-asssessment--upload"
                    @click="modalUploadOpen({ id: row.id, uuid: $store.state.auth.currentUser.uid, ...row })"
                  >
                    {{ row.fileRef ? 'Replace' : 'Upload' }}
                  </button>
                </div>
                <a
                  v-if="onStaging"
                  target="_blank"
                  :href="`https://assessments-staging.judicialappointments.digital/sign-in?email=${row.assessor.email}&ref=assessments/${row.id}`"
                  class="govuk-link"
                >Test the assessments app</a>
              </TableCell>
            </template>
          </Table>
        </div>
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
            Start Assessments
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
    this.$store.dispatch('assessments/bind', { exerciseId: this.exercise.id });
    next();
  },
  data() {
    return {
      exerciseStage: '',
      uploadAsssessmentProps: {},
      tabs: [
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
      ],
      activeTab: 'notrequested',
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Candidate name', sort: 'candidate.fullName', default: true },
        { title: 'Assessor' },
        { title: 'Status' },
        { title: 'Actions' },
      ],
      sendErrors: '',
      modalType: '',
      modalParams: null,
      modalCallback: null,
      selectedItems: [],
    };
  },
  computed: {
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
    assessmentsNotRequestedRecords() {
      return this.$store.state.assessments.assessmentsNotRequestedRecords;
    },
    assessmentsRequestedRecords() {
      return this.$store.state.assessments.assessmentsRequestedRecords;
    },
    assessmentsCompletedRecords() {
      return this.$store.state.assessments.assessmentsCompletedRecords;
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
      return !this.assessmentsNotRequestedRecords.length && !isDateInFuture(this.exercise.contactIndependentAssessors);
    },
    hasInitialisedAssessments() {
      return this.exercise.assessments && this.exercise.assessments.initialised;
    },
    hasStartedSending() {
      return this.exercise.assessments && this.exercise.assessments.sent;
    },
    onStaging() {
      return window.location.href.indexOf('admin-staging') > 0;
    },
    canCancelAssessments() {
      return this.hasInitialisedAssessments && !(this.exercise.assessments && this.exercise.assessments.sent);
    },
    canSendRequests() {
      return this.hasInitialisedAssessments && !(this.exercise.assessments && this.exercise.assessments.sent);
    },
    canSendReminders() {
      return this.hasInitialisedAssessments && (this.exercise.assessments && this.exercise.assessments.sent);
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
    async cancelAssessments() {
      await functions.httpsCallable('cancelAssessments')({ exerciseId: this.exercise.id });
    },
    async sendRequests(assessmentIds) {
      this.resetSelectedItems();
      const result = await functions.httpsCallable('sendAssessmentRequests')({ exerciseId: this.exercise.id, assessmentIds });
      this.processSendAssessmentResult(result);
    },
    async sendReminders(assessmentIds) {
      this.resetSelectedItems();
      const result = await functions.httpsCallable('sendAssessmentReminders')({ exerciseId: this.exercise.id, assessmentIds });
      this.processSendAssessmentResult(result);
    },
    async resendRequest(assessmentId) {
      const result = await functions.httpsCallable('sendAssessmentRequests')({ exerciseId: this.exercise.id, assessmentId: assessmentId, resend: true });
      this.processSendAssessmentResult(result);
    },
    async sendReminder(assessmentId) {
      const result = await functions.httpsCallable('sendAssessmentReminders')({ exerciseId: this.exercise.id, assessmentId: assessmentId });
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
    async testRequest(assessmentIds) {
      for (let i = 0; i < assessmentIds.length; i++) {
        const assessmentId = assessmentIds[i];
        console.log('send', assessmentId);
        // await functions.httpsCallable('testAssessmentNotification')({ assessmentId, notificationType: 'request' });
      }
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
    getAssessmentsNotRequested(params) {
      this.$store.dispatch(
        'assessments/bind',
        {
          exerciseId: this.exercise.id,
          status: 'draft',
          ...params,
        }
      );
    },
    getAssessmentsRequested(params) {
      this.$store.dispatch(
        'assessments/bind',
        {
          exerciseId: this.exercise.id,
          status: 'pending',
          ...params,
        }
      );
    },
    getAssessmentsCompleted(params) {
      this.$store.dispatch(
        'assessments/bind',
        {
          exerciseId: this.exercise.id,
          status: 'completed',
          ...params,
        }
      );
    },
    getTableData(params) {
      this.$store.dispatch(
        'assessments/bind',
        {
          exerciseId: this.exercise.id,
          ...params,
        }
      );
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
