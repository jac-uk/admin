<template>
  <div class="govuk-grid-row">
    <div class="govuk-grid-column-one-third">
      <h1 class="govuk-heading-l">
        Character Issues
      </h1>
    </div>
    <!-- bottom padding is needed on the next div else the grid layout messes up for some reason -->
    <div class="govuk-grid-column-two-thirds text-right govuk-!-padding-bottom-7">
      <ActionButton
        v-if="hasPermissions([
          PERMISSIONS.applicationRecords.permissions.canReadApplicationRecords.value,
          PERMISSIONS.applications.permissions.canReadApplications.value,
          PERMISSIONS.exercises.permissions.canReadExercises.value
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
          PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value
        ])"
        type="primary"
        :action="refreshReport"
      >
        Refresh
      </ActionButton>
    </div>
    <div class="govuk-grid-column-two-thirds clearfix">
      <div class="govuk-button-group">
        <Select
          id="exercise-stage"
          v-model="exerciseStage"
          class="govuk-!-margin-right-2"
        >
          <option
            v-for="stage in availableStages"
            :key="stage"
            :value="stage"
          >
            {{ $filters.lookup(stage) }} ({{ $filters.formatNumber(applicationRecordCounts[stage]) }})
          </option>
        </Select>
        <Select
          v-if="availableStatuses && availableStatuses.length > 0"
          id="availableStatuses"
          v-model="candidateStatus"
        >
          <option
            v-for="item in availableStatuses"
            :key="item"
            :value="item"
          >
            {{ $filters.lookup(item) }}
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
            v-if="issueStatus === 'all' || (row.issues.characterIssuesStatus || '') === (issueStatus || '')"
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
                  :to="{name: 'exercise-application', params: { applicationId: row.id }, query: {tab: 'issues' } }"
                  class="govuk-link print-none"
                  target="_blank"
                >
                  View application
                </RouterLink>
              </div>
              <div class="govuk-grid-column-full">
                <h4 class="govuk-!-margin-bottom-1">
                  Recommended SCC approach
                </h4>
                <Select
                  id="issue-status"
                  :model-value="row.issues.characterIssuesStatus || ''"
                  @update:model-value="saveIssueStatus(row, $event)"
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
                v-if="row.issues.characterIssuesStatus"
                class="govuk-grid-column-full"
              >
                <h4 class="govuk-!-margin-top-0 govuk-!-margin-bottom-1">
                  Reason for recommendation
                </h4>
                <TextareaInput
                  id="reason-for-status"
                  :value="row.issues.characterIssuesStatusReason"
                  @input="saveIssueStatusReason(row, $event)"
                />
              </div>

              <div class="govuk-grid-column-full">
                <div
                  v-for="(issue, index) in row.issues.characterIssues"
                  :key="index"
                  class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4"
                >
                  <hr
                    v-if="index !== 0"
                    class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-top-2"
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
              </div>
              <div class="govuk-grid-column-two-thirds">
                <a
                  href="#"
                  class="govuk-link print-none"
                  @click.prevent="toggleIssues(row)"
                >
                  View all character issues from previous applications<span
                    class="icon-expand"
                    :class="open[row.id] ? 'open' : 'close'"
                  >
                    <img src="@/assets/expand.svg">
                  </span>
                </a>
              </div>
              <div class="govuk-grid-column-one-third">
                Offence category
                <Select
                  id="issue-offence-category"
                  :model-value="row.issues.characterIssuesOffenceCategory || ''"
                  class="offence-category"
                  @update:model-value="saveIssueOffenceCategory(row, $event)"
                >
                  <option value="" />
                  <option
                    v-for="value in offenceCategory"
                    :key="value"
                    :value="value"
                  >
                    {{ $filters.lookup(value) }}
                  </option>
                </Select>
              </div>
            </div>

            <div v-if="open[row.id]">
              <template v-if="getOtherCharacterIssues(row).length">
                <div
                  v-for="(ar, index) in getOtherCharacterIssues(row)"
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
                        :href="`/exercise/${ar.exercise.id}/applications/applied/application/${ar.application.id}`"
                        class="govuk-link print-none"
                        target="_blank"
                      >
                        View application
                      </a>
                    </div>
                  </div>
                  <template v-if="ar.issues.characterIssues && ar.issues.characterIssues.length">
                    <div
                      v-for="(issue, subIndex) in ar.issues.characterIssues"
                      :key="`${index}-${subIndex}`"
                      class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4 govuk-!-margin-left-3"
                    >
                      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-top-2">
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
                  </template>
                  <template v-else>
                    <p class="govuk-body">
                      Data not requested
                    </p>
                  </template>
                </div>
              </template>
              <template v-else>
                <p class="govuk-body">
                  No previous applications with character issues
                </p>
              </template>
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
import EventRenderer from '@jac-uk/jac-kit/draftComponents/EventRenderer.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import { tableAsyncQuery } from '@jac-uk/jac-kit/components/Table/tableQuery';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import { applicationRecordCounts, availableStages, availableStatuses } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { OFFENCE_CATEGORY } from '@/helpers/constants';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';

