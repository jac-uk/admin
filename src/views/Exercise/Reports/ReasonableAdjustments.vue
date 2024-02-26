<template>
  <div>
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h2 class="govuk-heading-l">
          Reasonable Adjustments Report
        </h2>
      </div>

      <div
        class="moj-page-header-actions__actions float-right govuk-margin-left-10"
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
            {{ $filters.formatNumber(report.totalApplications) }}
          </h2>
        </div>
      </div>
      <div class="govuk-grid-column-one-half">
        <div class="panel govuk-!-margin-bottom-9">
          <span class="govuk-caption-m">
            Reasonable adjustments requests
          </span>
          <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
            {{ $filters.formatNumber(report.rows.length) }}
          </h2>
        </div>
      </div>
    </div>

    <!-- <div class="govuk-button-group"> -->
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <Select
          id="exercise-stage"
          v-model="exerciseStage"
          label="Application Stage"
          class="govuk-!-margin-right-2"
        >
          <option value="all">
            All applications
          </option>
          <option
            v-for="stage in availableStages"
            :key="stage"
            :value="stage"
          >
            {{ $filters.lookup(stage) }} ({{ $filters.formatNumber(applicationRecordCounts[stage]) }})
          </option>
        </Select>
      </div>
      <div class="govuk-grid-column-one-half">
        <Select
          v-if="availableStatuses && availableStatuses.length > 0"
          id="availableStatuses"
          v-model="candidateStatus"
          label="Application Status"
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
            {{ $filters.lookup(item) }}
          </option>
        </Select>
      </div>
    </div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <Select
          id="reasonalbe-adjustments-status-filter"
          v-model="filterStatus"
          class="govuk-!-margin-right-2"
          label="RA Approval Status"
        >
          <option value="all">
            All
          </option>
          <option
            v-for="status in reasonableAdjustmentsStatusOptions"
            :key="status"
            :value="status"
          >
            {{ $filters.lookup(status) }}
          </option>
        </Select>
      </div>
      <div class="govuk-grid-column-one-half">
        <Checkbox
          id="show-actioned"
          v-model="showActioned"
          class="govuk-!-margin-right-2"
          label="Show actioned candidates"
          @change="$refs.issuesTable.reload()"
        />
      </div>
    </div>
    <!-- </div> -->

    <div class="govuk-grid-column-full govuk-!-margin-0">
      <Table
        ref="issuesTable"
        data-key="id"
        :data="applicationRecords"
        :columns="tableColumns"
        page-item-type="uppercase-letter"
        :page-size="50"
        :search-map="$searchMap.applicationRecords"
        @change="getTableData"
      >
        <template #row="{row, index}">
          <TableCell
            v-if="hasStatus(row) && !isActioned(row) || showActioned && (isActioned(row) && hasStatus(row))"
            :title="tableColumns[0].title"
          >
            <div class="govuk-grid-row">
              <div
                v-if="row.candidate"
                class="govuk-grid-column-one-quarter"
              >
                <div class="candidate-name govuk-!-margin-bottom-0">
                  <strong>
                    Full Name:
                  </strong>
                  <br>
                  <span>
                    {{ row.candidate.fullName }}
                  </span>
                </div>
              </div>
              <div class="govuk-grid-column-one-quarter">
                <div class="candidate-phone govuk-!-margin-bottom-0">
                  <span>
                    <strong>
                      Phone:
                      <br>
                    </strong>
                    {{ personalDetails(row.candidate.id)?.phone }}
                  </span>
                </div>
              </div>
              <div class="govuk-grid-column-one-quarter">
                <div class="candidate-phone govuk-!-margin-bottom-0">
                  <span>
                    <strong>
                      Email:
                    </strong>
                    <br>
                    {{ personalDetails(row.candidate.id)?.email }}
                  </span>
                </div>
              </div>
              <div class="govuk-grid-column-one-quarter text-right">
                <strong>
                  Application:
                </strong>
                <br>
                <RouterLink
                  :to="{name: 'exercise-application', params: { applicationId: row.id } }"
                  class="govuk-link print-none"
                  target="_blank"
                >
                  {{ row.id }}
                </RouterLink>
              </div>
            </div>
            <hr>
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-full">
                <strong>
                  {{ exercise.referenceNumber }}:
                </strong>
                <br>
                <span v-if="row.candidate">
                  {{ row.candidate.reasonableAdjustmentsDetails }}
                </span>
              </div>
            </div>

            <div
              v-if="hasPermissions([
                PERMISSIONS.applicationRecords.permissions.canUpdateApplicationRecords.value,
              ])"
            >
              <div
                v-for="(reasonableAdjustmentsState, i) in row.candidate.reasonableAdjustmentsStates"
                :key="i"
                class="govuk-grid-row govuk-!-margin-left-0"
              >
                <div class="govuk-grid-column-one-third">
                  <h4 class="govuk-!-margin-bottom-1">
                    Approval Status
                  </h4>
                  <Select
                    :id="`reasonable-adjustments-status-${row.candidate.id}-${i}`"
                    v-model="reasonableAdjustmentsState.status"
                    @input="saveReasonableAdjustmentsChange(row, { status: $event.target.value }, i)"
                  >
                    <option
                      v-for="status in reasonableAdjustmentsStatusOptions"
                      :key="status"
                      :value="status"
                    >
                      {{ $filters.lookup(status) }}
                    </option>
                  </Select>
                </div>
                <div class="govuk-grid-column-one-third">
                  <h4 class="govuk-!-margin-bottom-1">
                    RA applies to
                  </h4>
                  <Select
                    :id="`reasonable-adjustments-reason-${row.candidate.id}-${i}`"
                    v-model="reasonableAdjustmentsState.reason"
                    @input="saveReasonableAdjustmentsChange(row, { reason: $event.target.value }, i)"
                  >
                    <option
                      v-for="activity in reasonableAdjustmentsActivities"
                      :key="activity"
                      :value="activity"
                    >
                      {{ $filters.lookup(activity) }}
                    </option>
                  </Select>
                </div>
                <div class="govuk-grid-column-one-third">
                  <h4 class="govuk-!-margin-bottom-1">
                    RA allocated
                  </h4>
                  <Select
                    :id="`reasonable-adjustments-time-allocations-${row.candidate.id}-${i}`"
                    v-model="reasonableAdjustmentsState.timeAllocation"
                    @input="saveReasonableAdjustmentsChange(row, { timeAllocation: $event.target.value }, i)"
                  >
                    <option
                      v-for="time in reasonableAdjustmentsTimeAllocations"
                      :key="time"
                      :value="time"
                    >
                      {{ $filters.lookup(time) }}
                    </option>
                  </Select>
                </div>
                <div class="govuk-grid-column-full">
                  <h4 class="govuk-!-margin-bottom-1">
                    Describe reasonable adjustment given
                  </h4>
                  <TextareaInput
                    :id="`reasonable-adjustments-note-${row.candidate.id}-${i}`"
                    v-model="reasonableAdjustmentsState.note"
                    @input="saveReasonableAdjustmentsNote(row, $event.target.value, i)"
                  />
                </div>

                <button
                  v-if="row.candidate.reasonableAdjustmentsStates.length > 1 && i > 0"
                  class="print-none govuk-button govuk-button--warning govuk-button--secondary govuk-!-margin-bottom-0 govuk-!-margin-bottom-2"
                  @click="openModal(index, i)"
                >
                  Remove
                </button>
                <Modal
                  :ref="`removeModal-${index}-${i}`"
                >
                  <ModalInner
                    @close="closeModal(index, i)"
                    @confirmed="removeReasonableAdjustmentsState(index, i)"
                  />
                </Modal>
                <hr>
              </div>

              <div
                class="govuk-grid-row govuk-!-margin-left-0 text-right"
              >
                <button
                  :class="`print-none govuk-button govuk-!-margin-bottom-0 float-left ${isActioned(row) ? 'govuk-button--warning' : ''}`"
                  @click="toggleActioned(index)"
                >
                  Mark candidate as {{ isActioned(row) ? 'un' : '' }}actioned
                  <!-- No further reasonable adjustments to add -->
                </button>
                <button
                  v-if="row.candidate.reasonableAdjustmentsStates.length < reasonableAdjustmentsActivities.length"
                  class="print-none govuk-button govuk-!-margin-bottom-0 float-right"
                  @click="addReasonableAdjustmentsState(index)"
                >
                  Add another
                </button>
              </div>
            </div>

            <div
              class="govuk-grid-row govuk-!-margin-left-0 govuk-!-margin-top-2 text-left"
            >
              <a
                href="#"
                class="govuk-link"
                @click.prevent="handleReasonableAdjustmentsDetailsClick(row)"
              >
                View all reasonable adjustments<span
                  class="icon-expand"
                  :class="open[row.id] ? 'open' : 'close'"
                >
                  <img src="@/assets/expand.svg">
                </span>
              </a>
            </div>

            <div v-if="open[row.id]">
              <div
                v-for="(ar, i) in getOtherReasonableAdjustments(row.candidate.id).filter(ra => ra.exercise.id !== exercise.id)"
                :key="`${row.candidate.id}-${i}`"
              >
                <br>
                <hr
                  class="govuk-section-break govuk-section-break--m govuk-section-break--visible govuk-!-margin-2"
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
                <div
                  v-if="ar.candidate.reasonableAdjustmentsDetails"
                  class="govuk-grid-row govuk-!-margin-0 govuk-!-margin-bottom-4"
                >
                  <p class="govuk-body">
                    {{ ar.candidate.reasonableAdjustmentsDetails }}
                  </p>
                  <ul>
                    <li
                      v-for="(reasonableAdjustmentsState, idx) in ar.candidate.reasonableAdjustmentsStates"
                      :key="idx"
                      style="display: flex;"
                    >
                      <span
                        class="govuk-heading-s"
                        style="flex-basis: 200px;"
                      >
                        Status:
                        <span
                          v-if="reasonableAdjustmentsState.status"
                          class="govuk-body"
                        >
                          {{ $filters.lookup(reasonableAdjustmentsState.status) }}
                        </span>
                      </span>
                      <span
                        class="govuk-heading-s"
                        style="flex-basis: 220px;"
                      >
                        Reason:
                        <span
                          v-if="reasonableAdjustmentsState.reason"
                          class="govuk-body"
                        >
                          {{ $filters.lookup(reasonableAdjustmentsState.reason) }}
                        </span>
                      </span>
                      <span class="govuk-heading-s">
                        Note:
                        <span
                          v-if="reasonableAdjustmentsState.note"
                          class="govuk-body"
                        >
                          {{ reasonableAdjustmentsState.note }}
                        </span>
                      </span>
                    </li>
                  </ul>
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
import Select from '@jac-uk/jac-kit/draftComponents/Form/Select.vue';
import Checkbox from '@jac-uk/jac-kit/draftComponents/Form/Checkbox.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import tableQuery from '@jac-uk/jac-kit/components/Table/tableQuery';
import TextareaInput from '@jac-uk/jac-kit/draftComponents/Form/TextareaInput.vue';
import ActionButton from '@jac-uk/jac-kit/draftComponents/ActionButton.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import { downloadXLSX } from '@jac-uk/jac-kit/helpers/export';
import { applicationRecordCounts, availableStages, availableStatuses } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { debounce } from 'lodash';

