<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        Qualifying Test
      </h2>
      <h3 class="govuk-heading-l">
        {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
        <span
          v-if="qualifyingTest.mode"
          class="govuk-tag govuk-tag--grey govuk-!-margin-left-2"
        >{{ qualifyingTest.mode | lookup }}</span>
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
          </RouterLink> / Out of Time
          <span
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ qualifyingTest.counts.completed }} / {{ qualifyingTest.counts.outOfTime }}</span>
        </p>
      </div>
    </div>

    <div
      v-if="hasCounts"
      class="govuk-grid-column-one-half"
    >
      <div
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
        <div v-if="isDryRun">
          <ActionButton
            type="primary"
            class="govuk-!-margin-right-3"
            @click="btnInitialise"
          >
            Create dry run tests
          </ActionButton>
        </div>
        <div v-else-if="isMopUp">
          <ActionButton
            type="primary"
            class="govuk-!-margin-right-3"
            @click="btnInitialise"
          >
            Create mop up tests
          </ActionButton>
        </div>
        <div v-else>
          <Select
            id="exercise-stage"
            v-model="exerciseStage"
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
          </Select>
          <Select
            v-if="availableStatuses && availableStatuses.length > 0"
            id="availableStatuses"
            v-model="candidateStatus"
            required
          >
            <option
              value="all"
            >
              All
            </option>
            <option
              v-for="item in availableStatuses"
              :key="item"
              :value="item"
            >
              {{ item | lookup }}
            </option>
          </Select>
          <ActionButton
            type="primary"
            :disabled="!exerciseStage"
            class="govuk-!-margin-right-3"
            @click="btnInitialise"
          >
            Create tests
          </ActionButton>
        </div>
      </div>

      <ActionButton
        v-if="isInitialised"
        :disabled="false"
        class="govuk-!-margin-right-3"
        @click="btnActivate"
      >
        Open tests
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

      <button
        v-if="canCreateCopy"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnCreateCopy"
      >
        Create Mop Up Test
      </button>

      <ActionButton
        v-if="isInitialised"
        type="secondary"
        :disabled="true"
        class="govuk-!-margin-right-3"
        @click="btnSendInvites"
      >
        Send invites
      </ActionButton>

      <ActionButton
        v-if="isActivated || isCompleted"
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
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { EXERCISE_STAGE, QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';
import { isDateGreaterThan } from '@jac-uk/jac-kit/helpers/date';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';

export default {
  components: {
    ActionButton,
    Select,
  },
  data() {
    return {
      exerciseStage: '',
      candidateStatus: 'all',
      availableStatuses: null,
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
      return this.qualifyingTest.counts && this.qualifyingTest.counts.initialised;
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
    isDryRun() {
      return this.qualifyingTest && this.qualifyingTest.mode && this.qualifyingTest.mode === 'dry-run';
    },
    isMopUp() {
      return this.qualifyingTest && this.qualifyingTest.mode && this.qualifyingTest.mode === 'mop-up';
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
    canCreateCopy() {
      return !this.isMopUp && (
        this.isInitialised ||
        this.isActivated ||
        this.isPaused ||
        this.isCompleted
      );
    },
  },
  watch: {
    exerciseStage: function (valueNow, valueBefore) {
      if (valueNow !== valueBefore) {
        this.availableStatuses = [];
      }
      if (valueNow === EXERCISE_STAGE.REVIEW) {
        this.availableStatuses = this.$store.getters['stageReview/availableStatuses'](this.exercise.shortlistingMethods, this.exercise.otherShortlistingMethod || []) ;
      }
      if (valueNow === EXERCISE_STAGE.SHORTLISTED) {
        this.availableStatuses = this.$store.getters['stageShortlisted/availableStatuses'];
      }
      if (valueNow === EXERCISE_STAGE.SELECTED) {
        this.availableStatuses = this.$store.getters['stageSelected/availableStatuses'];
      }
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
      const data = { qualifyingTestId: this.qualifyingTestId };
      if (!this.isDryRun) {
        data.stage = this.exerciseStage;
        if (this.candidateStatus) {
          data.status = this.candidateStatus;
        }
      }
      await functions.httpsCallable('initialiseQualifyingTest')( data );
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
    async btnCreateCopy() {
      const newTestId = await this.$store.dispatch('qualifyingTest/copy');
      this.$router.push({
        name: 'qualifying-test-edit',
        params: {
          qualifyingTestId: newTestId,
        },
      });

    },
  },
};
</script>
