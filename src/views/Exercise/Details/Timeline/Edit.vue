<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <div
          v-if="!hasJourney"
          class="text-right"
        >
          <BackLink class="govuk-!-margin-top-0 govuk-!-margin-bottom-0" />
        </div>

        <h2 class="govuk-heading-l govuk-!-margin-bottom-2">
          Timeline
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <div class="govuk_body govuk-!-margin-bottom-2">
          <p class="govuk-body-l govuk-!-margin-bottom-2">
            You can return to this page later to add or change dates.
          </p>
          <a
            href="#"
            class="govuk-link"
          >
            View key dates of all JAC exercises
          </a>
          <span class="govuk-hint">
            This can help you plan your own key dates (opens in a new tab).
          </span>
        </div>

        <h2 class="govuk-heading-l">
          Application dates
        </h2>
        <DateInput
          id="open-for-applications"
          v-model="formData.applicationOpenDate"
          label="Open for applications"
          required
        />
        <DateInput
          id="closed-for-applications"
          v-model="formData.applicationCloseDate"
          label="Closed for applications"
          required
        />

        <h2 class="govuk-heading-l">
          Shortlisting
        </h2>
        <DateInput
          v-if="hasPaperSift"
          id="sift-start-date"
          v-model="formData.siftStartDate"
          label="Sift start date"
          required
        />
        <DateInput
          v-if="hasPaperSift"
          id="sift-end-date"
          v-model="formData.siftEndDate"
          label="Sift end date"
          required
        />
        <DateInput
          v-if="hasNameBlindSift"
          id="name-blind-sift-start-date"
          v-model="formData.nameBlindSiftStartDate"
          label="Name-blind sift start date"
          required
        />
        <DateInput
          v-if="hasNameBlindSift"
          id="name-blind-sift-end-date"
          v-model="formData.nameBlindSiftEndDate"
          label="Name-blind sift end date"
          required
        />
        <DateInput
          v-if="hasTelephoneAssessment"
          id="telephone-assessment-start-date"
          v-model="formData.telephoneAssessmentStartDate"
          label="Telephone assessment start date"
          required
        />
        <DateInput
          v-if="hasTelephoneAssessment"
          id="telephone-assessment-end-date"
          v-model="formData.telephoneAssessmentEndDate"
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
            v-model="formData.situationalJudgementTestDate"
            label="Test date"
            required
          />
          <TimeInput
            id="sj-test-start-time"
            v-model="formData.situationalJudgementTestStartTime"
            label="Start time"
            required
          />
          <TimeInput
            id="sj-test-end-time"
            v-model="formData.situationalJudgementTestEndTime"
            label="End time"
            required
          />
          <DateInput
            id="sj-test-outcome"
            v-model="formData.situationalJudgementTestOutcome"
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
            v-model="formData.criticalAnalysisTestDate"
            label="Test date"
            required
          />
          <TimeInput
            id="ca-test-start-time"
            v-model="formData.criticalAnalysisTestStartTime"
            label="Start time"
            required
          />
          <TimeInput
            id="ca-test-end-time"
            v-model="formData.criticalAnalysisTestEndTime"
            label="End time"
            required
          />
          <DateInput
            id="ca-test-outcome"
            v-model="formData.criticalAnalysisTestOutcome"
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
            v-model="formData.scenarioTestDate"
            label="Test date"
            required
          />
          <TimeInput
            id="scenario-test-start-time"
            v-model="formData.scenarioTestStartTime"
            label="Start time"
            required
          />
          <TimeInput
            id="scenario-test-end-time"
            v-model="formData.scenarioTestEndTime"
            label="End time"
          />
          <DateInput
            id="scenario-test-outcome"
            v-model="formData.scenarioTestOutcome"
            label="Outcome to candidates"
            required
          />
        </div>

        <DateInput
          id="shortlisting-outcome-date"
          v-model="formData.shortlistingOutcomeDate"
          label="Shortlisting outcome"
          type="month"
          required
        />

        <div v-if="hasIndependentAssessments">
          <h2 class="govuk-heading-l">
            Independent Assessors
          </h2>
          <DateInput
            id="contact-independent-assessors"
            v-model="formData.contactIndependentAssessors"
            label="Contact independent assessors"
            hint="Email reminders will be sent to assessors who have not responded after 2 weeks."
            :disabled="assessmentsInitialised"
            required
          />
          <DateInput
            id="independent-assessments-return-date"
            v-model="formData.independentAssessmentsReturnDate"
            label="Independent Assessments return date"
            hint="An asessor can submit late after this date, up until the (optional) hard limit below."
            :disabled="assessmentsInitialised"
            required
          />
          <DateInput
            id="independent-assessments-hard-limit"
            v-model="formData.independentAssessmentsHardLimitDate"
            label="Independent Assessments hard limit"
            :hint="`An assessor cannot submit after ${iaHardLimitTime} on this date.`"
            :disabled="assessmentsInitialised"
          />
        </div>

        <h2 class="govuk-heading-l">
          Eligibility SCC
        </h2>
        <DateInput
          id="eligibility-scc-date"
          v-model="formData.eligibilitySCCDate"
          label="Eligibility SCC date"
          required
        />

        <h2 class="govuk-heading-l">
          Selection Day
        </h2>
        <RepeatableFields
          v-model="formData.selectionDays"
          :component="repeatableFields.SelectionDay"
          required
        />

        <h2 class="govuk-heading-l">
          Character Checks
        </h2>
        <DateInput
          id="character-checks-date"
          v-model="formData.characterChecksDate"
          label="Character Checks request date"
          required
        />

        <DateInput
          id="character-checks-date"
          v-model="formData.characterChecksReturnDate"
          label="Character Checks return date"
          required
        />

        <h2 class="govuk-heading-l">
          Statutory Consultation
        </h2>
        <DateInput
          id="statutory-consultation-date"
          v-model="formData.statutoryConsultationDate"
          label="Statutory Consultation date"
          required
        />

        <h2 class="govuk-heading-l">
          Character and Selection SCC
        </h2>
        <DateInput
          id="character-and-selection-scc-date"
          v-model="formData.characterAndSCCDate"
          label="Character and SCC date"
          required
        />

        <h2 class="govuk-heading-l">
          Final outcome
        </h2>
        <DateInput
          id="final-outcome"
          v-model="formData.finalOutcome"
          label="Final outcome to candidates"
          type="month"
          required
        />

        <h2 class="govuk-heading-l">
          Equal merit dates
        </h2>
        <DateInput
          id="emd-second-stage-start-date"
          v-model="formData.equalMeritSecondStageStartDate"
          label="Second stage start date"
          required
        />
        <DateInput
          id="emd-second-stage-end-date"
          v-model="formData.equalMeritSecondStageEndDate"
          label="Second stage end date"
          required
        />
        <DateInput
          id="emp-scc-date"
          v-model="formData.eMPSCCDate"
          label="EMP SCC date"
          required
        />
        <DateInput
          id="emp-outcome-date"
          v-model="formData.eMPOutcomeDate"
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
import { hasIndependentAssessments } from '@/helpers/exerciseHelper';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary';
import DateInput from '@jac-uk/jac-kit/draftComponents/Form/DateInput';
import TimeInput from '@jac-uk/jac-kit/draftComponents/Form/TimeInput';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields';
import SelectionDay from '@/components/RepeatableFields/SelectionDay';
import BackLink from '@jac-uk/jac-kit/draftComponents/BackLink';
import { formatDate } from '@/helpersTMP/date';

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
      siftStartDate: null,
      siftEndDate: null,
      nameBlindSiftStartDate: null,
      nameBlindSiftEndDate: null,
      telephoneAssessmentStartDate: null,
      telephoneAssessmentEndDate: null,
      criticalAnalysisTestDate: null,
      criticalAnalysisTestStartTime: null,
      criticalAnalysisTestEndTime: null,
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
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
      repeatableFields: {
        SelectionDay,
      },
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    hasIndependentAssessments() {
      return hasIndependentAssessments(this.exercise);
    },
    hasScenarioQT() {
      return this.exercise && this.exercise.shortlistingMethods && this.exercise.shortlistingMethods.includes('scenario-test-qualifying-test');
    },
    hasSituationalJudgementQT() {
      return this.exercise && this.exercise.shortlistingMethods && this.exercise.shortlistingMethods.includes('situational-judgement-qualifying-test');
    },
    hasCriticalAnalysisQT() {
      return this.exercise && this.exercise.shortlistingMethods && this.exercise.shortlistingMethods.includes('critical-analysis-qualifying-test');
    },
    hasPaperSift() {
      return this.exercise && this.exercise.shortlistingMethods && this.exercise.shortlistingMethods.includes('paper-sift');
    },
    hasNameBlindSift() {
      return this.exercise && this.exercise.shortlistingMethods && this.exercise.shortlistingMethods.includes('name-blind-paper-sift');
    },
    hasTelephoneAssessment() {
      return this.exercise && this.exercise.shortlistingMethods && this.exercise.shortlistingMethods.includes('telephone-assessment');
    },
    assessmentsInitialised() {
      return this.exercise && this.exercise.assessments && this.exercise.assessments.initialised && this.exercise.assessments.initialised > 0;
    },
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
    iaHardLimitTime() {
      return this.exercise.independentAssessmentsHardLimitDate ? formatDate(this.exercise.independentAssessmentsHardLimitDate, 'time') : false;
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.timeline'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-timeline'));
    },
  },
};
</script>
