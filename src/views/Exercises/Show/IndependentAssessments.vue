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
      v-if="!assessments.length"
    >
      <p class="govuk-body">
        No assessments requests sent yet.
      </p>

      <ActionButton
        class="moj-button-menu__item"
        @click="initialiseAssessments()"
      >
        Request assessments
      </ActionButton>

      <table
        v-if="applications.length"
        class="govuk-table govuk-!-margin-top-4"
      >
        <caption class="govuk-table__caption">
          Assessors listed by candidates
        </caption>
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
              Assessors
            </th>
            <th
              scope="col"
              class="govuk-table__header app-custom-class"
            >
              Date submitted
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr
            v-for="application in applications"
            :key="application.id"
            class="govuk-table__row"
          >
            <th
              scope="row"
              class="govuk-table__header"
            >
              <router-link
                class="govuk-link"
                :to="{name: 'exercise-show-application', params: { applicationId: application.id }}"
              >
                {{ application.referenceNumber }}
              </router-link>
            </th>
            <td class="govuk-table__cell">
              <span v-if="application.personalDetails">{{ application.personalDetails.fullName }}</span>
            </td>
            <td class="govuk-table__cell">
              <p class="govuk-body">
                <a
                  :href="`mailto:${application.firstAssessorEmail}`"
                  class="govuk-link govuk-link--no-visited-state"
                  target="_blank"
                >
                  {{ application.firstAssessorFullName }}
                </a>
              </p>
              <p class="govuk-body">
                <a
                  :href="`mailto:${application.secondAssessorEmail}`"
                  class="govuk-link govuk-link--no-visited-state"
                  target="_blank"
                >
                  {{ application.secondAssessorFullName }}
                </a>
              </p>
            </td>
            <td class="govuk-table__cell">
              {{ application.appliedAt | formatDate }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <table
      v-else
      class="govuk-table"
    >
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
            Uploaded
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
            <span v-if="assessment.file && assessment.file.name">
              {{ assessment.file.uploadedAt | formatDate }}
            </span>
            <span v-else>Not yet received</span>
          </td>
          <td class="govuk-table__cell">
            <div class="moj-button-menu">
              <div
                v-if="assessment.status === 'uploaded'"
                class="moj-button-menu__wrapper"
              >
                <DownloadLink
                  :file-name="`assessment/assessment.fileRef`"
                  :exercise-id="exercise.id"
                  :user-id="assessment.candidate.id"
                  title="Independent Assessment"
                />
              </div>
              <div
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
</template>

<script>
import { functions } from '@/firebase';
import { isDateInFuture } from '@/helpers/date';
import ActionButton from '@/components/ActionButton';

export default {
  components: {
    ActionButton,
  },
  data () {
    return {
      initialisingAssessments: false,
      sendingReminder: [],
      resendingRequest: [],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applications() {
      return this.$store.state.applications.records;
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
    this.$store.dispatch('applications/bind', { exerciseId: this.exercise.id, status: 'applied' });
    this.$store.dispatch('assessments/bind', { exerciseId: this.exercise.id });
  },
  beforeRouteUpdate (to, from, next) {
    this.$store.dispatch('applications/bind', { exerciseId: this.exercise.id, status: 'applied' });
    this.$store.dispatch('assessments/bind', { exerciseId: this.exercise.id });
    next();
  },
  methods: {
    async initialiseAssessments() {
      await functions.httpsCallable('initialiseAssessmentsForExercise')({ exerciseId: this.exercise.id });
    },
    async resendRequest(assessmentId) {
      await functions.httpsCallable('sendRequestForAssessment')({ assessmentId: assessmentId });
    },
    async sendReminder(assessmentId) {
      await functions.httpsCallable('sendReminderForAssessment')({ assessmentId: assessmentId });
    },
  },
};
</script>

