<template>
  <div>
    <div
      v-if="hasTools"
      class="govuk-grid-row"
    >
      <div class="govuk-grid-column-one-half">
        <a
          v-if="hasTool(SCORESHEET_TOOLS.FIND)"
          class="govuk-link govuk-!-margin-right-4"
          @click="btnFind"
        >Find an application</a>
        <a
          v-if="hasTool(SCORESHEET_TOOLS.COPY)"
          class="govuk-link govuk-!-margin-right-4"
          @click="btnCopy"
        >Copy</a>
      </div>
      <div class="govuk-grid-column-one-half text-right">
        <a
          v-if="hasTool(SCORESHEET_TOOLS.SCORE)"
          class="govuk-link govuk-!-margin-right-4"
          @click="btnToggle('showScore')"
        ><span v-if="showScore">Hide</span><span v-else>Show</span> score & rank</a>
        <a
          v-if="hasTool(SCORESHEET_TOOLS.DIVERSITY)"
          class="govuk-link"
          @click="btnToggle('showDiversity')"
        ><span v-if="showDiversity">Hide</span><span v-else>Show</span> diversity</a>
      </div>
    </div>
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
      @click="selectedApplication = null"
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
            colspan="2"
          />
          <th
            v-if="moderation"
            scope="col"
            class="govuk-table__header"
          />
          <th
            v-if="showDiversity"
            scope="col"
            class="govuk-table__header"
            colspan="4"
          />
        </tr>
      </template>

      <template #row="{row, index}">
        <slot
          name="columns-before"
          :row="{ ...row, highlight: row.referenceNumber === selectedApplication }"
          :index="index"
        />
        <ScoreSheetCell
          v-for="(column, columnIndex) in scoreSheetColumns"
          :key="columnIndex"
          :row="row"
          :column="column"
          :row-index="index"
          :column-index="columnIndex"
          :class="{ highlight: row.referenceNumber === selectedApplication }"
          @click="selectedApplication = null"
          @updated="updateScoreSheet"
        />
        <TableCell
          v-if="showScore"
          class="table-cell-value table-cell-score"
          :class="{ highlight: row.referenceNumber === selectedApplication }"
        >
          {{ row.score }}
        </TableCell>
        <TableCell
          v-if="showScore"
          class="table-cell-value table-cell-score"
          :class="{ highlight: row.referenceNumber === selectedApplication }"
        >
          {{ row.rank }}
        </TableCell>
        <TableCell
          v-if="moderation && editable"
          class="govuk-!-padding-0 v-top table-cell-score table-cell-moderation"
        >
          <div class="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-left-7">
            <div class="govuk-checkboxes__item">
              <input
                :id="`moderation-${row.id}`"
                :checked="row.scoreSheet.moderation === 'Yes'"
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
          {{ row.scoreSheet.moderation === 'Yes' ? 'Yes' : 'No' }}
        </TableCell>
        <template v-if="showDiversity">
          <TableCell
            title="Female"
            class="table-cell-value"
            :class="{ highlight: row.referenceNumber === selectedApplication }"
          >
            {{ $filters.toYesNo(row.diversity.female) }}
          </TableCell>
          <TableCell
            title="Ethnic minority"
            class="table-cell-value"
            :class="{ highlight: row.referenceNumber === selectedApplication }"
          >
            {{ $filters.toYesNo(row.diversity.bame) }}
          </TableCell>
          <TableCell
            title="Solicitor"
            class="table-cell-value"
            :class="{ highlight: row.referenceNumber === selectedApplication }"
          >
            {{ $filters.toYesNo(row.diversity.solicitor) }}
          </TableCell>
          <TableCell
            title="Disability"
            class="table-cell-value"
            :class="{ highlight: row.referenceNumber === selectedApplication }"
          >
            {{ $filters.toYesNo(row.diversity.disability) }}
          </TableCell>
        </template>
      </template>
    </Table>
    <Modal ref="findApplicationModal">
      <TitleBar @click="$refs['findApplicationModal'].closeModal()">
        Find an application
      </TitleBar>
      <!-- <FindAnApplication
        v-model="selectedApplication"
        :data="data"
        :search-fields="['referenceNumber']"
        @update:model-value="onApplicationFound"
        @cancel="selectedApplication = null; $refs['findApplicationModal'].closeModal()"
      /> -->
      <div style="padding: 0 20px 0 20px; min-height: 300px">
        <PredictiveSearch
          id="find-a-candidate"
          v-model="selectedApplication"
          hint="Type any part of reference number"
          :show-full-list-on-focus="false"
          :data="data"
          :search-fields="['referenceNumber']"
          required
          @update:model-value="onApplicationFound"
        />
        <button
          class="govuk-button govuk-button--secondary"
          type="button"
          @click="selectedApplication = null; $refs['findApplicationModal'].closeModal()"
        >
          Cancel
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import TitleBar from '../Page/TitleBar.vue';
import PredictiveSearch from '@jac-uk/jac-kit/draftComponents/Form/PredictiveSearch.vue';
import { SCORESHEET_TOOLS, markingScheme2Columns, markingScheme2ColumnHeaders } from '../../helpers/scoreSheetHelper';
import ScoreSheetCell from './ScoreSheetCell.vue';

