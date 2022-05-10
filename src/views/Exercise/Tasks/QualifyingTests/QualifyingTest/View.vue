
<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        {{ isTieBreaker ? 'Equal merit tie-breaker' : 'Qualifying test' }}
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
            :to="{ name: routeNamePrefix + '-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: 'all', }}"
          >
            Initialised
          </RouterLink>
          /
          <RouterLink
            :to="{ name: routeNamePrefix + '-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('ACTIVATED') }}"
          >
            Activated
          </RouterLink>
          <span
            class="display-block govuk-heading-l govuk-!-margin-top-1"
          >{{ qualifyingTest.counts.initialised }} / {{ qualifyingTest.counts.activated }}</span>
        </p>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: routeNamePrefix + '-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('COMPLETED') }}"
          >
            Completed
          </RouterLink> / Auto-submitted
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
            :to="{ name: routeNamePrefix + '-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('STARTED'), }}"
          >
            Started
          </RouterLink>
          <span class="govuk-heading-l govuk-!-margin-top-1">{{ qualifyingTest.counts.started }}</span>
        </p>
        <p class="govuk-body">
          <RouterLink
            :to="{ name: routeNamePrefix + '-responses', params: { qualifyingTestId: this.$route.params.qualifyingTestId, status: qtStatus('PROGRESS'), }}"
          >
            In Progress
          </RouterLink>
          <span class="govuk-heading-l govuk-!-margin-top-1">{{ qualifyingTest.counts.inProgress }}</span>
        </p>
      </div>
    </div>

    <div class="govuk-grid-column-full govuk-!-margin-bottom-2">
      <span v-if="(isCreated || isSubmitted || isApproved) && hasPermissions([PERMISSIONS.qualifyingTests.permissions.canUpdateQualifyingTests.value])">
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

      <div v-if="isApproved && hasPermissions([PERMISSIONS.qualifyingTests.permissions.canUpdateQualifyingTests.value])">
        <div v-if="isDryRun">
          <ActionButton
            type="primary"
            :disabled="!isDryRunCandidates"
            class="govuk-!-margin-right-3"
            @click="btnInitialise"
          >
            Create dry run tests
          </ActionButton>
          <router-link
            v-if="!isDryRunCandidates"
            :to="{ name: 'qualifying-test-dry-run' }"
            class="govuk-hint"
          >
            Please add emails before creating
          </router-link>
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
          <div v-if="isProcessing">
            <Select
              v-if="!isTieBreaker"
              id="exercise-stage"
              v-model="exerciseStage"
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
            </Select>
            <Select
              v-if="isTieBreaker && hasEMPCandidates"
              id="exercise-stage"
              v-model="exerciseStage"
            >
              <option value="">
                Choose applications (for EMP candidates)
              </option>
              <option
                v-if="applicationRecordCounts.reviewEMP"
                value="review"
              >
                Review ({{ applicationRecordCounts.reviewEMP }})
              </option>
              <option
                v-if="applicationRecordCounts.shortlistedEMP"
                value="shortlisted"
              >
                Shortlisted ({{ applicationRecordCounts.shortlistedEMP }})
              </option>
              <option
                v-if="applicationRecordCounts.selectedEMP"
                value="selected"
              >
                Selected ({{ applicationRecordCounts.selectedEMP }})
              </option>
            </Select>
          </div>
          <div v-else>
            <Banner
              :message="`No applications found`"
              status="warning"
            />
          </div>
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

      <Banner
        v-if="isTieBreaker && exerciseHasOpenQTs && hasPermissions([PERMISSIONS.qualifyingTests.permissions.canUpdateQualifyingTests.value])"
        message="You cannot open this tie-breaker test yet as there are still qualifying tests open for this exercise"
        status="warning"
      />

      <ActionButton
        v-if="isInitialised && hasPermissions([PERMISSIONS.qualifyingTests.permissions.canUpdateQualifyingTests.value])"
        :disabled="!isUserAdded || !canOpenTests"
        class="govuk-!-margin-right-3"
        @click="btnActivate"
      >
        Open tests
      </ActionButton>

      <button
        v-if="isActivated && hasPermissions([PERMISSIONS.qualifyingTests.permissions.canUpdateQualifyingTests.value])"
        :disabled="true"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnPause"
      >
        Pause
      </button>

      <button
        v-if="(isInitialised || isActivated || isPaused || isCompleted) && hasPermissions([PERMISSIONS.qualifyingTestResponses.permissions.canReadQualifyingTestResponses.value])"
        class="govuk-button govuk-!-margin-right-3"
        @click="btnResponses('all')"
      >
        Responses
      </button>

      <button
        v-if="(isInitialised || isActivated || isPaused) && hasPermissions([PERMISSIONS.qualifyingTestResponses.permissions.canReadQualifyingTestResponses.value])"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnResponses('reasonable-adjustments')"
      >
        Reasonable Adjustments
      </button>

      <button
        v-if="canCreateCopy && hasPermissions([PERMISSIONS.qualifyingTests.permissions.canUpdateQualifyingTests.value])"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnCreateCopy"
      >
        Create Mop Up Test
      </button>

      <button
        v-if="hasPermissions([PERMISSIONS.qualifyingTests.permissions.canUpdateQualifyingTests.value])"
        ref="btnCopyToClipboard"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
        @click="btnCopyToClipboard"
      >
        Copy QT to clipboard
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
        v-if="(isActivated || isCompleted) && hasPermissions([PERMISSIONS.qualifyingTests.permissions.canUpdateQualifyingTests.value])"
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
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import { isProcessing, applicationRecordCounts } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';

