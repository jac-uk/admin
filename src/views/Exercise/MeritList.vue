<template>
  <div>
    <!-- diversity header -->
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions govuk-!-margin-bottom-3">
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
          :data="scoreSheetRows"
          :columns="scoreSheetColumns"
          :page-size="500"
          class="merit-list"
        >
          <template #header>
            <tr class="govuk-table__row">
              <th
                scope="col"
                class="govuk-table__header table-cell-application"
              />
              <th
                scope="col"
                class="govuk-table__header"
              />
              <th
                v-for="column in headerColumns"
                :key="column.ref"
                scope="col"
                :colspan="column.colspan > 1 ? column.colspan : false"
                class="govuk-table__header text-center expandable"
                @click="toggleColumn(column.ref)"
              >
                <span class="elipses">{{ column.ref | lookup }}</span>
              </th>
            </tr>
          </template>
          <template #row="{row}">
            <TableCell class="table-cell-application">
              <a
                href="#"
                class="govuk-link"
              >{{ row.referenceNumber }}</a>
            </TableCell>

            <template if="row['critical-analysis']">
              <TableCell
                class="text-center table-cell-score"
              >
                {{ row['critical-analysis'].score }}
              </TableCell>
            </template>

            <template v-if="row.sift && isOpen('sift')">
              <TableCell
                v-for="(cap, index) in capabilities"
                :key="`sift_${index}`"
                class="text-center table-cell-score"
              >
                {{ row.sift.scoreSheet[cap] }}
                <span v-if="cap == 'OVERALL'">({{ row.sift.score }})</span>
              </TableCell>
            </template>
            <template v-else-if="row.sift && !isOpen('sift')">
              <TableCell
                class="text-center table-cell-score"
              >
                {{ row.sift.scoreSheet[capabilities[capabilities.length - 1]] }}
                ({{ row.sift.score }})
              </TableCell>
            </template>
            <td
              v-else
              :colspan="siftColumnCount"
            />

            <template v-if="row.selection">
              <template
                v-for="category in selectionCategories"
              >
                <template v-if="isOpen(category)">
                  <TableCell
                    v-for="(cap, index) in capabilities"
                    :key="`${category}_${index}`"
                    class="text-center table-cell-score"
                  >
                    {{ row.selection.scoreSheet[category][cap] }}
                    <span v-if="cap == 'OVERALL'">({{ row.selection.scoreSheet[category].score }})</span>
                  </TableCell>
                </template>
                <template v-else>
                  <TableCell
                    :key="category"
                    class="text-center table-cell-score"
                  >
                    {{ row.selection.scoreSheet[category]['OVERALL'] }}
                    ({{ row.selection.scoreSheet[category].score }})
                  </TableCell>
                </template>
              </template>
            </template>
            <td
              v-else
              :colspan="selectionColumnCount"
            />

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
import { CAPABILITIES, SELECTION_CATEGORIES, TASKS, TASK_TYPE, TASK_STATUS } from '@/helpers/exerciseHelper';

export default {
  components: {
    Table,
    TableCell,
    TabsList,
    FullScreenButton,
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
    capabilities() {
      if (!this.exercise) return [];
      return CAPABILITIES.filter(cap => this.exercise.capabilities.indexOf(cap) >= 0);
    },
    selectionCategories() {
      if (!this.exercise) return [];
      return SELECTION_CATEGORIES.filter(cap => this.exercise.selectionCategories.indexOf(cap) >= 0); // Using SELECTION_CATEGORIES to ensure display order
    },
    tasks() {
      console.log('tasks', this.$store.state.tasks.records);
      return this.$store.state.tasks.records;
    },
    completedTasks() {
      if (!this.tasks) return [];
      const tasks = this.tasks.filter(task => task.status === TASK_STATUS.COMPLETED);
      const completedTasks = [];
      TASKS.forEach(type => {
        const task = tasks.find(task => task.type === type);
        if (task) { completedTasks.push(task); }
      });
      return completedTasks;
    },
    hasScoreSheet() {
      return this.completedTasks.length > 0;
    },
    headerColumns() {
      const columns = [];
      this.completedTasks.forEach(task => {
        switch (task.type) {
        case TASK_TYPE.CRITICAL_ANALYSIS:
          //   columns.push({
          //     ref: task.type,
          //     colspan: 1,
          //   });
          //   break;
          columns.push();
          break;
        case TASK_TYPE.SIFT:
          columns.push({
            ref: task.type,
            colspan: this.isOpen(task.type) ? this.capabilities.length : 1,
          });
          break;
        case TASK_TYPE.SELECTION:
          this.selectionCategories.forEach(cat => {
            columns.push({
              ref: cat,
              colspan: this.isOpen(cat) ? this.capabilities.length : 1,
            });
          });
          break;
        }
      });
      return columns;
    },
    siftColumnCount() {
      return this.isOpen(TASK_TYPE.SIFT) ? this.capabilities.length : 1;
    },
    selectionColumnCount() {
      let columnCount = 0;
      this.selectionCategories.forEach(cat => {
        columnCount += this.isOpen(cat) ? this.capabilities.length : 1;
      });
      return columnCount;
    },
    scoreSheetColumns() {
      const columns = [];
      if (!this.hasScoreSheet) return columns;
      columns.push({ title: 'Application', class: 'table-cell-application' });
      this.completedTasks.forEach(task => {
        switch (task.type) {
        case TASK_TYPE.CRITICAL_ANALYSIS:
          columns.push({ title: 'CA', class: 'text-center table-cell-score' });
          break;
        case TASK_TYPE.SIFT:
          if (this.isOpen(TASK_TYPE.SIFT)) {
            this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
          } else {
            columns.push({ title: this.capabilities[this.capabilities.length - 1], class: 'text-center table-cell-score' });
          }
          break;
        case TASK_TYPE.SELECTION:
          this.selectionCategories.forEach(category => {
            if (this.isOpen(category)) {
              this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
            } else {
              columns.push({ title: this.capabilities[this.capabilities.length - 1], class: 'text-center table-cell-score' });
            }
          });
          break;
        }
      });
      columns.push({ title: 'Total score', class: 'text-center' });
      return columns;
    },
    scoreSheetRows() {
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
          applicationData[row.id][task.type] = {
            score: row.score,
            scoreSheet: row.scoreSheet,
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
      console.log('rows', rows);
      return rows;
    },
  },
  async created() {
    await this.$store.dispatch('tasks/bind', { exerciseId: this.exercise.id } );
  },
  methods: {
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
    // onChangeScoreSheet() {
    //   if (this.$refs['scoreSheet']) {
    //     this.$refs['scoreSheet'].loaded();
    //   }
    // },
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
