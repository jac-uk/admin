<template>
  <div>
    <TextField
      :id="`selection_exercise_officer_${index}`"
      v-model="row.name"
      label="Selection exercise officer"
      type="email"
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@/components/Form/TextField';

export default {
  components: {
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
};
</script>
