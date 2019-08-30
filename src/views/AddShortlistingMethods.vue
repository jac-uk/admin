<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
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
          label="Situational judgement test"
        />
        <CheckboxItem
          value="critical-analysis-test"
          label="Critical analysis test"
        />
        <CheckboxItem
          value="scenario-test"
          label="Scenario test"
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
            v-model="otherText"
            name="other-text-input"
            label="Add method"
          />
          <p class="govuk_body">
            <a
              href="#"
              class="govuk-link"
            >Add another</a>
          </p>
        </CheckboxItem>
      </CheckboxGroup>
      <button
        class="govuk-button"
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
      otherText: '',
    };
  },
};
</script>