export default {
  name: 'CharacterIssues',
  components: {
    EventRenderer,
    Select,
    Table,
    TableCell,
    TextareaInput,
    ActionButton,
  },
  mixins: [permissionMixin],
  data () {
    return {
      exerciseStage: 'all',
      candidateStatus: 'all',
      issueStatus: 'all',
      applicationRecords: [],
      unsubscribe: null,
      tableColumns: [
        { title: 'Candidate' },
      ],
      total: null,
      otherApplicationRecords: [], // used to store other application records for the same candidate (format: "[ { candidateId: '', otherRecords: [] }")
      open: [],
      offenceCategory: OFFENCE_CATEGORY,
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
    },
    availableStages() {
      const stages = availableStages(this.exercise);
      return stages.filter(stage => this.applicationRecordCounts[stage]);
    },
    availableStatuses() {
      if (this.exerciseStage === 'all') return null;
      const statuses = availableStatuses(this.exercise, this.exerciseStage);
      return statuses;
    },
  },
  watch: {
    exerciseStage: function () {
      this.candidateStatus = this.availableStatuses[0] || '';
      this.$refs['issuesTable'].reload();
    },
    candidateStatus: function() {
      this.$refs['issuesTable'].reload();
    },
  },
  mounted() {
    this.exerciseStage = this.availableStages[0] || '';
    this.candidateStatus = this.availableStatuses[0] || '';
  },
  unmounted() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    async refreshReport() {
      try {
        await functions.httpsCallable('flagApplicationIssuesForExercise')({ exerciseId: this.exercise.id });
        return true;
      } catch (error) {
        return;
      }
    },
    async gatherReportData() {
      // fetch data
      const response = await functions.httpsCallable('exportApplicationCharacterIssues')({
        exerciseId: this.exercise.id,
        stage: this.exerciseStage,
        status: this.candidateStatus,
        format: 'excel',
      });
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
      if (!this.exercise.referenceNumber) return; // abort if no ref
      try {
        const title = 'Character Issues';
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
    async exportToGoogleDoc() {
      if (!this.exercise.referenceNumber) return; // abort if no ref
      try {
        await functions.httpsCallable('exportApplicationCharacterIssues')({
          exerciseId: this.exercise.id,
          stage: this.exerciseStage,
          status: this.candidateStatus,
          format: 'googledoc',
        });
        return true;
      } catch (error) {
        return;
      }
    },
    async getTableData(params) {
      let firestoreRef = firestore
        .collection('applicationRecords')
        .where('exercise.id', '==', this.exercise.id)
        .where('flags.characterIssues', '==', true)
        .where('stage', '==', this.exerciseStage)
        .where('status', '==', this.candidateStatus);

      // intercept params so we can override without polluting the passed in object
      const localParams = { ...params };
      localParams.orderBy = 'documentId';

      const res = await tableAsyncQuery(this.applicationRecords, firestoreRef, localParams, null);
      firestoreRef = res.queryRef;
      this.total = res.total;
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
    async saveIssueStatus(applicationRecord, status) {
      applicationRecord.issues.characterIssuesStatus = status;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    async saveIssueStatusReason(applicationRecord, reason) {
      applicationRecord.issues.characterIssuesStatusReason = reason;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    toggleIssues(applicationRecord) {
      this.getOtherApplicationRecords(applicationRecord);
      const id = applicationRecord.id;
      this.open[id] = this.open[id] === undefined ? true : !this.open[id];
      this.open = Object.assign({}, this.open);
    },
    async saveIssueOffenceCategory(applicationRecord, category) {
      applicationRecord.issues.characterIssuesOffenceCategory = category;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    async getOtherApplicationRecords(applicationRecord) {
      const match = this.otherApplicationRecords.find(item => item.candidateId === applicationRecord.candidate.id);
      if (match) return; // already have the data for this candidate

      // get other application records for this candidate
      const firestoreRef = firestore
        .collection('applicationRecords')
        .where('candidate.id', '==', applicationRecord.candidate.id)
        .where('exercise.id', '!=', applicationRecord.exercise.id); // exclude current exercise
      const snapshot = await firestoreRef.get();
      const otherRecords = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        otherRecords.push(data);
      });
      if (otherRecords.length) {
        this.otherApplicationRecords.push({
          candidateId: applicationRecord.candidate.id,
          otherRecords,
        });
      }
    },
    getOtherCharacterIssues(applicationRecord) {
      const candidateId = applicationRecord.candidate.id;
      const exerciseId = applicationRecord.exercise.id;
      const record = this.otherApplicationRecords.find(item => item.candidateId === candidateId);
      return record ? record.otherRecords.filter(ar => ar.exercise.id !== exerciseId) : [];
    },
  },
};
</script>

<style>
.icon-expand {
  display: inline-block;
  margin-left: 14px;
  transition: transform 0.5s;
}
.icon-expand.open {
  transform: rotate(0deg);
}
.icon-expand.close {
  transform: rotate(180deg);
}

.offence-category select {
  width: 100%;
}
</style>
