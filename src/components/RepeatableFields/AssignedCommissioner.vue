<template>
  <div>
    <TextField
      :id="`assigned_comissioner_${index}`"
      v-model="row.name"
      type="email"
      label="Assigned commissioner"
      hint="An email address is required."
      required
    />
    <slot name="removeButton" />
  </div>
</template>

<script>
import TextField from '@jac-uk/jac-kit/draftComponents/Form/TextField.vue';

export default {
  name: 'AssignedCommissioner',
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
