<template>
  <div>
    <TextField
      :id="`assigned_comissioner_${index}`"
      v-model="row.name"
      type="email"
      label="Assigned commissioner"
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
