<template>
  <div class="govuk-grid-row">
    <TabsList
      :tabs="tabs"
      :active-tab.sync="activeTab"
    />
    <form
      v-if="activeTab == 'code'"
      class="govuk-grid-column-three-quarters"
      @submit.prevent="validateAndSave"
    >
      <TextareaInput
        id="testQuestions"
        v-model="testQuestionsJson"
        label="Questions"
        hint="Provide questions in JSON format"
        required
      />
      <button class="govuk-button">
        Save and continue
      </button>
    </form>
    <form
      v-else
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
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import Form from '@jac-uk/jac-kit/draftComponents/Form/Form';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import RepeatableFields from '@jac-uk/jac-kit/draftComponents/RepeatableFields';
import QualifyingTestQuestion from '@/components/RepeatableFields/QualifyingTests/QualifyingTestQuestion';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';

export default {
  components: {
    TabsList,
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
      testQuestionsJson: JSON.stringify(qualifyingTest.testQuestions),
      activeTab: 'questions',
      tabs: [
        {
          ref: 'questions',
          title: 'Questions',
        },
        {
          ref: 'code',
          title: 'Test Code',
        },
      ],
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
        if (this.activeTab === 'code') { this.qualifyingTest.testQuestions = JSON.parse(this.testQuestionsJson); }
        if (this.qualifyingTest.testQuestions && this.qualifyingTest.testQuestions.questions.length) {
          switch (this.qualifyingTest.type) {
          case QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS:
            this.qualifyingTest.maxScore = this.qualifyingTest.testQuestions.questions.length;
            break;
          case QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT:
            this.qualifyingTest.maxScore = 2 * this.qualifyingTest.testQuestions.questions.length;
            break;
          default:
            this.qualifyingTest.maxScore = null;
          }
        }
        await this.$store.dispatch('qualifyingTest/save', this.qualifyingTest);
        this.$router.push({ name: 'qualifying-test-review' });
      }
    },
  },
};
</script>
