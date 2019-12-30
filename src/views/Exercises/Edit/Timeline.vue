<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Timeline
        </h1>
        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />
        <p class="govuk-body-l">
          You can return to this page later to add or change dates.
        </p>

        <p class="govuk_body">
          <a
            href="#"
            class="govuk-link"
          >
            View key dates of all JAC exercises
          </a>
          <span class="govuk-hint">
            This can help you plan your own key dates (opens in a new tab).
          </span>
        </p>

        <h2 class="govuk-heading-l">
          Application dates
        </h2>
        <DateInput
          id="open-for-applications"
          v-model="exercise.applicationOpenDate"
          label="Open for applications"
          required
        />
        <DateInput
          id="closed-for-applications"
          v-model="exercise.applicationCloseDate"
          label="Closed for applications"
          required
        />

        <h2 class="govuk-heading-l">
          Shortlisting
        </h2>

        <div
          v-if="paperSift"
          ref="paperSift"
        >
          <h3 class="govuk-heading-m">
            Sifts
          </h3>
          <DateInput
            id="sift-date"
            v-model="exercise.siftDate"
            label="Sift date"
            required
          />
          <DateInput
            id="name-blind-sift-date"
            v-model="exercise.nameBlindSiftDate"
            label="Name-blind sift date"
            required
          />
          <DateInput
            id="telephone-assessment-date"
            v-model="exercise.telephoneAssessmentDate"
            label="Telephone assessment date"
            required
          />
        </div>

        <div
          v-if="situationalJudgementOrCriticalAnalysisQT"
          ref="situationalJudgementOrCriticalAnalysisQT"
        >
          <h3 class="govuk-heading-m">
            Situational judgement qualifying test (QT), Critical analysis qualifying test (QT)
          </h3>
          <DateInput
            id="test-date"
            v-model="exercise.sjcaTestDate"
            label="Test date"
            required
          />
          <TimeInput
            id="test-start-time"
            v-model="exercise.sjcaTestStartTime"
            label="Start time"
            required
          />
          <TimeInput
            id="test-end-time"
            v-model="exercise.sjcaTestEndTime"
            label="End time"
            required
          />
          <DateInput
            id="test-outcome"
            v-model="exercise.sjcaTestOutcome"
            label="Outcome to candidates"
            type="month"
            required
          />
        </div>

        <div
          v-if="scenarioQT"
          ref="scenarioQT"
        >
          <h3 class="govuk-heading-m">
            Scenario test qualifying test (QT)
          </h3>
          <DateInput
            id="scenario-test-date"
            v-model="exercise.scenarioTestDate"
            label="Test date"
            required
          />
          <TimeInput
            id="scenario-test-start-time"
            v-model="exercise.scenarioTestStartTime"
            label="Start time"
            required
          />
          <TimeInput
            id="test-end-time"
            v-model="exercise.scenarioTestEndTime"
            label="End time"
          />
          <DateInput
            id="test-outcome"
            v-model="exercise.scenarioTestOutcome"
            label="Outcome to candidates"
            type="month"
            required
          />
        </div>
        <DateInput
          id="shortlisting-outcome-date"
          v-model="exercise.shortlistingOutcomeDate"
          label="Shortlisting outcome date"
          required
        />

        <h2 class="govuk-heading-l">
          Independent assessors
        </h2>

        <DateInput
          id="contact-independent-assessors"
          v-model="exercise.contactIndependentAssessors"
          label="Contact independent assessors"
          hint="Email reminders will be sent to assessors who have not responded after 2 weeks."
          required
        />
        <DateInput
          id="independent-assessments-return-date"
          v-model="exercise.independentAssessmentsReturnDate"
          label="Independent assessments return date"
          required
        />

        <h2 class="govuk-heading-l">
          Eligibility SCC
        </h2>

        <DateInput
          id="eligibility-scc-date"
          v-model="exercise.eligibilitySCCDate"
          label="Eligibility SCC date"
          required
        />

        <h2 class="govuk-heading-l">
          Selection day
        </h2>

        <RepeatableFields
          v-model="exercise.selectionDays"
          :component="repeatableFields.SelectionDay"
          required
        />

        <h2 class="govuk-heading-l">
          Character Checks
        </h2>

        <DateInput
          id="character-checks-date"
          v-model="exercise.characterChecksDate"
          label="Character checks date"
          required
        />

        <h2 class="govuk-heading-l">
          Statutory Consultation
        </h2>

        <DateInput
          id="statutory-consultation-date"
          v-model="exercise.statutoryConsultationDate"
          label="Statutory Consultation date"
          required
        />

        <h2 class="govuk-heading-l">
          Character and Selection SCC
        </h2>

        <DateInput
          id="character-and-selection-scc-date"
          v-model="exercise.characterAndSCCDate"
          label="Character and SCC date"
          required
        />

        <h2 class="govuk-heading-l">
          Final outcome
        </h2>

        <DateInput
          id="final-outcome"
          v-model="exercise.finalOutcome"
          label="Final outcome to candidates"
          type="month"
          required
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import DateInput from '@/components/Form/DateInput';
import TimeInput from '@/components/Form/TimeInput';
import RepeatableFields from '@/components/RepeatableFields';
import SelectionDay from '@/components/RepeatableFields/SelectionDay';
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    DateInput,
    TimeInput,
    RepeatableFields,
    BackLink,
  },
  extends: Form,
  data(){
    const exercise = this.$store.getters['exerciseDocument/data']();

    return {
      repeatableFields: {
        SelectionDay,
      },
      exerciseShortlistingMethods: exercise.shortlistingMethods,
      exercise: {
        applicationOpenDate: exercise.applicationOpenDate || null,
        applicationCloseDate: exercise.applicationCloseDate || null,
        siftDate: exercise.siftDate || null,
        nameBlindSiftDate: exercise.nameBlindSiftDate || null,
        telephoneAssessmentDate: exercise.telephoneAssessmentDate || null,
        sjcaTestDate: exercise.sjcaTestDate || null,
        sjcaTestStartTime: exercise.sjcaTestStartTime || null,
        sjcaTestEndTime: exercise.sjcaTestEndTime || null,
        sjcaTestOutcome: exercise.sjcaTestOutcome || null,
        scenarioTestDate: exercise.scenarioTestDate ||null,
        scenarioTestStartTime: exercise.scenarioTestStartTime || null,
        scenarioTestEndTime: exercise.scenarioTestEndTime || null,
        scenarioTestOutcome: exercise.scenarioTestOutcome || null,
        shortlistingOutcomeDate: exercise.shortlistingOutcomeDate || null,
        contactIndependentAssessors: exercise.contactIndependentAssessors || null,
        independentAssessmentsReturnDate: exercise.independentAssessmentsReturnDate || null,
        eligibilitySCCDate: exercise.eligibilitySCCDate || null,
        selectionDays: exercise.selectionDays || null,
        characterChecksDate: exercise.characterChecksDate || null,
        statutoryConsultationDate: exercise.statutoryConsultationDate || null,
        characterAndSCCDate: exercise.characterAndSCCDate || null,
        finalOutcome: exercise.finalOutcome || null,
      },
    };
  },
  computed: {
    scenarioQT() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('scenario-test-qualifying-test');
    },
    situationalJudgementOrCriticalAnalysisQT() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('situational-judgement-qualifying-test') || this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('critical-analysis-qualifying-test');
    },
    paperSift() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('paper-sift');
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-timeline'));
    },
  },
};
</script>
