<template>
  <div>
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Applications - {{ status | lookup }}
        </h2>
      </div>

      <div
        v-if="status === 'applied'"
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="exportContacts()"
            >
              Export contacts
            </button>
          </div>
        </div>
      </div>
    </div>

    <Table
      ref="applicationsTable"
      data-key="id"
      :data="applications"
      :columns="tableColumns"
      :search="['personalDetails.fullName']"
      :page-size="50"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            class="govuk-link"
            :to="{name: 'exercise-applications-application', params: { applicationId: row.id, status: status }}"
          >
            {{ row.referenceNumber | showAlternative(row.id) }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          {{ row.personalDetails && row.personalDetails.fullName }}
        </TableCell>
        <TableCell :title="tableColumns[2].title">
          {{ row.status | lookup }}
        </TableCell>
      </template>
    </Table>
    <p
      v-if="!applications.length"
      class="govuk-body"
    >
      No applications found.
    </p>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import { functions } from '@/firebase';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';

export default {
  components: {
    Table,
    TableCell,
  },
  data(){
    return {
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'personalDetails.fullName', default: true },
        { title: 'Status' },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applications() {
      return this.$store.state.applications.records;
    },
    status() {
      return this.$route.params.status;
    },
  },
  watch: {
    status() {
      this.$refs['applicationsTable'].reload();
    },
  },
  methods: {
    getTableData(params) {
      return this.$store.dispatch(
        'applications/bind',
        {
          exerciseId: this.exercise.id,
          status: this.status,
          ...params,
        }
      );
    },
    async gatherReportData() {
      // fetch data
      const response = await functions.httpsCallable('exportApplicationContactsData')({ exerciseId: this.exercise.id, status: this.status });

      const reportData = [];

      // get headers
      reportData.push(response.data.headers.map(header => header));

      // get rows
      response.data.rows.forEach((row) => {
        reportData.push(Object.values(row).map(cell => cell));
      });

      return reportData;
    },
    async exportContacts() {
      const title = 'Contacts';
      const xlsxData = await this.gatherReportData();

      downloadXLSX(
        xlsxData,
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

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
  .govuk-summary-list__value,
  .govuk-summary-list__value:last-child,
  .govuk-summary-list__key {
    @include govuk-media-query($from: tablet) {
      width: auto;
    }
  }
</style>