export default {
  components: {
    ActionButton,
    Select,
    Banner,
  },
  mixins: [permissionMixin],
  data() {
    return {
      exerciseStage: '',
      candidateStatus: 'all',
      availableStatuses: null,
    };
  },
  computed: {
    exerciseId() {
      return this.$route.params.id;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isProcessing() {
      return isProcessing(this.exercise);
    },
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
    },
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
    qualifyingTest() {
      return this.$store.state.qualifyingTest.record;
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
    isDryRunCandidates() {
      return this.qualifyingTest && this.qualifyingTest.invitedEmails && this.qualifyingTest.invitedEmails.length > 0;
    },
    isMopUp() {
      return this.qualifyingTest && this.qualifyingTest.mode && this.qualifyingTest.mode === 'mop-up';
    },
    isInitialised() {
      return this.qualifyingTest.status === QUALIFYING_TEST.STATUS.INITIALISED;
    },
    isUserAdded() {
      return this.qualifyingTest.counts.initialised > 0;
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
    canOpenTests() {
      // do not allow QTs or tie-breakers to be opened until they have been initialised
      // also, do not allow tie-breakers to be opened if there are open QTs for this exercise
      return this.isInitialised && !(this.isTieBreaker && this.exerciseHasOpenQTs);
    },
    exerciseHasOpenQTs() {
      const qtList = this.$store.getters['qualifyingTest/getActivatedQTs'].filter(row => {
        return !row.isTieBreaker;
      });
      return qtList.length > 0;
    },
    hasEMPCandidates() {
      const appRecs = this.applicationRecordCounts;
      return appRecs.reviewEMP || appRecs.shortlistedEMP || appRecs.selectedEMP;
    },
    isTieBreaker() {
      return this.qualifyingTest.isTieBreaker;
    },
    routeNamePrefix() {
      return this.isTieBreaker ? 'equal-merit-tie-breaker' : 'qualifying-test';
    },
    testQuestionsJson() {
      const {
        additionalInstructions,
        feedbackSurvey,
        maxScore,
        responsesReport,
        results,
        testDuration,
        testQuestions,
        title,
        type,
      } = this.qualifyingTest;

      const clipboardQT = {
        additionalInstructions,
        feedbackSurvey,
        maxScore,
        responsesReport,
        results,
        testDuration,
        testQuestions,
        title,
        type,
      };

      const returnValue = JSON.stringify(clipboardQT);
      return returnValue;
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
  created() {
    if (this.$store.state.qualifyingTest.records.length === 0) {
      this.$store.dispatch('qualifyingTest/bindQTs', { exerciseId: this.exerciseId });
    }
  },
  methods: {
    btnEdit() {
      this.$router.push({ name: `${this.routeNamePrefix}-edit`, params: { qualifyingTestId: this.qualifyingTestId } });
    },
    btnReview() {
      this.$router.push({ name: `${this.routeNamePrefix}-review`, params: { qualifyingTestId: this.qualifyingTestId } });
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
      // console.log('Button clicked: PAUSE');
    },
    btnResponses(status) {
      const route = {
        name: `${this.routeNamePrefix}-responses`,
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
        name: `${this.routeNamePrefix}-edit`,
        params: {
          qualifyingTestId: newTestId,
        },
      });
    },
    btnCopyToClipboard() {
      this.$refs.btnCopyToClipboard.innerText = 'Copying to clipboard ...';
      this.$refs.btnCopyToClipboard.disabled = 'disabled';
      const el = document.createElement('textarea');
      el.value = this.testQuestionsJson;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      setTimeout(() => {
        this.$refs.btnCopyToClipboard.innerText = 'QT Copied to clipboard';
        this.$refs.btnCopyToClipboard.disabled = false;
      },3000);
    },
  },
};
</script>
