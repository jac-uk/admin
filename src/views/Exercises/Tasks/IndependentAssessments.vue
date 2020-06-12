<template>
  <div>
    <h1 class="govuk-heading-l">
      Independent Assessments
    </h1>

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
    </dl>

    <div
      v-if="!hasInitialisedAssessments"
    >
      <select
        id="exercise-stage"
        v-model="exerciseStage"
        class="govuk-select govuk-!-margin-right-3"
      >
        <option value="">
          Choose applications
        </option>
        <option value="review">
          Review ({{ exercise.applicationRecords.review }})
        </option>
        <option value="shortlisted">
          Shortlisted ({{ exercise.applicationRecords.shortlisted }})
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

    <div v-else>
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
              <router-link
                class="govuk-link"
                :to="{name: 'exercise-show-application', params: { applicationId: assessment.application.id }}"
              >
                {{ assessment.application.referenceNumber }}
              </router-link>
            </th>
            <td class="govuk-table__cell">
              {{ assessment.candidate.fullName }}
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
                    v-if="assessment.fileRef"
                    class="moj-button-menu__item"
                    :file-name="assessment.fileRef"
                    :exercise-id="exercise.id"
                    :application-id="assessment.application.id"
                    :assessor-id="assessment.assessor.id"
                    title="Download assessment"
                    type="button"
                  />
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
  </div>
</template>

<script>
import { functions } from '@/firebase';
import { isDateInFuture } from '@/helpers/date';
import ActionButton from '@/components/ActionButton';
import DownloadLink from '@/components/DownloadLink';

export default {
  components: {
    ActionButton,
    DownloadLink,
  },
  data() {
    return {
      exerciseStage: '',
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    assessments() {
      return this.$store.state.assessments.records;
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
  },
};
</script>

<style scoped>
.govuk-table__cell,
.govuk-table__header {
  vertical-align: middle;
}
</style>
