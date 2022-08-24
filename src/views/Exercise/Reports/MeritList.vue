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
                class="govuk-button govuk-button--secondary moj-button-menu__item moj-page-header-actions__action"
                data-module="govuk-button"
                @click="exportData()"
              >
                Export data
              </button>
              <FullScreenButton />
            </div>
          </div>
        </div>
      </div>

      <!-- <div
        v-if="exercise"
        class="govuk-grid-row"
      >
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">
              Total applications
            </span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ exercise._applications.applied }}
            </h2>
          </div>
        </div>
        <div class="govuk-grid-column-one-half">
          <div class="panel govuk-!-margin-bottom-9">
            <span class="govuk-caption-m">Type of exercise</span>
            <h2 class="govuk-heading-m govuk-!-margin-bottom-0">
              {{ exercise.typeOfExercise | lookup }}
            </h2>
          </div>
        </div>
      </div> -->
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
          class="merit-list"
        >
          <template #header>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header table-cell-application"
              />
              <template v-for="column in headerColumns">
                <template v-if="column.expandable">
                  <th
                    :key="column.ref"
                    scope="col"
                    :colspan="column.colspan > 1 ? column.colspan : false"
                    class="govuk-table__header text-center expandable"
                    @click="toggleColumn(column.ref)"
                  >
                    <span class="elipses">{{ column.ref | lookup }}</span>
                  </th>
                </template>
                <template v-else>
                  <th
                    :key="column.ref"
                    scope="col"
                    class="govuk-table__header"
                  />
                </template>
              </template>
            </tr>
          </template>
          <template #row="{row}">
            <TableCell class="table-cell-application">
              <a
                href="#"
                class="govuk-link"
              >{{ row.referenceNumber }}</a>
            </TableCell>

            <TableCell
              v-for="(col, index) in scoreSheetColumns"
              :key="index"
              class="text-center table-cell-score"
            >
              {{ getColValue(row, col) }}
            </TableCell>

            <TableCell class="text-center">
              {{ row.totalScore }}
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
import { lookup } from '@/filters';

const localLookup = {};
localLookup[TASK_TYPE.CRITICAL_ANALYSIS] = 'CA';
localLookup[TASK_TYPE.SITUATIONAL_JUDGEMENT] = 'SJ';
localLookup[TASK_TYPE.QUALIFYING_TEST] = 'QT';

export default {
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
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
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
                    type: task.id,
                    path: item.ref,
                    value: child.ref,
                  });
                });
              }
              columns.push({
                title: 'Score',
                type: task.id,
                path: item.ref,
                showScore: true,
              });
            } else {
              columns.push({
                type: task.id,
                value: item.ref,
              });
            }
          });
        } else {
          columns.push({
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
      columns.push({ title: 'Application', class: 'table-cell-application' });
      this.scoreSheetColumns.forEach(col => {
        columns.push({ title: this.getColumnTitle(col), class: 'table-cell text-center' });
      });
      columns.push({ title: 'Total score', class: 'text-center' });
      return columns;
    },
    tableData() {
      if (!this.hasScoreSheet) return [];
      const applicationData = {};
      this.completedTasks.forEach(task => {
        task.finalScores.forEach(row => {
          if (!applicationData[row.id]) {
            applicationData[row.id] = {
              totalScore: 0,
            };
          }
          applicationData[row.id].referenceNumber = row.ref;
          applicationData[row.id][task.id] = {
            score: row.score,
            scoreSheet: row.scoreSheet ? row.scoreSheet : null,
          };
          applicationData[row.id].totalScore += row.score;
        });
      });
      const rows = Object.entries(applicationData).map(([id, row]) => {
        return {
          id: id,
          ...row,
        };
      }).sort((a, b) => b.totalScore - a.totalScore);
      return rows;
    },
  },
  async created() {
    await this.$store.dispatch('tasks/bind', { exerciseId: this.exercise.id } );
  },
  methods: {
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
      const root = row[col.type];
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
    exportData() {
      console.log('export data');
    },
  },
};
</script>

<style lang="scss">
.merit-list {
  table {
    display: block;
    overflow-x: auto;
    overflow-y: auto;
    scroll-behavior: smooth;
    max-width: 100%;
    max-height: 80vh;
    margin: 0 !important;
    border-spacing: 0;
    table-layout: fixed;
    border-collapse: collapse;
    border-right: 1px solid #f3f2f1;
    border-left: 1px solid #f3f2f1;
  }
  tbody {
    white-space: nowrap;
  }
  //table,
  th,
  td {
      border: 1px solid #f3f2f1;
      vertical-align: middle;
      white-space: nowrap;
      &.v-top {
        vertical-align: top;
      }
  }
  tr > th:first-child,
  tr > td:first-child {
    position: sticky;
    left: 0;
    background-color: #f3f2f1;
    z-index:1;
  }
  tr:first-child > th {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 2;
    border: 0;
    padding-left: 20px;
    &.expandable {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  tr:nth-child(2) > th {
    position: sticky;
    top: 46px;
    background-color: #f3f2f1;
    z-index: 2;
  }
  tr:first-child > th:first-child,
  tr:nth-child(2) > th:first-child {
    z-index: 3;
  }
  tr > th:last-child,
  tr > td:last-child {
    padding-right: 10px;
  }
  .table-cell {
    padding: 0 10px;
  }
  .table-cell-application {
    min-width: 160px;
    padding: 10px;
  }
  .table-cell-score {
    min-width: 50px;
    padding: 0 10px;
    text-align: center;
  }
  .elipses {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;  // IE 6+, FF 7+, Op 11+, Saf 1.3+, Chr 1+
    -o-text-overflow: ellipsis;  // for Opera 9 & 10
  }
}
</style>
