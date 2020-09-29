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
      :columns="[
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Status', sort: 'status' },
        { title: 'Time Limit', sort: 'duration.testDurationAdjusted' },
        { title: '' },
      ]"
      :search="['candidate.fullName']"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell>
          {{ row.candidate.fullName | showAlternative(row.candidate.email) | showAlternative(row.candidate.id) }}
        </TableCell>
        <TableCell>{{ row.status | lookup }}</TableCell>
        <TableCell>{{ formatTimeLimit(row.duration.testDurationAdjusted) }}</TableCell>
        <TableCell>
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
import Table from '@/components/Page/Table/Table'; 
import TableCell from '@/components/Page/Table/TableCell'; 
import { QUALIFYING_TEST } from '@/helpers/constants';
import { downloadXLSX } from '@/helpers/export';
import * as filters from '@/filters';

export default {
  components: {
    Table,
    TableCell,
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
      console.log('responses', this.responses);
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
    downloadResponses() {

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
            `Q ${ index + 1 }. Most Appropriate`,
            `Q ${ index + 1 }. Least Appropriate`,
            `Q ${ index + 1 }. Score`
          );
        }
        if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO) {
          question.options.forEach((option, decimal) => {
            headers.push(`Scenario ${ index + 1 }. Question ${ decimal + 1 }: ${ option.question }`);
          });
        }
        if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS) {
          headers.push(
            `Q ${ index + 1 }. Answer`,
            `Q ${ index + 1 }. Score`
          );
        }
      });

      const data = this.sortedByScoresArr.map(element => {
        const row = [
          element.id,
          'element.application.referenceNumber',
          element.candidate.fullName,
          element.duration.testDurationAdjusted,
          element.duration.reasonableAdjustment,
          this.timeTaken(element),
          element.status,
          element.statusLog.started,
          element.statusLog.completed,
          element.score,
        ];
      
        // eslint-disable-next-line no-console
        console.log('data', data);
        // eslint-disable-next-line no-console
        console.log('qualifyingTest', this.qualifyingTest);
        
        return true;
        /* eslint-disable no-unreachable */

        switch (this.qualifyingTest.type){
        case QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            if (element.testQuestions.questions[index].response && (element.testQuestions.questions[index].response.selection !== undefined)) { 
              if (this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection.mostAppropriate] !== undefined && this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection.leastAppropriate] !== undefined) {
                row.push(
                  this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection.mostAppropriate].answer,
                  this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection.leastAppropriate].answer,
                  element.testQuestions.questions[index].response.score
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
          });
          break;
        case QUALIFYING_TEST.TYPE.SCENARIO:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            if (element.testQuestions.questions[index].responses) { 
              element.testQuestions.questions[index].responses.forEach((response) => {
                row.push(response.text === null ? 'Question skipped' : response.text);
              });
            }
          });
          break;
        case QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            if (element.testQuestions.questions[index].response && (element.testQuestions.questions[index].response.selection !== undefined)) {
              if (this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection]) {
                row.push(
                  this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection].answer,
                  element.testQuestions.questions[index].response.score
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
      this.$store.dispatch(
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
