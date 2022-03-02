<template>
  <div>
    <!-- diversity header -->
    <div class="govuk-grid-column-full">
      <div class="moj-page-header-actions">
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
            </div>
          </div>
        </div>
      </div>

      <div
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
      </div>
    </div>

    <div
      class="govuk-grid-column-full"
    >
      <!-- SCORE SHEET -->
      <div v-show="hasScoreSheet">
        <Table
          ref="scoreSheet"
          data-key="id"
          :data="scoreSheetRows"
          :columns="scoreSheetColumns"
          :page-size="500"
          @change="onChangeScoreSheet"
          class="merit-list"
        >
          <template #header>
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header table-cell-application"></th>
              <th
                v-if="emptyScoreSheet.sift"
                scope="col"
                :colspan="capabilities.length"
                class="govuk-table__header text-center"
              >
                Sift
              </th>
              <template v-if="emptyScoreSheet.selection">
                <th
                  v-for="category in selectionCategories"
                  :key="category"
                  scope="col"
                  :colspan="capabilities.length"
                  class="govuk-table__header text-center"
                >
                  {{ category | lookup }}
                </th>
              </template>
            </tr>
          </template>
          <template #row="{row}">
            <TableCell class="table-cell-application">
              {{ row.referenceNumber }}
            </TableCell>

            <template v-if="row.scoreSheet.sift">
              <TableCell
                v-for="(cap, index) in capabilities"
                :key="`sift_${index}`"
                class="text-center table-cell-score"
              >
                {{ row.scoreSheet.sift.scoreSheet[cap] }}
              </TableCell>
            </template>

            <template v-if="row.scoreSheet.selection">
              <template
                v-for="category in selectionCategories"
              >
                <TableCell
                  v-for="(cap, index) in capabilities"
                  :key="`${category}_${index}`"
                  class="text-center table-cell-score"
                >
                  {{ row.scoreSheet.selection.scoreSheet[category][cap] }}
                </TableCell>
              </template>
            </template>
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

export default {
  components: {
    Table,
    TableCell,
  },
  data() {
    return {
      panelsLoaded: false,
      scoreSheetRows: [],
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    capabilities() {
      return this.$store.getters['exerciseDocument/capabilities'];
    },
    selectionCategories() {
      return this.$store.getters['exerciseDocument/selectionCategories'];
    },
    emptyScoreSheet() {
      return this.$store.getters['exerciseDocument/emptyScoreSheet']();
    },
    panels() {
      return this.$store.state.panels.records;
    },
    hasScoreSheet() {
      if (this.panels && this.panels.length) {
        if (this.panels.find(p => p.scoreSheet)) return true;
      }
      return false;
    },
    scoreSheetColumns() {
      const columns = [];
      if (!this.hasScoreSheet) return columns;
      columns.push({ title: 'Application', class: 'table-cell-application' });
      if (this.emptyScoreSheet.sift) {
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
      }
      if (this.emptyScoreSheet.selection) {
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
        this.capabilities.forEach(cap => columns.push({ title: cap, class: 'text-center table-cell-score' }));
      }
      return columns;
    },
  },
  watch: {
    panels() {
      if (this.panels && !this.panelsLoaded) {
        console.log('panels loaded');
        this.panelsLoaded = true;
        if (this.hasScoreSheet) {
          if (this.$refs['scoreSheet']) {
            this.$refs['scoreSheet'].loaded();
          }
          this.scoreSheetRows = this.getScoreSheetRows();
        }
      }
    },
  },
  created() {
    this.$store.dispatch('panels/bind', { exerciseId: this.exercise.id });
  },
  destroyed() {
  },
  methods: {
    onChangeScoreSheet() {
      console.log('update score sheet view');
      if (this.$refs['scoreSheet']) {
        this.$refs['scoreSheet'].loaded();
      }
    },
    getScoreSheetRows() {
      const rows = [];
      if (!this.hasScoreSheet) return rows;

      // construct (empty) applications map
      const applicationsMap = {};
      this.panels.forEach(panel => {
        if (!panel.applicationIds) return;
        panel.applicationIds.forEach(applicationId => {
          if (!applicationsMap[applicationId]) {
            applicationsMap[applicationId] = {
              referenceNumber: panel.applications[applicationId].referenceNumber,
              scoreSheet: this.$store.getters['exerciseDocument/emptyScoreSheet'](),
            };
          }
        });
      });

      // populate applications map
      this.panels.forEach(panel => {
        if (!panel.applicationIds) return;
        if (!panel.capabilities) return;
        if (!panel.scoreSheet) return;
        panel.applicationIds.forEach(applicationId => {
          const scoreSheet = {
            ...applicationsMap[applicationId].scoreSheet[panel.type].scoreSheet,
            ...panel.scoreSheet[applicationId],
          };
          applicationsMap[applicationId].scoreSheet[panel.type].scoreSheet = scoreSheet;
          applicationsMap[applicationId].scoreSheet[panel.type].panel = {
            id: panel.id,
            name: panel.name,
          };
          applicationsMap[applicationId].scoreSheet[panel.type].report = null;
        });
      });

      // convert to rows
      Object.entries(applicationsMap).forEach(([key, value]) => {
        const row = {};
        row.id = key;
        row.referenceNumber = value.referenceNumber;
        row.scoreSheet = value.scoreSheet;
        rows.push(row);
      });

      return rows;
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
    scroll-behavior: smooth;
    max-width: 100%;
    margin: 0 !important;
    border-spacing: 0;
    table-layout: fixed;
    border-collapse: collapse;
  }
  tbody {
    white-space: nowrap;
  }
  //table,
  th,
  td {
      border: 1px solid #f3f2f1;
      vertical-align: middle;
  }
  tr > th:first-child,
  tr > td:first-child {
    position: sticky;
    left: 0;
    background-color: #f3f2f1;
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

}
</style>
