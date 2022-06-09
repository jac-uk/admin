<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-l">
        Eligibility Issues
      </h1>
    </div>
    <div class="govuk-grid-column-one-third text-right">
      <button
        v-if="hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
          PERMISSIONS.applications.permissions.canReadApplications.value
        ])"
        class="govuk-button govuk-button--secondary govuk-!-margin-right-2"
        :disabled="generatingExport"
        @click="exportData"
      >
        <span
          v-if="generatingExport"
          class="spinner-border spinner-border-sm"
        /> Export data
      </button>
      <button
        v-if="hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value
        ])"
        class="govuk-button govuk-button--secondary"
        @click="refreshReport"
      >
        <span
          v-if="refreshingReport"
          class="spinner-border spinner-border-sm"
        /> Refresh
      </button>
    </div>

    <div class="govuk-grid-column-full">
      <!-- // TODO Include count for issues across whole exercise. Then display here.
      <p class="govuk-body">
        Candidates with eligibility issues: <b>{{ applications.length }}</b>
      </p>
      -->
      <Table
        data-key="id"
        :data="applicationRecords"
        :columns="tableColumns"
        :page-size="10"
        :custom-search="{
          placeholder: 'Search candidate names',
          handler: candidateSearch,
          field: 'candidate.id',
        }"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell :title="tableColumns[0].title">
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds">
                <div class="candidate-name govuk-heading-m govuk-!-margin-bottom-0">
                  {{ row.referenceNumber }} <span v-if="row.candidate">{{ row.candidate.fullName }}</span>
                </div>
              </div>
              <div class="govuk-grid-column-one-third text-right">
                <RouterLink
                  :to="{name: 'exercise-application', params: { applicationId: row.id, tab: 'issues' }}"
                  class="govuk-link print-none"
                >
                  View application
                </RouterLink>
              </div>
            </div>

            <div
              v-for="(issue, index) in row.issues.eligibilityIssues"
              :key="index"
              class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4"
            >
              <hr
                class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-top-2"
                :class="{'govuk-!-margin-left-3 govuk-!-margin-right-3': index}"
              >
              <div class="govuk-grid-column-two-thirds">
                <div class="issue">
                  <span class="govuk-!-font-weight-bold">{{ issue.type | lookup }}:</span> {{ issue.summary }}
                </div>
                <div
                  v-if="issue.comments"
                  class="jac-comments"
                >
                  <span class="govuk-!-font-weight-bold">JAC / Panel comments:</span> {{ issue.comments }}
                </div>
              </div>
              <div class="govuk-grid-column-one-third">
                <select
                  class="govuk-select"
                  :disabled="!hasPermissions([PERMISSIONS.exercises.permissions.canUpdateExercises.value])"
                >
                  <option value="" />
                  <option value="proceed">
                    Proceed
                  </option>
                  <option value="reject">
                    Reject
                  </option>
                  <option value="reject-non-declaration">
                    Reject Non-Declaration
                  </option>
                  <option value="discuss">
                    Discuss
                  </option>
                </select>
              </div>
            </div>
          </TableCell>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import permissionMixin from '@/permissionMixin';

export default {
  components: {
    Table,
    TableCell,
  },
  mixins: [permissionMixin],
  data () {
    return {
      applicationRecords: [],
      refreshingReport: false,
      generatingExport: false,
      unsubscribe: null,
      tableColumns: [
        { title: 'Candidate', sort: 'candidate.fullName', default: true },
      ],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async refreshReport() {
      this.refreshingReport = true;
      await functions.httpsCallable('flagApplicationIssuesForExercise')({ exerciseId: this.exercise.id });
      this.refreshingReport = false;
    },
    getTableData(params) {
      let firestoreRef = firestore
        .collection('applicationRecords')
        .where('exercise.id', '==', this.exercise.id)
        .where('flags.eligibilityIssues', '==', true);
      firestoreRef = tableQuery(this.applicationRecords, firestoreRef, params);
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
    async gatherReportData() {

      this.generatingExport = true;

      // fetch data
      const response = await functions.httpsCallable('exportApplicationEligibilityIssues')({ exerciseId: this.exercise.id });

      this.generatingExport = false;

      const reportData = [];

      // get headers
      reportData.push(response.data.headers.map(header => header));

      // get rows
      response.data.rows.forEach((row) => {
        reportData.push(Object.values(row).map(cell => cell));
      });

      return reportData;
    },
    async exportData() {
      const title = 'Eligibility Issues';
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
