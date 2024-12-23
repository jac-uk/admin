<template>
  <div class="govuk-grid-row">
    <div
      v-if="hasPermissions([
        PERMISSIONS.applications.permissions.canReadApplications.value
      ])"
      class="govuk-grid-column-full"
    >
      <div class="moj-page-header-actions govuk-!-margin-bottom-2">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Multiple Exercise Custom report
          </h2>
        </div>
        <div
          class="moj-page-header-actions__actions float-right"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
                :disabled="isLoading || selectedColumns.length === 0"
                @click="generateReport"
              >
                Generate Report
              </button>
              <button
                class="govuk-button govuk-button--primary moj-button-menu__item moj-page-header-actions__action"
                :disabled="isLoading || !data || selectedColumns.length === 0"
                @click="downloadReport"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
        <div class="govuk-inset-text govuk-!-margin-bottom-2">
          <p class="govuk-body">
            <!-- This report is experimental. Please provide feedback if something doesn't look right. -->
            Choose the fields you wish to include in your custom report from the dropdown below and then click 'generate' to produce your report on screen. Only candidates with the status 'Applied' will be included in the report.<br>Download the report when you are satisfied with the content.
          </p>
        </div>
      </div>

      <div class="govuk-grid-row">
        <!-- Exercises -->
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-3">
            <span class="govuk-caption-m govuk-!-margin-bottom-2"> Select Exercises to display: </span>
            <div class="govuk-heading-m govuk-!-margin-bottom-0">
              <select
                v-model="selectedExercise"
                class="govuk-select"
                @change="selectExercise($event)"
              >
                <option
                  value=""
                  disabled
                  selected
                >
                  Select...
                </option>
                <option
                  v-for="(exercise, index) in exerciseNames"
                  :key="index"
                  :label="exercise.referenceNumber"
                  :value="exercise.id"
                >
                  <!-- {{ exercise.referenceNumber + ": " + exercise.name }} -->
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Columns -->
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-3">
            <span class="govuk-caption-m govuk-!-margin-bottom-2"> Select a column to display: </span>
            <div class="govuk-heading-m govuk-!-margin-bottom-0">
              <select
                v-model="selectedColumn"
                class="govuk-select"
                :disabled="isLoading || !selectedExercises.length"
                @change="selectColumn($event)"
              >
                <option value="">
                  {{ selectedExercises.length ? 'Select...' : 'Select at least one Exercise first' }}
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
                    {{ keys[key].label }}
                  </option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="govuk-grid-row">
        <!-- exercises -->
        <div
          id="exercise-list"
          class="govuk-grid-column-one-half"
        >
          <div
            class="panel govuk-!-margin-bottom-3"
          >
            <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
              Selected Exercises:
            </h2>

            <div
              v-if="selectedExercises.length"
            >
              <template
                v-for="(exerciseId, index) in selectedExercises"
                :key="index"
              >
                <div
                  :data-index="index"
                  class="govuk-!-margin-right-3 moj-filter__tag"
                  @click="removeExercise"
                >
                  {{ exerciseFromId(exerciseId).referenceNumber + ' - ' + exerciseFromId(exerciseId).name.slice(0,30) + (exerciseFromId(exerciseId).name.length > 30 ? '...' : '') }}
                </div>
              </template>
            </div>

            <div
              v-if="selectedExercises.length"
              class="govuk-hint govuk-!-margin-top-3 govuk-!-margin-bottom-0"
            >
              Click to remove
            </div>
          </div>
        </div>

        <!-- columns -->
        <div
          id="column-list"
          class="govuk-grid-column-one-half"
        >
          <div
            class="panel govuk-!-margin-bottom-3"
          >
            <h2 class="govuk-!-margin-bottom-0 govuk-!-margin-top-0">
              Show columns:
            </h2>

            <draggable
              v-if="selectedColumns.length"
              v-model="selectedColumns"
              item-key="getDraggableKey"
              @click="removeColumn"
            >
              <template #item="{element, index}">
                <div
                  :data-index="index"
                  :class="'govuk-!-margin-right-3 ' + (defaultColumns.includes(element) ? 'moj-filter__tag no-remove' : 'moj-filter__tag')"
                >
                  {{ keys[element].label }}
                </div>
              </template>
            </draggable>

            <div class="govuk-hint govuk-!-margin-top-3 govuk-!-margin-bottom-0">
              Click to remove, drag to re-order
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <LoadingMessage
    v-if="isLoading"
    :load-failed="loadFailed"
  />

  <div
    v-if="data"
    class="govuk-!-margin-top-9"
    style="overflow: auto;"
  >
    <table class="govuk-table">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th
            v-for="(column, columnIndex) in selectedColumns"
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
            v-for="(column, columnIndex) in selectedColumns"
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
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';
import { customReportConstants } from '@/helpers/customReportConstants';
import draggable from 'vuedraggable';
import _ from 'lodash';
import { mapState } from 'vuex';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
import permissionMixin from '@/permissionMixin';

