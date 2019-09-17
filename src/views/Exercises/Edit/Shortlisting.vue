<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
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
          v-model="exercise.shortlistingMethods"
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
import CheckboxGroup from '@/components/Form/CheckboxGroup';
import CheckboxItem from '@/components/Form/CheckboxItem';
import RepeatableFields from '@/components/RepeatableFields';
import OtherShortlistingMethod from '@/components/RepeatableFields/OtherShortlistingMethod';

export default {
  components: {
    CheckboxGroup,
    CheckboxItem,
    RepeatableFields,
  },
  data(){
    const exercise = this.$store.state.exerciseDocument.record;

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
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']);
    },
  },
};
</script>
