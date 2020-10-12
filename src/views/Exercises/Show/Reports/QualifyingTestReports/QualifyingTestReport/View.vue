<template>
  <div>
    <div class="govuk-grid-column-full govuk-!-margin-bottom-1">
      <h2 class="govuk-heading-m">
        Qualifying Test Report
        <ActionButton
          :disabled="true"
          type="primary"
          class="float-right"
          @click="btnGenerateReport"
        >
          Refresh
        </ActionButton>
      </h2>
      <h3 class="govuk-heading-l govuk-!-margin-bottom-0">
        {{ reportTitle }}
      </h3>
      <span
        class="govuk-body govuk-!-font-size-14"
      >
        {{ qualifyingTestReport.lastUpdated | formatDate('longdatetime') }}
      </span>
      <Table
        v-if="qualifyingTestReport.report"
        data-key="score"
        :data="qualifyingTestReport.report"
        :columns="[
          { title: 'Rank' },
          { title: 'Count' },
          { title: 'Score' },
          { title: 'Cum.% Female' },
          { title: 'Cum.% BAME' },
          { title: 'Cum.% State school' },
          { title: 'Cum.% Disability' },
        ]"
      >
        <template #row="{row}">
          <TableCell>{{ row.rank }}</TableCell>
          <TableCell>{{ row.count }}</TableCell>
          <TableCell>{{ row.score }}</TableCell>
          <TableCell />
          <TableCell />
          <TableCell />
          <TableCell />
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import ActionButton from '@/components/ActionButton';
import Table from '@/components/Page/Table/Table';
import TableCell from '@/components/Page/Table/TableCell';

export default {
  components: {
    ActionButton,
    Table,
    TableCell,
  },
  computed: {
    qualifyingTestReportId() {
      return this.$route.params.qualifyingTestReportId;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    qualifyingTestReport() {
      const record = this.$store.state.qualifyingTestReport.record;
      return record;
    },
    reportTitle() {
      const titles = [];
      this.qualifyingTestReport.qualifyingTests.forEach(qualifyingTest => {
        titles.push(qualifyingTest.title);
      });
      return titles.join(' + ');
    },
  },
  methods: {
    async btnGenerateReport() {
      await functions.httpsCallable('generateQualifyingTestReport')({ qualifyingTestReportId: this.qualifyingTestReportId });
    },
  },
};
</script>