// Prevents warnings and errors associated with using @vue/compat
draggable.compatConfig = { MODE: 3 };

export default {
  name: 'MultipleExerciseCustomReport',
  components: {
    LoadingMessage,
    draggable,
  },
  mixins: [permissionMixin],
  data(){
    return {
      defaultColumns: [
        'exerciseRef',
        'referenceNumber',
      ],
      isLoading: null,
      loadFailed: null,
      data: null,
      selectedColumn: '',
      selectedColumns: [
        'exerciseRef',
        'referenceNumber',
      ],
      selectedExercise: '',
      selectedExercises: [],
      groups: customReportConstants.groups,
      keys: customReportConstants.keys,
    };
  },
  computed: {
    ...mapState({
      exerciseNames: state => {
        return state.exerciseCollection.records

          .map(record => ({
            name: record.name,
            referenceNumber: record.referenceNumber,
            id: record.id,
          }))

          .sort((a, b) => {
            // Extract numeric parts from referenceNumber
            const numA = parseInt(a.referenceNumber.slice(3), 10);
            const numB = parseInt(b.referenceNumber.slice(3), 10);
            return numA - numB; //sort
          });
      },
    }),
  },
  beforeMount(){
    if (!this.hasPermissions([this.PERMISSIONS.applications.permissions.canReadApplications.value])){
      this.$router.replace({ path: '/exercises' });
    }
  },
  mounted(){
    this.fetchAllExercises();
  },
  methods: {
    fetchAllExercises() {
      this.$store.dispatch('exerciseCollection/getAll');
    },
    selectExercise(event) {
      if (!_.includes(this.selectedExercises, event.target.value)) {
        this.selectedExercises.push(event.target.value);
      }
      this.selectedExercise = '';
    },
    removeExercise(event) {
      const index = event.target.getAttribute('data-index');
      this.selectedExercises.splice(index, 1);
    },
    selectColumn(event) {
      if (!_.includes(this.selectedColumns, event.target.value)) {
        this.selectedColumns.push(event.target.value);
      }
      this.selectedColumn = '';
    },
    removeColumn(event) {
      const index = event.target.getAttribute('data-index');
      if (!['exerciseRef', 'referenceNumber'].includes(this.selectedColumns[index])){
        this.selectedColumns.splice(index, 1);
      }
    },
    generateReport() {
      this.getMultipleApplicationRecords();
      // Scroll to the list of columns
      const element = document.querySelector('#column-list'); // Replace with the actual element selector
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    async getMultipleApplicationRecords() {
      this.isLoading = true;
      this.data = null;

      try {
        if (this.selectedExercises.length > 0) {
          const response = await httpsCallable(functions, 'getMultipleApplicationData')({
            exerciseIds: this.selectedExercises,
            columns: this.selectedColumns,
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
    downloadReport() {
      const header = [...this.selectedColumns].map(col => this.keys[col].label);
      const csv = [[...header]];

      for (let i = 0; i < this.data.data.length; i++) {
        csv.push([...this.selectedColumns.map(col => this.data.data[i][col])]);
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
      link.setAttribute('download', 'multiple_exercise_custom_report.csv');
      document.body.appendChild(link);
      link.click();
    },
    isUsingFilter(key) {
      // return true if the column is a filter column
      return ['_processing.stage', '_processing.status'].includes(key);
    },
    exerciseFromId(exerciseId){
      if (this.exerciseNames.length) {
        return this.exerciseNames.filter(exercise => exerciseId == exercise.id)[0];
      } else {
        return exerciseId;
      }
    },
  },
};
</script>

<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
th:first-letter {
  text-transform: capitalize;
}
td:first-letter {
  text-transform: capitalize;
}
.moj-filter__tag {
  cursor: pointer;
}
.no-remove:after {
  background-image: none;
  margin-left: none;
  width: unset;
}
</style>
