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
          {{ row.candidate.fullName | showAlternative(row.candidate.id) }}
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
import { downloadXLSX } from '@/helpers/export';
import { QUALIFYING_TEST } from '@/helpers/constants';

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

      // const contacts = this.applications.map((application) => {
      //   return [
      //     application.referenceNumber,
      //     filters.lookup(application.status),
      //     application.personalDetails.fullName,
      //     application.personalDetails.email,
      //     application.personalDetails.phone,
      //     filters.formatDate(application.personalDetails.dateOfBirth),
      //     filters.formatNIN(application.personalDetails.nationalInsuranceNumber),
      //     filters.lookup(application.equalityAndDiversitySurvey.gender),
      //     filters.toYesNo(filters.lookup(application.equalityAndDiversitySurvey.disability)),
      //     filters.lookup(application.equalityAndDiversitySurvey.ethnicGroup),
      //     this.flattenCurrentLegalRole(application.equalityAndDiversitySurvey),
      //     this.flattenProfessionalBackground(application.equalityAndDiversitySurvey),
      //     filters.toYesNo(this.attendedUKStateSchool(application.equalityAndDiversitySurvey)),
      //     filters.toYesNo(filters.lookup(application.equalityAndDiversitySurvey.firstGenerationStudent)),
      //     application.firstAssessorFullName,
      //     application.firstAssessorEmail,
      //     application.firstAssessorPhone,
      //     application.secondAssessorFullName,
      //     application.secondAssessorEmail,
      //     application.secondAssessorPhone,
      //   ];
      // });

      const headers = [
        'ID',
        'Reference number',
        'Full Name',
        'Total Duration',
        'Adjust applied',
        'Status',
        'Started',
        'Completed',
      ];

      this.qualifyingTest.testQuestions.questions.forEach(element => {
        headers.push(element.details);
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
        ];
        switch (this.qualifyingTest.type){
        case QUALIFYING_TEST.TYPE.SITUATIONAL_JUDGEMENT:
          this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
            if (element.testQuestions.questions[index].selection) {
              row.push(this.qualifyingTest.testQuestions.questions[index].options[element.testQuestions.questions[index].selection.mostAppropriate].answer);
            // row.push(element.testQuestions.questions[index].selection.leastAppropriate);
            } else {
              row.push('---');
            }
          });
          break;
        // case QUALIFYING_TEST.TYPE.SCENARIO:
        //   this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
        //     // 
        //   });
        //   break;
        // case QUALIFYING_TEST.TYPE.CRITICAL_ANALYSIS:
        //   this.qualifyingTest.testQuestions.questions.forEach((question, index) => {
        //     // 
        //   });
        //   break;
        }
        return row;
      });

      const xlsxData = [
        headers,
        ...data,
      ];

      console.table(xlsxData);
      
      // });
      // downloadXLSX(
      //   [this.responses],
      //   {
      //     title: `${this.qualifyingTestId} - responses`,
      //     sheetName: `${this.qualifyingTestId} - responses`,
      //     fileName: `${this.qualifyingTestId} - responses.xlsx`,
      //   }
      // );
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
