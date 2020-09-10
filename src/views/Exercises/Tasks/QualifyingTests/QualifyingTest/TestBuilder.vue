<template>
  <div class="govuk-grid-row">  
    <form
      class="govuk-grid-column-three-quarters"
      @submit.prevent="validateAndSave"
    >
      <TextareaInput
        id="testQuestions-introduction"
        v-model="qualifyingTest.testQuestions.introduction"
        label="Introduction"
        hint="Short introductory instruction text."
        rows="2"
      />

      <RepeatableFields
        v-model="qualifyingTest.testQuestions.questions"
        :component="repeatableFields.QualifyingTestQuestion"
        :ident="qualifyingTest.type"
        :type="qualifyingTest.type"
        :type-name="typeName"
        required
      />

      <button class="govuk-button">
        Save and continue
      </button>
    </form>
  </div>
</template>
<script>
import Form from '@/components/Form/Form';
import TextareaInput from '@/components/Form/TextareaInput';
import RepeatableFields from '@/components/RepeatableFields';
import QualifyingTestQuestion from '@/components/RepeatableFields/QualifyingTests/QualifyingTestQuestion';
import { QUALIFYING_TEST } from '@/helpers/constants';

export default {
  components: {
    TextareaInput,
    RepeatableFields,
  },
  extends: Form,
  data() {
    const defaults = {
      testQuestions: {
        introduction: null,
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
  computed: {
    isScenario() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO ? true : false;
    },
    typeName() {
      return this.isScenario ? 'scenario' : 'question';
    },
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
