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

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header app-custom-class"
              >
                Reference number
              </th>
              <th
                scope="col"
                class="govuk-table__header app-custom-class"
              >
                Candidate name
              </th>
              <th
                scope="col"
                class="govuk-table__header app-custom-class"
              >
                Assessor
              </th>
              <th
                scope="col"
                class="govuk-table__header app-custom-class"
              >
                Status
              </th>
              <th
                scope="col"
                class="govuk-table__header app-custom-class"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr
              v-for="assessment in assessments"
              :key="assessment.id"
              class="govuk-table__row"
            >
              <th
                scope="row"
                class="govuk-table__header"
              >
                <RouterLink
                  class="govuk-link"
                  :to="{name: 'exercise-application', params: { applicationId: assessment.application.id }}"
                >
                  {{ assessment.application.referenceNumber }}
                </RouterLink>
              </th>
              <td class="govuk-table__cell">
                <RouterLink
                  :to="{ name: 'candidates-view', params: { id: assessment.candidate.id } }"
                >
                  {{ assessment.candidate.fullName }}
                </RouterLink>
              </td>
              <td class="govuk-table__cell">
                <a
                  :href="`mailto:${assessment.assessor.email}`"
                  class="govuk-link govuk-link--no-visited-state"
                  target="_blank"
                >
                  {{ assessment.assessor.fullName }}
                </a>
              </td>
              <td class="govuk-table__cell">
                {{ assessment.status | lookup }}
                <strong
                  v-if="lateIASubmission(assessment)"
                  class="govuk-tag govuk-tag--red"
                >
                  Late
                </strong>
              </td>
              <td
                class="govuk-table__cell govuk-!-padding-top-0"
              >
                <div class="moj-button-menu">
                  <div
                    v-if="!hasStartedSending"
                    class="moj-button-menu__wrapper"
                  >
                    <ActionButton
                      class="moj-button-menu__item"
                      @click="testRequest(assessment.id)"
                    >
                      Test Request
                    </ActionButton>
                  </div>
                  <div
                    v-else-if="assessment.status === 'completed'"
                    class="moj-button-menu__wrapper"
                  >
                    <DownloadLink
                      v-if="assessment.fileRef && !unapprovedLateSubmission(assessment)"
                      v-model="assessment.fileRef"
                      class="moj-button-menu__item"
                      :file-name="assessment.fileRef"
                      :file-path="assessment.filePath"
                      :exercise-id="exercise.id"
                      :application-id="assessment.application.id"
                      :assessor-id="assessment.assessor.id"
                      title="Download assessment"
                      type="button"
                    />
                    <ActionButton
                      v-if="unapprovedLateSubmission(assessment)"
                      class="moj-button-menu__item"
                      type="primary"
                      @click="approveLateSubmission(assessment)"
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
                      @click="resendRequest(assessment.id)"
                    >
                      Request
                    </ActionButton>

                    <ActionButton
                      class="moj-button-menu__item"
                      @click="sendReminder(assessment.id)"
                    >
                      Reminder
                    </ActionButton>
                  </div>
                </div>
                <button 
                  class="govuk-button govuk-button--secondary info-btn--independent-asssessment--upload"
                  @click="modalUploadOpen({ id: assessment.id, uuid: $store.state.auth.currentUser.uid, ...assessment })"
                >
                  {{ assessment.fileRef ? 'Replace' : 'Upload' }}
                </button>
                <br>
                <a 
                  v-if="onStaging"
                  target="_blank"
                  :href="`https://assessments-staging.judicialappointments.digital/sign-in?email=${assessment.assessor.email}&ref=assessments/${assessment.id}`"
                  class="govuk-link"
                >Test the assessments app</a>
              </td>
            </tr>
          </tbody>
        </table>      
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
import { isDateInFuture, isDateGreaterThan } from '@/helpers/date';
import ActionButton from '@/components/ActionButton';
import DownloadLink from '@/components/DownloadLink';
import Banner from '@/components/Page/Banner';
import Modal from '@/components/Modal/Modal';
import UploadAssessment from '@/components/Modal/views/UploadAssessment';

export default {
  components: {
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
  created() {
    this.$store.dispatch('assessments/bind', { exerciseId: this.exercise.id });
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
  },
};
</script>

<style scoped>
.govuk-table__cell,
.govuk-table__header {
  vertical-align: middle;
}
</style>
