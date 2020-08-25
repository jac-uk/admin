<template>
  <div class="govuk-grid-column-full">
    <h2 class="govuk-heading-l">
      Review qualifying test
    </h2>

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

    <dl class="govuk-summary-list">
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
        </dd>
      </div>
    </dl>

    <button
      v-if="isDraft"
      class="govuk-button govuk-!-margin-right-3"
      @click="submitForApproval"
    >
      Submit for Approval
    </button>
    <button
      v-if="isReadyForApproval"
      class="govuk-button govuk-!-margin-right-3"
      @click="approve"
    >
      Approve
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
    isReadyForApproval() {
      return this.qualifyingTest && this.qualifyingTest.status && this.qualifyingTest.status === QUALIFYING_TEST.STATUS.SUBMITTED;
    },
    questionLabel() {
      let label = 'Question';

      if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO) {
        label = 'Scenario';
      }
      return label;
    },
  },
  methods: {
    submitForApproval() {
      this.$store.dispatch('qualifyingTest/submitForApproval');
    },
    approve() {
      this.$store.dispatch('qualifyingTest/approve');
    },
  },
};
</script>
