<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        Qualifying Test Response: 
        <routerLink :to="{ name: 'qualifying-test-view', params: { qualifyingTestId: $route.params.qualifyingTestId } }">
          {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
        </routerLink>
      </h2>
      <h3 class="govuk-heading-l">
        {{ candidate && candidate.fullName | showAlternative(candidate && candidate.email) | showAlternative(candidate && candidate.id) }}
      </h3>

      <h2 class="govuk-heading-m">
        Test details
      </h2>

      <dl
        v-if="response" 
        class="govuk-summary-list"
      >
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Status
          </dt>
          <dd class="govuk-summary-list__value">
            {{ response.status | lookup }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Start date
          </dt>
          <dd class="govuk-summary-list__value">
            {{ response.statusLog.started | formatDate('datetime') }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            End date
          </dt>
          <dd class="govuk-summary-list__value">
            {{ response.statusLog.completed | formatDate('datetime') }}
          </dd>
        </div>
        <div 
          v-if="response"
          class="govuk-summary-list__row" 
        >
          <dt class="govuk-summary-list__key">
            Time taken
          </dt>
          <dd class="govuk-summary-list__value">
            {{ timeTaken }}
          </dd>
        </div>
        <div 
          v-if="response.score"
          class="govuk-summary-list__row" 
        >
          <dt class="govuk-summary-list__key">
            Score
          </dt>
          <dd class="govuk-summary-list__value">
            {{ response.score }}
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Reasonable Adjustments
          </dt>
          <dd 
            v-if="response"
            class="govuk-summary-list__value" 
          >
            <table class="govuk-table">
              <tr class="govuk-table__row">
                <td class="govuk-table__cell">
                  Duration / Adjusted
                </td>
                <td class="govuk-table__cell">
                  {{ response.duration.testDuration }} min. / {{ response.duration.testDurationAdjusted }} min.
                </td>
              </tr>
              <tr class="govuk-table__row">
                <td class="govuk-table__cell">
                  Adjustment
                </td>
                <td class="govuk-table__cell">
                  <EditableField 
                    :value="response.duration.reasonableAdjustment"
                    field="reasonableAdjustment"
                    @changefield="(obj) => actionReasonableAdjustment(obj, response.duration, responseId)"
                  />
                  {{ response.candidate.reasonableAdjustmentsDetails }}
                </td>
              </tr>
              <tr class="govuk-table__row">
                <td class="govuk-table__cell">
                  Justification
                </td>
                <td class="govuk-table__cell">
                  <EditableField 
                    :value="response.duration.reasonableAdjustmentsJustification"
                    field="reasonableAdjustmentsJustification"
                    @changefield="(obj) => actionReasonableAdjustmentJustification(obj, responseId)"
                  />
                </td>
              </tr>
            </table>
          </dd>
        </div>
      </dl>

      <h2 class="govuk-heading-m">
        Questions
      </h2>
      <div v-if="response">
        <dl class="govuk-summary-list">
          <div
            v-if="response.testQuestions.introduction"
            class="govuk-summary-list__row"
          >
            <dt
              class="govuk-summary-list__key"
            >
              Introduction
            </dt>
            <dd class="govuk-summary-list__value">
              {{ response.testQuestions.introduction }}
            </dd>
          </div>
        
          <div
            v-for="(testQuestion, index) in questions"
            :key="index"
            class="govuk-summary-list__row"
          >
            <dt class="govuk-summary-list__key">
              {{ questionLabel }} {{ index + 1 }}
            </dt>
            <dd class="govuk-summary-list__value">
              <!-- eslint-disable -->
              <div
                v-html="testQuestion.details"
              />
              <!-- eslint-enable -->

              <hr class="govuk-section-break govuk-section-break--visible">
              <ol 
                v-if="isCriticalAnalysis && testQuestion.response"
              >
                <li
                  v-for="(res, i) in testQuestion.options"
                  :key="i"
                  :class="checkSelected(i, testQuestion.correct, testQuestion.response.selection)"
                >
                  {{ res.answer }}
                </li>
              </ol>

              <ol 
                v-if="isSituationalJudgment && testQuestion.response"
              >
                <li
                  v-for="(res, i) in testQuestion.options"
                  :key="i"
                  :class="checkSelectedSituationalJudgement(i, {leastAppropriate: testQuestion.leastAppropriate, mostAppropriate: testQuestion.mostAppropriate}, { ...testQuestion.response.selection })"
                >
                  {{ res.answer }}
                </li>
              </ol>

              <ol 
                v-if="isScenario"
              >
                <li
                  v-for="(res, i) in testQuestion.options"
                  :key="i"
                >
                  {{ res.text }}
                </li>
              </ol>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import { QUALIFYING_TEST } from '@/helpers/constants';
import EditableField from '@/components/EditableField';

export default {
  components: {
    EditableField,
  },
  computed: {
    responseId() {
      const id = this.$route.params.responseId;
      return id;
    },
    response() {
      const qtList = this.$store.state.qualifyingTestResponses.record;
      return qtList;
    },
    qualifyingTest() {
      const qtList = this.$store.state.qualifyingTest.record;
      return qtList;
    },
    candidate() {
      return this.response ? this.response.candidate : null;
    },
    questionLabel() {
      let label = 'Question';

      if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO) {
        label = 'Scenario';
      }
      return label;
    },
    questions() {
      let returnQuestions = [];
      // merge the two objects;
      if (this.response.testQuestions.questions) {
        returnQuestions = this.response.testQuestions.questions.map((item, index) => {
          return { ...item, ...this.qualifyingTest.testQuestions.questions[index] };
        });
      }
      return returnQuestions;
    },
    timeTaken() {
      let diff = 0;
      if (this.response.statusLog.completed && this.response.statusLog.started) {
        diff = this.response.statusLog.completed - this.response.statusLog.started;
      }
      const newDate = new Date(diff);
      const hh = `0${newDate.getUTCHours()}`.slice(-2);
      const mm = `0${newDate.getUTCMinutes()}`.slice(-2);
      const ss = `0${newDate.getUTCSeconds()}`.slice(-2);
      const returnTimeTaken = `${hh}:${mm}:${ss}`;
      return returnTimeTaken;
    },
    isCriticalAnalysis () {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS;
    },
    isSituationalJudgment() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT;
    },
    isScenario() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO;
    },
  },
  async created() {
    this.$store.dispatch('qualifyingTestResponses/bindRecord', { id: this.responseId });
  },
  methods: {
    actionReasonableAdjustment(obj, duration, id) {
      const reasonableAdjustment = Number(obj.reasonableAdjustment);
      const calculation = reasonableAdjustment + Number(duration.testDuration);
      const returnObj = { 
        duration: {
          ...this.response.duration,
          testDuration: duration.testDuration,
          testDurationAdjusted: calculation,
          reasonableAdjustment: reasonableAdjustment,
        },
      };
      this.$store.dispatch('qualifyingTestResponses/updateRA', { data: returnObj, id: id });
    },
    actionReasonableAdjustmentJustification(obj, id) {
      const returnObj = { 
        duration: {
          ...this.response.duration,
          reasonableAdjustmentsJustification: obj.reasonableAdjustmentsJustification,
        },
      };
      this.$store.dispatch('qualifyingTestResponses/updateRA', { data: returnObj, id: id });
    },
    checkSelected(index, rightAnswer, selectedAnswer) {
      let returnClass = '';
      const isSelectedAnswer = index === selectedAnswer;
      const isRightAnswer = index === rightAnswer;
      const isRightAndSelectedAnswer = isSelectedAnswer && isRightAnswer;

      // eslint-disable-next-line no-console
      // console.log('checkResponse', index, rightAnswer, selectedAnswer);
      if (isRightAnswer) {
        returnClass += ' answer--right';
      }
      if (isSelectedAnswer && !isRightAnswer) {
        returnClass += ' answer--selected--wrong';
      }
      if (isRightAndSelectedAnswer) {
        returnClass += ' answer--selected--correct';
      }

      return returnClass;
    },
    checkSelectedSituationalJudgement(index, rightAnswer, selectedAnswer) {
      // eslint-disable-next-line no-console
      // console.log('checkSelectedSituationalJudgement', index, rightAnswer, selectedAnswer);
      let returnClass = '';
      
      const isSelectedAnswerMost = index === selectedAnswer.mostAppropriate ;
      const isSelectedAnswerLeast = index === selectedAnswer.leastAppropriate;

      const isRightAnswerMost = index === rightAnswer.mostAppropriate;
      const isRightAnswerLeast = index === rightAnswer.leastAppropriate;

      const isRightAndSelectedAnswerMost = isRightAnswerMost && isSelectedAnswerMost;
      const isRightAndSelectedAnswerLeast = isRightAnswerLeast && isSelectedAnswerLeast;
      
      if (isRightAnswerMost || isRightAnswerLeast) {
        returnClass += ' answer--right';
      }
      if (isSelectedAnswerMost && !isRightAnswerMost || isSelectedAnswerLeast && !isRightAnswerLeast) {
        returnClass += ' answer--selected--wrong';
      }
      if (isRightAndSelectedAnswerMost || isRightAndSelectedAnswerLeast) {
        returnClass += ' answer--selected--correct';
      }

      return returnClass;
    },
  },
};
</script>

<style scoped>
  .answer--right {
    font-weight: bold;
    text-decoration: underline;
  }
  .answer--selected--wrong {
    background-color: #FFCCCC;
  }
  .answer--selected--correct {
    background-color: #00FFCC;
  }
</style>

