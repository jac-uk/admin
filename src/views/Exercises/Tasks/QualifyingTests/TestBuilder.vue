<template>
  <div class="govuk-grid-row">
    <form @submit.prevent="validateAndSave">
      <div class="govuk-grid-column-two-thirds">
        <BackLink />

        <h1 class="govuk-heading-xl">
          Add questions to the test
        </h1>

        <ErrorSummary 
          :errors="errors" 
          :show-save-button="true" 
        />

        <div 
          v-if="hasQuestions"
          class="govuk-summary-list__row"
        >
          <dd class="govuk-summary-list__value">
            <ul class="govuk-list">
              <li
                v-for="(question, index) in questionArray"
                :key="index"
              >
                {{ question.question }}
                <span
                  v-for="(answer, index) in question.answers"
                  :key="index"
                >
                  {{ answer.answer }}
                </span>
              </li>
            </ul>
          </dd>
        </div>
        
        <fieldset class="govuk-fieldset govuk-!-margin-bottom-5">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h3 class="govuk-fieldset__heading">
              Critical Analysis
            </h3>
          </legend>
          <TextField
            id="qt-critical-analysis-question"
            v-model="currentQuestion.question"
            ident="qt-critical-analysis-question"
            label="Question X"
          />      
          <RepeatableFields
            v-model="currentQuestion.answers"
            :component="repeatableFields.Answer"
            ident="qt-critical-analysis-answer"
            required
          />
        </fieldset>

        <button class="govuk-button">
          Save question
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import Form from '@/components/Form/Form';
import ErrorSummary from '@/components/Form/ErrorSummary';
import TextField from '@/components/Form/TextField';
import RepeatableFields from '@/components/RepeatableFields';
import Answer from '@/components/RepeatableFields/Answer';
import BackLink from '@/components/BackLink';

export default {
  components: {
    ErrorSummary,
    BackLink,
    TextField,
    RepeatableFields,
  },
  extends: Form,
  data () {
    return {
      questionNumber: 1,
      currentQuestion: {
        'question': null, 
        'answers': [],
      },
      questionArray: [],
      repeatableFields: {
        Answer,
      },
    };
  },
  computed: {
    hasQuestions(){
      return this.questionArray.length > 0 ? true : false;
    },
  },
  methods: {
    save(isValid) {
      if (isValid) {
        console.log(this.currentQuestion.question);
        console.log(this.currentQuestion.answers.toString());
                
        this.questionArray.push(this.currentQuestion);
      }
    },
  },
};
</script>
