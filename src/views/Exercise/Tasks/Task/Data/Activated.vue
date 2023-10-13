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

    <p class="govuk-body govuk-!-margin-bottom-4">
      Please enter scores for all candidates.
    </p>

    <div
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

    <div>
      <div class="govuk-button-group govuk-!-margin-bottom-6">
        <button
          class="govuk-button govuk-button-s govuk-button--secondary govuk-!-margin-bottom-0"
          @click="copyToClipboard"
        >
          Copy to clipboard
        </button>
        <button
          class="govuk-button govuk-button--secondary govuk-!-margin-bottom-0"
          @click="pasteFromClipboard"
        >
          Paste from clipboard
        </button>
      </div>
      <Table
        ref="scoreSheet"
        data-key="id"
        :data="tableData"
        :columns="tableColumns"
        :page-size="500"
        local-data
        sticky
      >
        <template
          v-if="scoreSheetHeaders.length"
          #header
        >
          <tr class="govuk-table__row">
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
          <TableCell class="table-cell-application">
            {{ row.fullName }}
          </TableCell>

          <TableCell
            v-for="(column, columnIndex) in scoreSheetColumns"
            :key="`${task.type}_${index}_${columnIndex}`"
            class="text-center table-cell-score"
            :title="column.ref"
          >
            <input
              v-if="column.type == 'number'"
              :id="`row-${index}_col-${columnIndex}`"
              v-model="scoreSheet[row.id][column.parent][column.ref]"
              type="number"
              class="govuk-input govuk-input--width-1"
              spellcheck="false"
              autocomplete="off"
              @keydown="onKeyDown($event, index, columnIndex)"
              @input="onCellValueChange(row, column)"
            >
            <input
              v-if="column.type == 'select'"
              :id="`row-${index}_col-${columnIndex}`"
              v-model="scoreSheet[row.id][column.parent][column.ref]"
              type="text"
              maxlength="1"
              class="govuk-input govuk-input--width-1"
              spellcheck="false"
              autocomplete="grade"
              @keydown="onKeyDown($event, index, columnIndex)"
              @input="onCellValueChange(row, column)"
            >
            <input
              v-if="column.type == 'grade' && !column.parent"
              :id="`row-${index}_col-${columnIndex}`"
              v-model="scoreSheet[row.id][column.ref]"
              type="text"
              maxlength="1"
              class="govuk-input govuk-input--width-1"
              spellcheck="false"
              autocomplete="grade"
              @keydown="onKeyDown($event, index, columnIndex)"
              @input="onCellValueChange(row, column)"
            >
            <input
              v-if="column.type == 'grade' && column.parent"
              :id="`row-${index}_col-${columnIndex}`"
              v-model="scoreSheet[row.id][column.parent][column.ref]"
              type="text"
              maxlength="1"
              class="govuk-input govuk-input--width-1"
              spellcheck="false"
              autocomplete="grade"
              @keydown="onKeyDown($event, index, columnIndex)"
              @input="onCellValueChange(row, column)"
            >
          </TableCell>

          <TableCell class="text-center table-cell-score">
            {{ row.score }}
          </TableCell>
        </template>
      </Table>
    </div>
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
import { beforeRouteEnter, btnNext } from '../helper';
import { CAPABILITIES, SELECTION_CATEGORIES, getTaskSteps } from '@/helpers/exerciseHelper';
import { getScoreSheetTotal, GRADES, isScoreSheetComplete } from '@/helpers/taskHelper';
import ProgressBar from '@/components/Page/ProgressBar.vue';
import Table from '@jac-uk/jac-kit/components/Table/Table.vue';
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import FullScreenButton from '@/components/Page/FullScreenButton.vue';
import Modal from '@jac-uk/jac-kit/components/Modal/Modal.vue';
import ModalInner from '@jac-uk/jac-kit/components/Modal/ModalInner.vue';
import { functions } from '@/firebase';
import clone from 'clone';

export default {
  components: {
    Table,
    TableCell,
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
      scoreSheet: task.scoreSheet,
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
      return SELECTION_CATEGORIES.filter(cap => this.task.selectionCategories.indexOf(cap) >= 0); // Using SELECTION_CATEGORIES to ensure display order
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
          item.children.forEach(child => columns.push({ ...child, parent: item.ref }));
        } else {
          columns.push(item);
        }
      });
      return columns;
    },
    tableColumns() {
      const columns = [];
      columns.push({ title: 'Candidate', class: 'table-cell-application' });
      this.scoreSheetColumns.forEach(column => columns.push({ title: column.ref, class: 'text-center table-cell-score' }));
      columns.push({ title: 'Score', class: 'text-center table-cell-score' });
      return columns;
    },
    clipboardColumns() {
      const columns = [];
      columns.push({ title: 'ID', ref: 'id', editable: false });
      columns.push({ title: 'Ref', ref: 'ref', editable: false });
      columns.push({ title: 'Name', ref: 'fullName', editable: false });
      this.scoreSheetColumns.forEach(column => {
        let title = column.ref;
        if (column.parent) title = `${column.parent}.${column.ref}`;
        columns.push({ title: title, editable: true, ...column });
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
          scoreSheet: this.scoreSheet[application.id],
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
      this.scoreSheet = this.task.scoreSheet;
    },
  },
  methods: {
    btnNext,
    btnContinue() {
      this.$refs.modalCheckDataComplete.openModal();
    },
    async btnFinalise() {
      await functions.httpsCallable('updateTask')({
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
    async pasteFromClipboard() {
      if (navigator && navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
          const rows = clipboardText.split('\n');
          const pastedDataMap = {};

          // check headers are all present
          const pastedHeaders = rows[0].split('\t');
          const missingColumns = this.clipboardColumns.filter(column => pastedHeaders.indexOf(column.title) < 0);
          if (missingColumns.length > 0) { console.log('missing columns'); return false; }

          // get data
          const identIndex = 0;
          rows.forEach((row, rowIndex) => {
            if (row && rowIndex > 0) {
              const cols = row.split('\t');
              const id = cols[identIndex];
              pastedDataMap[id] = cols;
            }
          });

          // check we have data for all applications
          const missingApplications = this.task.applications.filter(application => !pastedDataMap[application.id]);
          if (missingApplications.length > 0) { console.log('missingApplications', missingApplications.length); return false; }

          // update scoresheet
          const scoreSheet = {};
          const editableColumns = [];
          this.clipboardColumns.forEach(column => {
            if (column.editable) {
              editableColumns.push({
                index: pastedHeaders.indexOf(column.title),
                ...column,
              });
            }
          });
          this.task.applications.forEach(application => {
            const data = clone(this.task.emptyScoreSheet);
            editableColumns.forEach(column => {
              if (column.parent) {
                data[column.parent][column.ref] = pastedDataMap[application.id][column.index];
              } else {
                data[column.ref] = pastedDataMap[application.id][column.index];
              }
            });
            scoreSheet[application.id] = data;
          });
          await this.$store.dispatch('task/update', { exerciseId: this.exercise.id, type: this.task.type, data: { scoreSheet: scoreSheet } });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.govuk-input--width-1 {
  max-width: 4ex;
  text-align: center;
}
.govuk-input--width-2 {
  max-width: 6ex;
  text-align: right;
}
.vertical-align-middle {
  vertical-align: middle;
}
.table-cell-value {
  min-width: 50px;
  padding: 0 10px;
  text-align: center;
}
</style>
