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

export default {
  components: {
    Table,
    TableCell,
  },
  computed: {
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
    downloadResponses() {

      const headers = [
        'ID',
        'Reference number',
        'Full Name',
        'Total Duration',
        'Adjust applied',
        'Status',
        'Started',
        'Completed',
        'Score',
      ];

      this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
        if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT) {
          headers.push(`Q ${ index + 1 }. Most Appropriate`, `Q ${ index + 1 }. Least Appropriate`);
        }
        // if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.SCENARIO) {
        //   headers.push('scenario');
        // }
        if (this.qualifyingTest.type === QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS) {
          headers.push(`Q ${ index + 1 }. Answer`);
        }
      });

      const data = this.responses.map(element => {
        const row = [
          element.id,
          element.application.referenceNumber,
          element.candidate.fullName,
          element.duration.testDurationAdjusted,
          element.duration.reasonableAdjustment,
          element.status,
          element.statusLog.started,
          element.statusLog.completed,
          element.score,
        ];
        switch (this.qualifyingTest.type){
        case QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            if (element.testQuestions.questions[index].response && (element.testQuestions.questions[index].response.selection !== undefined)) { 
              if (this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection.mostAppropriate] !== undefined) {
                row.push(this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection.mostAppropriate].answer);
              } else {
                row.push('---','---');  
              }
              if (this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection.leastAppropriate] !== undefined) {
                row.push(this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection.leastAppropriate].answer);
              } else {
                row.push('---','---');  
              }
            } else {
              row.push('---','---');
            }
          });
          break;
        // case QUALIFYING_TEST.TYPE.SCENARIO:
        //   this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
        //     // 
        //   });
        //   break;
        case QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            if (element.testQuestions.questions[index].response && (element.testQuestions.questions[index].response.selection !== undefined)) {
              if (this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection]) {
                row.push(this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].response.selection].answer);
              } else {
                row.push('---');  
              }
            } else {
              row.push('---');
            }
          });
          break;
        }
        return row;
      });

      const xlsxData = [
        headers,
        ...data,
      ];

      downloadXLSX(
        xlsxData,
        {
          title: `${this.qualifyingTestId} - responses`,
          sheetName: `${this.qualifyingTestId} - responses`,
          fileName: `${this.qualifyingTestId} - responses.xlsx`,
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
  },
};
</script>
