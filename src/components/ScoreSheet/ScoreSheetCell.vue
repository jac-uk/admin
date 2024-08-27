<template>
  <TableCell
    :key="`cell-${rowIndex}-${columnIndex}`"
    class="text-center "
    :class="column.editable ? 'table-cell-score': 'table-cell-value'"
  >
    <template v-if="!column.editable">
      <span v-if="column.parent">{{ lookupColumnValue(column, row.scoreSheet[column.parent][column.ref]) }}</span>
      <span v-else>{{ lookupColumnValue(column, row.scoreSheet[column.ref]) }}</span>
    </template>

    <template v-else>
      <input
        v-if="column.type == MARKING_TYPE.NUMBER.value"
        :id="`row-${rowIndex}_col-${columnIndex}`"
        v-model="localValue"
        type="number"
        class="govuk-input"
        spellcheck="false"
        autocomplete="off"
        @keydown="onKeyDown($event, rowIndex, columnIndex)"
      >
      <select 
        v-else-if="hasOptions(column.type)"
        :id="`row-${rowIndex}_col-${columnIndex}`"
        v-model="localValue"
        class="govuk-select" 
        @keydown="onKeyDown($event, rowIndex, columnIndex)"
      >
        <option 
          v-for="option in getOptions(column.type)"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </template>  
  </TableCell>
</template>

<script>
import TableCell from '@jac-uk/jac-kit/components/Table/TableCell.vue';
import { MARKING_TYPE, markingTypeHasOptions, markingTypeGetOptions } from '@/helpers/taskHelper';

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
  data() {
    return {
      MARKING_TYPE: MARKING_TYPE,
    };
  },
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
    hasOptions(type) {
      return markingTypeHasOptions(type);
    },
    getOptions(type) {
      return markingTypeGetOptions(type);
    },
    lookupColumnValue(column, value) {
      if (this.hasOptions(column.type)) {
        const options = this.getOptions(column.type);
        const option = options.find(option => option.value === value);
        if (option) return option.label;
      }
      return value;
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
          if (element.select) element.select();
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
    vertical-align:top;
    > .govuk-input {
      text-align: center;
      border: 0;
      height: 46px;
    }
    > .govuk-select {
      text-align: center;
      border: 0;
      height: 46px;
      min-width: 100%;
    }

  }
  .table-cell-value {
    padding: 10px !important;
  }
}
</style>
