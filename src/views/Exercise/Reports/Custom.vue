<template>
  <div class="govuk-grid-row">
    <!-- diversity header -->
    <div
      v-if="hasPermissions([
        PERMISSIONS.applications.permissions.canReadApplications.value
      ])"
      class="govuk-grid-column-full"
    >
      <div class="moj-page-header-actions">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Custom report
          </h2>
        </div>
        <div
          class="moj-page-header-actions__actions float-right"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <p>Load saved report:</p>
              <select
                v-if="customReports.length > 0"
                class="govuk-select govuk-!-margin-right-3"
                :disabled="isLoading"
                @change="selectReport($event)"
              >
                <option>
                  Select a saved report...
                </option>
                <optgroup label="Your saved reports">
                  <option
                    v-for="(report, reportIndex) in customReports"
                    :key="reportIndex"
                    :value="reportIndex"
                  >
                    {{ report.name }}
                  </option>
                </optgroup>
              </select>
              <button
                class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
                :disabled="isLoading || columns.length === 0"
                @click="generateReport"
              >
                Generate Report
              </button>
              <button
                class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
                :disabled="isLoading || !data || columns.length === 0"
                @click="downloadReport"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <Banner
        v-if="warnings"
        :message="warnings"
      />
      <div class="govuk-inset-text govuk-!-margin-bottom-7">
        <p class="govuk-body">
          <!-- This report is experimental. Please provide feedback if something doesn't look right. -->
          Choose the fields you wish to include in your custom report from the dropdown below and then click 'generate' to produce your report on screen. Only candidates with the status 'Applied' will be included in the report.<br>Download the report when you are satisfied with the content.
        </p>
      </div>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-3">
            <span class="govuk-caption-m govuk-!-margin-bottom-2"> Select a column to display: </span>
            <div class="govuk-heading-m govuk-!-margin-bottom-0">
              <div>
                <select
                  v-model="selectedColumn"
                  class="govuk-select"
                  :disabled="isLoading"
                  @change="selectColumn($event)"
                >
                  <option value="">
                    Select...
                  </option>
                  <optgroup
                    v-for="(keyGroup, keyGroupIndex) in groups"
                    :key="keyGroupIndex"
                    :label="keyGroup.name"
                  >
                    <option
                      v-for="(key, keyIndex) in keyGroup.keys"
                      :key="keyIndex"
                      :value="key"
                    >
                      {{ keys[key] ? keys[key]?.label : `${key} not found` }}
                    </option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="govuk-!-margin-bottom-3">
            <div class="govuk-heading-m govuk-!-margin-bottom-0">
              <div class="govuk-radios__item-container govuk-!-margin-bottom-2 govuk-!-margin-top-2">
                <div class="govuk-radios__item">
                  <input
                    id="showData"
                    v-model="type"
                    type="radio"
                    value="showData"
                    class="govuk-radios__input"
                    :disabled="isLoading"
                  >
                  <label
                    for="showData"
                    class="govuk-label govuk-radios__label"
                  >Show Individual Records</label>
                </div>
              </div>
              <div class="govuk-radios__item-container">
                <div class="govuk-radios__item">
                  <input
                    id="count"
                    v-model="type"
                    type="radio"
                    value="count"
                    class="govuk-radios__input"
                    :disabled="isLoading"
                  >
                  <label
                    for="count"
                    class="govuk-label govuk-radios__label"
                  >Count Records</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="columns.length > 0"
        id="column-list"
        class="panel govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
          Show columns:
        </h2>

        <draggable
          v-if="columns.length"
          v-model="columns"
          item-key="getDraggableKey"
          @click="removeColumn"
        >
          <template #item="{element, index}">
            <div
              :data-index="index"
              class="govuk-!-margin-right-3 moj-filter__tag"
            >
              {{ keys[element].label }}
            </div>
          </template>
        </draggable>

        <div class="govuk-hint govuk-!-margin-top-3 govuk-!-margin-bottom-0">
          Click to remove, drag to re-order
        </div>
      </div>

      <div
        v-if="whereClauses.length > 0"
        class="panel govuk-!-margin-bottom-3"
      >
        <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
          Only show records where:
        </h2>

        <div
          v-for="(whereClause, whereClauseIndex) in whereClauses"
          :key="whereClauseIndex"
          :data-index="whereClauseIndex"
          class="govuk-!-margin-right-3 moj-filter__tag"
          @click="removeWhereClause($event)"
        >
          '{{ keys[whereClause.column].label }}' IS '{{ whereClause.value }}'
        </div>
      </div>
      <LoadingMessage
        v-if="isLoading"
        :load-failed="loadFailed"
      />
      <div
        v-if="data && type === 'showData'"
        class="govuk-!-margin-top-9"
        style="overflow: auto;"
      >
        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                class="govuk-table__header"
              >
                {{ keys[column].label }}
              </th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr
              v-for="(row, rowIndex) of data.data"
              :key="rowIndex"
              class="govuk-table__row"
            >
              <td
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                :style="{
                  'white-space': keys[column]?.nowrap ? 'nowrap' : ''
                }"
                class="govuk-table__cell"
              >
                {{ isUsingFilter(column) ? $filters.lookup(row[column]) : row[column] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="data && type === 'count'"
        class="govuk-!-margin-top-9"
      >
        <div
          v-for="(column, columnIndex) in columns"
          :key="columnIndex"
        >
          <table class="govuk-table table-with-border">
            <thead class="govuk-table__head">
              <tr>
                <th class="govuk-table__header">
                  {{ keys[column].label }}
                </th>
                <th class="govuk-table__header govuk-table__header govuk-table__header--numeric">
                  Applications
                </th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              <tr
                v-for="(row, rowIndex) in data.data[column]"
                :key="rowIndex"
                class="govuk-table__row"
              >
                <th
                  scope="col"
                  class="govuk-table__header"
                  style="cursor: pointer"
                  @click="addWhereClause(column, '==', rowIndex)"
                >
                  {{ rowIndex }}
                </th>
                <td
                  class="govuk-table__cell govuk-table__cell--numeric"
                >
                  {{ $filters.formatNumber(row) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Modal
      ref="modalRefSaveReport"
    >
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Save report
      </div>
      <div class="modal__content govuk-!-margin-6">
        <label>Enter a name for the report</label>
        <input
          v-model="customReportName"
          class="govuk-input"
        ><br><br>
        <button
          class="govuk-button govuk-!-margin-right-3"
          @click="saveReport()"
        >
          Save
        </button>
        <button
          class="govuk-button govuk-button--secondary"
          @click="closeModal('modalRefSaveReport')"
        >
          Cancel
        </button>
      </div>
    </Modal>
    <Modal
      ref="modalRefReportSaved"
    >
      <div class="modal__title govuk-!-padding-2 govuk-heading-m">
        Save report
      </div>
      <div class="modal__content govuk-!-margin-6">
        <p>The report has been saved.</p>
        <button
          class="govuk-button govuk-!-margin-right-3"
          @click="closeModal('modalRefReportSaved')"
        >
          OK
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import draggable from 'vuedraggable';
import _ from 'lodash';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import { customReportConstants } from '@/helpers/customReportConstants';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
import Banner from '@jac-uk/jac-kit/draftComponents/Banner.vue';
import { STATUS } from '@jac-uk/jac-kit/helpers/constants';
import { applicationRecordCounts, availableStages, availableStatuses } from '@/helpers/exerciseHelper';
import permissionMixin from '@/permissionMixin';
import { isNewAdditionalWorkingPreferencesQuestionType } from '../../../helpers/exerciseHelper';

// Prevents warnings and errors associated with using @vue/compat
draggable.compatConfig = { MODE: 3 };

export default {
  name: 'CustomReport',
  components: {
    Modal,
    draggable,
    LoadingMessage,
    Banner,
  },
  mixins: [permissionMixin],
  data() {
    return {
      STATUS,
      type: 'showData',
      data: null,
      statuses: [STATUS.APPLIED],
      selectedStage: 'all',
      selectedStageStatus: null,
      isLoading: null,
      loadFailed: null,
      customReports: [],
      customReportName: null,
      selectedColumn: '',
      whereClauses: [],
      columns: ['referenceNumber', 'personalDetails.fullName', 'status'],
      warnings: '',
      warningTimeout: null,
      defaultGroups: customReportConstants.groups,
      defaultKeys: customReportConstants.keys,
      workingPreferences: ['locationPreferences', 'jurisdictionPreferences',  'additionalWorkingPreferences'],
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
      if (this.selectedStage === 'all') return null;
      const statuses = availableStatuses(this.exercise, this.selectedStage);
      return statuses;
    },
    groups() {
      let groups = this.defaultGroups.slice();
      if (this.exercise.typeOfExercise === 'non-legal') {
        groups = groups.concat([
          {
            name: 'Experience',
            keys: ['experience'],
          },
        ]);

      }
      groups = groups.concat(this.preferenceGroups);
      return groups;
    },
    keys() {
      let keys = _.clone(this.defaultKeys);
      if (this.exercise.typeOfExercise === 'non-legal') {
        keys = _.merge(keys, {
          experience: { label: 'Experience', type: String },
        });
      }
      return _.merge(keys, this.preferenceKeys);
    },
    preferenceGroups() {
      const groups = [];

      // handle old worker prefs data structure
      if (this.exercise.jurisdictionQuestion) {
        groups.push({
          name: 'Jurisdiction Preferences',
          keys: ['jurisdictionPreferences'],
        });
      }
      if (this.exercise.locationQuestion) {
        groups.push({
          name: 'Location Preferences',
          keys: ['locationPreferences'],
        });
      }
      if (this.exercise?.additionalWorkingPreferences?.length && !isNewAdditionalWorkingPreferencesQuestionType(this.exercise)) {
        const keys = [];
        this.exercise.additionalWorkingPreferences.forEach((question, i) => {
          keys.push(`additionalWorkingPreferences ${i}`);
        });
        groups.push({
          name: 'Additional Working Preferences',
          keys: keys,
        });
      }

      // handle new worker prefs data structure
      for (const preference of this.workingPreferences) {
        if (preference === 'additionalWorkingPreferences' && !isNewAdditionalWorkingPreferencesQuestionType(this.exercise)) {
          continue;
        }
        const questions = this.exercise[preference] || [];
        if (questions.length) {
          const keys = questions.map((q) => `${preference}.${q.id}`);
          groups.push({
            name: _.startCase(preference),
            keys,
          });
        }
      }
      return groups;
    },
    preferenceKeys() {
      const keys = {};

      // handle old worker prefs data structure
      if (this.exercise.jurisdictionQuestion) {
        keys['jurisdictionPreferences'] = { label: this.exercise.jurisdictionQuestion, type: String };
      }
      if (this.exercise.locationQuestion) {
        keys['locationPreferences'] = { label: this.exercise.locationQuestion, type: String };
      }

      if (!isNewAdditionalWorkingPreferencesQuestionType(this.exercise)) {
        this.exercise.additionalWorkingPreferences.forEach((question, i) => {
          keys[`additionalWorkingPreferences ${i}`] = { label: question.question, type: String };
        });
      }

      // handle new worker prefs data structure
      for (const preference of this.workingPreferences) {
        if (preference === 'additionalWorkingPreferences' && !isNewAdditionalWorkingPreferencesQuestionType(this.exercise)) {
          continue;
        }
        const questions = this.exercise[preference] || [];
        if (questions.length) {
          for (const question of questions) {
            keys[`${preference}.${question.id}`] = { label: question.question, type: String };
          }
        }
      }
      return keys;
    },
  },
  watch: {
    statuses: {
      handler: function() {
        this.getApplicationRecords();
      },
      deep: true,
    },
    selectedStage: function () {
      this.selectedStageStatus = 'all';
      this.getApplicationRecords();
    },
    selectedStageStatus: {
      handler: function() {
        this.getApplicationRecords();
      },
      deep: true,
    },
    columns: {
      handler: function() {
        this.data = null;
      },
      deep: true,
    },
    type: {
      handler: function() {
        this.getApplicationRecords();
      },
      deep: true,
    },
    whereClauses: {
      handler: function() {
        this.getApplicationRecords();
      },
      deep: true,
    },
  },
  created() {
    this.getReports();
  },
  methods: {
    async getApplicationRecords() {
      this.isLoading = true;
      this.data = null;

      try {
        if (this.columns.length > 0) {
          const response = await httpsCallable(functions, 'getApplicationData')({
            exerciseId: this.exercise.id,
            columns: this.columns,
            type: this.type,
            whereClauses: this.whereClauses,
            statuses: this.statuses,
            stage: this.selectedStage === 'all' ? null : this.selectedStage,
            stageStatus: this.selectedStageStatus === 'all' ? null : this.selectedStageStatus,
          });

          if (response === null) {
            this.redirectToErrorPage();
          } else {
            this.data = response;
          }
        }
      } catch (e) {
        this.isLoading = false;
        this.loadFailed = true;
        throw e;
      }

      this.isLoading = false;
    },
    selectColumn(event) {
      if (!_.includes(this.columns, event.target.value)) {
        this.columns.push(event.target.value);
      }
      this.selectedColumn = '';
    },
    removeColumn(event) {
      const index = event.target.getAttribute('data-index');
      this.columns.splice(index, 1);
    },
    addWhereClause(column, operator, value) {
      this.whereClauses.push(
        {
          column: column,
          operator: operator,
          value: value,
        }
      );
    },
    removeWhereClause(event) {
      const index = event.target.getAttribute('data-index');
      this.whereClauses.splice(index, 1);
    },
    openModal(modalRef){
      if (this.columns.length === 0) {
        clearTimeout(this.warningTimeout);
        this.warnings = 'You have select no columns to save the report';
        this.warningTimeout = window.setTimeout(() => this.warnings = '', 5000);
        return;
      }
      this.$refs[modalRef].openModal();
    },
    closeModal(modalRef) {
      this.$refs[modalRef].closeModal();
      this.customReportName = null;
    },
    async saveReport() {
      if (this.customReports.map(r => r.name).includes(this.customReportName)) {
        this.closeModal('modalRefSaveReport');
        clearTimeout(this.warningTimeout);
        this.warnings = 'Your report has not been saved. There is already a report with that name';
        this.warningTimeout = window.setTimeout(() => this.warnings = '', 5000);
        return;
      }
      const reports = await httpsCallable(functions, 'customReport')({
        columns: this.columns,
        whereClauses: this.whereClauses,
        name: this.customReportName,
      });
      this.customReports = reports.data;
      this.closeModal('modalRefSaveReport');
      this.openModal('modalRefReportSaved');
    },
    async getReports() {
      const reports = await httpsCallable(functions, 'customReport')({});
      this.customReports = reports.data;
    },
    selectReport(event) {
      const report = this.customReports[event.target.value];
      this.columns = report.columns;
      this.whereClauses = report.whereClauses;
    },
    generateReport() {
      this.getApplicationRecords();
      // Scroll to the list of columns
      const element = document.querySelector('#column-list'); // Replace with the actual element selector
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    downloadReport() {
      const header = [...this.columns].map(col => this.keys[col].label);
      const csv = [[...header]];

      for (let i = 0; i < this.data.data.length; i++) {
        csv.push([...this.columns.map(col => this.data.data[i][col])]);
      }

      // Convert the 2D array to CSV, ensuring values are properly escaped
      const escapeValue = value => {
        if (value == null) return ''; // Handle null or undefined
        const escaped = String(value).replace(/"/g, '""'); // Escape double quotes
        return `"${escaped}"`; // Enclose in double quotes
      };

      const mappedCSV = csv
        .map(row => row.map(escapeValue).join(',')) // Escape each value and join with commas
        .join('\n'); // Join rows with a newline

      const csvContent = `data:text/csv;charset=utf-8,${mappedCSV}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'custom_report.csv');
      document.body.appendChild(link);
      link.click();
    },

    getDraggableKey(item) {
      // The internal index of the array isnt available in draggable so we have to use this fn to generate one so we can pass a
      // value to item-key
      const i = this.columns.indexOf(item);
      return i;
    },
    isUsingFilter(key) {
      // return true if the column is a filter column
      return ['_processing.stage', '_processing.status'].includes(key);
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
th:first-letter {
  text-transform: capitalize
}
td:first-letter {
  text-transform: capitalize
}
.moj-filter__tag {
  cursor: pointer;
}
</style>
