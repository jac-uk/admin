<template>
  <Table
    ref="scoreSheet"
    data-key="id"
    :data="data"
    :columns="tableColumns"
    :page-size="500"
    local-data
    sticky
    class="score-sheet"
    @copy="copySheet"
  >
    <template
      v-if="scoreSheetHeaders.length > 1"
      #header
    >
      <tr class="govuk-table__row sticky-top">
        <th
          v-for="column in columnsBefore"
          :key="column"
          scope="col"
          class="govuk-table__header"
          :class="column.class"
        />
        <th
          v-for="header in scoreSheetHeaders"
          :key="header.ref"
          scope="col"
          :colspan="header.colspan"
          class="govuk-table__header text-center table-header-group"
        >
          {{ $filters.lookup(header.ref) }}
        </th>
        <th
          v-if="showScore"
          scope="col"
          class="govuk-table__header"
        />
        <th
          v-if="moderation"
          scope="col"
          class="govuk-table__header"
        />
      </tr>
    </template>

    <template #row="{row, index}">
      <slot
        name="columns-before"
        :row="row"
        :index="index"
      />
      <ScoreSheetCell
        v-for="(column, columnIndex) in scoreSheetColumns"
        :key="columnIndex"
        :row="row"
        :column="column"
        :row-index="index"
        :column-index="columnIndex"
        @updated="updateScoreSheet"
      />
      <TableCell 
        v-if="showScore"
        class="table-cell-value table-cell-score"
      >
        {{ row.score }}
      </TableCell>
      <TableCell
        v-if="moderation && editable"
        class="govuk-!-padding-0 v-top table-cell-score table-cell-moderation"
      >
        <div class="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-left-7">
          <div class="govuk-checkboxes__item">
            <input
              :id="`moderation-${row.id}`"
              :checked="row.scoreSheet.flagForModeration"
              class="govuk-checkboxes__input"
              type="checkbox"
              @input="updateModeration(row, $event)"
            >
            <label
              class="govuk-label govuk-checkboxes__label"
              :for="`moderation-${row.id}`"
            />
          </div>
        </div>
      </TableCell>
      <TableCell
        v-if="moderation && !editable"
        class="govuk-!-padding-0 table-cell-value"
      >
        {{ row.scoreSheet.moderation === 'TRUE' ? 'Yes' : 'No' }}
      </TableCell>
    </template>
  </Table>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import { markingScheme2Columns, markingScheme2ColumnHeaders } from '@/helpers/taskHelper';
import ScoreSheetCell from './ScoreSheetCell.vue';

export default {
  name: 'ScoreSheet',
  components: {
    Table,
    TableCell,
    ScoreSheetCell,
  },
  props: {
    data: {
      required: true,
      type: Array,
    },
    markingScheme: {
      required: true,
      type: Array,
    },
    columnsBefore: {
      required: false,
      type: Array,
      default: () => [],
    },
    editable: {
      required: false,
      type: Boolean,
      default: false,
    },
    moderation: {
      required: false,
      type: Boolean,
      default: false,
    },
    showScore: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  computed: {
    scoreSheetHeaders() {
      return markingScheme2ColumnHeaders(this.markingScheme);
    },
    scoreSheetColumns() {
      return markingScheme2Columns(this.markingScheme, this.editable);
    },
    tableColumns() {
      let columns = [];
      if (this.columnsBefore.length) columns = columns.concat(this.columnsBefore);
      this.scoreSheetColumns.forEach(column => columns.push({ title: column.ref, class: 'table-cell-score-header' }));
      if (this.showScore) {
        columns.push({ title: 'Score', class: 'table-cell-value table-cell-score' });
      }
      if (this.moderation) {
        columns.push({ title: 'Moderation?', class: 'text-center table-cell-score' });
      }
      // columns.push({ title: 'Report', class: 'text-center' });      
      return columns;
    },
  },
  methods: {
    updateScoreSheet(row, column, newValue) {
      console.log('updateScoreSheet', row.id, column.parent, column.ref, newValue);
    },
    updateModeration(row, event) {
      console.log('updateModeration', row, event);
      // const saveData = {};
      // saveData[`scoreSheet.${applicationId}.flagForModeration`] = event.target.checked;
      // await this.$store.dispatch('panel/update', { id: panelId, data: saveData } );
    },    
    copySheet(event) {
      console.log('copySheet', event);
    },
    selectSheet(event) {
      console.log('select', event);
    },
  },
};

</script>

<style lang="scss">
.score-sheet {
  table {
    border: 1px solid govuk-colour("mid-grey") !important;
  }  
  th, td {
    vertical-align: middle;
  }

  .table-cell-value {
    min-width: 50px;
    padding: 0 10px !important;
    text-align: center;
    border-right: 1px solid govuk-colour("mid-grey");
  }
  .table-cell-score-header {
    padding: 10px;
    text-align: center;
  }

  .govuk-table__head .table-cell-application {
    border-left: 1px solid govuk-colour("light-grey") !important;
  }
  .govuk-table__body .table-cell-application {
    padding: 10px;
    border-left: 1px solid govuk-colour("light-grey");
    border-right: 1px solid govuk-colour("mid-grey");
  }

  .table-header-group {
    border-left: 1px solid govuk-colour("mid-grey");
    border-right: 1px solid govuk-colour("mid-grey");
    padding: 10px;
  }
  .table-header-group ~ .table-header-group {
    border-left: 1px solid transparent;
  }

  .sticky-top {
    position: sticky;
    top: 0;
    background-color: white;
  }

  .sticky-left {
    position: sticky;
    left: 0;
    background-color: #f3f2f1;
  }

  .sticky-right {
    position: sticky;
    right: 0;
    background-color: #f3f2f1;
  }

  .nowrap {
    white-space: nowrap;
  }

  .table-cell-application {
    width: 160px;
  }
  .table-cell-score {
    width: 50px;
  }
  .table-cell-moderation {
    vertical-align: top;
  }

}
</style>
