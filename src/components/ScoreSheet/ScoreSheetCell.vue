<template>
  <TableCell
    :key="`cell-${rowIndex}-${columnIndex}`"
    class="text-center "
    :class="column.editable ? 'table-cell-score': 'table-cell-value'"
  >
    <template v-if="!column.editable">
      <span v-if="column.parent">{{ row.scoreSheet[column.parent][column.ref] }}</span>
      <span v-else>{{ row.scoreSheet[column.ref] }}</span>
    </template>

    <template v-else>
      <input
        v-if="column.type == 'grade'"
        :id="`row-${rowIndex}_col-${columnIndex}`"
        v-model="localValue"
        type="text"
        maxlength="1"
        class="govuk-input"
        spellcheck="false"
        autocomplete="off"
        @keydown="onKeyDown($event, rowIndex, columnIndex)"
        @input="onCellValueChange($event, row, column)"
      >
      <input
        v-else-if="column.type == 'number'"
        :id="`row-${rowIndex}_col-${columnIndex}`"
        v-model="localValue"
        type="number"
        class="govuk-input"
        spellcheck="false"
        autocomplete="off"
        @keydown="onKeyDown($event, rowIndex, columnIndex)"
        @input="onCellValueChange(row, column)"
      >
      <input
        v-else-if="column.type == 'select'"
        :id="`row-${rowIndex}_col-${columnIndex}`"
        v-model="localValue"
        type="text"
        maxlength="1"
        class="govuk-input"
        spellcheck="false"
        autocomplete="grade"
        @keydown="onKeyDown($event, rowIndex, columnIndex)"
        @input="onCellValueChange(row, column)"
      >      
    </template>  
  </TableCell>
</template>

<script>
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import { GRADES } from '@/helpers/taskHelper';

export default {
  name: 'ScoreSheetCell',
  components: {
    TableCell,
  },
  props: {
    row: {
      required: true,
      type: Object,
    },
    column: {
      required: true,
      type: Object,
    },
    rowIndex: {
      required: true,
      type: Number,
    },
    columnIndex: {
      required: true,
      type: Number,
    },
  },
  emits: ['updated'],
  computed: {
    localValue: {
      get() {
        if (this.column.parent) {
          return this.row.scoreSheet[this.column.parent][this.column.ref];
        } else {
          return this.row.scoreSheet[this.column.ref];
        }
      },
      set(value) {
        this.$emit('updated', this.row, this.column, value);
      },
    },
  },
  methods: {
    onCellValueChange(event, row, column) {
      let value = event.target.value;
      if (column.type === 'grade') {
        value = value.toUpperCase();
        if (GRADES.indexOf(value) < 0) {
          value = '';
        }
        event.target.value = value;
      }
    },

    onKeyDown(event, rowIndex, colIndex) {
      let newRow = rowIndex;
      let newCol = colIndex;
      if (event.ctrlKey || event.metaKey) {
        if (event.key.toLowerCase() === 'a') {
          console.log('ctrl + A pressed, so highlight sheet');
        }
      }
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
  },
};
</script>

<style lang="scss" scoped>
.score-sheet {
  .table-cell-score {
    padding: 0 !important;
    border-right: 1px solid govuk-colour("mid-grey");
    > .govuk-input {
      text-align: center;
      border: 0;
    }
  }
  .table-cell-value {
    padding: 10px !important;
  }
}
</style>
