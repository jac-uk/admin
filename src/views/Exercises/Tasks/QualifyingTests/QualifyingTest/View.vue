<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        Qualifying Test
      </h2>
      <h3 class="govuk-heading-l">
        {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
      </h3>

      <table class="govuk-table">
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Type
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.type | lookup }}
            </td>
            <th class="govuk-table__header">
              State
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.status | lookup }}
            </td>
          </tr>
          <tr class="govuk-table__row">
            <th class="govuk-table__header">
              Start Date
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.startDate | formatDate('longdatetime') }}
            </td>
            <th class="govuk-table__header">
              End Date
            </th>
            <td class="govuk-table__cell">
              {{ qualifyingTest.endDate | formatDate('longdatetime') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>    

    <div 
      v-if="hasCounts"
      class="govuk-grid-column-one-half" 
    >
      <div
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Number of Participants
        </h2>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: 'all', }}"
          >
            Initialised
          </RouterLink>
          / 
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('ACTIVATED') }}"
          >
            Activated
          </RouterLink>
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ qualifyingTest.counts.initialised }} / {{ qualifyingTest.counts.activated }}</span>
        </p>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('COMPLETED') }}"
          >
            Completed
          </RouterLink>
          <span 
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ qualifyingTest.counts.completed }}</span>
        </p>
      </div>
    </div>

    <div 
      v-if="hasCounts"
      class="govuk-grid-column-one-half"
    >
      <div 
        v-if="true"
        class="background-light-grey govuk-!-padding-4 govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-heading-l">
          Progress
        </h2>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('STARTED'), }}"
          >
            Started
          </RouterLink>
          <span class="govuk-heading-l govuk-!-margin-top-1">{{ qualifyingTest.counts.started }}</span>
        </p>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: 'qualifying-test-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('PROGRESS'), }}"
          >
            In Progress
          </RouterLink>
          <span class="govuk-heading-l govuk-!-margin-top-1">{{ qualifyingTest.counts.inProgress }}</span>
        </p>
      </div>
    </div>

    <div class="govuk-grid-column-full govuk-!-margin-bottom-2">
      <span v-if="isCreated || isSubmitted || isApproved">
        <button
          :disabled="false"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="btnEdit"
        >
          Edit
        </button>
        <button
          :disabled="false"
          class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
          @click="btnReview"
        >
          Review
        </button>
      </span>

      <div v-if="isApproved">
        <select
          id="exercise-stage"
          v-model="exerciseStage"
          class="govuk-select govuk-!-margin-right-3"
        >
          <option value="">
            Choose applications
          </option>
          <option
            v-if="exercise.applicationRecords.review"
            value="review" 
          >
            Review ({{ exercise.applicationRecords.review }})
          </option>
          <option
            v-if="exercise.applicationRecords.shortlisted"
            value="shortlisted" 
          >
            Shortlisted ({{ exercise.applicationRecords.shortlisted }})
          </option>
          <option
            v-if="exercise.applicationRecords.selected"
            value="selected" 
          >
            Selected ({{ exercise.applicationRecords.selected }})
          </option>
        </select>
        <ActionButton
          type="primary"
          :disabled="!exerciseStage"
          class="govuk-!-margin-right-3"
          @click="btnInitialise"
        >
          Initialise
        </ActionButton>
      </div>

      <ActionButton
        v-if="isInitialised"
        :disabled="false"
        class="govuk-!-margin-right-3"
        @click="btnActivate"
      >
        Activate
      </ActionButton>

      <button
        v-if="isActivated"
        :disabled="true"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnPause"
      >
        Pause
      </button>

      <button
        v-if="isInitialised || isActivated || isPaused || isCompleted"
        class="govuk-button govuk-!-margin-right-3"
        @click="btnResponses('all')"
      >
        Responses
      </button>

      <button
        v-if="isInitialised || isActivated || isPaused"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnResponses('reasonable-adjustments')"
      >
        Reasonable Adjustments
      </button>

      <ActionButton
        v-if="isInitialised"
        type="secondary"
        :disabled="false"
        class="govuk-!-margin-right-3"
        @click="btnSendInvites"
      >
        Send invites
      </ActionButton>

      <ActionButton
        v-if="isEndDatePassed || isActivated || isCompleted"
        type="primary"
        :disabled="isEndDatePassed"
        class="govuk-!-margin-right-3"
        @click="btnGetScores"
      >
        Close & Score
      </ActionButton>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import ActionButton from '@/components/ActionButton';
import { QUALIFYING_TEST } from '@/helpers/constants';
import { isDateGreaterThan } from '@/helpers/date';

export default {
  components: {
    ActionButton,
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
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
    qualifyingTest() {
      const record = this.$store.state.qualifyingTest.record;
      return record;
    },
    hasCounts() {
      return this.qualifyingTest.counts;
    },
    isCreated() {
      return this.qualifyingTest.status === QUALIFYING_TEST.STATUS.CREATED;
    },
    isSubmitted() {
      return this.qualifyingTest.status === QUALIFYING_TEST.STATUS.SUBMITTED;
    },
    isApproved() {
      return this.qualifyingTest.status === QUALIFYING_TEST.STATUS.APPROVED;
    },
    isInitialised() {
      return this.qualifyingTest.status === QUALIFYING_TEST.STATUS.INITIALISED;
    },
    isActivated() {
      return this.qualifyingTest.status === QUALIFYING_TEST.STATUS.ACTIVATED;
    },
    isPaused() {
      return this.qualifyingTest.status === QUALIFYING_TEST.STATUS.PAUSED;
    },
    isCompleted() {
      return this.qualifyingTest.status === QUALIFYING_TEST.STATUS.COMPLETED;
    },
    isEndDatePassed() {
      const today = new Date();
      const endDate = new Date(this.qualifyingTest.endDate);
      return isDateGreaterThan(endDate, today);
    },
  },
  methods: {
    btnEdit() {
      this.$router.push({ name: 'qualifying-test-edit', params: { qualifyingTestId: this.qualifyingTestId } });
    },
    btnReview() {
      this.$router.push({ name: 'qualifying-test-review', params: { qualifyingTestId: this.qualifyingTestId } });
    },
    async btnSendInvites() {
      await functions.httpsCallable('sendQualifyingTestReminders')({ qualifyingTestId: this.qualifyingTestId });
    },
    async btnInitialise() {
      // @TODO allow user to select stage (maybe status too) they want to include in the test
      await functions.httpsCallable('initialiseQualifyingTest')({ qualifyingTestId: this.qualifyingTestId, stage: this.exerciseStage });
    },
    async btnActivate() {
      await functions.httpsCallable('activateQualifyingTest')({ qualifyingTestId: this.qualifyingTestId });
    },
    async btnGetScores() {
      await functions.httpsCallable('scoreQualifyingTest')({ qualifyingTestId: this.qualifyingTestId });
    },
    btnPause() {
      // eslint-disable-next-line no-console
      console.log('Button clicked: PAUSE');
    },
    btnResponses(status) {
      const route = { 
        name: 'qualifying-test-responses', 
        params: { 
          qualifyingTestId: this.$route.params.qualifyingTestId, 
          status: status, 
        },
      };
      
      this.$router.push(route);
    },
    qtStatus(status) {
      return QUALIFYING_TEST.STATUS[status];
    },
  },  
};
</script>
