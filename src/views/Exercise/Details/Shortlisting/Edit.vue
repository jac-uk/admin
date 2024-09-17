<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-full">
        <h2 class="govuk-heading-l">
          Shortlisting methods
        </h2>

        <ErrorSummary
          :errors="errors"
          :show-save-button="true"
          @save="save"
        />

        <p class="govuk-body-l">
          You can return to this page later to add or change methods.
        </p>

        <CheckboxGroup
          id="shortlisting-methods"
          v-model="formData.shortlistingMethods"
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
              v-model="formData.otherShortlistingMethod"
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
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form.vue';
import ErrorSummary from '@jac-uk/jac-kit/draftComponents/Form/ErrorSummary.vue';
import CheckboxGroup from '@jac-uk/jac-kit/draftComponents/Form/CheckboxGroup.vue';
import CheckboxItem from '@jac-uk/jac-kit/draftComponents/Form/CheckboxItem.vue';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields.vue';
import OtherShortlistingMethod from '@/components/RepeatableFields/OtherShortlistingMethod.vue';

export default {
  components: {
    ErrorSummary,
    CheckboxGroup,
    CheckboxItem,
    RepeatableFields,
  },
  extends: Form,
  data(){
    const defaults = {
      shortlistingMethods: null,
      otherShortlistingMethod: null,
    };
    const formData = this.$store.getters['exerciseDocument/data'](defaults);
    return {
      formData: formData,
      repeatableFields: {
        OtherShortlistingMethod,
      },
    };
  },
  computed: {
    hasJourney() {
      return this.$store.getters['exerciseCreateJourney/hasJourney'];
    },
  },
  methods: {
    async save(isValid) {
      this.formData['progress.shortlisting'] = isValid ? true : false;
      await this.$store.dispatch('exerciseDocument/save', this.formData);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']('exercise-details-shortlisting'));
    },
  },
};
</script>
