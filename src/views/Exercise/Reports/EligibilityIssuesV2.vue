<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Eligibility Issues v2
          </h2>
          <span
            v-if="eligibilityIssuesReport"
            class="govuk-body govuk-!-font-size-14"
          >
            {{ $filters.formatDate(eligibilityIssuesReport.createdAt, 'longdatetime') }}
          </span>
        </div>
        <div
          class="moj-page-header-actions__actions float-right"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
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
                v-if="hasPermissions([
                  PERMISSIONS.exercises.permissions.canReadExercises.value,
                  PERMISSIONS.applications.permissions.canReadApplications.value,
                  PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value
                ])"
                class="govuk-!-margin-right-2"
                :action="downloadSCCAnnexReport"
              >
                Download SCC Annex report
              </ActionButton>
              <ActionButton
                type="primary"
                :action="refreshReport"
              >
                Refresh
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="govuk-grid-column-full text-right">
      <div class="govuk-!-display-inline-block ">
        <Checkbox
          id="show-not-met"
          v-model="showNotMet"
        >
          Display only candidates with Eligibility issues
        </Checkbox>
      </div>
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
        ref="issuesTable"
        data-key="id"
        :data="applicationRecords"
        :columns="tableColumns"
        :page-size="10"
        :page-item-type="'number'"
        :total="total"
        :search-map="$searchMap.applicationRecords"
        @change="getTableData"
      >
        <template #row="{row}">
          <TableCell
            v-if="filterIssueStatus(row)"
            :title="tableColumns[0].title"
          >
            <!-- candidate name -->
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-two-thirds">
                <div class="candidate-name govuk-heading-m govuk-!-margin-top-8 govuk-!-margin-bottom-0">
                  {{ row.referenceNumber }}
                  <span v-if="row.candidate">{{ row.candidate.fullName }}</span>
                </div>
              </div>
              <div class="govuk-grid-column-one-third text-right  govuk-!-margin-top-8 govuk-!-margin-bottom-0">
                <RouterLink
                  :to="{name: 'exercise-application', params: { applicationId: row.id, tab: 'issues' }}"
                  target="_blank"
                  class="govuk-link print-none"
                >
                  View application
                </RouterLink>
              </div>
            </div>

            <!-- statutory eligibility issues -->
            <div
              v-for="(issueGroup, index) in row.issueGroups"
              :key="issueGroup.category"
              class="govuk-grid-row"
            >
              <hr
                class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-bottom-6"
                :class="{'candidate-break': index === 0}"
              >
              <div class="govuk-grid-column-full">
                <h3 class="govuk-!-margin-top-0 govuk-!-margin-bottom-4">
                  {{ issueGroup.category }}
                </h3>
              </div>

              <div
                v-for="(issue, index) in issueGroup.issues"
                :key="`${index}_${issue.type}`"
              >
                <!-- issue summary & candidate comments -->
                <div class="govuk-grid-column-two-thirds govuk-!-margin-bottom-3">
                  <!-- issue summary -->
                  <div class="govuk-!-margin-top-0 govuk-!-margin-bottom-3">
                    <span class="govuk-!-font-weight-bold">{{ mapIssueTypeToName(issue.type) }}:</span> {{ issue.summary }}
                  </div>

                  <!-- candidate comments -->
                  <div
                    v-if="hasCandidateComments(issue)"
                    class="govuk-!-margin-top-0  govuk-!-margin-bottom-0"
                  >
                    <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-1">
                      Candidate comments:
                    </h4>
                    {{ issue.candidateComments || '' }}
                  </div>
                </div>

                <!-- issue recommendation -->
                <div
                  v-if="showRecommendation(issue, index) || isForStatutoryRecommendation(issue, index)"
                  class="govuk-grid-column-one-third govuk-!-margin-top-0  govuk-!-margin-bottom-0 text-right"
                  :class="{
                    'govuk-!-margin-bottom-0': !!issue.result || isForStatutoryRecommendation(issue, index),
                    'govuk-!-margin-bottom-6': !issue.result && !isForStatutoryRecommendation(issue, index),
                  }"
                >
                  <h4 class="govuk-!-margin-bottom-1 govuk-!-margin-top-0">
                    Recommendation
                  </h4>
                  <Select
                    :id="`${row.id}_${index}_${issue.type}_status`"
                    :model-value="issue.result"
                    class="govuk-!-margin-bottom-0"
                    @update:model-value="saveIssueStatus(row, issue.type, $event)"
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

                <!-- reasons not satisfied / JAC comments -->
                <div
                  v-if="issue.result && (showRecommendation(issue, index) || isForStatutoryReasons(issueGroup.issues, issue, index))"
                  class="govuk-!-margin-top-0 govuk-grid-column-full"
                >
                  <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-1">
                    {{ isForStatutoryReasons(issueGroup.issues, issue, index) ? 'Reasons not satisfied' : 'JAC comments' }}
                  </h4>
                  <TextareaInput
                    :id="`${row.id}_${index}_${issue.type}_reason`"
                    :model-value="issue.comments"
                    @update:model-value="saveIssueStatusReason(row, issue.type, $event)"
                  />
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
import { query, collection, doc, where, onSnapshot } from '@firebase/firestore';
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
import { debounce } from 'lodash';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import { downloadBase64File } from '@/helpers/file';

