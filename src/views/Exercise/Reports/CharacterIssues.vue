<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <h1 class="govuk-heading-l">
        Character Issues
      </h1>
    </div>
    <div class="govuk-grid-column-one-third text-right">
      <button
        class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
        @click="downloadReport"
      >
        <span
          v-if="downloadingReport"
          class="spinner-border spinner-border-sm"
        />
        Export Data
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
      <!-- // TODO Include count for character issues across whole exercise. Then display here.
      <p class="govuk-body">
        Candidates with character issues: <b>{{ applications.length }}</b>
      </p>
      -->
      <Table
        ref="issuesTable"
        data-key="id"
        :data="filteredApplicationRecords"
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
            v-if="issueStatus === 'all' || ((row.issues.characterIssuesStatus || '') === (issueStatus || ''))"
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
                  :to="{name: 'exercise-application', params: { applicationId: row.id, tab: 'issues' } }"
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
                  :value="row.issues.characterIssuesStatus || ''"
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
              </div>
              <div
                v-if="row.issues.characterIssueStatus"
                class="govuk-grid-column-full"
              >
                <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-1">
                  Reason for recommendation
                </h4>
                <TextareaInput
                  id="reason-for-status"
                  :value="row.issues.characterIssueStatusReason"
                  @input="saveIssueStatusReason(row, $event)"
                />
              </div>
            </div>
            <div
              v-for="(issue, index) in row.issues.characterIssues"
              :key="index"
              class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4"
            >
              <hr
                class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-top-2"
                :class="{'govuk-!-margin-left-3 govuk-!-margin-right-3': index}"
              >
              <div class="govuk-grid-column-full">
                <div class="issue">
                  <p class="govuk-body">
                    {{ issue.summary }}
                  </p>
                  <EventRenderer
                    v-if="issue.events"
                    :events="issue.events"
                  />
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
import EventRenderer from '@jac-uk/jac-kit/draftComponents/EventRenderer';
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select';
import { EXERCISE_STAGE } from '@jac-uk/jac-kit/helpers/constants';
import { applicationRecordCounts } from '@/helpers/exerciseHelper';

export default {
  components: {
    EventRenderer,
    Select,
    Table,
    TableCell,
    TextareaInput,
  },
  data () {
    return {
      exerciseStage: 'all',
      candidateStatus: 'all',
      issueStatus: 'all',
      availableStatuses: null,
      applicationRecords: [],
      filteredApplicationRecords: [],
      refreshingReport: false,
      unsubscribe: null,
      tableColumns: [
        { title: 'Candidate' },
      ],
      downloadingReport: false,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
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
    applicationRecords() {
      this.filterIssueStatus();
    },
    issueStatus() {
      this.filterIssueStatus();
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
    async downloadReport() {
      this.downloadingReport = true;
      if (!this.exercise.referenceNumber) {
        this.downloadingReport = false;
        return; //Abort if no ref
      }
      const reportData = await functions.httpsCallable('exportApplicationCharacterIssues')({
        exerciseId: this.exercise.id,
        stage: this.exerciseStage,
        status: this.candidateStatus,
      });
      const title = `Character Check Report - ${this.exercise.referenceNumber}`;
      const data = [];
      if (reportData.data.rows.length === 0) {
        this.downloadingReport = false;
        return; //Abort if no applications or data.
      }
      data.push(reportData.data.headers.map(header => header.title));
      // get rows
      reportData.data.rows.forEach((row) => {
        data.push(Object.values(row).map(cell => cell));
      });

      downloadXLSX(data, {
        title,
        sheetName: title,
        filename: `${title}.xlsx`,
      });
      this.downloadingReport = false;
    },
    getTableData(params) {
      let firestoreRef = firestore
        .collection('applicationRecords')
        .where('exercise.id', '==', this.exercise.id)
        .where('flags.characterIssues', '==', true);
      if (this.exerciseStage !== 'all') {
        firestoreRef = firestoreRef.where('stage', '==', this.exerciseStage);
      }
      // intercept params so we can override without polluting the passed in object
      const localParams = { ...params };
      if (this.candidateStatus === 'all') {
        firestoreRef = firestoreRef.where('status', '!=', 'withdrewApplication');
        localParams.orderBy = ['status', 'documentId'];
      } else {
        firestoreRef = firestoreRef.where('status', '==', this.candidateStatus);
        localParams.orderBy = 'documentId';
      }
      firestoreRef = tableQuery(this.applicationRecords, firestoreRef, localParams);
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
    async saveIssueStatus(applicationRecord, status) {
      applicationRecord.issues.characterIssuesStatus = status;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    async saveIssueStatusReason(applicationRecord, reason) {
      applicationRecord.issues.characterIssueStatusReason = reason;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    filterIssueStatus() {
      if (this.issueStatus === 'all') {
        this.filteredApplicationRecords = this.applicationRecords;
      } else {
        this.filteredApplicationRecords = [];
        for (let i = 0; i < this.applicationRecords.length; i++) {
          const filterIssues = this.applicationRecords[i].issues.characterIssues.filter(issue => (!issue.status && this.issueStatus === '') || issue.status === this.issueStatus);
          if (filterIssues && filterIssues.length) {
            this.applicationRecords[i].issues.eligibilityIssues = filterIssues;
            this.filteredApplicationRecords.push(this.applicationRecords[i]);
          }
        }
      }
    },
  },
};
</script>
