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
            {{ response.status | lookup }} {{ response.isOutOfTime ? 'DNF' : '' }}
            <ActionButton
              v-if="authorisedToPerformAction"
              :disabled="hasActivated"
              type="secondary"
              class="float-right govuk-!-margin-bottom-1"
              @click="resetTest"
            >
              Reset
            </ActionButton>
            <ActionButton
              v-if="authorisedToPerformAction"
              :disabled="hasCompleted"
              type="secondary"
              class="float-right govuk-!-margin-bottom-1 govuk-!-margin-right-1"
              @click="markAsCompleted"
            >
              Mark as completed
            </ActionButton>
          </dd>
        </div>
        <div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">
            Start date
          </dt>
          <dd class="govuk-summary-list__value">
            <span v-if="response.statusLog.started">{{ response.statusLog.started | formatDate('datetime') }}</span>
            <span v-else>{{ qualifyingTest.startDate | formatDate('datetime') }}</span>
            <div v-if="hasRelatedTests && isEditingTestDate">
              <Select
                id="moveToTest"
                v-model="moveToTest"
                required
              >
                <option value="">
                  Choose new test date
                </option>
                <option
                  v-for="test in relatedTests"
                  :key="test.id"
                  :value="test.id"
                >
                  {{ test.title }} - {{ test.startDate | formatDate('datetime') }}
                </option>
              </Select>
              <button
                class="govuk-button"
                :disabled="!moveToTest"
                @click="btnMoveTest"
              >
                Save
              </button>
            </div>
            <span
              v-if="hasRelatedTests && !isEditingTestDate"
              class="float-right"
            >
              <a
                href="#"
                class="govuk-link print-none"
                @click.prevent="btnEditTestDate"
              >Change</a>
            </span>
          </dd>
        </div>
        <div
          v-if="hasCompleted"
          class="govuk-summary-list__row"
        >
          <dt class="govuk-summary-list__key">
            End date
          </dt>
          <dd class="govuk-summary-list__value">
            {{ response.statusLog.completed | formatDate('datetime') }}
          </dd>
        </div>
        <div
          v-if="hasCompleted"
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
              <tr
                v-if="response.duration.reasonableAdjustment"
                class="govuk-table__row"
              >
                <td class="govuk-table__cell">
                  Justification
                </td>
                <td class="govuk-table__cell">
                  <EditableField
                    :value="response.duration.reasonableAdjustmentsJustification"
                    field="reasonableAdjustmentsJustification"
                    type="textarea"
                    @changefield="(obj) => actionReasonableAdjustmentJustification(obj, responseId)"
                  />
                </td>
              </tr>
            </table>
          </dd>
        </div>
      </dl>

      <div v-if="hasStarted">
        <TabsList
          :tabs="tabs"
          :active-tab.sync="activeTab"
        />

        <div v-if="activeTab === 'questions'">
          <h2 class="govuk-heading-m">
            Questions
          </h2>

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
                <QuestionDuration
                  v-if="!isScenario"
                  :start="responses[index].started"
                  :end="responses[index].completed"
                />
              </dt>
              <dd class="govuk-summary-list__value">
                <div
                  v-if="isScenario"
                >
                  <dl
                    v-for="(document, docIndex) in testQuestion.documents"
                    :key="docIndex"
                  >
                    <dt>{{ document.title }}</dt>
                    <!-- eslint-disable -->
                    <dd v-html="document.content" />
                    <!-- eslint-enable -->
                  </dl>
                </div>
                <!-- eslint-disable -->
                <div
                  v-else
                  v-html="testQuestion.details"
                />
                <!-- eslint-enable -->
                <hr class="govuk-section-break govuk-section-break--visible">
                <ol
                  v-if="isCriticalAnalysis && responses[index]"
                >
                  <li
                    v-for="(res, i) in testQuestion.options"
                    :key="i"
                    :class="checkSelected(i, testQuestion.correct, responses[index].selection)"
                  >
                    {{ res.answer }}
                  </li>
                </ol>

                <ol
                  v-if="isSituationalJudgment && responses[index]"
                >
                  <li
                    v-for="(res, i) in testQuestion.options"
                    :key="i"
                    :class="checkSelectedSituationalJudgement(i, {leastAppropriate: testQuestion.leastAppropriate, mostAppropriate: testQuestion.mostAppropriate}, { ...responses[index].selection })"
                  >
                    {{ res.answer }}
                  </li>
                </ol>

                <ol
                  v-if="isScenario"
                >
                  <li
                    v-for="(res, i) in responses[index].responsesForScenario"
                    :key="i"
                  >
                    <p>
                      <strong>{{ testQuestion.options[i].question }}</strong>
                      <span
                        v-if="testQuestion.options[i].hint"
                        class="govuk-hint"
                      >{{ testQuestion.options[i].hint }}</span>
                    </p>

                    <QuestionDuration
                      :start="res.started"
                      :end="res.completed"
                    />
                    <span
                      v-if="res.started !== null && res.text === null"
                    >
                      [Answer skipped]
                    </span>
                    <span
                      v-else
                    >
                      <p>{{ res.text }} </p>
                    </span>
                  </li>
                </ol>
              </dd>
            </div>
          </dl>
        </div>
        <div v-if="activeTab === 'logs'">
          <h2 class="govuk-heading-m">
            Logs
          </h2>
          <div
            v-for="(log, i) in logs"
            :key="i"
          >
            <table>
              <tr class="log_row">
                <td class="log_row_time">
                  {{ timeDifference(log) }}
                </td>
                <td class="log_row_date">
                  {{ log.on }}<br> {{ log.off }}
                </td>
              </tr>
              <tr>
                <td class="log_row_time">
                  {{ timeOffline(i) }}
                </td>
                <td class="log_row_date">
                  {{ timeOffline(i) ? 'OFFLINE' : '' }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div><!-- hasStarted -->
    </div>
  </div>
</template>

<script>
import firebase from '@firebase/app';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';
import EditableField from '@jac-uk/jac-kit/draftComponents/EditableField';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import QuestionDuration from '@/components/Micro/QuestionDuration';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { authorisedToPerformAction }  from '@/helpers/authUsers';

export default {
  components: {
    EditableField,
    Select,
    TabsList,
    QuestionDuration,
    ActionButton,
  },
  data() {
    return {
      moveToTest: '',
      isEditingTestDate: false,
      activeTab: 'questions',
      authorisedToPerformAction: false,
    };
  },
  computed: {
    tabs(){
      return [
        {
          ref: 'questions',
          title: 'Questions',
        },
        {
          ref: 'logs',
          title: 'Logs',
        },
      ];
    },
    responseId() {
      const id = this.$route.params.responseId;
      return id;
    },
    response() {
      const qtList = this.$store.state.qualifyingTestResponses.record;
      return qtList;
    },
    responses() {
      let responses = [];
      if (this.response.responses && this.response.responses.length) {
        responses = this.response.responses;
      } else {  // check for responses on testQuestions (backward compatibility)
        if (this.response.testQuestions && this.response.testQuestions.questions) {
          this.response.testQuestions.questions.forEach(question => {
            if (this.isScenario) {
              if (question.responses) {
                responses.push({
                  responsesForScenario: question.responses,
                });
              }
            } else {
              if (question.response) {
                responses.push(question.response);
              }
            }
          });
        }
      }
      return responses;
    },
    qualifyingTest() {
      const qtList = this.$store.state.qualifyingTest.record;
      return qtList;
    },
    qualifyingTests() {
      return this.$store.state.qualifyingTest.records;
    },
    relatedTests() {
      if (this.qualifyingTests) {
        if (this.qualifyingTest && this.qualifyingTest.relationship && this.qualifyingTest.relationship.copiedFrom) {
          return this.qualifyingTests.filter(item => {
            return item.id === this.qualifyingTest.relationship.copiedFrom ||
              (item.relationship && item.relationship.copiedFrom === this.qualifyingTest.relationship.copiedFrom);
          });
        } else {
          return this.qualifyingTests.filter(item => {
            return item.relationship && item.relationship.copiedFrom === this.qualifyingTest.id;
          });
        }
      } else {
        return [];
      }
    },
    hasRelatedTests() {
      return this.relatedTests && this.relatedTests.length;
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
    isCriticalAnalysis() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS;
    },
    isSituationalJudgment() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT;
    },
    isScenario() {
      return this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO;
    },
    hasActivated() {
      return this.response.status === QUALIFYING_TEST.STATUS.ACTIVATED;
    },
    hasStarted() {
      return this.response && (
        this.response.status === QUALIFYING_TEST.STATUS.STARTED
        || this.response.status === QUALIFYING_TEST.STATUS.COMPLETED
      );
    },
    hasCompleted() {
      return this.response && this.response.status === QUALIFYING_TEST.STATUS.COMPLETED;
    },
    logs() {
      const qtList = this.$store.state.connectionMonitor.records;
      return qtList;
    },
  },
  watch: {
    activeTab: async function (newActiveTab) {
      if (newActiveTab === 'logs') {
        const candidateId = this.candidate.id;
        const qualifyingTestId = this.$route.params.qualifyingTestId;
        // eslint-disable-next-line no-console
        // console.log('mounted', candidateId, qualifyingTestId, this);
        await this.$store.dispatch('connectionMonitor/bind', { qualifyingTestId, candidateId });
      }
    },
  },
  async created() {
    this.$store.dispatch('qualifyingTestResponses/bindRecord', { id: this.responseId });
    const email = firebase.auth().currentUser.email;
    this.authorisedToPerformAction = await authorisedToPerformAction(email);
  },
  methods: {
    resetTest() {
      if (this.authorisedToPerformAction && this.authorisedToPerformAction === true) {
        this.$store.dispatch('qualifyingTestResponses/resetTest');
      }
    },
    markAsCompleted() {
      if (this.authorisedToPerformAction && this.authorisedToPerformAction === true) {
        this.$store.dispatch('qualifyingTestResponses/markAsCompleted');
      }
    },
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
    async btnMoveTest() {
      if (this.moveToTest) {
        const destinationTest = this.qualifyingTests.find(item => item.id === this.moveToTest);
        await this.$store.dispatch('qualifyingTestResponses/moveTest', { qualifyingTest: destinationTest, qualifyingTestResponse: this.response });
        this.isEditingTestDate = false;
        this.$router.push({
          name: 'qualifying-test-responses',
          params: {
            qualifyingTestId: this.qualifyingTest.id,
            status: 'all',  // TODO go to same list status as before
          },
        });
      }
    },
    btnEditTestDate() {
      this.isEditingTestDate = true;
    },
    timeDifference(log) {
      if (log.offline === undefined) {
        return 'ONLINE';
      } else {
        const minDate = (log.offline - log.online);
        return new Date(minDate).toISOString().substr(11, 8);
      }
    },
    timeOffline(index) {
      const thisTimeOffline = this.logs[index] && this.logs[index].offline;
      const nextIndex = index + 1 >= this.logs.length ? this.logs.length : index + 1;
      const nextTimeOnline = this.logs[nextIndex] && this.logs[nextIndex].online;
      const timeOffline = nextTimeOnline - thisTimeOffline;
      if (nextTimeOnline === undefined) {
        return;
      } else {
        return new Date(timeOffline).toISOString().substr(11, 8);
      }
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
  .log_row_time {
    font-weight: bold;
    border-bottom: 1px solid silver;
    padding: 5px;
  }
  .log_row_date {
    font-size: 12px;;
    color: grey;
    border-bottom: 1px solid silver;
    line-height: 1;
    padding: 5px;
  }
</style>

