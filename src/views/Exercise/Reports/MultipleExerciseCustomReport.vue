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
                  v-for="(exercise, index) in exerciseDetails"
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
          <template
            v-for="(column, columnIndex) in configuredColumns"
            :key="columnIndex"
          >
          <th
            class="govuk-table__header"
          >
          <span>
            {{ preferenceLabel(column) }}
          </span>
        </th>
      </template>
      <hr>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        <tr
          v-for="(row, rowIndex) of data.data"
          :key="rowIndex"
          class="govuk-table__row"
        >
          <template
            v-for="(column, columnIndex) in configuredColumns"
            :key="columnIndex"
          >
          <td
            :style="{
            'white-space': keys[column]?.nowrap ? 'nowrap' : ''
            }"
            class="govuk-table__cell"
            >
              <span>
                {{ formatQuestion(row, column) }}
              </span>
            </td>
          </template>
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
import _includes from 'lodash/includes';
import _merge from 'lodash/merge';
import _clone from 'lodash/clone';
import _startCase from 'lodash/startCase';
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
      defaultGroups: customReportConstants.groups,
      defaultKeys: customReportConstants.keys,
      workingPreferences: ['locationPreferences', 'jurisdictionPreferences',  'additionalWorkingPreferences'],
      locationPreferences: [],
      jurisdictionPreferences: [],
      locationQuestion: [],
      jurisdictionQuestion: [],
      additionalWorkingPreferences: [],
      oldAdditionalWorkingPreferences: [],
      anyLegal: false,
    };
  },
  computed: {
    ...mapState({
      exerciseDetails: state => {
        return state.exerciseCollection.records

          .map(record => ({
            name: record.name,
            referenceNumber: record.referenceNumber,
            id: record.id,
            locationPreferences: record.locationPreferences,
            locationQuestion: record.locationQuestion,
            jurisdictionPreferences: record.jurisdictionPreferences,
            jurisdictionQuestion: record.jurisdictionQuestion,
            additionalWorkingPreferences: record.additionalWorkingPreferences,
          }))
            
          .sort((a, b) => {
            // Extract numeric parts from referenceNumber
            const numA = parseInt(a.referenceNumber.slice(3), 10);
            const numB = parseInt(b.referenceNumber.slice(3), 10);
            return numA - numB; //sort
          });
      },
    }),
    preferenceGroups() {
      const groups = [];
      if ((this.jurisdictionPreferences.length || this.jurisdictionQuestion.length) || (this.locationPreferences.length || this.locationQuestion.length) || (this.additionalWorkingPreferences.length || this.oldAdditionalWorkingPreferences)) {
        const keys = [];
        if (this.jurisdictionPreferences.length || this.jurisdictionQuestion.length) {
          keys.push('jurisdictionPreferences');
        }
        if (this.locationPreferences.length || this.locationQuestion.length) {
          keys.push('locationPreferences');
        }
        if (this.additionalWorkingPreferences.length || this.oldAdditionalWorkingPreferences) {
          keys.push('additionalWorkingPreferences');
        }

        groups.push({
          name: 'Working Preferences',
          keys: keys,
        });
      }
      return groups;
    },
    preferenceKeys() {
      const keys = {};
      if (this.jurisdictionPreferences.length || this.jurisdictionQuestion.length) {
        keys['jurisdictionPreferences'] = { label: 'All Jurisdiction Preferences', type: String };
      }
      if (this.locationPreferences.length || this.locationQuestion.length) {
        keys['locationPreferences'] = { label: 'All Location Preferences', type: String };
      }
      if (this.additionalWorkingPreferences.length || this.oldAdditionalWorkingPreferences) {
        keys['additionalWorkingPreferences'] = { label: 'All Additional Working Preferences', type: String };
      }

      return keys;
    },
    groups() {
      let groups = this.defaultGroups.slice();
      
      groups = groups.concat([
        {
          name: 'Experience',
          keys: ['experience'],
        },
      ]);
      groups = groups.concat(this.preferenceGroups);
      return groups;
    },
    keys() {
      let keys = _clone(this.defaultKeys);
      keys = _merge(keys, {
        experience: { label: 'Experience', type: String },
      });
      
      return _merge(keys, this.preferenceKeys);
    },
    configuredColumns() {
    // Build mapped columns for each type of preference
      const locationPrefColumns = this.locationPreferences.map(pref =>
        pref.id ? `locationPreferences.${pref.id}` : 'locationPreferences'
      );
      
      const jurisdictionPrefColumns = this.jurisdictionPreferences.map(pref =>
        pref.id ? `jurisdictionPreferences.${pref.id}` : 'jurisdictionPreferences'
      );

      const additionalWorkingPrefColumns = [
        ...this.additionalWorkingPreferences.map(pref => `additionalWorkingPreferences.${pref.id}`),
        ...this.oldAdditionalWorkingPreferences
      ];

      let res = this.selectedColumns.filter(col =>
        !['locationPreferences', 'jurisdictionPreferences', 'additionalWorkingPreferences'].includes(col)
      );

      const hasLocationSelection = this.selectedColumns.includes('locationPreferences');
      const hasJurisdictionSelection = this.selectedColumns.includes('jurisdictionPreferences');
      const hasAdditionalWorkingSelection = this.selectedColumns.includes('additionalWorkingPreferences');
      
      if (this.selectedExercises.length > 0) {
        // Process location preferences
        if (hasLocationSelection) {
          if (this.locationPreferences.length) {
            // new
            res = [
              ...res,
              ...locationPrefColumns.filter(col => col !== 'locationPreferences')
            ];
          } 
          if (this.locationQuestion.length) {
            // old
            res = [
              ...res,
              ...locationPrefColumns.filter(col => !col.startsWith('locationPreferences.')),
              ...['locationPreferences']
            ];
          }
        }
        // Process jurisdiction preferences
        if (hasJurisdictionSelection) {
          if (this.jurisdictionPreferences.length) {
            // new
            res = [
              ...res,
              ...jurisdictionPrefColumns.filter(col => col !== 'jurisdictionPreferences')
            ];
          } 
          if (this.jurisdictionQuestion.length) {
            // old
            res = [
              ...res,
              ...jurisdictionPrefColumns.filter(col => !col.startsWith('jurisdictionPreferences.')),
              ...['jurisdictionPreferences']
            ];
          }
        }
        // Process additional working preferences
        if (hasAdditionalWorkingSelection) {
          
          if (this.additionalWorkingPreferences.length) {
            // new
            res = [
              ...res,
              ...additionalWorkingPrefColumns.filter(col => !col.startsWith('additionalWorkingPreferences '))
            ];
          } 
          if (this.oldAdditionalWorkingPreferences.length) {
            // old
            res = [
              ...res,
              ...additionalWorkingPrefColumns.filter(col => !col.startsWith('additionalWorkingPreferences.')),
            ];
          }
        }
      }
      
      return res;
    }
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
    formatQuestion(row, column){
      if (column) {
        if (this.isUsingFilter(column)) {
          return $filters.lookup(row[column]);
        } else if (
          ['locationPreferences', 'jurisdictionPreferences']
          .some(pref => column.startsWith(pref))
        ){
          if (typeof row[column] === 'object') {
            return 'Not asked (Old question type)'
          } else if (row[column] === '') {
            return 'Not asked (New question type)'
          }
        } else if (!row[column]){
          if (column.startsWith('additionalWorkingPreferences.')){
            return 'Not asked (New question type)'
          }
          if (column.startsWith('additionalWorkingPreferences ')){
            return 'Not asked (Old question type)'
          }
        }
      }
      return row[column];
    },
    preferenceLabel(column) {    
      if (this.isMatch(column)) {
        if (column.includes('jurisdiction')) return 'Jurisdiction Preferences';
        if (column.includes('location')) return 'Location Preferences';
        if (column.includes('additionalWorkingPreferences')) return 'Additional Working Preferences';
      }
      return this.keys[column].label;
    },
    isMatch(column) {
      return ['locationPreferences', 'jurisdictionPreferences', 'additionalWorkingPreferences'].some(word => word.includes(column) || column.includes(word));
    },
    fetchAllExercises() {
      this.$store.dispatch('exerciseCollection/getAll');
    },
    selectExercise(event) {
      const exercise = event.target.value;
      if (!_includes(this.selectedExercises, exercise)) {
        this.selectedExercises.push(exercise);
      }
      this.getExercisePrefColumns()
      this.selectedExercise = '';
    },
    removeExercise(event) {
      const index = event.target.getAttribute('data-index');
      this.selectedExercises.splice(index, 1);
      this.getExercisePrefColumns()
    },
    selectColumn(event) {
      if (!_includes(this.selectedColumns, event.target.value)) {
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
            columns: this.configuredColumns,
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
      const header = [...this.configuredColumns].map((col) => {
        return this.preferenceLabel(col)
      });

      const csv = [[...header]];

      for (let i = 0; i < this.data.data.length; i++) {
        csv.push([...this.configuredColumns.map(col => typeof this.data.data[i][col] === 'object' ? '' : this.data.data[i][col])]);
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
      if (this.exerciseDetails.length) {
        return this.exerciseDetails.filter(exercise => exerciseId == exercise.id)[0];
      } else {
        return exerciseId;
      }
    },
    getExercisePrefColumns(){
      this.locationPreferences = [];
      this.locationQuestion = [];
      this.jurisdictionPreferences = [];
      this.jurisdictionQuestion = [];
      this.additionalWorkingPreferences = [];
      this.oldAdditionalWorkingPreferences = [];

      this.exerciseDetails
      .filter(ex => this.selectedExercises.includes(ex.id))
      .forEach(ex => {
        if (ex.jurisdictionPreferences?.length) {
          ex.jurisdictionPreferences.forEach(pref => this.jurisdictionPreferences.push(pref));
        }
        if (ex.locationPreferences?.length) {
          ex.locationPreferences.forEach((pref) => {
            this.locationPreferences.push(pref)
          });
        }
        if (ex.additionalWorkingPreferences?.length) {
          ex.additionalWorkingPreferences.forEach((pref, index) => {
            
            if (pref.hasOwnProperty('id')) {
              this.additionalWorkingPreferences.push(pref)
            } else {
              this.oldAdditionalWorkingPreferences.push(`additionalWorkingPreferences ${index}`)
            }
            
          });
        }
        if (ex.locationQuestion) {
          this.locationQuestion.push(ex.locationQuestion);
        }
        if (ex.jurisdictionQuestion) {
          this.jurisdictionQuestion.push(ex.jurisdictionQuestion);
        }
      })
    }
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
