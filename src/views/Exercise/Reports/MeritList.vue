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
          class="merit-list"
          @change="updateTableState"
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
              <template v-else>
                {{ getColValue(row, col) }}
              </template>
            </TableCell>

            <TableCell class="text-center">
              {{ row.totalScore | formatNumber(2) }}
            </TableCell>

            <!-- @TODO: Integrate this in below
            <TableCell :title="tableColumns[3].title">
              {{ 100 * (row.cumulativeDiversity.female / (row.rank + row.count - 1)) | formatNumber(2) }}%
            </TableCell>
            <TableCell :title="tableColumns[4].title">
              {{ 100 * (row.cumulativeDiversity.bame / (row.rank + row.count - 1)) | formatNumber(2) }}%
            </TableCell>
            <TableCell :title="tableColumns[5].title">
              {{ 100 * (row.cumulativeDiversity.solicitor / (row.rank + row.count - 1)) | formatNumber(2) }}%
            </TableCell>
            <TableCell :title="tableColumns[6].title">
              {{ 100 * (row.cumulativeDiversity.disability / (row.rank + row.count - 1)) | formatNumber(2) }}%
            </TableCell>
            -->

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
import { getTableData } from '@/helpers/tableHelper';

const localLookup = {};
localLookup[TASK_TYPE.CRITICAL_ANALYSIS] = 'CA';
localLookup[TASK_TYPE.SITUATIONAL_JUDGEMENT] = 'SJ';
localLookup[TASK_TYPE.QUALIFYING_TEST] = 'QT';

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
      //columns.push({ title: 'Candidate', class: 'table-cell-application' });
      columns.push({ title: 'Candidate', class: 'table-cell-application', sort: 'fullName' });
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
        if (task.finalScores) {
          task.finalScores.forEach(row => {
            if (!applicationData[row.id]) {
              applicationData[row.id] = {
                totalScore: 0,
              };
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
                  parent: parent,
                  ref: subItem.ref,
                  type: subItem.type,
                });
              });
            }
            else {
              columns.push({
                parent: parent,
                ref: item.ref,
                type: item.type,
              });
            }
          });
          columns.push({
            parent: parent,
            type: 'number',
            ref: 'score',
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
        if (column.parent) title = `${column.parent}.${column.ref}`;
        columns.push({ title: title, editable: true, ...column });
      });
      return columns;
    },
  },
  async created() {
    await this.$store.dispatch('tasks/bind', { exerciseId: this.exercise.id } );
  },
  methods: {

    // @TODO: WARREN CONTINUE HERE - copy to clipboard needs reworking for the data structure in here
    async copyToClipboard() {
      const rows = [];
      const headers = this.clipboardColumns.map(column => column.title);
      rows.push(headers);
      this.task.applications.forEach(application => {
        const row = [];
        this.clipboardColumns.forEach(column => {
          if (column.editable) {
            if (column.parent) {
              row.push(this.task.scoreSheet[application.id][column.parent][column.ref]);
            } else {
              row.push(this.task.scoreSheet[application.id][column.ref]);
            }
          } else {
            row.push(application[column.ref]);
          }
        });
        rows.push(row);
      });
      let data = '';
      rows.forEach(row => data += `${row.join('\t')}\n` );
      if (navigator && navigator.clipboard) {
        await navigator.clipboard.writeText(data);
      }
    },
    isNumericColumn(colType) {
      switch (colType) {
      case 'qualifyingTest':
      case 'scenarioTest':
        return true;
      default:
        return false;
      }
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

    // @TODO: Copy and paste should use the finalScores.scoresheet
    // - not all tasks will have a scoresheet but will have id, ref, score, pass
    // - eg critical analysis test (we do want to be able to adjust this score)
    // - it will only be there temporarily

    getColValue(row, col) {

      // console.log('--getColValue, row:');
      // console.log(row);
      // console.log('--getColValue, col:');
      // console.log(col);

      const root = row[col.type];
      if (!root) return '';
      let scoreSheet = root.scoreSheet;

      // console.log('root.scoreSheet:');
      // console.log(root.scoreSheet);

      if (scoreSheet) {
        if (col.path) {
          scoreSheet = scoreSheet[col.path];

          // console.log('scoreSheet:');
          // console.log(scoreSheet);
        }
        if (col.value) {
          let value = scoreSheet;
          if (col.value.indexOf('.') >= 0) {
            const valueParts = col.value.split('.');

            //console.log('valueParts:', valueParts);

            valueParts.forEach(valuePart => {
              value = value[valuePart];
            });

            //console.log('1 - value:', value);

          } else {
            value = value[col.value];

            //console.log('2 - value:', value);

          }
          if (col.showScore) {

            //console.log(`return ${value} (${scoreSheet.score})`);

            return `${value} (${scoreSheet.score})`;
          } else {

            //console.log(`return value: ${value}`);

            return value;
          }
        } else {
          if (col.showScore) {

            //console.log(`return scoreSheet.score: ${scoreSheet.score}`);

            return scoreSheet.score;
          }
        }
      }
      if (col.showScore) {

        //console.log(`return root.score: ${root.score}`);

        return root.score;
      }

      //console.log('return empty string');

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
