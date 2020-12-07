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
        <DateInput
          v-if="hasPaperSift"
          id="sift-start-date"
          v-model="exercise.siftStartDate"
          label="Sift start date"
          required
        />
        <DateInput
          v-if="hasPaperSift"
          id="sift-end-date"
          v-model="exercise.siftEndDate"
          label="Sift end date"
          required
        />
        <DateInput
          v-if="hasNameBlindSift"
          id="name-blind-sift-start-date"
          v-model="exercise.nameBlindSiftStartDate"
          label="Name-blind sift start date"
          required
        />
        <DateInput
          v-if="hasNameBlindSift"
          id="name-blind-sift-end-date"
          v-model="exercise.nameBlindSiftEndDate"
          label="Name-blind sift end date"
          required
        />
        <DateInput
          v-if="hasTelephoneAssessment"
          id="telephone-assessment-start-date"
          v-model="exercise.telephoneAssessmentStartDate"
          label="Telephone assessment start date"
          required
        />
        <DateInput
          v-if="hasTelephoneAssessment"
          id="telephone-assessment-end-date"
          v-model="exercise.telephoneAssessmentEndDate"
          label="Telephone assessment end date"
          required
        />

        <div
          v-if="hasSituationalJudgementQT"
          ref="situationalJudgementQT"
        >
          <h3 class="govuk-heading-m">
            Situational judgement qualifying test (QT)
          </h3>
          <DateInput
            id="sj-test-date"
            v-model="exercise.situationalJudgementTestDate"
            label="Test date"
            required
          />
          <TimeInput
            id="sj-test-start-time"
            v-model="exercise.situationalJudgementTestStartTime"
            label="Start time"
            required
          />
          <TimeInput
            id="sj-test-end-time"
            v-model="exercise.situationalJudgementTestEndTime"
            label="End time"
            required
          />
          <DateInput
            id="sj-test-outcome"
            v-model="exercise.situationalJudgementTestOutcome"
            label="Outcome to candidates"
            required
          />
        </div>

        <div
          v-if="hasCriticalAnalysisQT"
          ref="criticalAnalysisQT"
        >
          <h3 class="govuk-heading-m">
            Critical analysis qualifying test (QT)
          </h3>
          <DateInput
            id="ca-test-date"
            v-model="exercise.criticalAnalysisTestDate"
            label="Test date"
            required
          />
          <TimeInput
            id="ca-test-start-time"
            v-model="exercise.criticalAnalysisTestStartTime"
            label="Start time"
            required
          />
          <TimeInput
            id="ca-test-end-time"
            v-model="exercise.criticalAnalysisTestEndTime"
            label="End time"
            required
          />
          <DateInput
            id="ca-test-outcome"
            v-model="exercise.criticalAnalysisTestOutcome"
            label="Outcome to candidates"
            required
          />
        </div>

        <div
          v-if="hasScenarioQT"
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
            id="scenario-test-end-time"
            v-model="exercise.scenarioTestEndTime"
            label="End time"
          />
          <DateInput
            id="scenario-test-outcome"
            v-model="exercise.scenarioTestOutcome"
            label="Outcome to candidates"
            required
          />
        </div>

        <DateInput
          id="shortlisting-outcome-date"
          v-model="exercise.shortlistingOutcomeDate"
          label="Shortlisting outcome"
          type="month"
          required
        />

        <h2 class="govuk-heading-l">
          Independent Assessors
        </h2>
        <DateInput
          id="contact-independent-assessors"
          v-model="exercise.contactIndependentAssessors"
          label="Contact independent assessors"
          hint="Email reminders will be sent to assessors who have not responded after 2 weeks."
          :disabled="assessmentsInitialised"
          required
        />
        <DateInput
          id="independent-assessments-return-date"
          v-model="exercise.independentAssessmentsReturnDate"
          label="Independent Assessments return date"
          hint="An asessor can submit late after this date, up until the (optional) hard limit below."
          :disabled="assessmentsInitialised"
          required
        />
        <DateInput
          id="independent-assessments-hard-limit"
          v-model="exercise.independentAssessmentsHardLimitDate"
          label="Independent Assessments hard limit"
          hint="An assessor cannot submit late after 23:59 on this date."
          :disabled="assessmentsInitialised"
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
          Selection Day
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
          label="Character Checks request date"
          required
        />

        <DateInput
          id="character-checks-date"
          v-model="exercise.characterChecksReturnDate"
          label="Character Checks return date"
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

        <h2 class="govuk-heading-l">
          Equal merit dates
        </h2>
        <DateInput
          id="emd-second-stage-start-date"
          v-model="exercise.equalMeritSecondStageStartDate"
          label="Second stage start date"
          required
        />
        <DateInput
          id="emd-second-stage-end-date"
          v-model="exercise.equalMeritSecondStageEndDate"
          label="Second stage end date"
          required
        />
        <DateInput
          id="emp-scc-date"
          v-model="exercise.eMPSCCDate"
          label="EMP SCC date"
          required
        />
        <DateInput
          id="emp-outcome-date"
          v-model="exercise.eMPOutcomeDate"
          label="EMP Outcomes"
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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';
import TimeInput from '@jac-uk/jac-kit/draftComponents/Form/TimeInput';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields';
import SelectionDay from '@/components/RepeatableFields/SelectionDay';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
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
    const defaults = {
      applicationOpenDate: null,
      applicationCloseDate: null,
      assessments: null,
      siftStartDate: null,
      siftEndDate: null,
      nameBlindSiftStartDate: null,
      nameBlindSiftEndDate: null,
      telephoneAssessmentStartDate: null,
      telephoneAssessmentEndDate: null,
      criticalAnalysisTestDate: null,
      criticalAnalysisTestStartTime: null,
      criticalAnalysisTestEndime: null,
      criticalAnalysisTestOutcome: null,
      situationalJudgementTestDate: null,
      situationalJudgementTestStartTime: null,
      situationalJudgementTestEndTime: null,
      situationalJudgementTestOutcome: null,
      scenarioTestDate: null,
      scenarioTestStartTime: null,
      scenarioTestEndTime: null,
      scenarioTestOutcome: null,
      shortlistingOutcomeDate: null,
      contactIndependentAssessors: null,
      independentAssessmentsReturnDate: null,
      independentAssessmentsHardLimitDate: null,
      eligibilitySCCDate: null,
      selectionDays: null,
      characterChecksDate: null,
      characterChecksReturnDate: null,
      statutoryConsultationDate: null,
      characterAndSCCDate: null,
      finalOutcome: null,
      equalMeritSecondStageStartDate: null,
      equalMeritSecondStageEndDate: null,
      eMPSCCDate: null,
      eMPOutcomeDate: null,
    };
    const data = this.$store.getters['exerciseDocument/data']();
    const exercise = { ...defaults, ...data };
    return {
      repeatableFields: {
        SelectionDay,
      },
      exerciseShortlistingMethods: exercise.shortlistingMethods,
      assessments: exercise.assessments,
      exercise: exercise,
    };
  },
  computed: {
    hasScenarioQT() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('scenario-test-qualifying-test');
    },
    hasSituationalJudgementQT() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('situational-judgement-qualifying-test');
    },
    hasCriticalAnalysisQT() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('critical-analysis-qualifying-test');
    },
    hasPaperSift() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('paper-sift');
    },
    hasNameBlindSift() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('name-blind-paper-sift');
    },
    hasTelephoneAssessment() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('telephone-assessment');
    },
    assessmentsInitialised() {
      return this.assessments && this.assessments.initialised && this.assessments.initialised > 0;
    },
  },
  methods: {
    async save(isValid) {
      this.exercise.progress.timeline = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-show-timeline'));
    },
  },
};
</script>
