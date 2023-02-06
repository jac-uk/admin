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
        ref="issuesTable"
        data-key="id"
        :data="applicationRecords"
        :columns="tableColumns"
        :page-size="50"
        :custom-search="{
          placeholder: 'Search candidate names',
          handler: candidateSearch,
          field: 'userId',
        }"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            {{ row.personalDetails.fullName }}
          </TableCell>
          <TableCell :title="tableColumns[1].title">
            {{ row.personalDetails.email }}
          </TableCell>
          <TableCell :title="tableColumns[2].title">
            {{ row.personalDetails.phone }}
          </TableCell>
          <TableCell :title="tableColumns[3].title">
            {{ row.personalDetails.reasonableAdjustmentsDetails }}
          </TableCell>
        </template>
      </Table>
    </div>

    <div
      v-if="report != null && report.rows.length"
      class="govuk-grid-column-full"
    >
      <!-- <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th
              scope="col"
              class="govuk-table__header"
            >
              Name
            </th>
            <th
              scope="col"
              class="govuk-table__header"
            >
              Email
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-table__header--numeric"
            >
              Phone number
            </th>
            <th
              scope="col"
              class="govuk-table__header govuk-!-width-one-third"
            >
              Details
            </th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr
            v-for="row in report.rows"
            :key="row.name + Math.random()"
            class="govuk-table__row"
          >
            <td class="govuk-table__cell">
              {{ row.name }}
            </td>
            <td class="govuk-table__cell">
              <a
                :href="`mailto:${row.email}`"
                class="govuk-link govuk-link--no-visited-state"
                target="_blank"
              >
                {{ row.email }}
              </a>
            </td>
            <td class="govuk-table__cell govuk-table__cell--numeric">
              {{ row.phone }}
            </td>
            <td class="govuk-table__cell">
              {{ row.details }}
            </td>
          </tr>
        </tbody>
      </table> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      tableColumns: [
        { title: 'Name', sort: 'personalDetails.fullName', default: true },
        { title: 'Email' },
        { title: 'Phone number' },
        { title: 'Details' },
      ],
      applicationRecords: [],
      availableStatuses: null,
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
      // this.candidateStatus = 'all';

      // this.$refs['issuesTable'].reload();
    },
    applicationRecords: function() {
    },
  },
  created() {
    this.$store.dispatch('applications/bind', { exerciseId: this.exercise.id, status: 'applied' });
    this.unsubscribe = firestore.doc(`exercises/${this.exercise.id}/reports/reasonableAdjustments`)
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
    async getTableData(params) {
      let firestoreRef = firestore
        .collection('applications')
        .where('exerciseId', '==', this.exercise.id)
        .where('personalDetails.reasonableAdjustments', '==', true);
      if (this.exerciseStage !== 'all') {
        // firestoreRef = firestoreRef.where('stage', '==', this.exerciseStage);
      }
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
