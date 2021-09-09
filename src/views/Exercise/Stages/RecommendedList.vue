<template>
  <div>
    <Banner
      :message="message"
      status="success"
    />
    <form>
      <div class="moj-page-header-actions govuk-!-margin-bottom-2">
        <div class="moj-page-header-actions__title">
          <h1 class="govuk-heading-l">
            Recommended ({{ totalApplicationRecords }})
          </h1>
        </div>
        <div class="moj-page-header-actions__actions float-right">
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                :disabled="isButtonDisabled"
                @click.prevent="moveBack()"
              >
                Move back to ...
              </button>
              <button
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                :disabled="isButtonDisabled"
                @click.prevent="setStatus()"
              >
                Set status
              </button>
              <button
                v-if="exercise.id === 'G7d4Y3iwggL6HXAK6IU3'"
                class="govuk-button moj-button-menu__item moj-page-header-actions__action govuk-!-margin-right-2"
                @click.prevent="exportCustom033Data()"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
      <Table
        data-key="id"
        :data="applicationRecords"
        :columns="tableColumns"
        multi-select
        :selection.sync="selectedItems"
        :page-size="50"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <RouterLink
              :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
            >
              {{ row.application.referenceNumber }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            <RouterLink
              :to="{ name: 'candidates-view', params: { id: row.candidate.id } }"
            >
              {{ row.candidate.fullName }}
            </RouterLink>
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row | candidateHasIssues }}
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            {{ row.status | lookup }}
          </TableCell>
          <TableCell :title="tableColumns[4].title">
            {{ row.flags.empApplied | toYesNo }}
          </TableCell>
        </template>
      </Table>
      <p v-if="!applicationRecords.length">
        No applications found.
      </p>
    </form>
  </div>
</template>

<script>
import Banner from '@jac-uk/jac-kit/draftComponents/Banner';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import { functions } from '@/firebase';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';

export default {
  components: {
    Banner,
    Table,
    TableCell,
  },
  data() {
    return {
      message: null,
      selectedItems: [],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: 'candidate.fullName', default: true },
        { title: 'Issues' },
        { title: 'Status' },
        { title: 'EMP' },
      ],
    };
  },
  computed: {
    applicationRecords() {
      const records = this.$store.state.stageRecommended.records;
      return records;
    },
    totalApplicationRecords() {
      return this.exercise.applicationRecords.recommended || 0;
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    isButtonDisabled() {
      const isDisabled = this.selectedItems && this.selectedItems.length;
      return !isDisabled;
    },
  },
  async created() {
    this.message = await this.$store.dispatch('stageRecommended/getMessages');
  },
  methods: {
    async gatherReportData() {
      // fetch data
      const response = await functions.httpsCallable('exportCustom033Data')({ exerciseId: this.exercise.id });

      const reportData = [];

      // get headers
      reportData.push(response.data.headers.map(header => header));

      // get rows
      response.data.rows.forEach((row) => {
        reportData.push(Object.values(row).map(cell => cell));
      });

      return reportData;
    },
    async exportCustom033Data() {
      const title = 'Exercise 033 data';
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
    moveBack() {
      this.$store.dispatch('stageRecommended/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-recommended-back' });
    },
    setStatus() {
      this.$store.dispatch('stageRecommended/storeItems', { items: this.selectedItems });
      this.$router.push({ name: 'exercise-stages-recommended-edit' });
    },
    getTableData(params) {
      this.$store.dispatch(
        'stageRecommended/bind',
        {
          exerciseId: this.exercise.id,
          ...params,
        }
      );
    },
  },
};
</script>
