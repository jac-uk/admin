<template>
  <div>
    <h1 class="govuk-heading-l">
      Independent Assessments
    </h1>
    <div
      v-if="hasInitialisedAssessments"
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
    <dl class="govuk-summary-list">
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
          v-if="canCancelAssessments"
          class="govuk-!-margin-right-3"
          @click="cancelAssessments()"
        >
          Cancel Assessments
        </ActionButton>
        <ActionButton
          v-if="canSendRequestsToAll"
          type="primary"
          @click="sendRequestsToAll()"
        >
          Send to all
        </ActionButton>
        <ActionButton
          v-if="canSendRemindersToAll"
          type="primary"
          @click="sendRemindersToAll()"
        >
          Send reminders
        </ActionButton>

        <Table
          data-key="id"
          :data="assessments"
          :page-size="50"
          :columns="tableColumns"
          :search="['candidate.fullName']"
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
                  v-if="!hasStartedSending"
                  class="moj-button-menu__wrapper"
                >
                  <ActionButton
                    class="moj-button-menu__item"
                    @click="testRequest(row.id)"
                  >
                    Test Request
                  </ActionButton>
                </div>
                <div
                  v-else-if="row.status === 'completed'"
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
                <div
                  v-else
                  class="moj-button-menu__wrapper"
                >
                  <ActionButton
                    class="moj-button-menu__item"
                    @click="resendRequest(row.id)"
                  >
                    Request
                  </ActionButton>

                  <ActionButton
                    class="moj-button-menu__item"
                    @click="sendReminder(row.id)"
                  >
                    Reminder
                  </ActionButton>
                </div>
              </div>
              <div class="moj-button-menu__wrapper">
                <button
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
      <div v-else>
        <select
          id="exercise-stage"
          v-model="exerciseStage"
          class="govuk-select govuk-!-margin-right-3"
        >
          <option value="">
            Choose applications
          </option>
          <option
            v-if="hasApplicationRecordsReview"
            value="review"
          >
            Review ({{ exercise.applicationRecords.review }})
          </option>
          <option
            v-if="hasApplicationsRecordsShortlisted"
            value="shortlisted"
          >
            Shortlisted ({{ exercise.applicationRecords.shortlisted }})
          </option>

          <option
            v-if="hasApplicationsRecordsSelected"
            value="selected"
          >
            Selected ({{ exercise.applicationRecords.selected }})
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

export default {
  components: {
    Table,
    TableCell,
    ActionButton,
    Banner,
    DownloadLink,
    Modal,
    UploadAssessment,
  },
  data() {
    return {
      exerciseStage: '',
      uploadAsssessmentProps: {},
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Candidate name', sort: 'candidate.fullName', default: true },
        { title: 'Assessor' },
        { title: 'Status' },
        { title: 'Actions' },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
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
    assessments() {
      return this.$store.state.assessments.records;
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
      return !this.assessments.length && !isDateInFuture(this.exercise.contactIndependentAssessors);
    },
    hasInitialisedAssessments() {
      return this.exercise.assessments && this.exercise.assessments.initialised;
    },
    hasStartedSending() {
      return this.exercise.assessments && this.exercise.assessments.sent;
    },
    hasApplicationRecordsReview(){
      if (this.exercise && this.exercise.applicationRecords && this.exercise.applicationRecords.review){
        return true;
      } else {
        return false;
      }
    },
    hasApplicationsRecordsShortlisted(){
      if (this.exercise && this.exercise.applicationRecords && this.exercise.applicationRecords.shortlisted){
        return true;
      } else {
        return false;
      }
    },
    hasApplicationsRecordsSelected(){
      if (this.exercise && this.exercise.applicationRecords && this.exercise.applicationRecords.selected){
        return true;
      } else {
        return false;
      }
    },
    onStaging() {
      return window.location.href.indexOf('admin-staging') > 0;
    },
    canCancelAssessments() {
      return this.hasInitialisedAssessments && !(this.exercise.assessments && this.exercise.assessments.sent);
    },
    canSendRequestsToAll() {
      return this.hasInitialisedAssessments && !(this.exercise.assessments && this.exercise.assessments.sent);
    },
    canSendRemindersToAll() {
      return this.hasInitialisedAssessments && (this.exercise.assessments && this.exercise.assessments.sent);
    },
    uploadPath() {
      const exerciseId = this.exercise.id;
      const applicationId = this.assessment.application.id;
      const assessorId = this.assessorId;
      return `/exercise/${exerciseId}/application/${applicationId}/assessor/${assessorId}`;
    },
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('assessments/bind', { exerciseId: this.exercise.id });
    next();
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
    async sendRequestsToAll() {
      await functions.httpsCallable('sendAssessmentRequests')({ exerciseId: this.exercise.id });
    },
    async sendRemindersToAll() {
      await functions.httpsCallable('sendAssessmentReminders')({ exerciseId: this.exercise.id });
    },
    async resendRequest(assessmentId) {
      await functions.httpsCallable('sendAssessmentRequests')({ exerciseId: this.exercise.id, assessmentId: assessmentId, resend: true });
    },
    async sendReminder(assessmentId) {
      await functions.httpsCallable('sendAssessmentReminders')({ exerciseId: this.exercise.id, assessmentId: assessmentId });
    },
    async testRequest(assessmentId) {
      await functions.httpsCallable('testAssessmentNotification')({ assessmentId: assessmentId, notificationType: 'request' });
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
    modalUploadOpen(obj) {
      this.uploadAsssessmentProps = obj;
      this.$refs.modalRef.openModal();
    },
    modalUploadClose() {
      this.$refs.modalRef.closeModal();
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
  },
};
</script>

<style scoped>
.govuk-table__cell,
.govuk-table__header {
  vertical-align: middle;
}
</style>
