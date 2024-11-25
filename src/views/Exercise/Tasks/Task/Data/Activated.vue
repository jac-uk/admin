<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-one-half">
        <h1 class="govuk-heading-l govuk-!-margin-bottom-2">
          {{ $filters.lookup(type) }}
        </h1>
      </div>
      <div class="text-right govuk-grid-column-one-half">
        <FullScreenButton />
      </div>
    </div>

    <ProgressBar :steps="taskSteps" />

    <p class="govuk-body">
      Upload scores to the platform by taking the following steps:
    </p>
    <ol class="govuk-list govuk-list--number">
      <li>If necessary, rename the column containing application references to <strong>Reference number</strong></li>
      <li>
        Rename the score columns as follows:
        <span
          v-for="(col, index) in scoreSheetColumns"
          :key="col"
        ><strong>{{ col.title }}</strong><span v-if="index < scoreSheetColumns.length - 1">, </span></span>
      </li>
      <li>Select all and copy all</li>
      <li>Return to this page and click ‘Paste from clipboard’</li>
      <li>The application totals will update automatically and you will see the scores populate below</li>
      <li>If you are happy with the number of applications updated, click continue to move to the next step</li>
    </ol>

    <div class="govuk-button-group govuk-!-margin-bottom-6">
      <button
        class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
        @click="pasteFromClipboard"
      >
        Paste from clipboard
      </button>
    </div>

    <div
      v-if="completeRows.length"
      class="govuk-grid-row"
    >
      <div class="govuk-grid-column-two-thirds">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-0">
            Applications
            <span class="govuk-caption-m"><span>With scores / </span>Total</span>
          </p>
          <h2 class="govuk-heading-l govuk-!-padding-top-0 govuk-!-margin-bottom-0">
            <span>{{ completeRows.length }} / </span>{{ task.applications.length }}
          </h2>
        </div>
      </div>

      <div class="govuk-grid-column-one-third">
        <div class="panel govuk-!-margin-bottom-6 govuk-!-padding-4 background-light-grey">
          <p class="govuk-body govuk-!-margin-bottom-4">
            Next step
          </p>
          <button
            class="govuk-button govuk-!-margin-bottom-1"
            type="button"
            @click="btnContinue"
          >
            Continue
          </button>
        </div>
      </div>
    </div>

    <div class="govuk-!-margin-bottom-6">
      <a
        class="govuk-link"
        @click="copyToClipboard"
      >
        Copy scoresheet to clipboard
      </a>
    </div>

    <!--
    <Table
      v-if="completeRows.length"
      ref="scoreSheet"
      data-key="id"
      :data="tableData"
      :columns="tableColumns"
      :page-size="1000"
      local-data
      sticky
      class="score-sheet"
    >
      <template
        v-if="scoreSheetHeaders.length"
        #header
      >
        <tr class="govuk-table__row sticky-row">
          <th
            scope="col"
            class="govuk-table__header table-cell-application"
          />
          <th
            v-for="header in scoreSheetHeaders"
            :key="header.ref"
            scope="col"
            :colspan="header.colspan"
            class="govuk-table__header text-center"
          >
            {{ $filters.lookup(header.ref) }}
          </th>
          <th
            scope="col"
            class="govuk-table__header table-cell-value"
          />
        </tr>
      </template>

      <template #row="{row, index}">
        <TableCell class="table-cell-application vertical-align-middle">
          {{ row.referenceNumber }}
        </TableCell>

        <TableCell
          v-for="(column, columnIndex) in scoreSheetColumns"
          :key="`${task.type}_${index}_${columnIndex}`"
          class="text-center table-cell-score"
          :title="column.ref"
        >
          <span v-if="!scoreSheet[row.id]">Can't find scoresheet entry row for {{ row.id }}. Scoresheet = {{ row.scoreSheet }}</span>
          <input
            v-else-if="column.type == 'number'"
            :id="`row-${index}_col-${columnIndex}`"
            v-model="scoreSheet[row.id][column.parent][column.ref]"
            type="number"
            class="govuk-input"
            spellcheck="false"
            autocomplete="off"
            @keydown="onKeyDown($event, index, columnIndex)"
            @input="onCellValueChange(row, column)"
          >
          <input
            v-else-if="column.type == 'select'"
            :id="`row-${index}_col-${columnIndex}`"
            v-model="scoreSheet[row.id][column.parent][column.ref]"
            type="text"
            maxlength="1"
            class="govuk-input"
            spellcheck="false"
            autocomplete="grade"
            @keydown="onKeyDown($event, index, columnIndex)"
            @input="onCellValueChange(row, column)"
          >
          <input
            v-else-if="column.type == 'grade' && !column.parent"
            :id="`row-${index}_col-${columnIndex}`"
            v-model="scoreSheet[row.id][column.ref]"
            type="text"
            maxlength="1"
            class="govuk-input"
            spellcheck="false"
            autocomplete="grade"
            @keydown="onKeyDown($event, index, columnIndex)"
            @input="onCellValueChange(row, column)"
          >
          <input
            v-else-if="column.type == 'grade' && column.parent"
            :id="`row-${index}_col-${columnIndex}`"
            v-model="scoreSheet[row.id][column.parent][column.ref]"
            type="text"
            maxlength="1"
            class="govuk-input"
            spellcheck="false"
            autocomplete="grade"
            @keydown="onKeyDown($event, index, columnIndex)"
            @input="onCellValueChange(row, column)"
          >
        </TableCell>

        <TableCell class="text-center table-cell-score vertical-align-middle">
          {{ row.score }}
        </TableCell>
      </template>
    </Table> -->

    <Modal ref="modalCheckDataComplete">
      <ModalInner
        title="Are you sure you wish to continue?"
        :message="confirmationMessage"
        button-text="Yes - please continue"
        @close="$refs.modalCheckDataComplete.closeModal()"
        @confirmed="btnFinalise"
      />
    </Modal>
  </div>
