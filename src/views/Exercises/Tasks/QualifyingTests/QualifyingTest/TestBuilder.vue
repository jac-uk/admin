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
import TabsList from '@/components/Page/TabsList';
import Form from '@/components/Form/Form';
import TextareaInput from '@/components/Form/TextareaInput';
import RepeatableFields from '@/components/RepeatableFields';
import QualifyingTestQuestion from '@/components/RepeatableFields/QualifyingTests/QualifyingTestQuestion';
import { QUALIFYING_TEST } from '@/helpers/constants';

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
        await this.$store.dispatch('qualifyingTest/save', this.qualifyingTest);
        this.$router.push({ name: 'qualifying-test-review' });
      }
    },
  },
};
</script>
