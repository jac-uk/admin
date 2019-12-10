<template>
  <div>
    <TextField 
      :id="`statutory_consultee_${index}`"
      v-model="row.name"
      type="email"
      label="Statutory Consultee"
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