</template>

<script>
import { httpsCallable } from '@firebase/functions';
import { beforeRouteEnter, btnNext } from '../helper';
import { CAPABILITIES, SELECTION_CATEGORIES, getTaskSteps } from '@/helpers/exerciseHelper';
import { getScoreSheetTotal, GRADES, isScoreSheetComplete, getCompleteScoreSheet } from '@/helpers/scoreSheetHelper';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import { functions } from '@/firebase';
import clone from 'clone';

export default {
  components: {
    FullScreenButton,
    Modal,
    ModalInner,
    ProgressBar,
  },
  beforeRouteEnter: beforeRouteEnter,
  props: {
    type: {
      required: true,
      type: String,
    },
  },
  data() {
    const task = this.$store.getters['tasks/getTask'](this.type);
    return {
      scoreSheet: getCompleteScoreSheet(task),
    };
  },
  computed: {
    exercise() {
      return this.$store.state.exerciseDocument.record;
    },
    task() {
      return this.$store.getters['tasks/getTask'](this.type);
    },
    taskSteps() {
      const steps = getTaskSteps(this.exercise, this.type, this.task);
      return steps;
    },
    hasTaskStarted() {
      if (!this.task) return false;
      if (!this.task.startDate) return false;
      return this.task.startDate < new Date();
    },
    capabilities() {
      if (!this.task) return [];
      if (!this.task.capabilities) return [];
      return CAPABILITIES.filter(cap => this.task.capabilities.indexOf(cap) >= 0);  // Using CAPABILITIES to ensure display order of selected capabilities
    },
    selectionCategories() {
      if (!this.task) return [];
      if (!this.task.selectionCategories) return [];
      return SELECTION_CATEGORIES.filter(cat => this.task.selectionCategories.indexOf(cat) >= 0); // Using SELECTION_CATEGORIES to ensure display order
    },
    grades() {
      return this.task && this.task.grades ? this.task.grades : GRADES;
    },
    scoreSheetHeaders() {
      const headers = [];
      if (!this.task) return headers;
      if (!this.task.markingScheme) return headers;
      let columns = 0;
      this.task.markingScheme.forEach(item => {
        if (item.type === 'group') {
          if (columns > 0) {
            headers.push({
              ref: '',
              colspan: columns,
            });
            columns = 0;
          }
          headers.push({
            ref: item.ref,
            colspan: item.children.length,
          });
        } else {
          columns += 1;
        }
      });
      return headers;
    },
    scoreSheetColumns() {
      const columns = [];
      if (!this.task) return columns;
      if (!this.task.markingScheme) return columns;
      this.task.markingScheme.forEach(item => {
        if (item.type === 'group') {
          item.children.forEach(child => columns.push({ ...child, parent: item.ref, title: `${item.ref}. ${child.ref}. Score`, matches: [`${item.ref}.${child.ref}`, `${item.ref}.${child.ref}.`, `${item.ref}. ${child.ref}.`, `${item.ref} ${child.ref}`, `${item.ref}.${child.ref} Score`, `${item.ref}.${child.ref}. Score`, `${item.ref}. ${child.ref}. Score`, `${item.ref} ${child.ref} Score`] }));
        } else {
          columns.push({ ...item, title: `${item.ref}. Score`, matches: [item.ref, `${item.ref}. Score`, `${item.ref} Score`] });
        }
      });
      return columns;
    },
    tableColumns() {
      const columns = [];
      columns.push({ title: 'Reference', class: 'table-cell-application' });
      this.scoreSheetColumns.forEach(column => columns.push({ title: column.ref, class: 'text-center table-cell-score' }));
      columns.push({ title: 'Total score', class: 'text-center table-cell-score' });
      return columns;
    },
    clipboardColumns() {
      const columns = [];
      columns.push({ title: 'Reference', ref: 'ref', editable: false, matches: ['Reference', 'Reference Number', 'Reference number', 'Ref'] });
      this.scoreSheetColumns.forEach(column => {
        columns.push({ editable: true, ...column });
      });
      return columns;
    },
    tableData() {
      const rows = [];
      this.task.applications.forEach(application => {
        const row = {
          id: application.id,
          fullName: application.fullName,
          referenceNumber: application.ref,
          scoreSheet: this.scoreSheet[application.id], // ? this.scoreSheet[application.id] : clone(this.task.emptyScoreSheet),
          score: getScoreSheetTotal(this.task.markingScheme, this.scoreSheet[application.id]),
          isComplete: isScoreSheetComplete(this.task.markingScheme, this.scoreSheet[application.id]),
        };
        rows.push(row);
      });
      return rows;
    },
    completeRows() {
      return this.task.applications.filter(application => isScoreSheetComplete(this.task.markingScheme, this.scoreSheet[application.id]));
    },
    areAllRowsComplete() {
      return this.completeRows.length === this.task.applications.length;
    },
    confirmationMessage() {
      return `${this.completeRows.length} out of ${this.task.applications.length} applications have scores`;
    },
  },
  watch: {
    task() {
      this.scoreSheet = getCompleteScoreSheet(this.task);
    },
  },
  methods: {
    btnNext,
    btnContinue() {
      this.$refs.modalCheckDataComplete.openModal();
    },
    async btnFinalise() {
      await httpsCallable(functions, 'updateTask')({
        exerciseId: this.exercise.id,
        type: this.type,
      });
      this.btnNext();
    },
    onCellValueChange(row, column) {
      let value = column.parent ? this.scoreSheet[row.id][column.parent][column.ref] : this.scoreSheet[row.id][column.ref];

      if (column.type === 'grade') {
        value = value.toUpperCase();
        if (this.grades.indexOf(value) < 0) {
          value = '';
        }
      }

      if (column.parent) {
        this.scoreSheet[row.id][column.parent][column.ref] = value;
        this.saveCell([row.id, column.parent, column.ref], value);
      } else {
        this.scoreSheet[row.id][column.ref] = value;
        this.saveCell([row.id, column.ref], value);
      }
    },
    async saveCell(path, value) {
      const data = { };
      data[`scoreSheet.${path.join('.')}`] = value;
      await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.task.type, data: data });
    },
    onKeyDown(event, rowIndex, colIndex) {
      let newRow = rowIndex;
      let newCol = colIndex;
      switch (event.key) {
      case 'ArrowRight':
        newCol++;
        break;
      case 'ArrowLeft':
        newCol--;
        break;
      case 'ArrowUp':
        newRow--;
        break;
      case 'ArrowDown':
        newRow++;
        break;
      }
      if (newRow !== rowIndex || newCol !== colIndex) {
        event.preventDefault();
        const element = document.getElementById(`row-${newRow}_col-${newCol}`);
        if (element) {
          element.focus();
          element.select();
        }
      }
    },
    async copyToClipboard() {
      const rows = [];
      const headers = this.clipboardColumns.map(column => column.title);
      rows.push(headers);
      this.task.applications.forEach(application => {
        const row = [];
        this.clipboardColumns.forEach(column => {
          if (column.editable) {
            if (this.task.scoreSheet && this.task.scoreSheet[application.id]) {
              if (column.parent) {
                row.push(this.task.scoreSheet[application.id][column.parent][column.ref]);
              } else {
                row.push(this.task.scoreSheet[application.id][column.ref]);
              }
            } else {
              row.push('');
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
    async pasteFromClipboard() {
      if (navigator && navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
          const rows = clipboardText.split('\n');
          const pastedDataMap = {};

          // check headers are all present
          let pastedHeaders = rows[0].split('\t');
          pastedHeaders = pastedHeaders.map(item => item.replace(/\s+/g, ' ').trim());
          const missingColumns = this.clipboardColumns.filter(column => {
            const columnIndex = pastedHeaders.findIndex(item => column.matches.indexOf(item) >= 0);
            return columnIndex < 0;
          });
          if (missingColumns.length > 0) { console.log('missing columns'); return false; }

          // get Ref column index
          const refIndex = pastedHeaders.findIndex(item => this.clipboardColumns[0].matches.indexOf(item) >= 0);
          if (refIndex < 0) { console.log('Ref not found in headers'); return false; }

          // get data
          rows.forEach((row, rowIndex) => {
            if (row && rowIndex > 0) {
              let cols = row.split('\t');
              cols = cols.map(item => item.replace(/\r/g, ' ').trim());
              const ref = cols[refIndex];
              pastedDataMap[ref] = cols;
            }
          });

          // update scoresheet
          const scoreSheet = {};
          const editableColumns = [];
          this.clipboardColumns.forEach(column => {
            if (column.editable) {
              editableColumns.push({
                index: pastedHeaders.findIndex(item => column.matches.indexOf(item) >= 0),
                ...column,
              });
            }
          });
          this.task.applications.forEach(application => {
            if (pastedDataMap[application.ref]) {
              const data = clone(this.task.emptyScoreSheet);
              editableColumns.forEach(column => {
                if (column.parent) {
                  data[column.parent][column.ref] = this.parseColumnValue(column.type, pastedDataMap[application.ref][column.index]);
                } else {
                  data[column.ref] = this.parseColumnValue(column.type, pastedDataMap[application.ref][column.index]);
                }
              });
              scoreSheet[application.id] = data;  // use app ID for scoresheet entries
            }
          });
          const saveData = {};
          Object.entries(scoreSheet).forEach(([key, value]) => saveData[`scoreSheet.${key}`] = value);  // here we are updating individual values (rather than replacing the whole `scoreSheet` map)
          await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.task.type, data: saveData });
        }
      }
    },
    parseColumnValue(columnType, value) {
      switch(columnType) {
      case 'number':
        return parseInt(value);
      default:
        return value;
      }
    }
  },
};
</script>

<style lang="scss">
.vertical-align-middle {
  vertical-align: middle !important;
}
</style>
