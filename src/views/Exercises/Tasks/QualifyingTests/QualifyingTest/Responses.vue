<template>
  <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
    <h2 class="govuk-heading-m">
      {{ isTieBreaker ? 'Equal merit tie-breaker' : 'Qualifying test' }} responses / {{ searchStatus | lookup }}
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
            :to="{ name: `${routeNamePrefix}-response-view`, params: { qualifyingTestId: qualifyingTestId, responseId: row.id, status: 'all' } }"
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
import { functions } from '@/firebase';
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
    isTieBreaker() {
      return this.qualifyingTest.isTieBreaker && this.qualifyingTest.isTieBreaker;
    },
    routeNamePrefix() {
      return this.isTieBreaker ? 'equal-merit-tie-breaker' : 'qualifying-test';
    },
  },
  methods: {
    async gatherExportData() {

      // fetch data
      const response = await functions.httpsCallable('exportQualifyingTestResponses')({ qualifyingTestId: this.qualifyingTest.id });

      const reportData = [];

      // get headers
      reportData.push(response.data.headers.map(header => header));

      // get rows
      response.data.rows.forEach((row) => {
        reportData.push(Object.values(row).map(cell => cell));
      });

      return reportData;
    },
    async downloadResponses() {
      const xlsxData = await this.gatherExportData();

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
      this.$router.push({ name: `${this.routeNamePrefix}-view`, params: { qualifyingTestId: this.qualifyingTestId } });
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