export default {
  name: 'ScoreSheet',
  components: {
    Table,
    TableCell,
    Modal,
    TitleBar,
    PredictiveSearch,
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
    tools: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showDiversity: false,
      showScore: false,
      selectedApplication: null,
      SCORESHEET_TOOLS: SCORESHEET_TOOLS,
    };
  },
  computed: {
    hasTools() {
      return this.tools.length ? true : false;
    },
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
        columns.push({ title: 'Rank', class: 'table-cell-value table-cell-score' });
      }
      if (this.moderation) {
        columns.push({ title: 'Moderation?', class: 'text-center table-cell-score' });
      }
      if (this.showDiversity) {
        columns.push({ title: 'Female', class: 'table-cell-value' });
        columns.push({ title: 'Ethnic Minority', class: 'table-cell-value' });
        columns.push({ title: 'Solicitor', class: 'table-cell-value' });
        columns.push({ title: 'Disability', class: 'table-cell-value' });
      }
      // columns.push({ title: 'Report', class: 'text-center' });
      return columns;
    },
    clipboardColumns() {
      let columns = [];
      if (this.columnsBefore.length) columns = columns.concat(this.columnsBefore);
      // columns.push({ title: 'Reference', ref: 'referenceNumber', editable: false, matches: ['Reference', 'Reference Number', 'Reference number', 'Ref'] });
      this.scoreSheetColumns.forEach(column => {
        columns.push({ ...column, editable: true });
      });
      if (this.showScore) {
        columns.push({ title: 'Score', ref: 'score' });
        columns.push({ title: 'Rank', ref: 'rank' });
      }
      if (this.moderation) {
        columns.push({ title: 'Moderation?', ref: 'moderate' });
      }
      if (this.showDiversity) {
        columns.push({ title: 'Female', parent: 'diversity', ref: 'female' });
        columns.push({ title: 'Ethnic Minority', parent: 'diversity', ref: 'bame' });
        columns.push({ title: 'Solicitor', parent: 'diversity', ref: 'solicitor' });
        columns.push({ title: 'Disability', parent: 'diversity', ref: 'disability' });
      }
      return columns;
    },
  },
  methods: {
    hasTool(ref) {
      if (!this.hasTools) return false;
      return this.tools.indexOf(ref) >= 0;
    },
    async btnCopy() {
      const clipboardColumns = this.clipboardColumns;
      const rows = [];
      const headers = clipboardColumns.map(column => column.title);
      rows.push(headers);
      this.data.forEach(item => {
        const row = [];
        clipboardColumns.forEach(column => {
          if (column.editable) {
            if (item.scoreSheet) {
              if (column.parent) {
                row.push(item.scoreSheet[column.parent][column.ref]);
              } else {
                row.push(item.scoreSheet[column.ref]);
              }
            } else {
              row.push('');
            }
          } else {
            if (column.parent) {
              row.push(item[column.parent][column.ref]);
            } else {
              row.push(item[column.ref]);
            }
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
    btnFind() {
      // this.selectedApplication = null;
      this.$refs['findApplicationModal'].openModal();
    },
    onApplicationFound() {
      // this.selectedApplication = match;
      this.$refs['findApplicationModal'].closeModal();
    },
    btnToggle(ident) {
      this[ident] = !this[ident];
    },
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

  tr > th:first-child {
    position: sticky;
    left: 0;
    background-color: white;
    z-index:1;
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

  .highlight {
    background-color: rgba(86,148,202,0.2) !important;
  }

}
</style>
