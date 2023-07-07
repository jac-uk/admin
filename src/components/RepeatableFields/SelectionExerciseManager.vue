<template>
  <div>
    <TextField
      :id="`selection_exercise_manager_${index}`"
      v-model="row.name"
      type="email"
      label="Selection exercise manager"
      hint="An email address is required."
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

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
