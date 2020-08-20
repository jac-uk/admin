<template>
  <div class="govuk-grid-row">  
    <form @submit.prevent="validateAndSave">
      <fieldset
        class="govuk-fieldset"
      >         
        <RepeatableFields
          v-model="qualifyingTest.testQuestions.questions"
          :component="repeatableFields.QualifyingTestQuestion"
          :ident="qualifyingTest.type"
          :type="qualifyingTest.type"
          required
        />
        <button class="govuk-button">
          Save and continue
        </button>
      </fieldset>
    </form>
  </div>
</template>
<script>
import Form from '@/components/Form/Form';
import RepeatableFields from '@/components/RepeatableFields';
import QualifyingTestQuestion from '@/components/RepeatableFields/QualifyingTests/QualifyingTestQuestion';

export default {
  components: {
    RepeatableFields,
  },
  extends: Form,
  data() {
    const defaults = {
      testQuestions: {
        questions: [
        ],
      },
    };
    const data = this.$store.getters['qualifyingTest/data']();
    const qualifyingTest = { ...defaults, ...data };
    return {
      repeatableFields: {
        QualifyingTestQuestion,
      },
      qualifyingTest: qualifyingTest,
    };
  },
  methods: {
    async save(isValid) {
      if (isValid){
        await this.$store.dispatch('qualifyingTest/save', this.qualifyingTest);
        this.$router.push({ name: 'qualifying-test-review' });
      }
    },
  },
};
</script>
