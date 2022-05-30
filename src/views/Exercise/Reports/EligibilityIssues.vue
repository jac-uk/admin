<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-one-third">
      <h1 class="govuk-heading-l">
        Eligibility Issues
      </h1>
    </div>
    <div class="govuk-grid-column-two-thirds text-right">
      <button
        class="govuk-button govuk-button--secondary govuk-!-margin-right-2"
        :disabled="generatingExport"
        @click="exportData"
      >
        <span
          v-if="generatingExport"
          class="spinner-border spinner-border-sm"
        />
        Export to Excel
      </button>
      <button
        class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
        @click="exportToGoogleDoc"
      >
        <span
          v-if="exportingToGoogleDoc"
          class="spinner-border spinner-border-sm"
        />
        Generate Report
      </button>
      <button
        class="govuk-button moj-button-menu__item moj-page-header-actions__action"
        @click="refreshReport"
      >
        <span
          v-if="refreshingReport"
          class="spinner-border spinner-border-sm"
        /> Refresh
      </button>
    </div>

    <div class="govuk-grid-column-full text-right">
      <Select
        id="issue-status-filter"
        v-model="issueStatus"
        class="govuk-!-margin-right-2"
      >
        <option value="all">
          All issue statuses
        </option>
        <option value="">
          Unassigned
        </option>
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
      </Select>
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
          <TableCell
            v-if="issueStatus === 'all' || (row.issues.eligibilityIssuesStatus || '') === (issueStatus || '')"
            :title="tableColumns[0].title"
          >
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
              <div class="govuk-grid-column-full">
                <h4 class="govuk-!-margin-bottom-1">
                  Recommendation
                </h4>
                <Select
                  id="issue-status"
                  :value="row.issues.eligibilityIssuesStatus || ''"
                  @input="saveIssueStatus(row, $event)"
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
                </Select>
                <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-1">
                  Reason for recommendation
                </h4>
                <TextareaInput
                  id="recommendation-reason"
                  :value="row.issues.eligibilityIssuesReason || ''"
                  @input="debounceInput(row, $event)"
                />
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
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import _ from 'lodash';

export default {
  components: {
    Table,
    TableCell,
    Select,
    TextareaInput,
  },
  data () {
    return {
      applicationRecords: [],
      issueStatus: 'all',
      refreshingReport: false,
      generatingExport: false,
      unsubscribe: null,
      tableColumns: [
        { title: 'Candidate', sort: 'candidate.fullName', default: true },
      ],
      exportingToGoogleDoc: false,
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
    async exportToGoogleDoc() {
      this.exportingToGoogleDoc = true;
      if (!this.exercise.referenceNumber) {
        this.downloadingReport = false;
        return; // abort if no ref
      }

      try {
        await functions.httpsCallable('exportApplicationEligibilityIssues')({ exerciseId: this.exercise.id, format: 'googledoc' });
      } catch (error) {
        console.error(error);
      }
      this.exportingToGoogleDoc = false;
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
      const response = await functions.httpsCallable('exportApplicationEligibilityIssues')({ exerciseId: this.exercise.id, format: 'excel' });

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
    async saveIssueStatus(applicationRecord, status) {
      applicationRecord.issues['eligibilityIssuesStatus'] = status;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    debounceInput: _.debounce(function(applicationRecord, reason) {
      this.saveIssueReason(applicationRecord, reason);
    }, 2000),
    async saveIssueReason(applicationRecord, reason) {
      applicationRecord.issues['eligibilityIssuesReason'] = reason;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
  },
};
</script>
