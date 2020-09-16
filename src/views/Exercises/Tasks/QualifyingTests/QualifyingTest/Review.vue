<template>
  <div class="govuk-grid-column-full">
    <h2 class="govuk-heading-m">
      Qualifying Test
    </h2>
    <h3 class="govuk-heading-l">
      {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
    </h3>

    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'qualifying-test-edit'}"
      >
        Update details
      </router-link>
    </div>

    <h2 class="govuk-heading-m">
      Test details
    </h2>

    <dl class="govuk-summary-list">
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Type
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.type | lookup }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Status
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.status | lookup }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Title
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.title }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Start date
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.startDate | formatDate('datetime') }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          End date
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.endDate | formatDate('datetime') }}
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Duration
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.testDuration }} minutes
        </dd>
      </div>
      <div class="govuk-summary-list__row">
        <dt class="govuk-summary-list__key">
          Additional instructions
        </dt>
        <dd class="govuk-summary-list__value">
          <ul class="govuk-list">
            <li
              v-for="(item, index) in qualifyingTest.additionalInstructions"
              :key="index"
            >
              {{ item.text }}
            </li>
          </ul>
        </dd>
      </div>
    </dl>

    <div class="text-right">
      <router-link
        class="govuk-link"
        :to="{name: 'qualifying-test-question-builder'}"
      >
        Update questions
      </router-link>
    </div>

    <h2 class="govuk-heading-m">
      Questions
    </h2>

    <dl
      v-if="qualifyingTest.testQuestions"
      class="govuk-summary-list"
    >
      <div
        v-if="qualifyingTest.testQuestions.introduction"
        class="govuk-summary-list__row"
      >
        <dt
          class="govuk-summary-list__key"
        >
          Introduction
        </dt>
        <dd class="govuk-summary-list__value">
          {{ qualifyingTest.testQuestions.introduction }}
        </dd>
      </div>

      <div
        v-for="(testQuestion, index) in qualifyingTest.testQuestions.questions"
        :key="index"
        class="govuk-summary-list__row"
      >
        <dt class="govuk-summary-list__key">
          {{ questionLabel }} {{ index + 1 }}
        </dt>
        <dd class="govuk-summary-list__value">
          <!-- eslint-disable -->
          <div
            v-html="testQuestion.details"
          />
          <!-- eslint-enable -->

          <hr class="govuk-section-break govuk-section-break--visible">
          <ol>
            <li
              v-for="(option, i) in testQuestion.options"
              :key="i"
            >
              {{ option.answer }}
            </li>
          </ol>
          <hr 
            v-if="isSituationalJudgement || isCriticalAnalysis"
            class="govuk-section-break govuk-section-break--visible"
          >
          <div
            v-if="isSituationalJudgement && testQuestion.mostAppropriate >= 0 && testQuestion.leastAppropriate >= 0"
          >
            Most appropriate: {{ testQuestion.options[testQuestion.mostAppropriate].answer }} <br>
            Least appropriate: {{ testQuestion.options[testQuestion.leastAppropriate].answer }}
          </div>
          <div
            v-if="isCriticalAnalysis && testQuestion.correct >= 0"
          >
            Correct: {{ testQuestion.options[testQuestion.correct].answer }}
          </div>
        </dd>
      </div>
    </dl>

    <div v-if="isDryRun">
      <div class="text-right">
        <router-link
          class="govuk-link"
          :to="{name: 'qualifying-test-dry-run'}"
        >
          Update dry run details 
        </router-link>
      </div>

      <h2 class="govuk-heading-m">
        Dry run details
      </h2>

      <dl class="govuk-summary-list">
        <div
          class="govuk-summary-list__row"
        >
          <dt
            class="govuk-summary-list__key"
          >
            Invited emails
          </dt>
          <dd class="govuk-summary-list__value">
            {{ qualifyingTest.invitedEmails | toCSV }}
          </dd>
        </div>
      </dl>
    </div>

    <span v-if="isDraft">
      <button
        class="govuk-button govuk-!-margin-right-3"
        @click="submitForApproval"
      >
        Submit for Approval
      </button>
    </span>
    
    <span v-if="isReadyForApproval">
      <button
        class="govuk-button govuk-!-margin-right-3"
        @click="approve"
      >
        Approve
      </button>
    </span>

    <button
      v-if="isApproved"
      class="govuk-button govuk-button--secondary govuk-!-margin-right-3"
      @click="btnGoBack"
    >
      Go back
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { QUALIFYING_TEST } from '@/helpers/constants';

export default {
  computed: {
    ...mapState({
      qualifyingTest: state => state.qualifyingTest.record,
    }),
    isDraft() {
      return this.qualifyingTest && this.qualifyingTest.status && this.qualifyingTest.status === QUALIFYING_TEST.STATUS.CREATED;
    },
    isDryRun() {
      return this.qualifyingTest && this.qualifyingTest.mode && this.qualifyingTest.mode === 'dry-run';
    },
    isReadyForApproval() {
      return this.qualifyingTest && this.qualifyingTest.status && this.qualifyingTest.status === QUALIFYING_TEST.STATUS.SUBMITTED;
    },
    isApproved() {
      return !this.isDraft && !this.isReadyForApproval;
    },
    questionLabel() {
      let label = 'Question';

      if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO) {
        label = 'Scenario';
      }
      return label;
    },
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
    isCriticalAnalysis() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS ? true : false;
    },
    isScenario() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO ? true : false;
    },
    isSituationalJudgement() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT ? true : false;
    },
  },
  methods: {
    submitForApproval() {
      this.$store.dispatch('qualifyingTest/submitForApproval');
      this.$router.push({ name: 'qualifying-test-view', params: { qualifyingTestId: this.qualifyingTestId } });
    },
    approve() {
      this.$store.dispatch('qualifyingTest/approve');
      // #799 On Approval of the QT send back to the dashboard
      this.$router.push({ name: 'qualifying-test-view', params: { qualifyingTestId: this.qualifyingTestId } });
    },
    btnGoBack() {
      // TODO check we need go back button
    },
  },
};
</script>
