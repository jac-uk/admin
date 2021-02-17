<template>
  <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
    <h2 class="govuk-heading-m">
      Qualifying Test Responses / {{ searchStatus | lookup }}
    </h2>
    <h3
      class="govuk-heading-l"
      @click="goToQualifyingTest"
    >
      {{ qualifyingTest.title | showAlternative(qualifyingTest.id) }}
      <span
        v-if="qualifyingTest.mode"
        class="govuk-tag govuk-tag--grey govuk-!-margin-left-2"
      >{{ qualifyingTest.mode | lookup }}</span>
    </h3>
    <button
      class="govuk-button govuk-!-margin-left-3 float-right"
      @click="downloadResponses"
    >
      Download responses
    </button>
    <Table
      data-key="id"
      :data="responses"
      :page-size="50"
      :columns="tableColumns"
      :search="['candidate.fullName']"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          {{ row.candidate.fullName | showAlternative(row.candidate.email) | showAlternative(row.candidate.id) }}
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.status | lookup }} {{ row.isOutOfTime ? 'DNF' : '' }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ formatTimeLimit(row.duration.testDurationAdjusted) }}
        </TableCell>
        <TableCell :title="tableColumns[3].title">
          <RouterLink
            :to="{ name: 'qualifying-test-response-view', params: { qualifyingTestId: qualifyingTestId, responseId: row.id, status: 'all' } }"
          >
            View
          </RouterLink>
        </TableCell>
      </template>
    </Table>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import { QUALIFYING_TEST } from '@jac-uk/jac-kit/helpers/constants';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import * as filters from '@jac-uk/jac-kit/filters/filters';

