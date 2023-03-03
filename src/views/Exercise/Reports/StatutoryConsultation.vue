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
            <button
              v-if="hasPermissions([
                PERMISSIONS.applications.permissions.canReadApplications.value,
                PERMISSIONS.exercises.permissions.canReadExercises.value
              ])"
              class="govuk-button moj-button-menu__item moj-page-header-actions__action"
              data-module="govuk-button"
              @click="refreshReport"
            >
              <span
                v-if="refreshingReport"
                class="spinner-border spinner-border-sm"
              /> Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <div class="govuk-button-group">
          <Select
            id="exercise-stage"
            v-model="exerciseStage"
            class="govuk-!-margin-right-2"
          >
            <option value="all">
              All applications
            </option>
            <option
              v-if="applicationRecordCounts.review"
              value="review"
            >
              Review
            </option>
            <option
              v-if="applicationRecordCounts.shortlisted"
              value="shortlisted"
            >
              Shortlisted
            </option>
            <option
              v-if="applicationRecordCounts.selected"
              value="selected"
            >
              Selected
            </option>
            <option
              v-if="applicationRecordCounts.recommended"
              value="recommended"
            >
              Recommended
            </option>
            <option
              v-if="applicationRecordCounts.handover"
              value="handover"
            >
              Handover
            </option>
          </Select>
          <Select
            v-if="availableStatuses && availableStatuses.length > 0"
            id="availableStatuses"
            v-model="candidateStatus"
          >
            <option
              value="all"
            >
              All
            </option>
            <option
              v-for="item in availableStatuses"
              :key="item"
              :value="item"
            >
              {{ item | lookup }}
            </option>
          </Select>
        </div>
      </div>

      <div class="govuk-grid-column-full">
        <Table
          :key="tableKey"
          ref="issuesTable"
          data-key="id"
          :data="applicationRecords"
          :columns="tableColumns"
          :page-item-type="paginationType"
          :page-size="pageSize"
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

        <button
          class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action govuk-!-margin-top-2"
          @click="togglePagination"
        >
          {{ paginationType === 'uppercase-letter' ? '1 2 3 4' : 'A B C D' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from 'lodash';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import permissionMixin from '@/permissionMixin';
import { EXERCISE_STAGE } from '@jac-uk/jac-kit/helpers/constants';
import { applicationRecordCounts } from '@/helpers/exerciseHelper';

export default {
  name: 'StatutoryConsultation',
  components: {
    Select,
    Table,
    TableCell,
    TextareaInput,
  },
  mixins: [permissionMixin],
  data() {
    return {
      exerciseStage: 'all',
      candidateStatus: 'all',
      availableStatuses: null,
      applicationRecords: [],
      tableColumns: [
        { title: 'Reference number' },
        { title: 'Name', sort: '_sort.fullNameUC', default: true },
        { title: 'Note' },
      ],
      paginationType: '',
      pageSize: 50,
      unsubscribe: null,
      unsubscribeReport: null,
      report: null,
      refreshingReport: false,
    };
  },
  computed: {
    ...mapState({
      exercise: state => state.exerciseDocument.record,
    }),
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
    },
    tableKey() {
      return `table-${this.paginationType}`;
    },
    hasReportData() {
      return this.report && this.report.headers;
    },
  },
  watch: {
    exerciseStage: function (valueNow) {
      // populate the status dropdown, for the chosen stage
      if (valueNow === EXERCISE_STAGE.REVIEW) {
        this.availableStatuses = this.$store.getters['stageReview/availableStatuses'](this.exercise.shortlistingMethods, this.exercise.otherShortlistingMethod || []) ;
      } else if (valueNow === EXERCISE_STAGE.SHORTLISTED) {
        this.availableStatuses = this.$store.getters['stageShortlisted/availableStatuses'];
      } else if (valueNow === EXERCISE_STAGE.SELECTED) {
        this.availableStatuses = this.$store.getters['stageSelected/availableStatuses'];
      } else if (valueNow === EXERCISE_STAGE.RECOMMENDED) {
        this.availableStatuses = this.$store.getters['stageRecommended/availableStatuses'];
      } else { // handover
        this.availableStatuses = [];
      }
      // reset the status dropdown to 'All'
      this.candidateStatus = 'all';

      this.$refs['issuesTable'].reload();
    },
    candidateStatus: function() {
      this.$refs['issuesTable'].reload();
    },
  },
  created() {
    this.unsubscribeReport = firestore.doc(`exercises/${this.exercise.id}/reports/statutoryConsultation`)
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
    if (this.unsubscribeReport) {
      this.unsubscribeReport();
    }
  },
  methods: {
    async getTableData(params) {
      let firestoreRef = firestore
        .collection('applicationRecords')
        .where('exercise.id', '==', this.exercise.id)
        .where('status', '==', 'invitedToSelectionDay');
      if (this.exerciseStage !== 'all') {
        firestoreRef = firestoreRef.where('stage', '==', this.exerciseStage);
      }
      if (this.candidateStatus !== 'all') {
        firestoreRef = firestoreRef.where('status', '==', this.candidateStatus);
      }
      params.orderBy = 'candidate.fullName';
      firestoreRef = await tableQuery(this.applicationRecords, firestoreRef, params);
      if (firestoreRef) {
        this.unsubscribe = firestoreRef
          .onSnapshot((snap) => {
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
    togglePagination() {
      this.paginationType = this.paginationType === 'uppercase-letter' ? '' : 'uppercase-letter';
      this.pageSize = this.paginationType === 'uppercase-letter' ? 0 : 50;
    },
    async refreshReport() {
      this.refreshingReport = true;
      try {
        await functions.httpsCallable('generateStatutoryConsultationReport')({ exerciseId: this.exercise.id });
      } catch (error) {
        console.error(error);
      }
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
