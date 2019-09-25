<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="save">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />
        <h1 class="govuk-heading-xl">
          Shortlisting methods
        </h1>

        <p class="govuk-body-l">
          You can return to this page later to add or change methods.
        </p>

        <CheckboxGroup
          id="shortlisting-methods"
          v-model="exercise.shortlistingMethods"
        >
          <CheckboxItem
            value="Situational judgement qualifying test (QT)"
            label="Situational judgement qualifying test (QT)"
          />
          <CheckboxItem
            value="Critical analysis qualifying test (QT)"
            label="Critical analysis qualifying test (QT)"
          />
          <CheckboxItem
            value="Scenario test qualifying test (QT)"
            label="Scenario test qualifying test (QT)"
          />
          <CheckboxItem
            value="Name blind paper sift"
            label="Name blind paper sift"
          />
          <CheckboxItem
            value="Paper sift"
            label="Paper sift"
          />
          <CheckboxItem
            value="Telephone assessment"
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
import BackLink from '@/components/BackLink';

export default {
  components: {
    CheckboxGroup,
    CheckboxItem,
    RepeatableFields,
    BackLink,
  },
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
      await this.$store.dispatch('exerciseDocument/save', this.exercise);
      this.$router.push(this.$store.getters['exerciseCreateJourney/nextPage']);
    },
  },
};
</script>
