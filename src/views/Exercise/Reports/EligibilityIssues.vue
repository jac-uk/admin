<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-one-third">
      <h1 class="govuk-heading-l">
        Eligibility Issues
      </h1>
    </div>
    <div class="govuk-grid-column-two-thirds text-right govuk-!-padding-bottom-7">
      <ActionButton
        v-if="hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
          PERMISSIONS.applications.permissions.canReadApplications.value
        ])"
        class="govuk-!-margin-right-2"
        :action="exportData"
      >
        Export to Excel
      </ActionButton>
      <ActionButton
        v-if="hasPermissions([
          PERMISSIONS.exercises.permissions.canReadExercises.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value
        ])"
        class="govuk-!-margin-right-2"
        :action="exportToGoogleDoc"
      >
        Generate Report
      </ActionButton>
      <ActionButton
        type="primary"
        :action="refreshReport"
      >
        Refresh
      </ActionButton>
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
        :page-item-type="'number'"
        :total="total"
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
                  <option value="discuss">
                    Discuss
                  </option>
                </Select>
              </div>
              <div
                v-if="row.issues.eligibilityIssuesStatus"
                class="govuk-grid-column-full"
              >
                <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-1">
                  Reason for recommendation
                </h4>
                <TextareaInput
                  id="recommendation-reason"
                  :value="row.issues.eligibilityIssuesStatusReason"
                  @input="saveIssueStatusReason(row, $event)"
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
                  <span class="govuk-!-font-weight-bold">{{ $filters.lookup(issue.type) }}:</span> {{ issue.summary }}
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
import { httpsCallable } from '@firebase/functions';
import { query, collection, where, onSnapshot } from '@firebase/firestore';
import { firestore, functions } from '@/firebase';
import vuexfireSerialize from '@jac-uk/jac-kit/helpers/vuexfireSerialize';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import { tableAsyncQuery } from '@jac-uk/jac-kit/components/Table/tableQuery';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import permissionMixin from '@/permissionMixin';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';

export default {
  name: 'EligibilityIssues',
  components: {
    Table,
    TableCell,
    Select,
    TextareaInput,
    ActionButton,
  },
  mixins: [permissionMixin],
  data () {
    return {
      applicationRecords: [],
      issueStatus: 'all',
      unsubscribe: null,
      tableColumns: [
        { title: 'Candidate', sort: 'candidate.fullName', default: true },
      ],
      total: null,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async refreshReport() {
      try {
        return await httpsCallable(functions, 'flagApplicationIssuesForExercise')({ exerciseId: this.exercise.id });
      } catch (error) {
        return;
      }
    },
    async exportToGoogleDoc() {
      if (!this.exercise.referenceNumber) return; // abort if no ref
      try {
        return await httpsCallable(functions, 'exportApplicationEligibilityIssues')({ exerciseId: this.exercise.id, format: 'googledoc' });
      } catch (error) {
        return;
      }
    },
    async getTableData(params) {
      let firestoreRef = query(
        collection(firestore, 'applicationRecords'),
        where('exercise.id', '==', this.exercise.id),
        where('flags.eligibilityIssues', '==', true)
      );
      const res = await tableAsyncQuery(this.applicationRecords, firestoreRef, params, null);
      firestoreRef = res.queryRef;
      this.total = res.total;
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
    async gatherReportData() {
      // fetch data
      const response = await httpsCallable(functions, 'exportApplicationEligibilityIssues')({ exerciseId: this.exercise.id, format: 'excel' });
      const reportData = [];
      // get headers
      reportData.push(response.data.headers.map(header => header.title));
      // get rows
      response.data.rows.forEach((row) => {
        reportData.push(response.data.headers.map(header => row[header.ref]));
      });

      return reportData;
    },
    async exportData() {
      try {
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
        return true;
      } catch (error) {
        return;
      }
    },
    async saveIssueStatus(applicationRecord, status) {
      applicationRecord.issues.eligibilityIssuesStatus = status;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    async saveIssueStatusReason(applicationRecord, reason) {
      applicationRecord.issues.eligibilityIssuesStatusReason = reason;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
  },
};
</script>
