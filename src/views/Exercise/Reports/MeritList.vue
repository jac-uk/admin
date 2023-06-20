<template>
  <div>
    <!-- diversity header -->
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions govuk-!-margin-bottom-0">
        <div class="moj-page-header-actions__title">
          <h2 class="govuk-heading-l">
            Merit List
          </h2>
        </div>
        <div
          class="moj-page-header-actions__actions float-right"
        >
          <div class="moj-button-menu">
            <div class="moj-button-menu__wrapper">
              <button
                class="govuk-button govuk-button-s govuk-button--secondary govuk-!-margin-bottom-0 govuk-!-margin-right-3"
                @click="copyToClipboard"
              >
                Copy to clipboard
              </button>
              <!-- <button
                class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0 govuk-!-margin-right-3"
                @click="pasteFromClipboard"
              >
                Paste from clipboard
              </button> -->
              <FullScreenButton />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="govuk-grid-column-full"
    >
      <TabsList
        v-if="false"
        class="print-none"
        :tabs="tabs"
        :active-tab.sync="activeTab"
      />

      <!-- SCORE SHEET -->
      <div v-show="hasScoreSheet">
        <Table
          ref="scoreSheet"
          data-key="id"
          :data="tableData"
          :columns="tableColumns"
          :page-size="500"
          :search="['fullName', 'referenceNumber']"
          search-placeholder="Candidate name or application ref"
          local-data
          sticky
          class="merit-list"
          @change="updateTableState"
          @clickCol="clickColumn"
        >
          <template #row="{row}">
            <TableCell class="table-cell-application">
              <RouterLink
                target="_blank"
                :to="{ name: 'exercise-application', params: { applicationId: row.id } }"
              >
                {{ row.fullName }}
              </RouterLink>
            </TableCell>

            <TableCell
              v-for="(col, index) in scoreSheetColumns"
              :key="index"
              class="text-center table-cell-score"
            >
              <template v-if="isScoreColumn(col.type)">
                {{ getColValue(row, col).score | formatNumber(2) }}
              </template>
              <template v-else-if="isNumericColumn(col.type)">
                {{ getColValue(row, col) | formatNumber(2) }}
              </template>
              <template v-else-if="isYesNoColumn(col.type)">
                {{ getColValue(row, col) | toYesNo }}
              </template>
              <template v-else>
                {{ getColValue(row, col) }}
              </template>
            </TableCell>

            <TableCell
              :title="tableColumns[tableColumns.length - 5].title"
              class="text-center"
            >
              {{ row.totalScore | formatNumber(2) }}
            </TableCell>
            <TableCell
              :title="tableColumns[tableColumns.length - 4].title"
              class="text-center"
            >
              {{ row.diversity.female | toYesNo }}
            </TableCell>
            <TableCell
              :title="tableColumns[tableColumns.length - 3].title"
              class="text-center"
            >
              {{ row.diversity.bame | toYesNo }}
            </TableCell>
            <TableCell
              :title="tableColumns[tableColumns.length - 2].title"
              class="text-center"
            >
              {{ row.diversity.solicitor | toYesNo }}
            </TableCell>
            <TableCell
              :title="tableColumns[tableColumns.length - 1].title"
              class="text-center"
            >
              {{ row.diversity.disability | toYesNo }}
            </TableCell>
          </template>
        </Table>
      </div>
      <!-- // END SCORE SHEET -->
    </div>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell';
import TabsList from '@jac-uk/jac-kit/draftComponents/TabsList';
import FullScreenButton from '@/components/Page/FullScreenButton';
import { TASK_TYPE, TASK_STATUS, getMeritListTaskTypes } from '@/helpers/exerciseHelper';
import { DIVERSITY_CHARACTERISTICS, hasDiversityCharacteristic } from '@/helpers/diversityCharacteristics';
import { lookup } from '@/filters';
import { MARKING_TYPE } from '@/helpers/taskHelper';
import { getTableData } from '@/helpers/tableHelper';

const localLookup = {};
localLookup[TASK_TYPE.CRITICAL_ANALYSIS] = 'CA';
localLookup[TASK_TYPE.SITUATIONAL_JUDGEMENT] = 'SJ';
localLookup[TASK_TYPE.QUALIFYING_TEST] = 'QT';
localLookup[TASK_TYPE.SIFT] = 'Sift';

