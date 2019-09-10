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
    <TextField
      :id="selectionDayIdLocation"
      v-model="row.selectionDayLocation"
      label="Location"
    />

    <slot name="removeButton" />
  </div>
</template>

<script>
import DateInput from '@/components/Form/DateInput';
import TextField from '@/components/Form/TextField';

export default {
  name: 'SelectionDay',
  components: {
    DateInput,
    TextField,
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
    selectionDayIdLocation() {
      return `selection_location_${this.index}`;
    },
  },
};
</script>
