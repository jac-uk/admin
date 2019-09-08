<template>
  <div>
    <DateInput
      :id="selectionDayIdStart"
      v-model="row.selectionDayStart"
      label="Selection day start"
    />
    <DateInput
      :id="selectionDayIdEnd"
      v-model="row.selectionDayEnd"
      label="Selection day end"
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import DateInput from '@/components/Form/DateInput';

export default {
  name: 'SelectionDay',
  components: {
    DateInput,
  },
  props: {
    row: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
  },
  computed: {
    selectionDayIdStart() {
      return `selection_start_${this.index}`;
    },
    selectionDayIdEnd() {
      return `selection_end_${this.index}`;
    },
  },
};
</script>
