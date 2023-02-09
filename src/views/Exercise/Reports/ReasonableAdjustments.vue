<template>
  <div>
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Reasonable Adjustments Report
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

    <div
      v-if="report != null"
      class="govuk-grid-row"
    >
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Total applications
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ report.totalApplications | formatNumber }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Reasonable adjustments requests
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ report.rows.length | formatNumber }}
          </h2>
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
      <div class="govuk-grid-column-one-third text-right">
        <Select
          id="reasonalbe-adjustments-status-filter"
          v-model="reasonalbeAdjustmentsStatus"
          class="govuk-!-margin-right-2"
        >
          <option value="all">
            All
          </option>
          <option value="">
            Unassigned
          </option>
          <option value="approved">
            Approved
          </option>
          <option value="denied">
            Denied
          </option>
        </Select>
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
            <TableCell
              v-if="reasonalbeAdjustmentsStatus === 'all' || (row.candidate.reasonableAdjustmentsStatus || '') === (reasonalbeAdjustmentsStatus || '')"
              :title="tableColumns[0].title"
            >
              <div class="govuk-grid-row">
                <div class="govuk-grid-column-two-thirds">
                  <div class="candidate-name govuk-heading-m govuk-!-margin-bottom-0">
                    <span v-if="row.candidate">
                      {{ row.candidate.fullName }}
                    </span>
                  </div>
                </div>
                <div class="govuk-grid-column-one-third text-right">
                  <RouterLink
                    :to="{name: 'exercise-application', params: { applicationId: row.id, tab: 'issues' } }"
                    class="govuk-link print-none"
                    target="_blank"
                  >
                    View application
                  </RouterLink>
                </div>
                <div class="govuk-grid-column-full">
                  <h4 class="govuk-!-margin-bottom-1">
                    Status
                  </h4>
                  <Select
                    id="reasonable-adjustments-status"
                    :value="row.candidate.reasonableAdjustmentsStatus || ''"
                    @input="saveReasonableAdjustmentsStatus(row, $event)"
                  >
                    <option value="" />
                    <option value="approved">
                      Approved
                    </option>
                    <option value="denied">
                      Denied
                    </option>
                  </Select>
                </div>
                <div class="govuk-grid-column-full">
                  <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-1">
                    Where the reasonable adjustments was given
                  </h4>
                  <Select
                    id="reasonable-adjustments-from"
                    :value="row.candidate.reasonableAdjustmentsFrom || ''"
                    @input="saveReasonableAdjustmentsFrom(row, $event)"
                  >
                    <option value="" />
                    <option value="qualifying-test">
                      Qualifying Test
                    </option>
                    <option value="selection-day">
                      Selection Day
                    </option>
                  </Select>
                </div>

                <div class="govuk-grid-column-two-thirds">
                  <a
                    href="#"
                    class="govuk-link print-none"
                    @click.prevent="toggleReasonableAdjustmentsDetails(row.id)"
                  >
                    View all reasonable adjustments<span
                      class="icon-expand"
                      :class="open[row.id] ? 'open' : 'close'"
                    >
                      <img src="@/assets/expand.svg">
                    </span>
                  </a>
                </div>
              </div>

              <div v-if="open[row.id]">
                <div
                  v-for="(ar, index) in getOtherReasonableAdjustments(row.candidate.id)"
                  :key="`${row.candidate.id}-${index}`"
                >
                  <hr
                    class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-top-2"
                  >
                  <p class="govuk-hint">
                    Exercise - {{ ar.exercise.referenceNumber }}
                  </p>
                  <div class="govuk-grid-row">
                    <div class="govuk-grid-column-two-thirds">
                      <div class="candidate-name govuk-heading-m govuk-!-margin-bottom-4">
                        {{ ar.exercise.name }}
                      </div>
                    </div>
                    <div class="govuk-grid-column-one-third text-right">
                      <a
                        :href="`/exercise/${ar.exercise.id}/applications/qualifyingTestPassed/application/${ar.application.id}`"
                        class="govuk-link print-none"
                        target="_blank"
                      >
                        View application
                      </a>
                    </div>
                  </div>
                  <div
                    v-if="ar.candidate.reasonableAdjustmentsDetails"
                    class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4"
                  >
                    <p class="govuk-body">
                      {{ ar.candidate.reasonableAdjustmentsDetails }}
                    </p>
                  </div>
                </div>
              </div>
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
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import { EXERCISE_STAGE } from '@jac-uk/jac-kit/helpers/constants';
import { applicationRecordCounts } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';

export default {
  name: 'ReasonableAdjustments',
  components: {
    Select,
    Table,
    TableCell,
  },
  mixins: [permissionMixin],
  data() {
    return {
      exerciseStage: 'all',
      candidateStatus: 'all',
      availableStatuses: null,
      reasonalbeAdjustmentsStatus: 'all',
      applicationRecords: [],
      tableColumns: [
        { title: 'Candidate' },
      ],
      paginationType: '',
      pageSize: 50,
      unsubscribe: null,
      unsubscribeReport: null,
      open: {},
      otherApplicationRecords: [],
      report: null,
      refreshingReport: false,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
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
    applicationRecords: function() {
      this.getOtherApplicationRecords(this.applicationRecords);
    },
  },
  created() {
    this.$store.dispatch('applications/bind', { exerciseId: this.exercise.id, status: 'applied' });
    this.unsubscribeReport = firestore.doc(`exercises/${this.exercise.id}/reports/reasonableAdjustments`)
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
        .where('candidate.reasonableAdjustments', '==', true);
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
    async saveReasonableAdjustmentsStatus(applicationRecord, status) {
      applicationRecord.candidate.reasonableAdjustmentsStatus = status;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    async saveReasonableAdjustmentsFrom(applicationRecord, value) {
      applicationRecord.candidate.reasonableAdjustmentsFrom = value;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    toggleReasonableAdjustmentsDetails(id) {
      this.open[id] = this.open[id] === undefined ? true : !this.open[id];
      this.open = Object.assign({}, this.open);
    },
    async getOtherApplicationRecords(applicationRecords) {
      if (!applicationRecords || !applicationRecords.length) {
        this.otherApplicationRecords = [];
      }
      
      for (let i = 0; i < applicationRecords.length; i++) {
        const record = applicationRecords[i];
        const firestoreRef = firestore
          .collection('applicationRecords')
          .where('candidate.id', '==', record.candidate.id)
          .where('candidate.reasonableAdjustments', '==', true);
        const snapshot = await firestoreRef.get();
        const otherRecords = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.exercise.id === record.exercise.id) {
            otherRecords.unshift(data); // put current exercise first
          } else {
            otherRecords.push(data);
          }
        });
        if (otherRecords.length) {
          this.otherApplicationRecords.push({
            candidateId: record.candidate.id,
            otherRecords,
          });
        }
      }
    },
    getOtherReasonableAdjustments(candidateId) {
      const record = this.otherApplicationRecords.find(item => item.candidateId === candidateId);
      return record ? record.otherRecords : [];
    },
    togglePagination() {
      this.paginationType = this.paginationType === 'uppercase-letter' ? '' : 'uppercase-letter';
      this.pageSize = this.paginationType === 'uppercase-letter' ? 0 : 50;
    },
    async refreshReport() {
      this.refreshingReport = true;
      await functions.httpsCallable('generateReasonableAdjustmentsReport')({ exerciseId: this.exercise.id });
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
      const title = 'Reasonable Adjustments Report';
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
