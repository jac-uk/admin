<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Handover Report - HR Details only
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

              <ActionButton
                v-if="hasPermissions([
                  PERMISSIONS.exercises.permissions.canReadExercises.value,
                  PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
                  PERMISSIONS.applications.permissions.canReadApplications.value
                ])"
                type="primary"
                :action="refreshReport"
              >
                Refresh
              </ActionButton>
            <!--            <ActionButton-->
            <!--              v-if="totalApplicationRecords"-->
            <!--              type="primary"-->
            <!--              :action="transferHandoverData"-->
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
              {{ $filters.formatNumber(totalApplicationRecords) }}
            </h2>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">Type of exercise</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ $filters.lookup(exerciseType) }}
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
        local-data
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

      <Modal
        ref="infoModal"
      >
        <ReportInfo @close="closeModal" />
      </Modal>
    </div>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { onSnapshot, doc } from '@firebase/firestore';
import { mapState } from 'vuex';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { APPLICATION_STATUS } from '@jac-uk/jac-kit/helpers/constants';
import permissionMixin from '@/permissionMixin';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ReportInfo from '@/components/ModalViews/ReportInfo.vue';

export default {
  name: 'HandoverReport',
  components: {
    Table,
    TableCell,
    ActionButton,
    Modal,
    ReportInfo,
  },
  mixins: [permissionMixin],
  data() {
    return {
      report: null,
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
    this.unsubscribe = onSnapshot(
      doc(firestore, `exercises/${this.exercise.id}/reports/handover`),
      (snap) => {
        if (snap.exists) {
          this.report = vuexfireSerialize(snap);
        }
      });
  },
  mounted() {
    this.openModal();
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async transferHandoverData() {
      await httpsCallable(functions, 'transferHandoverData')({ exerciseId: this.exercise.id });
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
      try {
        await httpsCallable(functions, 'generateHandoverReport')({ exerciseId: this.exercise.id });
        return true;
      } catch (error) {
        return;
      }
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
      /**
       * Make the 'Judicial experience' (column S) can display multiple lines.
       *
       * @link: https://github.com/dtjohnson/xlsx-populate?tab=readme-ov-file#styles-1
       */
      const styles = {
        row: {
          1: {
            bold: true,
            fill: 'eeeeee',
          },
        },
        column: {
          'S': {
            wrapText: true,
          },
        },
      };
      const freezePanes = [
        {
          xSplit: 0,
          ySplit: 1,
        },
      ];

      downloadXLSX(
        data,
        {
          title: `${this.exercise.referenceNumber} ${title}`,
          sheetName: title,
          fileName: `${this.exercise.referenceNumber} - ${title}.xlsx`,
          styles,
          freezePanes,
        }
      );
    },
    openModal() {
      this.$refs.infoModal.openModal();
    },
    closeModal() {
      this.$refs.infoModal.closeModal();
    },
  },
};
</script>
