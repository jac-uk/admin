<template>
  <div class="govuk-grid-row">
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
        v-model="applicationOpenDate"
        label="Open for applications"
      />
      <DateInput
        id="closed-for-applications"
        v-model="applicationCloseDate"
        label="Closed for applications"
      />

      <h2 class="govuk-heading-l">
        Shortlisting dates
      </h2>

      <h2 class="govuk-heading-m">
        Situational judgement qualifying test (QT), Critical analysis qualifying test (QT)
      </h2>
      <DateInput
        id="test-date"
        v-model="sjcaTestDate"
        label="Test date"
      />
      <TimeInput
        id="test-start-time"
        v-model="sjcaTestStartTime"
        label="Start time"
      />
      <TimeInput
        id="test-end-time"
        v-model="sjcaTestEndTime"
        label="End time"
      />
      <DateInput
        id="test-outcome"
        v-model="sjcaTestOutcome"
        label="Outcome to candidates"
        type="month"
      />

      <h2 class="govuk-heading-m">
        Scenario test qualifying test (QT)
      </h2>
      <DateInput
        id="scenario-test-date"
        v-model="scenarioTestDate"
        label="Test date"
      />
      <TimeInput
        id="scenario-test-start-time"
        v-model="scenarioTestStartTime"
        label="Start time"
      />
      <TimeInput
        id="test-end-time"
        v-model="scenarioTestEndTime"
        label="End time"
      />
      <DateInput
        id="test-outcome"
        v-model="scenarioTestOutcome"
        label="Outcome to candidates"
        type="month"
      />

      <h2 class="govuk-heading-l">
        Independent assessors
      </h2>

      <DateInput
        id="contact-independent-assessors"
        v-model="contactIndependentAssessors"
        label="Contact independent assessors"
        hint="Email reminders will be sent to assessors who have not responded after 2 weeks."
      />

      <h2 class="govuk-heading-l">
        Selection day dates
      </h2>

      <RepeatableFields
        v-model="selectionDays"
        :component="repeatableFields.SelectionDay"
      />

      <h2 class="govuk-heading-l">
        Candidate checks
      </h2>

      <DateInput
        id="character-checks"
        v-model="characterChecks"
        label="Character checks"
        type="month"
      />
      <DateInput
        id="statutory-consultation"
        v-model="statutoryConsultation"
        label="Statutory consultation"
        type="month"
      />

      <h2 class="govuk-heading-l">
        Final outcome
      </h2>

      <DateInput
        id="final-outcome"
        v-model="finalOutcome"
        label="Final outcome"
        type="month"
      />


      <button
        ref="linkToAboutTheVacancy"
        class="govuk-button"
        @click="$router.push({ name: 'exercise-edit-about', params: { id: 'example' } })"
      >
        Save and continue
      </button>
    </div>
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
    return {
      applicationOpenDate: null,
      applicationCloseDate: null,
      sjcaTestDate: null,
      sjcaTestStartTime: null,
      sjcaTestEndTime: null,
      sjcaTestOutcome: null,
      scenarioTestDate: null,
      scenarioTestStartTime: null,
      scenarioTestEndTime: null,
      scenarioTestOutcome: null,
      contactIndependentAssessors: null,
      selectionDayStart: null,
      selectionDayEnd: null,
      characterChecks: null,
      statutoryConsultation: null,
      finalOutcome: null,
      selectionDays: [],
      repeatableFields: {
        SelectionDay,
      },
    };
  },
};
</script>
