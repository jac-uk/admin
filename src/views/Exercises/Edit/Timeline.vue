<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Timeline
        </h1>
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
        />
        <DateInput
          id="closed-for-applications"
          v-model="exercise.applicationCloseDate"
          label="Closed for applications"
        />

        <h2 class="govuk-heading-l">
          Shortlisting dates
        </h2>

        <div
          v-if="paperSift"
          ref="paperSift"
        >
          <h3 class="govuk-heading-m">
            Paper sift
          </h3>
          <DateInput
            id="paper-sift"
            v-model="exercise.paperSiftDate"
            label="Sift date"
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
          />
          <TimeInput
            id="test-start-time"
            v-model="exercise.sjcaTestStartTime"
            label="Start time"
          />
          <TimeInput
            id="test-end-time"
            v-model="exercise.sjcaTestEndTime"
            label="End time"
          />
          <DateInput
            id="test-outcome"
            v-model="exercise.sjcaTestOutcome"
            label="Outcome to candidates"
            type="month"
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
          />
          <TimeInput
            id="scenario-test-start-time"
            v-model="exercise.scenarioTestStartTime"
            label="Start time"
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
          />
        </div>

        <h2 class="govuk-heading-l">
          Independent assessors
        </h2>

        <DateInput
          id="contact-independent-assessors"
          v-model="exercise.contactIndependentAssessors"
          label="Contact independent assessors"
          hint="Email reminders will be sent to assessors who have not responded after 2 weeks."
        />

        <h2 class="govuk-heading-l">
          Selection day
        </h2>

        <RepeatableFields
          v-model="exercise.selectionDays"
          :component="repeatableFields.SelectionDay"
        />

        <h2 class="govuk-heading-l">
          Final outcome
        </h2>

        <DateInput
          id="final-outcome"
          v-model="exercise.finalOutcome"
          label="Final outcome to candidates"
          type="month"
        />

        <button class="govuk-button">
          Save and continue
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import DateInput from '@/components/Form/DateInput';
import TimeInput from '@/components/Form/TimeInput';
import RepeatableFields from '@/components/RepeatableFields';
import SelectionDay from '@/components/RepeatableFields/SelectionDay';
import BackLink from '@/components/BackLink';

export default {
  components: {
    DateInput,
    TimeInput,
    RepeatableFields,
    BackLink,
  },
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
        sjcaTestDate: exercise.sjcaTestDate || null,
        sjcaTestStartTime: exercise.sjcaTestStartTime || null,
        paperSiftDate: exercise.paperSiftDate || null,
        sjcaTestEndTime: exercise.sjcaTestEndTime || null,
        scenarioTestDate: exercise.scenarioTestDate ||null,
        scenarioTestStartTime: exercise.scenarioTestStartTime || null,
        scenarioTestEndTime: exercise.scenarioTestEndTime || null,
        contactIndependentAssessors: exercise.contactIndependentAssessors || null,
        finalOutcome: exercise.finalOutcome || null,
        selectionDays: exercise.selectionDays || null,
      },
    };
  },
  computed: {
    scenarioQT() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('Scenario test qualifying test (QT)');
    },
    situationalJudgementOrCriticalAnalysisQT() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('Situational judgement qualifying test (QT)') || this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('Critical analysis qualifying test (QT)');
    },
    paperSift() {
      return this.exerciseShortlistingMethods && this.exerciseShortlistingMethods.includes('Paper sift');
    },
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']);
    },
  },
};
</script>