export default {
  components: {
    Table,
    TableCell,
  },
  data() {
    return {
      tableColumns: [
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Status' },
        { title: 'Time Limit', sort: 'duration.testDurationAdjusted' },
        { title: '' },
      ],
    };
  },
  computed: {
    sortedByScoresArr() {
      return this.responses.slice().sort((a, b) => {return a.score - b.score;}).reverse();
    },
    equalityAndDiversity() {
      const localDocs = this.$store.state.candidates.equalityAndDiversitySurvey;
      return localDocs || {};
    },
    responses() {
      const responsesList = this.$store.state.qualifyingTestResponses.records;
      return responsesList;
    },
    qualifyingTest() {
      const record = this.$store.state.qualifyingTest.record;
      return record;
    },
    qualifyingTestId() {
      return this.$route.params.qualifyingTestId;
    },
    searchStatus() {
      return this.$route.params.status;
    },
  },
  methods: {
    async downloadResponses() {

      await this.getTableData({});

      const headers = [
        'ID',
        'Reference number',
        'Full Name',
        'Total Duration',
        'Adjust applied',
        'Time Taken',
        'Status',
        'Started',
        'Completed',
        `${this.typeInitials(this.qualifyingTest.type)} Score`,
      ];

      this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
        if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT) {
          headers.push(
            `Q${ index + 1 }. Most Appropriate`,
            `Q${ index + 1 }. Least Appropriate`,
            `Q${ index + 1 }. Score`
          );
        }
        if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO) {
          question.options.forEach((option, decimal) => {
            headers.push(`Scenario ${ index + 1 }. Question ${ decimal + 1 }: ${ option.question }`);
          });
        }
        if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS) {
          headers.push(
            `Q${ index + 1 }. Answer`,
            `Q${ index + 1 }. Score`
          );
        }
      });

      const data = this.sortedByScoresArr.map(element => {
        const row = [
          element.id,
          element.application ? element.application.referenceNumber : '',
          element.candidate.fullName || element.candidate.email,
          element.duration.testDurationAdjusted,
          element.duration.reasonableAdjustment,
          this.timeTaken(element),
          element.status,
          filters.formatDate(element.statusLog.started, 'longdatetime'),
          filters.formatDate(element.statusLog.completed, 'longdatetime'),
          element.score,
        ];

        switch (this.qualifyingTest.type){
        case QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            let response = [];
            if (element.responses.length) {
              response = element.responses[index];
            } else {
              if (element.testQuestions && element.testQuestions.questions) {
                response = element.testQuestions.questions[index].response;
              }
            }
            if (response) {
              const responseSelection = response.selection;
              if (responseSelection) {
                if (responseSelection.mostAppropriate !== undefined && responseSelection.leastAppropriate !== undefined) {
                  row.push(
                    question.options[responseSelection.mostAppropriate].answer,
                    question.options[responseSelection.leastAppropriate].answer,
                    response.score
                  );
                } else {
                  row.push(
                    '---',
                    '---',
                    '---'
                  );
                }
              } else {
                row.push(
                  '---',
                  '---',
                  '---'
                );
              }
            } else {
              row.push(
                '---',
                '---',
                '---'
              );
            }
          });
          break;
        case QUALIFYING_TEST.TYPE.SCENARIO:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            let responses = [];
            if (element.responses.length) {
              responses = element.responses[index].responsesForScenario;
            } else {
              if (element.testQuestions && element.testQuestions.questions) {
                responses = element.testQuestions.questions[index].responses;
              }
            }
            if (responses) {
              responses.forEach((response) => {
                row.push(response.text === null ? 'Question skipped' : response.text);
              });
            }
          });
          break;
        case QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            let response = [];
            if (element.responses.length) {
              response = element.responses[index];
            } else {
              if (element.testQuestions && element.testQuestions.questions) {
                response = element.testQuestions.questions[index].response;
              }
            }
            if (response) {
              const responseSelection = response.selection;
              if (responseSelection !== undefined) {
                row.push(
                  question.options[response.selection].answer,
                  response.score
                );
              } else {
                row.push('---','---');
              }
            } else {
              row.push('---','---');
            }
          });
          break;
        }
        return row;
      });

      data;

      const xlsxData = [
        headers,
        ...data,
      ];

      downloadXLSX(
        xlsxData,
        {
          title: `${this.qualifyingTest.title} - ${this.typeInitials(this.qualifyingTest.type)} - ${filters.formatDate(this.qualifyingTest.endDate)} - responses`,
          sheetName: `${this.qualifyingTest.title} - ${this.typeInitials(this.qualifyingTest.type)} - ${filters.formatDate(this.qualifyingTest.endDate)} - responses`,
          fileName: `${this.qualifyingTest.title} - ${this.typeInitials(this.qualifyingTest.type)} - ${filters.formatDate(this.qualifyingTest.endDate)} - responses`,
        }
      );
    },
    isReasonableAdjustment(needAdjustment) {
      return needAdjustment;
    },
    formatTimeLimit(timeLimit) {
      // TODO
      // Function to format the time limit
      // If activated ...
      // If Started ...
      // If completed
      return `${timeLimit} min`;
    },
    getTableData(params) {
      return this.$store.dispatch(
        'qualifyingTestResponses/bind',
        {
          qualifyingTestId: this.qualifyingTestId,
          searchStatus: this.searchStatus,
          ...params,
        }
      );
    },
    goToQualifyingTest() {
      this.$router.push({ name: 'qualifying-test-view', params: { qualifyingTestId: this.qualifyingTestId } });
    },
    typeInitials(string) {
      let result;
      const strArray = string.split('-');
      if (strArray.length === 1) {
        result =  'SC';
      } else {
        result = `${strArray[0].charAt(0)}${strArray[strArray.length - 1].charAt(0)}`;
      }
      return result.toUpperCase();
    },
    timeTaken(response) {
      let diff = 0;
      if (response.statusLog.completed && response.statusLog.started) {
        diff = response.statusLog.completed - response.statusLog.started;
      }
      const newDate = new Date(diff);
      const hh = `0${newDate.getUTCHours()}`.slice(-2);
      const mm = `0${newDate.getUTCMinutes()}`.slice(-2);
      const ss = `0${newDate.getUTCSeconds()}`.slice(-2);
      const returnTimeTaken = `${hh}:${mm}:${ss}`;
      return returnTimeTaken;
    },
  },
};
</script>
