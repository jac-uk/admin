<template>
  <div class="govuk-grid-column-full">
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Statutory Consultation
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
                PERMISSIONS.applications.permissions.canReadApplications.value,
                PERMISSIONS.exercises.permissions.canReadExercises.value
              ])"
              type="primary"
              :action="refreshReport"
            >
              Refresh
            </ActionButton>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <Table
          data-key="id"
          :data="applicationRecords"
          :columns="tableColumns"
          page-item-type="uppercase-letter"
          :page-size="50"
          :custom-search="{
            placeholder: 'Search candidate names',
            handler: candidateSearch,
            field: 'candidate.id',
          }"
          @change="getTableData"
        >
          <template #row="{row}">
            <TableCell :title="tableColumns[0].title">
              <RouterLink
                class="govuk-link"
                :to="{name: 'exercise-applications-application', params: { applicationId: row.id, status: 'applied' }}"
                target="_blank"
              >
                {{ row.application.referenceNumber }}
              </RouterLink>
            </TableCell>
            <TableCell :title="tableColumns[1].title">
              {{ row.candidate && row.candidate.fullName }}
            </TableCell>
            <TableCell :title="tableColumns[2].title">
              <TextareaInput
                :id="`statutory-consultation-note-${row.candidate.id}`"
                :value="row.statutoryConsultation && row.statutoryConsultation.note"
                @input="saveStatutoryConsultationNote(row, $event)"
              />
            </TableCell>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { query, collection, where, onSnapshot, doc } from '@firebase/firestore';
import { mapState } from 'vuex';
import { debounce } from 'lodash';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import permissionMixin from '@/permissionMixin';
import { APPLICATION_STATUS } from '@/helpers/constants';

export default {
  name: 'StatutoryConsultation',
  components: {
    Table,
    TableCell,
    TextareaInput,
    ActionButton,
  },
  mixins: [permissionMixin],
  data() {
    return {
      applicationRecords: [],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: '_sort.fullNameUC', default: true },
        { title: 'Note' },
      ],
      unsubscribe: null,
      unsubscribeReport: null,
      report: null,
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
    }),
    hasReportData() {
      return this.report && this.report.headers;
    },
  },
  created() {
    this.unsubscribeReport = onSnapshot(
      doc(firestore, `exercises/${this.exercise.id}/reports/statutoryConsultation`),
      (snap) => {
        if (snap.exists) {
          this.report = vuexfireSerialize(snap);
        }
      });
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this.unsubscribeReport) {
      this.unsubscribeReport();
    }
  },
  methods: {
    async getTableData(params) {
      const statuses = [];
      if (this.exercise?._processingVersion >= 2) {
        statuses.push(APPLICATION_STATUS.SHORTLISTING_PASSED, APPLICATION_STATUS.SHORTLISTING_FAILED); // TODO: need to confirm the status
      } else {
        statuses.push(APPLICATION_STATUS.INVITED_TO_SELECTION_DAY);
      }

      let firestoreRef = query(
        collection(firestore, 'applicationRecords'),
        where('exercise.id', '==', this.exercise.id),
        where('status', 'in', statuses)
      );
      params.orderBy = 'candidate.fullName';
      firestoreRef = await tableQuery(this.applicationRecords, firestoreRef, params);
      if (firestoreRef) {
        this.unsubscribe = onSnapshot(
          firestoreRef,
          (snap) => {
            const applicationRecords = [];
            snap.forEach((doc) => {
              applicationRecords.push(vuexfireSerialize(doc));
            });
            this.applicationRecords = applicationRecords;
          });
      } else {
        this.applicationRecords = [];
      }
    },
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm });
    },
    saveStatutoryConsultationNote: debounce(async function(applicationRecord, note) {
      if (!applicationRecord.statutoryConsultation) {
        applicationRecord.statutoryConsultation = {};
      }
      applicationRecord.statutoryConsultation.note = note;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    }, 2000),
    async refreshReport() {
      try {
        await httpsCallable(functions, 'generateStatutoryConsultationReport')({ exerciseId: this.exercise.id });
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
    exportData() {
      const title = 'Statutory Consultation Report';
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
