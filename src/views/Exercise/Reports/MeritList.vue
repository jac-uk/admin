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
              <template v-if="isNumericColumn(col.type)">
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
import { TASK_TYPE, TASK_STATUS, getTaskTypes } from '@/helpers/exerciseHelper';
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
      // if we have Qualifying Test then remove SJ & CA
      let taskTypes = getTaskTypes(this.exercise);
      if (taskTypes.indexOf(TASK_TYPE.QUALIFYING_TEST) >= 0) {
        taskTypes = taskTypes.filter(taskType => [TASK_TYPE.CRITICAL_ANALYSIS, TASK_TYPE.SITUATIONAL_JUDGEMENT].indexOf(taskType) < 0);
      }
      return taskTypes;
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
      columns.push({ title: 'BAME' });
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

<style type="text/css" rel="stylesheet/scss" lang="scss">
.merit-list {
  .moj-search {
    max-width: 360px
  }
}
</style>
