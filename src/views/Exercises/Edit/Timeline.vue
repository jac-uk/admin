<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <a
          ref="BackLinkToAddShortlistingMethods"
          class="govuk-back-link"
          @click="$router.push({ name: 'exercise-edit-shortlisting', params: { id: 'example' } })"
        >
          Back
        </a>

        <h1 class="govuk-heading-xl">
          Add exercise timeline
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
          Selection day dates
        </h2>

        <RepeatableFields
          v-model="exercise.selectionDays"
          :component="repeatableFields.SelectionDay"
        />

        <h2 class="govuk-heading-l">
          Candidate checks
        </h2>

        <DateInput
          id="character-checks"
          v-model="exercise.characterChecks"
          label="Character checks"
          type="month"
        />
        <DateInput
          id="statutory-consultation"
          v-model="exercise.statutoryConsultation"
          label="Statutory consultation"
          type="month"
        />

        <h2 class="govuk-heading-l">
          Final outcome
        </h2>

        <DateInput
          id="final-outcome"
          v-model="exercise.finalOutcome"
          label="Final outcome"
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

export default {
  components: {
    DateInput,
    TimeInput,
    RepeatableFields,
  },
  data(){
    const exercise = this.$store.state.exerciseDocument.record;

    return {
      repeatableFields: {
        SelectionDay,
      },
      exercise: {
        applicationOpenDate: exercise.applicationOpenDate || null,
        applicationCloseDate: exercise.applicationCloseDate || null,
        sjcaTestDate: exercise.sjcaTestDate || null,
        sjcaTestStartTime: exercise.sjcaTestStartTime || null,
        sjcaTestEndTime: exercise.sjcaTestEndTime || null,
        sjcaTestOutcome: exercise.sjcaTestOutcome || null,
        scenarioTestDate: exercise.scenarioTestDate ||null,
        scenarioTestStartTime: exercise.scenarioTestStartTime || null,
        scenarioTestEndTime: exercise.scenarioTestEndTime || null,
        scenarioTestOutcome: exercise.scenarioTestOutcome || null,
        contactIndependentAssessors: exercise.contactIndependentAssessors || null,
        selectionDayStart: exercise.selectionDayStart || null,
        selectionDayEnd: exercise.selectionDayEnd || null,
        characterChecks: exercise.characterChecks || null,
        statutoryConsultation: exercise.statutoryConsultation || null,
        finalOutcome: exercise.finalOutcome || null,
        selectionDays: exercise.selectionDays || [],
      },
    };
  },
  methods: {
    async save() {
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
    },
  },
};
</script>
