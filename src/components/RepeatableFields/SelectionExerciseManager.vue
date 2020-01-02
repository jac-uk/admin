<template>
  <div>
    <TextField
      :id="`selection_exercise_manager_${index}`"
      v-model="row.name"
      type="email"
      label="Selection exercise manager"
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