export default {
  name: 'ReasonableAdjustments',
  components: {
    Select,
    Table,
    TableCell,
    TextareaInput,
    ActionButton,
    Checkbox,
    Modal,
    ModalInner,
  },
  mixins: [permissionMixin],
  data() {
    const reasonableAdjustmentsStatusOptions = ['approved', 'denied'];
    const reasonableAdjustmentsActivities = ['qualifying-test', 'scenario-test', 'selection-day', 'Other'];
    const reasonableAdjustmentsTimeAllocations = [
      '5% additional time',
      '10% additional time',
      '15% additional time',
      '20% additional time',
      '25% additional time',
      '30% additional time',
      '40% additional time',
      '50% additional time',
      'Other',
    ]
    ;

    return {
      exerciseStage: 'all',
      candidateStatus: 'all',
      filterStatus: 'all',
      showActioned: false,
      reasonableAdjustmentsStatusOptions,
      reasonableAdjustmentsActivities,
      reasonableAdjustmentsTimeAllocations,
      applicationRecords: [],
      tableColumns: [
        { title: 'Candidate' },
      ],
      unsubscribe: null,
      unsubscribeReport: null,
      open: {},
      otherApplicationRecords: [],
      report: null,
    };
  },
  computed: {
    reasonableAdjustmentsReport() {
      return this.$store.getters['applications/reasonableAdjustments'];
    },
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    applicationRecordCounts() {
      return applicationRecordCounts(this.exercise);
    },
    hasReportData() {
      return this.report && this.report.headers;
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
      this.candidateStatus = 'all';
      this.$refs['issuesTable'].reload();
    },
    candidateStatus: function() {
      this.$refs['issuesTable'].reload();
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
      // if (!this.showActioned) {
      // firestoreRef = firestoreRef.where('candidate.reasonableAdjustmentsActioned', '==', false);
      // }

      params.orderBy = 'candidate.fullName';
      firestoreRef = await tableQuery(this.applicationRecords, firestoreRef, params);
      if (firestoreRef) {
        this.unsubscribe = firestoreRef
          .onSnapshot((snap) => {
            const applicationRecords = [];
            snap.forEach((doc) => {
              const data = vuexfireSerialize(doc);
              if (!data.candidate.reasonableAdjustmentsStates)
                data.candidate.reasonableAdjustmentsStates = [{}];
              applicationRecords.push(data);
            });
            this.applicationRecords = applicationRecords;
          });
      } else {
        this.applicationRecords = [];
      }
    },
    personalDetails(id) {
      return this.reasonableAdjustmentsReport.candidates.filter((candidate) => candidate.userId === id)[0];
    },
    async candidateSearch(searchTerm) {
      return await this.$store.dispatch('candidates/search', { searchTerm: searchTerm });
    },
    hasStatus(applicationRecord) {
      if (this.filterStatus === 'all') return true;
      return applicationRecord.candidate.reasonableAdjustmentsStates.some(state => state.status === this.filterStatus);
    },
    isActioned(applicationRecord) {
      return applicationRecord.candidate.reasonableAdjustmentsActioned;
    },
    async saveReasonableAdjustmentsChange(applicationRecord, change, index) {
      applicationRecord.candidate.reasonableAdjustmentsStates[index] = { ...applicationRecord.candidate.reasonableAdjustmentsStates[index], ...change };
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    saveReasonableAdjustmentsNote: debounce(async function (applicationRecord, note, index) {
      // use debounce
      applicationRecord.candidate.reasonableAdjustmentsStates[index].note = note;
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    }, 2000),
    addReasonableAdjustmentsState(index) {
      this.applicationRecords[index].candidate.reasonableAdjustmentsStates.push({});
    },
    async toggleActioned(index) {
      const applicationRecord = this.applicationRecords[index];
      if (applicationRecord.candidate.hasOwnProperty('reasonableAdjustmentsActioned')) {
        applicationRecord.candidate.reasonableAdjustmentsActioned = !applicationRecord.candidate.reasonableAdjustmentsActioned;
      } else {
        applicationRecord.candidate.reasonableAdjustmentsActioned = true;
      }
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    async removeReasonableAdjustmentsState(candidateIndex, index) {
      this.closeModal(candidateIndex, index);
      this.applicationRecords[candidateIndex].candidate.reasonableAdjustmentsStates.splice(index, 1);
      const applicationRecord = this.applicationRecords[candidateIndex];
      await this.$store.dispatch('candidateApplications/update', [{ id: applicationRecord.id, data: applicationRecord }]);
    },
    handleReasonableAdjustmentsDetailsClick(record) {
      this.toggleReasonableAdjustmentsDetails(record.id);
      const OtherReasonableAdjustments = this.getOtherReasonableAdjustments(record.candidate.id);
      if (!OtherReasonableAdjustments.length) { // retrieve from other applicationRecords only when first click
        this.getOtherApplicationRecords(record);
      }
    },
    toggleReasonableAdjustmentsDetails(id) {
      this.open[id] = this.open[id] === undefined ? true : !this.open[id];
      this.open = Object.assign({}, this.open);
    },
    async getOtherApplicationRecords(record) {
      const firestoreRef = firestore
        .collection('applicationRecords')
        .where('candidate.id', '==', record.candidate.id)
        .where('candidate.reasonableAdjustments', '==', true)
        .orderBy('exercise.referenceNumber', 'desc');
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
    },
    getOtherReasonableAdjustments(candidateId) {
      const record = this.otherApplicationRecords.find(item => item.candidateId === candidateId);
      return record ? record.otherRecords : [];
    },
    async refreshReport() {
      try {
        await functions.httpsCallable('generateReasonableAdjustmentsReport')({ exerciseId: this.exercise.id });
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
    closeModal(index, i) {
      this.$refs[`removeModal-${index}-${i}`][0].closeModal();
    },
    openModal(index, i) {
      this.$refs[`removeModal-${index}-${i}`][0].openModal();
    },
  },
};
</script>
