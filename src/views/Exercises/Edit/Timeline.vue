<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
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
        Situational judgment test, Critical analysis test
      </h2>
      <DateInput
        id="test-open-date"
        v-model="testOpenDate"
        hint="For example, 31 05 2020"
        label="Test open date"
      />
      <TimeInput
        id="test-open-time"
        v-model="testOpenTime"
        label="Test open time"
      />
      <DateInput
        id="test-outcome"
        v-model="testOutcome"
        label="Test outcome"
        type="month"
      />

      <h2 class="govuk-heading-l">
        Independent assessment dates
      </h2>
      <DateInput
        id="contact-independent-assessors"
        v-model="contactIndependentAssessors"
        label="Contact independent assessors"
      />

      <h2 class="govuk-heading-l">
        Selection day dates
      </h2>

      <RepeatableFields
        v-model="selectionDays"
        :component="repeatableFields.SelectionDay"
      />

      <h2 class="govuk-heading-l">
        Final selection dates
      </h2>
      <DateInput
        id="eligibility-checks"
        v-model="eligibilityChecks"
        label="Eligibility checks"
        type="month"
      />
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
      <DateInput
        id="selection-process-outcome"
        v-model="selectionProcessOutcome"
        label="Selection process outcome"
        hint="This is when we expect to inform candidates."
        type="month"
      />


      <button
        ref="linkToAboutTheVacancy"
        class="govuk-button"
        @click="$router.push('about-the-vacancy')"
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
      testOpenDate: null,
      testOpenTime: null,
      testOutcome: null,
      contactIndependentAssessors: null,
      selectionDayStart: null,
      selectionDayEnd: null,
      eligibilityChecks: null,
      characterChecks: null,
      statutoryConsultation: null,
      selectionProcessOutcome: null,
      selectionDays: [],
      repeatableFields: {
        SelectionDay,
      },
    };
  },
};
</script>
