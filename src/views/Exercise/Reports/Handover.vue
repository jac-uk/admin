<template>
  <div class="govuk-grid-column-full">
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Handover
        </h2>
      </div>

      <div
        class="moj-page-header-actions__actions float-right"
      >
        <div class="moj-button-menu">
          <div class="moj-button-menu__wrapper">
            <button
              class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              :disabled="!hasReportData"
              @click="exportData()"
            >
              Export data
            </button>
            <button
              class="govuk-button moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="refreshReport"
            >
              <span
                v-if="refreshingReport"
                class="spinner-border spinner-border-sm"
              /> Refresh
            </button>
            <!--            <ActionButton-->
            <!--              v-if="totalApplicationRecords"-->
            <!--              type="primary"-->
            <!--              @click="transferHandoverData()"-->
            <!--            >-->
            <!--              Transfer Handover Data-->
            <!--            </ActionButton>-->
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Approved for immediate appointment
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ totalApplicationRecords }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">Type of exercise</span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ exerciseType | lookup }}
          </h2>
        </div>
      </div>
    </div>

    <Table
      v-if="report != null"
      data-key="id"
      :data="report.rows"
      :columns="tableColumns"
      :page-size="1000"
      @change="getTableData"
    >
      <template #row="{row}">
        <TableCell :title="tableColumns[0].title">
          <RouterLink
            :to="{ name: 'exercise-application', params: { applicationId: row.applicationId } }"
          >
            {{ row.referenceNumber }}
          </RouterLink>
        </TableCell>
        <TableCell :title="tableColumns[1].title">
          <RouterLink
            :to="{ name: 'candidates-view', params: { id: row.candidateId } }"
          >
            {{ row.fullName }}
          </RouterLink>
        </TableCell>
      </template>
    </Table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
// import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton';
import { APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';

export default {
  components: {
    Table,
    TableCell,
    // ActionButton,
  },
  data() {
    return {
      report: null,
      refreshingReport: false,
      tableColumns: [
        {
          title: 'Reference number',
          class: ['govuk-!-width-one-third'],
        },
        { title: 'Name', sort: 'candidate.fullName', default: true },
      ],
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
    }),
    exerciseType() {
      return this.exercise.typeOfExercise;
    },
    totalApplicationRecords() {
      return this.report ? this.report.totalApplications : 0;
    },
    hasReportData() {
      return this.report && this.report.headers;
    },
  },
  created() {
    this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/handover`)
      .onSnapshot((snap) => {
        if (snap.exists) {
          this.report = vuexfireSerialize(snap);
        }
      });
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async transferHandoverData() {
      await functions.httpsCallable('transferHandoverData')({ exerciseId: this.exercise.id });
    },
    getTableData(params) {
      this.$store.dispatch(
        'stageHandover/bind',
        {
          exerciseId: this.exercise.id,
          status: APPLICATION_STATUS.APPROVED_FOR_IMMEDIATE_APPOINTMENT,
          ...params,
        }
      );
    },
    async refreshReport() {
      this.refreshingReport = true;
      await functions.httpsCallable('generateHandoverReport')({ exerciseId: this.exercise.id });
      this.refreshingReport = false;
    },
    gatherReportData() {
      const reportData = [];

      // get headers
      reportData.push(this.report.headers.map(header => header.title));

      // get rows
      this.report.rows.forEach((row) => {
        reportData.push(this.report.headers.map(header => row[header.ref]));
      });

      return reportData;
    },
    async exportData() {
      const title = 'Handover Report';
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
