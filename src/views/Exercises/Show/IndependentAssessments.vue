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
          {{ exercise.contactIndependentAssessors | formatDate }}
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
          {{ exercise.independentAssessmentsReturnDate | formatDate }}
        </dd>
        <dd class="govuk-summary-list__actions" />
      </div>
    </dl>

    <div
      v-if="!(exercise.assessments && exercise.assessments.initialised)"
    >
      <ActionButton
        @click="initialiseAssessments()"
      >
        Start Assessments
      </ActionButton>
    </div>

    <div v-else>
      <ActionButton
        @click="sendRequests()"
      >
        Send to all
      </ActionButton>

      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <!--<th
              scope="col"
              class="govuk-table__header app-custom-class"
            >
              <div class="govuk-checkboxes govuk-checkboxes&#45;&#45;small">
                <div class="govuk-checkboxes__item">
                  <input
                    id="checkboxes"
                    class="govuk-checkboxes__input"
                    type="checkbox"
                  >
                  <label
                    class="govuk-label govuk-checkboxes__label"
                    for="checkboxes"
                  />
                </div>
              </div>
            </th>-->
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
            <!--<td class="govuk-table__cell">
              <div class="govuk-checkboxes govuk-checkboxes&#45;&#45;small">
                <div class="govuk-checkboxes__item">
                  <input
                    id="checkbox-application"
                    class="govuk-checkboxes__input"
                    type="checkbox"
                  >
                  <label
                    class="govuk-label govuk-checkboxes__label"
                  />
                </div>
              </div>
            </td>-->
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
              <p class="govuk-body">
                <a
                  :href="`mailto:${assessment.assessor.email}`"
                  class="govuk-link govuk-link--no-visited-state"
                  target="_blank"
                >
                  {{ assessment.assessor.fullName }}
                </a>
              </p>
            </td>
            <td class="govuk-table__cell">
              {{ assessment.status | lookup }}
            </td>
            <td class="govuk-table__cell">
              <div class="moj-button-menu">
                <div
                  v-if="assessment.status === 'completed'"
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
      await functions.httpsCallable('initialiseAssessments')({ exerciseId: this.exercise.id });
    },
    async sendRequests() {
      await functions.httpsCallable('sendAssessmentRequests')({ exerciseId: this.exercise.id });
    },
    async resendRequest(assessmentId) {
      await functions.httpsCallable('sendAssessmentRequests')({ exerciseId: this.exercise.id, assessmentId: assessmentId });
    },
    async sendReminder(assessmentId) {
      await functions.httpsCallable('sendAssessmentReminders')({ exerciseId: this.exercise.id, assessmentId: assessmentId });
    },
  },
};
</script>