export default {
  name: 'MeritList',
  components: {
    Table,
    TableCell,
    TabsList,
    FullScreenButton,
  },
  filters: {
    lookup(value) {  // override global lookup filter
      if (localLookup[value]) return localLookup[value];
      return lookup(value);
    },
  },
  data() {
    return {
      openColumns: [],
      tabs: [
        {
          ref: 'shortlisted',
          title: 'Shortlisted',
        },
        {
          ref: 'selected',
          title: 'Selected',
        },
        {
          ref: 'recommended',
          title: 'Recommended',
        },
        {
          ref: 'handover',
          title: 'Handover',
        },
      ],
      activeTab: 'selected',
      tableState: null, // Table params
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    exerciseDiversity() {
      return this.$store.state.exerciseDiversity.record ? this.$store.state.exerciseDiversity.record.applicationsMap : {};
    },
    tasks() {
      return this.$store.state.tasks.records;
    },
    getMeritListTaskTypes() {
      return getMeritListTaskTypes(this.exercise);
    },
    completedTasks() {
      if (!this.tasks) return [];
      const tasks = this.tasks.filter(task => task.status === TASK_STATUS.COMPLETED);
      const completedTasks = this.getMeritListTaskTypes
        .filter(taskType => tasks.find(task => task.type === taskType))
        .map(taskType => tasks.find(task => task.type === taskType));
      return completedTasks;
    },
    scoreSheetColumns() {
      const columns = [];
      this.completedTasks.forEach(task => {
        if (task.markingScheme) {
          // loop through each item and add columns
          task.markingScheme.forEach(item => {
            if (item.type === 'group') {
              if (this.isOpen(item.ref)) {
                item.children.forEach(child => {
                  columns.push({
                    task: task.type,
                    type: child.type,
                    title: child.title,
                    path: item.ref,
                    value: child.ref,
                  });
                });
              }
              columns.push({
                task: task.type,
                title: 'Score',
                type: 'number',
                path: item.ref,
                showScore: true,
              });
            } else {
              columns.push({
                task: task.type,
                type: item.type,
                title: item.title,
                value: item.ref,
              });
            }
          });
        } else {
          columns.push({
            task: task.type,
            type: task.id,
            showScore: true,
          });
        }
      });
      return columns;
    },
    hasScoreSheet() {
      return this.completedTasks.length > 0;
    },
    headerColumns() {
      const columns = [];
      this.completedTasks.forEach(task => {
        if (task.markingScheme) {
          task.markingScheme.forEach(item => {
            if (item.type === 'group') {
              columns.push({
                ref: item.ref,
                expandable: true,
                colspan: this.isOpen(item.ref) ? item.children.length + 1 : 1,
              });
            } else {
              columns.push({
                ref: item.ref,
              });
            }
          });
        } else {
          columns.push({
            ref: task.id,
          });
        }
      });
      return columns;
    },
    tableColumns() {
      const columns = [];
      if (!this.hasScoreSheet) return columns;
      columns.push({ title: 'Candidate', class: 'table-cell-application', sort: 'fullName' });
      this.scoreSheetColumns.forEach(col => {
        const column = { title: this.getColumnTitle(col), class: 'table-cell text-center' };
        if (column.title.toLowerCase() === 'score') {
          const prefix = localLookup[col.path] ? localLookup[col.path] : col.path;
          column.title = `${prefix} ${column.title}`;
          // Specify a click event for the column header
          column.eventParams = [col.path];
          column.emitEvent = 'clickCol';
        }
        columns.push(column);
      });
      // Default sort by total score (initially)
      columns.push({ title: 'Total Score', sort: 'totalScore', direction: 'desc', default: true, class: 'text-center' });
      columns.push({ title: 'Female' });
      columns.push({ title: 'Ethnic minority' });
      columns.push({ title: 'Solicitor' });
      columns.push({ title: 'Disability' });
      return columns;
    },
    tableData() {
      if (!this.hasScoreSheet) return [];
      if (!this.exerciseDiversity) return [];
      const applicationData = {};
      this.completedTasks.forEach(task => {
        if (task.finalScores) {
          task.finalScores.forEach(row => {
            if (!applicationData[row.id]) {
              applicationData[row.id] = {
                totalScore: 0,
                diversity: {},
              };
              // TODO this code also appears on Finalised/View.vue therefore move to a helper?
              const ref = row.ref.split('-')[1];
              if (this.exerciseDiversity[ref]) {
                applicationData[row.id].diversity = {
                  female: this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.GENDER_FEMALE),
                  bame: this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.ETHNICITY_BAME),
                  solicitor: this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.PROFESSION_SOLICITOR),
                  disability: this.hasDiversityCharacteristic(this.exerciseDiversity[ref], DIVERSITY_CHARACTERISTICS.DISABILITY_DISABLED),
                };
              }
            }
            applicationData[row.id].referenceNumber = row.ref;
            let fullName;
            if (task.applications) { fullName = task.applications.find(application => application.id === row.id).fullName; }
            if (fullName) { applicationData[row.id].fullName = fullName; }
            applicationData[row.id][task.id] = {
              score: row.score,
              scoreSheet: row.scoreSheet ? row.scoreSheet : null,
            };
            applicationData[row.id].totalScore += row.score;
          });
        }
      });
      const data = Object.entries(applicationData).map(([id, row]) => {
        return {
          id: id,
          ...row,
        };
      });
      if (!this.tableState) {
        return data;
      }
      return getTableData(data, this.tableColumns, this.tableState);
    },
    scoreSheetColumnsNew() {
      const columns = [];
      let parent = null;
      this.completedTasks.forEach(task => {
        if (task.markingScheme) {
          // loop through each item and add columns
          task.markingScheme.forEach(item => {
            parent = item.ref;
            if (item.type === 'group') {
              item.children.forEach(subItem => {
                columns.push({
                  task: task.type,
                  parent: parent,
                  ref: subItem.ref,
                  type: subItem.type,
                });
              });
              columns.push({
                task: task.type,
                parent: parent,
                type: 'number',
                ref: 'score',
              });
            } else {
              columns.push({
                task: task.type,
                ref: item.ref,
                type: item.type,
              });
            }
          });
        }
      });
      return columns;
    },
    clipboardColumns() {
      // @todo: Use the scoresheetColumnsNew here once you've got the data in there looking right
      const columns = [];
      columns.push({ title: 'ID', ref: 'id', editable: false });
      columns.push({ title: 'Ref', ref: 'ref', editable: false });
      columns.push({ title: 'Name', ref: 'fullName', editable: false });
      this.scoreSheetColumnsNew.forEach(column => {
        let title = column.ref;
        if (column.parent) title = `${column.parent}.${title}`;
        columns.push({ title: title, editable: true, ...column });
      });
      return columns;
    },
  },
  async created() {
    await this.$store.dispatch('tasks/bind', { exerciseId: this.exercise.id } );
    await this.$store.dispatch('exerciseDiversity/bind', this.exercise.id);
  },
  methods: {
    hasDiversityCharacteristic,
    clickColumn(columnRef) {
      this.toggleColumn(columnRef);
    },
    async copyToClipboard() {
      const rows = [];
      const headers = this.clipboardColumns.map(column => column.title);
      rows.push(headers);

      // collate all data
      const applicationData = {};
      this.completedTasks.forEach(task => {
        task.finalScores.forEach(item => {
          if (!applicationData[item.id]) {
            applicationData[item.id] = {};
            applicationData[item.id][task.type] = {};
          }
          applicationData[item.id].id = item.id;
          applicationData[item.id].ref = item.ref;
          if (!applicationData[item.id].fullName) { applicationData[item.id].fullName = this.getFullName(task, item.id); }
          applicationData[item.id][task.type] = item.scoreSheet;
          applicationData[item.id][task.type].score = item.score;
          // applicationData[item.id][task.type].pass = item.pass;
        });
      });

      // construct rows (from first task as this should have the most applications)
      this.completedTasks[0].finalScores.forEach(item => {
        const row = [];
        this.clipboardColumns.forEach(column => {
          let valueMap = applicationData[item.id];
          if (column.task && valueMap[column.task]) valueMap = valueMap[column.task];
          if (column.parent && valueMap[column.parent]) valueMap = valueMap[column.parent];
          row.push(valueMap[column.ref]);
        });
        rows.push(row);
      });

      let data = '';
      rows.forEach(row => data += `${row.join('\t')}\n` );
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(data);
      }
    },
    async pasteFromClipboard() {
      if (navigator && navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
          const rows = clipboardText.split('\n');

          // check headers are all present
          const pastedHeaders = rows[0].split('\t');
          const missingColumns = this.clipboardColumns.filter(column => pastedHeaders.indexOf(column.title) < 0);
          if (missingColumns.length > 0) { console.log('missing columns'); return false; }

          // get data
          const pastedDataMap = {};
          const identIndex = 0;
          rows.forEach((row, rowIndex) => {
            if (row && rowIndex > 0) {
              const cols = row.split('\t');
              const id = cols[identIndex];
              pastedDataMap[id] = cols;
            }
          });

          // get editable columns
          const editableColumns = [];
          this.clipboardColumns.forEach(column => {
            if (column.editable) {
              editableColumns.push({
                index: pastedHeaders.indexOf(column.title),
                ...column,
              });
            }
          });

          let currentTask;
          let currentScoreSheet = {};
          editableColumns.forEach(editableColumn => {
            if (!currentTask) currentTask = editableColumn.task;
            if (currentTask !== editableColumn.task) {
              // we have moved to a new task, therefore save what we've got
              console.log('save', currentTask, currentScoreSheet);
              // await this.saveTask(currentTask, currentScoreSheet);
              currentScoreSheet = {};
            }
            rows.forEach((row, rowIndex) => {
              if (row && rowIndex > 0) {
                const cols = row.split('\t');
                const id = cols[identIndex];
                if (!currentScoreSheet[id]) currentScoreSheet[id] = {};
                if (editableColumn.parent && !currentScoreSheet[id][editableColumn.parent]) currentScoreSheet[id][editableColumn.parent] = {};
                if (editableColumn.parent) {
                  currentScoreSheet[id][editableColumn.parent][editableColumn.ref] = cols[editableColumn.index];
                } else {
                  currentScoreSheet[id][editableColumn.ref] = cols[editableColumn.index];
                }
              }
            });
            currentTask = editableColumn.task;
          });
          console.log('save', currentTask, currentScoreSheet);
          // await this.saveTask(currentTask, currentScoreSheet);  // save the last task as it won't have been saved yet
        }
      }
    },
    getFullName(task, applicationId) {
      if (task && task.applications) {
        return task.applications.find(application => application.id === applicationId).fullName;
      }
      return '';
    },
    async saveTask(task, saveData) {
      console.log('saveTask', task, saveData);
      // save the current scoresheet for the current task
      // get task.finalScores
      // console.log('save current score sheet, in finalScores', currentScoreSheet);
      // await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.task.type, data: { scoreSheet: scoreSheet } });
    },
    isScoreColumn(colType) {
      return colType === MARKING_TYPE.SCORE;
    },
    isNumericColumn(colType) {
      return colType === MARKING_TYPE.NUMBER;
    },
    isYesNoColumn(colType) {
      return colType === MARKING_TYPE.BOOL;
    },
    searchMatch(searchTerm, source) {
      if (source.length) {
        const sourceStr = source.trim().toLowerCase();
        return sourceStr.includes(searchTerm.trim().toLowerCase());
      }
      return false;
    },
    updateTableState(params) {
      this.tableState = params;
    },
    getColumnTitle(col) {
      let title;
      if (col.title) {
        title = col.title;
      } else if (col.value) {
        title = col.value;
      } else if (col.showScore) {
        title = col.type;
      }
      if (localLookup[title]) return localLookup[title];
      return title;
    },
    getColValue(row, col) {
      const root = row[col.task];
      if (!root) return '';
      let scoreSheet = root.scoreSheet;
      if (scoreSheet) {
        if (col.path) {
          scoreSheet = scoreSheet[col.path];
        }
        if (col.value) {
          let value = scoreSheet;
          if (col.value.indexOf('.') >= 0) {
            const valueParts = col.value.split('.');
            valueParts.forEach(valuePart => {
              value = value[valuePart];
            });
          } else {
            value = value[col.value];
          }
          if (col.showScore) {
            return `${value} (${scoreSheet.score})`;
          } else {
            return value;
          }
        } else {
          if (col.showScore) {
            return scoreSheet.score;
          }
        }
      }
      if (col.showScore) {
        return root.score;
      }
      return '';
    },
    toggleColumn(ref) {
      const index = this.openColumns.indexOf(ref);
      if (index >= 0) {
        this.openColumns.splice(index, 1);
      } else {
        this.openColumns.push(ref);
      }
    },
    isOpen(ref) {
      return this.openColumns.indexOf(ref) >= 0;
    },
  },
};
</script>

<style lang="scss">
.merit-list {
  .moj-search {
    max-width: 360px
  }
}
</style>
