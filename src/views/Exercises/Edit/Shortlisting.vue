<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Shortlisting methods
        </h1>

        <ErrorSummary :errors="errors" />

        <p class="govuk-body-l">
          You can return to this page later to add or change methods.
        </p>

        <CheckboxGroup
          id="shortlisting-methods"
          v-model="exercise.shortlistingMethods"
          required
          :messages="{required: 'Please choose at least one shortlisting method'}"
        >
          <CheckboxItem
            value="situational-judgement-qualifying-test"
            label="Situational judgement qualifying test (QT)"
          />
          <CheckboxItem
            value="critical-analysis-qualifying-test"
            label="Critical analysis qualifying test (QT)"
          />
          <CheckboxItem
            value="scenario-test-qualifying-test"
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
            <RepeatableFields
              v-model="exercise.otherShortlistingMethod"
              :component="repeatableFields.OtherShortlistingMethod"
            />
          </CheckboxItem>
        </CheckboxGroup>
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
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import RepeatableFields from '@/components/RepeatableFields';
import OtherShortlistingMethod from '@/components/RepeatableFields/OtherShortlistingMethod';
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
    RepeatableFields,
    BackLink,
  },
  extends: Form,
  data(){
    const exercise = this.$store.getters['exerciseDocument/data']();

    return {
      repeatableFields: {
        OtherShortlistingMethod,
      },
      exercise: {
        shortlistingMethods: exercise.shortlistingMethods || null,
        otherShortlistingMethod: exercise.otherShortlistingMethod || null,
      },
    };
  },
  methods: {
    async save() {
      this.validate();
      if (this.isValid()) {
        await this.$store.dispatch('exerciseDocument/save', this.exercise);
        this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']);
      }
    },
  },
};
</script>
