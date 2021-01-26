<template>
  <div>
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-m">
            Qualifying Test Report
          </h2>
          <h3 class="govuk-heading-l govuk-!-margin-bottom-0">
            {{ qualifyingTestReport.title }}
          </h3>
          <span
            class="govuk-body govuk-!-font-size-14"
          >
            {{ qualifyingTestReport.lastUpdated | formatDate('longdatetime') }}
          </span>
        </div>
        <div class="moj-page-header-actions__actions govuk-!-margin-top-2">
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                type="button"
                @click="btnEdit"
              >
                Edit
              </button>
              <ActionButton
                class="moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                @click="btnGenerateReport"
              >
                Refresh
              </ActionButton>
              <button
                :disabled="!hasReportData"
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                type="button"
                @click="downloadData"
              >
                Download data
              </button>
              <button
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                type="button"
                :disabled="true"
              >
                Set pass mark
              </button>
            </div>
          </div>
        </div>
      </div>

      <Table
        v-if="hasReportData"
        data-key="score"
        :data="qualifyingTestReport.report"
        :columns="tableColumns"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            {{ row.rank }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.count }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            <RouterLink
              :to="{ name: 'qualifying-test-report-view-score', params: { qualifyingTestReportId: qualifyingTestReportId, score: row.score } }"
              class="govuk-link"
            >
              {{ row.score }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            {{ 100 * (row.cumulativeDiversity.female / (row.rank + row.count - 1)) | formatNumber(2) }}%
          </TableCell>
          <TableCell :title="tableColumns[4].title">
            {{ 100 * (row.cumulativeDiversity.bame / (row.rank + row.count - 1)) | formatNumber(2) }}%
          </TableCell>
          <TableCell :title="tableColumns[5].title">
            {{ 100 * (row.cumulativeDiversity.solicitor / (row.rank + row.count - 1)) | formatNumber(2) }}%
          </TableCell>
          <TableCell :title="tableColumns[6].title">
            {{ 100 * (row.cumulativeDiversity.disability / (row.rank + row.count - 1)) | formatNumber(2) }}%
          </TableCell>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { functions } from '@/firebase';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';

export default {
  components: {
    ActionButton,
    Table,
    TableCell,
  },
  data() {
    return {
      tableColumns: [
        { title: 'Rank' },
        { title: 'Count' },
        { title: 'Score' },
        { title: 'Female' },
        { title: 'BAME' },
        { title: 'Solicitor' },
        { title: 'Disability' },
      ],
    };
  },
  computed: {
    qualifyingTestReportId() {
      return this.$route.params.qualifyingTestReportId;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    qualifyingTestReport() {
      return this.$store.getters['qualifyingTestReport/data'];
    },
    hasReportData() {
      return this.qualifyingTestReport.report && this.qualifyingTestReport.report.length;
    },
    maxScore() {
      let score = 0;
      this.qualifyingTestReport.qualifyingTests.forEach(qualifyingTest => {
        score += qualifyingTest.maxScore;
      });
      return score;
    },
  },
  methods: {
    btnEdit() {
      this.$router.push({
        name: 'qualifying-test-report-edit',
        params: {
          qualifyingTestReportId: this.qualifyingTestReportId,
        },
      });
    },
    async btnGenerateReport() {
      await functions.httpsCallable('generateQualifyingTestReport')({ qualifyingTestReportId: this.qualifyingTestReportId });
    },
    gatherReportData() {
      const headers = [];
      headers.push('Ref');
      // 'Name',
      // 'Email',
      this.qualifyingTestReport.qualifyingTests.forEach(qualifyingTest => {
        headers.push(`${qualifyingTest.title} - status`);
        headers.push(qualifyingTest.title);
      });
      headers.push('Total');
      headers.push('%');
      headers.push('Rank');
      headers.push('Female');
      headers.push('BAME');
      headers.push('Solicitor');
      headers.push('Disability');

      const data = this.qualifyingTestReport.rawData.map(row => {
        const mapData = [];
        mapData.push();
        mapData.push(row.application.referenceNumber);
        // row.candidate.fullName,
        // '', // row.candidate.email,
        this.qualifyingTestReport.qualifyingTests.forEach(qualifyingTest => {
          mapData.push(row.qualifyingTests[qualifyingTest.id].status);
          mapData.push(row.qualifyingTests[qualifyingTest.id].score);
        });
        mapData.push(row.score);
        mapData.push((100 * (row.score / this.maxScore)).toFixed(2));
        mapData.push(row.rank);
        mapData.push(row.diversity.female);
        mapData.push(row.diversity.bame);
        mapData.push(row.diversity.solicitor);
        mapData.push(row.diversity.disability);
        return mapData;
      });

      return [
        headers,
        ...data,
      ];
    },
    downloadData() {
      const title = 'Qualifying Test Report';
      const data = this.gatherReportData();
      downloadXLSX(
        data,
        {
          title: `${this.exercise.referenceNumber} ${title}`,
          sheetName: title,
          fileName: `${this.exercise.referenceNumber} - ${title}.xlsx`,
        }
      );
    },
  },
};
</script>