export default {
  name: 'EligibilityIssuesV2',
  components: {
    Table,
    TableCell,
    Select,
    TextareaInput,
    ActionButton,
    Checkbox,
  },
  mixins: [permissionMixin],
  data () {
    return {
      eligibilityIssuesReport: null,
      unsubscribeEligibilityIssuesReport: null,
      applicationRecords: [],
      issueStatus: 'all',
      unsubscribeApplicationRecords: null,
      tableColumns: [
        { title: 'Candidate', sort: 'candidate.fullName', default: true },
      ],
      total: null,
      showNotMet: false,
      statutoryTypes: ['pq', 'pqe'],
      nonStatutoryTypes: ['pje', 'rls'],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
  },
  watch: {
    showNotMet: function () {
      this.$refs['issuesTable'].reload();
    },
  },
  created() {
    this.unsubscribeEligibilityIssuesReport = onSnapshot(
      doc(firestore, `exercises/${this.exercise.id}/reports/eligibilityIssues`),
      (snap) => {
        if (snap.exists) {
          this.eligibilityIssuesReport = vuexfireSerialize(snap);
        }
      });
  },
  unmounted() {
    if (this.unsubscribeEligibilityIssuesReport) {
      this.unsubscribeEligibilityIssuesReport();
    }
    if (this.unsubscribeApplicationRecords) {
      this.unsubscribeApplicationRecords();
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
      if (this.showNotMet) {
        firestoreRef = query(firestoreRef, where('flags.eligibilityIssuesMet', '==', false));
      }
      const res = await tableAsyncQuery(this.applicationRecords, firestoreRef, params, null);
      firestoreRef = res.queryRef;
      this.total = res.total;
      if (firestoreRef) {
        this.unsubscribeApplicationRecords = onSnapshot(
          firestoreRef,
          (snap) => {
            const applicationRecords = [];
            snap.forEach((doc) => {
              const record = vuexfireSerialize(doc);
              record.issueGroups = this.groupIssuesByStatutory(record);
              applicationRecords.push(record);
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
    async saveIssueStatus(applicationRecord, issueType, status) {
      applicationRecord.issues.eligibilityIssues.forEach((issue) => {
        // statutory issues share one overall recommendation
        // non-statutory issues have separate recommendation
        const isStatutory = this.statutoryTypes.includes(issue.type) && this.statutoryTypes.includes(issueType);
        if (isStatutory || issue.type === issueType) {
          issue.result = status;
        }
      });

      const data = {
        'issues.eligibilityIssues': applicationRecord.issues.eligibilityIssues,
      };

      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data }]);
    },
    saveIssueStatusReason: debounce(async function (applicationRecord, issueType, reason) {

      applicationRecord.issues.eligibilityIssues.forEach((issue) => {
        const isStatutory = this.statutoryTypes.includes(issue.type) && this.statutoryTypes.includes(issueType);
        if (isStatutory || issue.type === issueType) {
          issue.comments = reason;
        }
      });
      const data = {
        'issues.eligibilityIssues': applicationRecord.issues.eligibilityIssues,
      };
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data }]);
    }, 2000),
    async downloadSCCAnnexReport() {
      if (!this.exercise.referenceNumber) return; // abort if no ref
      try {
        const result = await httpsCallable(functions, 'exportApplicationEligibilityIssues')({ exerciseId: this.exercise.id, format: 'annex' });
        if (!result.data) return;
        downloadBase64File(
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          result.data,
          `${this.exercise.referenceNumber}_SCC Annex Report.docx`
        );
        return true;
      } catch (error) {
        return;
      }
    },
    groupIssuesByStatutory(applicationRecord) {
      const eligibilityIssues = applicationRecord.issues.eligibilityIssues;

      const statutoryTypes = this.statutoryTypes;
      const nonStatutoryTypes = this.nonStatutoryTypes;

      const statutoryIssues = statutoryTypes.map((targeType) => eligibilityIssues.find((issue) => issue.type === targeType))
        .filter((issue) => !!issue);
      const nonStatutoryIssues = nonStatutoryTypes.map((targeType) => eligibilityIssues.find((issue) => issue.type === targeType))
        .filter((issue) => !!issue);

      return [
        {
          category: 'Statutory',
          issues: statutoryIssues,
        },
        {
          category: 'Non-statutory',
          issues: nonStatutoryIssues,
        },
      ];
    },
    mapIssueTypeToName(type) {
      const typeToName = {
        'pq': 'Professional Qualification',
        'pqe': 'Post-qualification experience',
        'pje': 'Previous Judicial Experience',
        'rls': 'Reasonable length of service',
      };

      return typeToName[type] || '';
    },
    showRecommendation(issue) {
      // For statutory issues, only have one overall recommendation, it's displayed in other style.
      // For non-statutory issues, show recommendation for each issue.
      const isStatutory = this.statutoryTypes.includes(issue.type);
      return !isStatutory;
    },
    isForStatutoryRecommendation(issue, index) {
      // For statutory issues, only have one overall recommendation, it's next to the first statutory issue.
      return this.statutoryTypes.includes(issue.type) && index === 0;
    },
    isForStatutoryReasons(statutoryIssues, issue, index) {
      // For statutory issues, only have one overall recommendation, it's next to the last statutory issue.
      return this.statutoryTypes.includes(issue.type) && index === (statutoryIssues.length - 1);
    },
    hasCandidateComments(issue) {
      return this.nonStatutoryTypes.includes(issue.type);
    },
    filterIssueStatus(applicationRecord) {
      if (this.issueStatus === 'all') return true;

      const issues = applicationRecord.issues.eligibilityIssues;
      return issues.some((issue) => issue.result === this.issueStatus);
    },
  },
};
</script>

<style lang="scss">
.candidate-break {
  border-bottom: 2px solid govuk-colour("black") !important;
}
</style>
