<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <a
        ref="BackLinkToAddExerciseContacts"
        class="govuk-back-link"
        @click="$router.push('exercise-edit-contacts')"
      >
        Back
      </a>

      <h1 class="govuk-heading-xl">
        Add shortlisting methods
      </h1>

      <p class="govuk-body-l">
        You can return to this page later to add or change methods.
      </p>

      <CheckboxGroup
        id="shortlisting-methods"
        v-model="shortlistingMethods"
      >
        <CheckboxItem
          value="situational-judgement-test"
          label="Situational judgement qualifying test (QT)"
        />
        <CheckboxItem
          value="critical-analysis-test"
          label="Critical analysis qualifying test (QT)"
        />
        <CheckboxItem
          value="scenario-test"
          label="Scenario test qualifying test (QT)"
        />
        <CheckboxItem
          value="name-blind-paper-sift"
          label="Name blind paper sift"
        />
        <CheckboxItem
          value="paper-sift"
          label="Paper sift"
        />
        <CheckboxItem
          value="telephone-assessment"
          label="Telephone assessment"
        />
        <CheckboxItem
          value="other"
          label="Other"
        >
          <TextField
            id="other-text-input"
            v-model="otherShortlistingMethod"
            label="Add method"
          />
          <p class="govuk_body">
            <a
              class="govuk-link"
            >
              Add another
            </a>
          </p>
        </CheckboxItem>
      </CheckboxGroup>
      <button
        ref="linkToAddExerciseTimeline"
        class="govuk-button"
        @click="$router.push({ name: 'exercise-edit-timeline', params: { id: 'example' } })"
      >
        Save and continue
      </button>
    </div>
  </div>
</template>

<script>
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import TextField from '@/components/Form/TextField';

export default {
  components: {
    CheckboxGroup,
    CheckboxItem,
    TextField,
  },
  data(){
    return {
      shortlistingMethods: [],
      otherShortlistingMethod: null,
    };
  },
};
</script>
